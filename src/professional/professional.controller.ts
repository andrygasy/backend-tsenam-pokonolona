import { Body, Controller, Get, Post, Put, Query, Param, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ProfessionalService } from './professional.service';
import { RequestProfessionalDto } from './dto/request-professional.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('professional')
@Controller('api/professional')
export class ProfessionalController {
  constructor(private readonly professionalService: ProfessionalService) {}

  @Post('request')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  requestProfessional(@CurrentUser() user: any, @Body() dto: RequestProfessionalDto) {
    return this.professionalService.requestProfessional(user.id, dto);
  }

  @Get('products')
  findProProducts(@CurrentUser() user: any, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.professionalService.findProProducts(user.id, { page: page ? +page : undefined, limit: limit ? +limit : undefined });
  }

  @Get('services')
  findProServices(@CurrentUser() user: any, @Query('page') page?: number, @Query('limit') limit?: number) {
    return this.professionalService.findProServices(user.id, { page: page ? +page : undefined, limit: limit ? +limit : undefined });
  }

  @Get('orders')
  findProOrders(
    @CurrentUser() user: any,
    @Query('status') status?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.professionalService.findProOrders(user.id, { status, page: page ? +page : undefined, limit: limit ? +limit : undefined });
  }

  @Put('orders/:orderId/status')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateOrderStatus(@Param('orderId') orderId: string, @Body() dto: UpdateOrderStatusDto) {
    return this.professionalService.updateOrderStatus(orderId, dto);
  }
}
