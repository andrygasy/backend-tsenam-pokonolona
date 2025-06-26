import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async search(@Query() dto: SearchDto) {
    const result = await this.searchService.search(
      dto.q,
      dto.type ?? 'all',
      dto.page ?? 1,
      dto.limit ?? 10,
    );
    return {
      products: result.items.products,
      services: result.items.services,
      pagination: { total: result.total, page: result.page, limit: result.limit },
    };
  }
}
