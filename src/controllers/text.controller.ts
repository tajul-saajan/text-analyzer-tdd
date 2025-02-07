import { Request, Response } from 'express';
import { Container } from 'typedi';
import { TextService } from '@services/textService';

export class TextController {
  private readonly textService: TextService;

  constructor() {
    this.textService = Container.get(TextService);
  }

  public createText = async (req: Request, res: Response) => {
    try {
      const { content } = req.body;
      const text = await this.textService.createText(content);
      res.status(201).json(text);
    } catch (err) {
      res.status(400).json(err);
    }
  };
}
