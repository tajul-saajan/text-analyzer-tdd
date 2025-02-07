import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { TextService } from '@services/textService';
import { validateRequest } from '@utils/validateRequest';
import { TextCreateDto } from '@dtos/create-text.dto';

export class TextController {
  private readonly textService: TextService;

  constructor() {
    this.textService = Container.get(TextService);
  }

  public getTexts = async (req: Request, res: Response) => {
    const { page = 1, per_page = 10 } = req.query;

    const texts = await this.textService.getAllTexts(+page, +per_page);
    res.status(200).json(texts);
  };

  public createText = async (req: Request, res: Response) => {
    try {
      const dto = await validateRequest(TextCreateDto, req.body, res);
      const text = await this.textService.createText(dto);
      res.status(201).json(text);
    } catch (err) {
      res.status(400).json(err);
    }
  };

  public updateText = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const dto = await validateRequest<TextCreateDto>(TextCreateDto, req.body, res);
      const text = await this.textService.updateText(+id, dto);
      res.status(202).json(text);
    } catch (e) {
      next(e);
    }
  };

  deleteText = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const result = await this.textService.deleteText(Number(id));
      res.status(204).json(result);
    } catch (e) {
      next(e);
    }
  };
}
