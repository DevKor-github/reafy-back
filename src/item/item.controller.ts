import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { ItemDto } from './dto/item.dto';

@ApiTags("Item")
@UseGuards(AuthGuard('access'))
@Controller('item')
export class ItemController {
    constructor(private readonly itemService: ItemService) { }


    @ApiOperation({
        summary: 'item list api',
        description: 'user 소유하고 있는 item list',
    })
    @ApiOkResponse({
        description: 'user 소유하고 있는 item list return',
        type: ItemDto,
    })
    @ApiBearerAuth('accessToken')
    @Get("userItemList")
    async getItemList(
        @Req() req,
    ): Promise<ItemDto[]> {
        const userId = req.user.userId;
        return await this.itemService.getItemList(userId);
    }


    @ApiOperation({
        summary: 'item 구매 api',
        description: 'item 구매 및 사용 여부 업데이트에 사용',
    })
    @ApiOkResponse({
        description: '변경된 item 정보 return',
        type: ItemDto,
    })
    @ApiBearerAuth('accessToken')
    @Post()
    async buyItem(
        @Body() itemDto: ItemDto,
        @Req() req,
    ): Promise<ItemDto> {
        const userId = req.user.userId;
        return await this.itemService.buyItem(userId, itemDto);
    }

}
