export interface Flashcard {
  id: string;
  question: string;
  answer: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface StudyMaterial {
  title: string;
  summary: string;
  cards: Flashcard[];
  quiz: QuizQuestion[];
}

export type CardReviewStatus = 'known' | 'unknown';

export interface UserQuizAnswer {
  selectedOption: number;
  isCorrect: boolean;
}

export type StudyMode = 'flashcards' | 'quiz';

export type QuizMode = 'normal' | 'retry';

export interface GenerateStudyRequestPayload {
  input: string;
}
