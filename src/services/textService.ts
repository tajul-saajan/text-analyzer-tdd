import { Service } from 'typedi';
import { Text } from '@/entities/text';
import { TextCreateDto } from '@dtos/create-text.dto';

@Service()
export class TextService {
  async getAllTexts(page: number, per_page: number) {
    if (page < 1) page = 1;
    if (per_page < 1) per_page = 10;

    const offset = per_page * (page - 1);

    const [texts, total] = await Text.findAndCount({ skip: offset, take: per_page });
    return {
      texts,
      total,
      page,
      per_page,
      totalPages: Math.ceil(total / per_page),
    };
  }

  async createText(dto: TextCreateDto) {
    const text = new Text();
    text.content = dto.content;
    return await text.save();
  }
}
