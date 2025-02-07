import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { TextAnalysisService } from '@services/text-analysis.service';
import { TextService } from '@services/textService';

export class TextAnalysisController {
  private readonly textAnalysisService: TextAnalysisService;
  private readonly textService: TextService;

  constructor() {
    this.textAnalysisService = Container.get(TextAnalysisService);
    this.textService = Container.get(TextService);
  }

  public getWordCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text_id } = req.params;
      const text = await this.textService.getText(+text_id);
      const data = this.textAnalysisService.getWordCount(text.content);

      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  };

  public getCharacterCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { text_id } = req.params;
      const { include_whitespace = 0 } = req.query;

      const text = await this.textService.getText(+text_id);
      const char_count = this.textAnalysisService.getCharacterCount(text.content, Boolean(+include_whitespace));

      res.status(200).json({ char_count });
    } catch (e) {
      next(e);
    }
  };
}
