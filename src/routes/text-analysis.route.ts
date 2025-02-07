import { Router } from 'express';
import { Routes } from '@interfaces/route.interface';
import { TextAnalysisController } from '@controllers/text-analysis.controller';

export class TextAnalysisRoute implements Routes {
  public path = '/text-analysis';
  public router = Router();

  private textAnalysisController: TextAnalysisController;

  constructor() {
    this.textAnalysisController = new TextAnalysisController();
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/:text_id/word_count`, this.textAnalysisController.getWordCount);
    this.router.get(`${this.path}/:text_id/char_count`, this.textAnalysisController.getCharacterCount);
    // this.router.get(`${this.path}/:text_id/sentence_count`, this.textAnalysisController.getTexts);
    // this.router.get(`${this.path}/:text_id/longest_words`, this.textAnalysisController.getTexts);
  }
}
