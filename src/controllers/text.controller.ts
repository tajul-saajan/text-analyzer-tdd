import { Request, Response } from 'express';
import { Container } from 'typedi';
import { TextService } from '@services/textService';
import { validateRequest } from '@utils/validateRequest';
import { TextCreateDto } from '@dtos/create-text.dto';

export class TextController {
  private readonly textService: TextService;

  constructor() {
    this.textService = Container.get(TextService);
  }

  public createText = async (req: Request, res: Response) => {
    try {
      const dto = await validateRequest(TextCreateDto, req.body, res);
      const text = await this.textService.createText(dto);
      res.status(201).json(text);
    } catch (err) {
      res.status(400).json(err);
    }
  };
}
