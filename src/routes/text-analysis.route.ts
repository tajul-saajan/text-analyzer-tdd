import { Router } from 'express';
import { Routes } from '@interfaces/route.interface';
import { TextAnalysisController } from '@controllers/text-analysis.controller';
import { authenticate } from '@/middlewares/auth.middleware';

export class TextAnalysisRoute implements Routes {
  public path = '/text-analysis/:text_id';
  public router = Router();

  private textAnalysisController: TextAnalysisController;

  constructor() {
    this.textAnalysisController = new TextAnalysisController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/words/count`, authenticate, this.textAnalysisController.getWordCount);
    this.router.get(`${this.path}/characters/count`, authenticate, this.textAnalysisController.getCharacterCount);
    this.router.get(`${this.path}/sentences/count`, authenticate, this.textAnalysisController.getSentenceCount);
    this.router.get(`${this.path}/paragraphs/count`, authenticate, this.textAnalysisController.getParagraphCount);
    this.router.get(`${this.path}/paragraphs/words/longest`, authenticate, this.textAnalysisController.getLongestWordsInParagraphs);
  }
}
