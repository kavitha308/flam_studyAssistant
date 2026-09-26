import { GoogleGenAI, Type } from '@google/genai';
import { studyMaterialSchema, StudyMaterial } from '../validators/study.schema.js';

export class StudyApiError extends Error {
  public code: string;
  public statusCode: number;

  constructor(code: string, message: string, statusCode: number = 502) {
    super(message);
    this.name = 'StudyApiError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

export type AiTestScenario =
  | 'malformed-json'
  | 'missing-cards'
  | 'invalid-card'
  | 'invalid-quiz-options'
  | 'empty-response'
  | 'semantic-invalid';

export class GeminiService {
  private getApiKey(): string {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey.trim() === '' || apiKey === 'your_gemini_api_key_here') {
      throw new StudyApiError(
        'CONFIG_ERROR',
        'Server missing valid GEMINI_API_KEY configuration. Please configure GEMINI_API_KEY in backend/.env',
        500
      );
    }
    return apiKey.trim();
  }

  private getCandidateModels(): string[] {
    const configuredModel = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const fallbacks = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    return Array.from(new Set([configuredModel, ...fallbacks]));
  }

  public async generateStudyMaterial(
    input: string,
    testScenario?: string
  ): Promise<StudyMaterial> {
    const trimmedInput = input?.trim();
    if (!trimmedInput) {
      throw new StudyApiError('INVALID_INPUT', 'Please enter a topic or some notes to study.', 400);
    }

    if (trimmedInput.length > 10000) {
      throw new StudyApiError(
        'INVALID_INPUT',
        'Input exceeds maximum allowed limit of 10,000 characters.',
        400
      );
    }

    let textResponse: string | undefined;

    const isTestMode = process.env.AI_TEST_MODE === 'true' || process.env.AI_TEST_MODE === '1';

    if (isTestMode && testScenario) {
      console.log(`[AI Test Mode Active] Simulating scenario: "${testScenario}"`);

      switch (testScenario.trim().toLowerCase()) {
        case 'malformed-json':
          textResponse = '{ this is not valid JSON';
          break;

        case 'missing-cards':
          textResponse = JSON.stringify({
            title: 'Photosynthesis Summary',
            summary: 'Photosynthesis converts sunlight into energy.',
            quiz: [
              {
                id: 'quiz-1',
                question: 'Where does photosynthesis occur?',
                options: ['Chloroplast', 'Mitochondria', 'Nucleus', 'Ribosome'],
                correctAnswer: 0,
                explanation: 'Chloroplasts contain chlorophyll.',
              },
            ],
          });
          break;

        case 'invalid-card':
          textResponse = JSON.stringify({
            title: 'Test Title',
            summary: 'Test Summary',
            cards: [
              {
                id: 'card-1',
              },
            ],
            quiz: [
              {
                id: 'quiz-1',
                question: 'Q?',
                options: ['A', 'B', 'C', 'D'],
                correctAnswer: 0,
                explanation: 'Exp',
              },
            ],
          });
          break;

        case 'invalid-quiz-options':
          textResponse = JSON.stringify({
            title: 'Photosynthesis',
            summary: 'Test summary content',
            cards: [
              { id: 'c1', question: 'Q1', answer: 'A1' },
              { id: 'c2', question: 'Q2', answer: 'A2' },
              { id: 'c3', question: 'Q3', answer: 'A3' },
            ],
            quiz: [
              {
                id: 'quiz-1',
                question: 'Invalid options count question',
                options: ['Option A', 'Option B', 'Option C'],
                correctAnswer: 0,
                explanation: 'Explanation',
              },
            ],
          });
          break;

        case 'empty-response':
          textResponse = '';
          break;

        case 'semantic-invalid':
          textResponse = JSON.stringify({
            title: '',
            summary: 'Summary',
            cards: [
              { id: 'c1', question: 'Q1', answer: 'A1' },
            ],
            quiz: [
              {
                id: 'q1',
                question: 'Q1',
                options: ['A', 'B', 'C', 'D'],
                correctAnswer: 99,
                explanation: '',
              },
            ],
          });
          break;

        default:
          console.warn(`[AI Test Mode] Unknown scenario "${testScenario}", proceeding with real AI call`);
          break;
      }
    }

    if (textResponse === undefined) {
      const apiKey = this.getApiKey();
      const candidateModels = this.getCandidateModels();
      const ai = new GoogleGenAI({ apiKey });

      const systemPrompt = `You are a study assistant.
Transform the user's notes or topic into concise educational study material.

Return ONLY the requested structured JSON.

Generate:
- a useful title
- a concise summary
- 3–10 flashcards
- 3–10 multiple-choice questions
- exactly four options for every question
- the zero-based index of the correct answer (0, 1, 2, or 3)
- a short explanation for each question

Do not include markdown.
Do not include conversational text.
Do not include fields outside the requested schema.

The material should be appropriate for the user's supplied topic.
User Supplied Notes/Topic Data:
"""
${trimmedInput}
"""`;

      const timeoutMs = 60000;
      let timeoutTimer: NodeJS.Timeout;

      const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutTimer = setTimeout(() => {
          reject(
            new StudyApiError('AI_TIMEOUT', 'The study generation took too long. Please try again.', 504)
          );
        }, timeoutMs);
      });

      const generatePromise = (async () => {
        let lastErrorMsg = '';

        for (const modelName of candidateModels) {
          try {
            console.log(`[Gemini Service] Requesting study material using model: ${modelName}`);
            const response = await ai.models.generateContent({
              model: modelName,
              contents: systemPrompt,
              config: {
                responseMimeType: 'application/json',
                responseSchema: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    summary: { type: Type.STRING },
                    cards: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          question: { type: Type.STRING },
                          answer: { type: Type.STRING },
                        },
                        required: ['id', 'question', 'answer'],
                      },
                    },
                    quiz: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          id: { type: Type.STRING },
                          question: { type: Type.STRING },
                          options: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                          },
                          correctAnswer: { type: Type.INTEGER },
                          explanation: { type: Type.STRING },
                        },
                        required: ['id', 'question', 'options', 'correctAnswer', 'explanation'],
                      },
                    },
                  },
                  required: ['title', 'summary', 'cards', 'quiz'],
                },
              },
            });
            return response;
          } catch (err: any) {
            const errMsg = err?.message || String(err);
            console.warn(`[Gemini Model ${modelName} Failure Diagnostic]:`, errMsg);
            lastErrorMsg = errMsg;

            if (
              errMsg.includes('API key not valid') ||
              errMsg.includes('API_KEY_INVALID') ||
              errMsg.includes('UNAUTHENTICATED')
            ) {
              throw new StudyApiError(
                'INVALID_API_KEY',
                'The GEMINI_API_KEY configured in backend/.env is invalid or unauthorized.',
                400
              );
            }

            if (errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('Quota')) {
              throw new StudyApiError(
                'RATE_LIMIT_EXCEEDED',
                'AI generation rate limit exceeded. Please wait a moment and try again.',
                429
              );
            }
          }
        }

        throw new StudyApiError(
          'AI_PROVIDER_ERROR',
          "We couldn't generate study material right now. Provider service unavailable.",
          502
        );
      })();

      try {
        const response = await Promise.race([generatePromise, timeoutPromise]);
        clearTimeout(timeoutTimer!);
        textResponse = response?.text;
      } finally {
        if (timeoutTimer!) {
          clearTimeout(timeoutTimer);
        }
      }
    }

    if (!textResponse || textResponse.trim() === '') {
      console.error('[Gemini Error]: Received empty text response from AI');
      throw new StudyApiError(
        'AI_EMPTY_RESPONSE',
        'The AI returned an empty response. Please try again.',
        502
      );
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(textResponse);
    } catch (jsonErr) {
      console.error('[Gemini Error]: Failed to parse returned JSON text:', textResponse);
      throw new StudyApiError(
        'AI_INVALID_OUTPUT',
        "We couldn't generate valid structured study material. Raw output was not valid JSON.",
        502
      );
    }

    const validationResult = studyMaterialSchema.safeParse(parsedJson);
    if (!validationResult.success) {
      console.error(
        '[Zod Validation Error Diagnostic]: Output failed schema validation:',
        validationResult.error.format()
      );
      throw new StudyApiError(
        'AI_INVALID_OUTPUT',
        "We couldn't generate study material matching the required structure. Please try again.",
        502
      );
    }

    return validationResult.data;
  }
}

export const geminiService = new GeminiService();
