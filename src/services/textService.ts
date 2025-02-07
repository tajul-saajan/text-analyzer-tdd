import { Service } from 'typedi';
import { Text } from '@/entities/text';
import { TextCreateDto } from '@dtos/create-text.dto';

@Service()
export class TextService {
  async createText(dto: TextCreateDto) {
    const text = new Text();
    text.content = dto.content;
    return await text.save();
  }
}
