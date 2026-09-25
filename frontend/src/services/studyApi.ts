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
    let json: StudyApiResponse;

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
      if (!json.error) {
        let defaultMsg = 'An error occurred while generating study material.';
        let code = `HTTP_${response.status}`;

        if (response.status === 400) defaultMsg = 'Please enter a valid study topic or notes.';
        else if (response.status === 429) defaultMsg = 'Rate limit exceeded. Please wait a moment and try again.';
        else if (response.status === 504) defaultMsg = 'The study generation took too long. Please try again.';
        else if (response.status >= 500) defaultMsg = "We couldn't reach the study service. Please try again.";

        json.error = { code, message: defaultMsg };
      }

      return {
        success: false,
        error: json.error,
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

    return json;
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
