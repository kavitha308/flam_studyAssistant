import { StudyMaterial } from '../types/study';
import { API_BASE_URL } from '../utils/constants';

export interface StudyApiResponse {
  success: boolean;
  data?: StudyMaterial;
  error?: {
    code: string;
    message: string;
  };
}

export async function generateStudyMaterial(
  input: string,
  signal?: AbortSignal,
  testScenario?: string
): Promise<StudyApiResponse> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (testScenario && testScenario.trim() !== '') {
      headers['x-ai-test-scenario'] = testScenario.trim();
    }

    const response = await fetch(`${API_BASE_URL}/study/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ input }),
      signal,
    });

    const rawText = await response.text();
    let json: any;

    try {
      json = rawText ? JSON.parse(rawText) : {};
    } catch {
      return {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: `We couldn't reach the study service. Please try again.`,
        },
      };
    }

    if (!response.ok || !json.success) {
      const serverMsg =
        json?.error?.message ||
        (typeof json?.message === 'string' ? json.message : null) ||
        (typeof json?.error === 'string' ? json.error : null);

      const errorCode =
        json?.error?.code ||
        (response.status === 400
          ? 'INVALID_INPUT'
          : response.status === 429
          ? 'RATE_LIMIT_EXCEEDED'
          : response.status === 504
          ? 'AI_TIMEOUT'
          : response.ok
          ? 'SERVER_ERROR'
          : `HTTP_${response.status}`);

      return {
        success: false,
        error: {
          code: errorCode,
          message:
            serverMsg ||
            'An error occurred while generating study material. Please try again.',
        },
      };
    }

    // Defensive Frontend Response Shape Verification
    const data = json.data;
    if (
      !data ||
      typeof data.title !== 'string' ||
      typeof data.summary !== 'string' ||
      !Array.isArray(data.cards) ||
      !Array.isArray(data.quiz) ||
      data.cards.length < 3 ||
      data.quiz.length < 3
    ) {
      return {
        success: false,
        error: {
          code: 'UNEXPECTED_RESPONSE_SHAPE',
          message: 'Received an unexpected response format from the server. Please try again.',
        },
      };
    }

    return {
      success: true,
      data: json.data,
    };
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw error;
    }
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: "We couldn't reach the study service. Please try again.",
      },
    };
  }
}
