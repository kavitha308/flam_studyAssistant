import { Router, Request, Response, NextFunction } from 'express';
import { generateStudyRequestSchema } from '../validators/study.schema.js';
import { geminiService } from '../services/gemini.service.js';

const router = Router();

router.post('/generate', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const rawInput = req.body?.input ?? req.body?.text;
    const parseResult = generateStudyRequestSchema.safeParse({ input: rawInput });

    if (!parseResult.success) {
      const errorMessage = parseResult.error.errors.map((e) => e.message).join('. ');
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_INPUT',
          message: errorMessage || 'Please enter a topic or some notes to study.',
        },
      });
      return;
    }

    const testScenario =
      (req.headers['x-ai-test-scenario'] as string) ||
      (req.query.testScenario as string) ||
      req.body?.testScenario;

    const studyMaterial = await geminiService.generateStudyMaterial(
      parseResult.data.input,
      testScenario
    );

    res.status(200).json({
      success: true,
      data: studyMaterial,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
