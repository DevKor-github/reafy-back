import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  QuestHistoryDto,
  QuestHistoryListDto,
  QuestListDto,
} from './dtos/quest.dto';
import { QuestService } from './quest.service';
import { AuthGuard } from '@nestjs/passport';
import { QuestType } from '../model/entity/Quest.entity';
import { DateUtilService } from '../common/util/date.util';

@ApiTags('Quest')
@ApiBearerAuth('accessToken')
@Controller('quest')
@UseGuards(AuthGuard('access'))
export class QuestController {
  constructor(private readonly questService: QuestService) {}

  @ApiOperation({
    summary: '기본 퀘스트 생성',
    description: '주간 독서 기록에 대한 퀘스트를 만들기 위한 api',
  })
  @ApiOkResponse({
    description: '생성된 퀘스트 리스트 반환',
    isArray: true,
    type: QuestListDto,
  })
  @Post('/default')
  async saveDefaultQuest(): Promise<QuestListDto> {
    return this.questService.createDefaultQuest();
  }

  @ApiOperation({
    summary: '퀘스트 리스트 가져오기',
    description: '주어진 타입에 맞는 모든 퀘스트 리스트 가져오기',
  })
  @ApiOkResponse({
    description: '주어진 타입에 맞는 퀘스트 리스트를 반환',
    isArray: true,
    type: QuestListDto,
  })
  @Get('/list')
  async getQuestList(@Query('type') type: QuestType): Promise<QuestListDto> {
    return this.questService.getQuestList(type);
  }

  @ApiOperation({
    summary: '퀘스트 달성 처리',
    description: '퀘스트 id 기준으로 퀘스트를 달성 처리한다.',
  })
  @ApiOkResponse({
    description: '달성된 퀘스트에 대한 기록이 반환된다.',
    isArray: false,
    type: QuestHistoryDto,
  })
  @Post('/achieve/:questId')
  async achieveQuest(
    @Req() req,
    @Param('questId') questId: number,
  ): Promise<QuestHistoryDto> {
    const userId = req.user.userId;
    return this.questService.achieveQuest(userId, questId);
  }

  @ApiOperation({
    summary: '주간 달성한 퀘스트 리스트 가져오기',
    description: '오늘 날짜 기준으로 금주에 달성된 퀘스트 리스트를 가져온다. ',
  })
  @ApiOkResponse({
    description: '주간 달성된 퀘스트 리스트가 반환된다.',
    isArray: true,
    type: QuestHistoryListDto,
  })
  @Get('/weekly/achieve')
  async achieveWeeklyQuest(
    @Req() req,
    @Query('date') dateString: string,
  ): Promise<QuestHistoryListDto> {
    const userId = req.user.userId;
    const date = DateUtilService.getDateYYYYMMDD(dateString);
    return await this.questService.getWeeklyAchieveQuestList(userId, date);
  }
}
