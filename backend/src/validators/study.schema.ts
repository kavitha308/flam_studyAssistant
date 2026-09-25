import { z } from 'zod';

// Input payload schema for POST /api/study/generate
export const generateStudyRequestSchema = z.object({
  input: z
    .string()
    .trim()
    .min(1, 'Notes or topic input cannot be empty')
    .max(10000, 'Input exceeds maximum allowed length of 10000 characters'),
});

export type GenerateStudyRequestInput = z.infer<typeof generateStudyRequestSchema>;

// Individual Flashcard schema
export const flashcardSchema = z.object({
  id: z.string().min(1, 'Card id must not be empty'),
  question: z.string().min(1, 'Card question must not be empty'),
  answer: z.string().min(1, 'Card answer must not be empty'),
});

// Individual Quiz Question schema
export const quizQuestionSchema = z.object({
  id: z.string().min(1, 'Quiz id must not be empty'),
  question: z.string().min(1, 'Quiz question must not be empty'),
  options: z
    .array(z.string().min(1, 'Option text must not be empty'))
    .length(4, 'Quiz question must have exactly 4 options'),
  correctAnswer: z
    .number()
    .int('correctAnswer must be an integer')
    .min(0, 'correctAnswer index must be between 0 and 3')
    .max(3, 'correctAnswer index must be between 0 and 3'),
  explanation: z.string().min(1, 'Quiz explanation must not be empty'),
});

// Full AI Study Material Response Schema
export const studyMaterialSchema = z.object({
  title: z.string().min(1, 'Study material title must not be empty'),
  summary: z.string().min(1, 'Study material summary must not be empty'),
  cards: z
    .array(flashcardSchema)
    .min(3, 'Must contain at least 3 flashcards')
    .max(10, 'Must contain at most 10 flashcards'),
  quiz: z
    .array(quizQuestionSchema)
    .min(3, 'Must contain at least 3 quiz questions')
    .max(10, 'Must contain at most 10 quiz questions'),
});

export type Flashcard = z.infer<typeof flashcardSchema>;
export type QuizQuestion = z.infer<typeof quizQuestionSchema>;
export type StudyMaterial = z.infer<typeof studyMaterialSchema>;
