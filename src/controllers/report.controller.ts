import { Container } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { TextAnalysisProxy } from '@services/text-analysis-proxy.service';
import { validateRequest } from '@utils/validateRequest';
import { TextDto } from '@dtos/report.dto';
import { TextService } from '@services/textService';

export class ReportController {
  private readonly textAnalysisProxy: TextAnalysisProxy;
  private readonly textService: TextService;

  constructor() {
    this.textAnalysisProxy = Container.get(TextAnalysisProxy);
    this.textService = Container.get(TextService);
  }

  public getFullReport = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = await validateRequest<TextDto>(TextDto, req.body, res);
      const { text, text_id } = dto;

      let content = text;
      if (text_id) {
        const textObject = await this.textService.getText(text_id);
        content = textObject.content;
      }

      const data = await this.textAnalysisProxy.analyzeText(content);

      res.status(200).json(data);
    } catch (e) {
      next(e);
    }
  };
}
