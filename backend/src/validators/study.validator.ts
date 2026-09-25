import { z } from 'zod';

export const generateStudyMaterialSchema = z.object({
  text: z.string().min(1, 'Notes or topic text cannot be empty').max(10000, 'Text too long'),
});

export type GenerateStudyMaterialInput = z.infer<typeof generateStudyMaterialSchema>;
