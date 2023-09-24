import { Body, Controller, Logger, Post, Patch } from '@nestjs/common'
import { CardEntity } from '../entities/Card'
import { CardsService } from './cards.service'
import { MoveCardDto } from './move-card.dto';

@Controller('cards')
export class CardsController {
  private readonly logger = new Logger(CardsController.name)

  constructor(private cardsService: CardsService) {}

  @Post()
  addCard(@Body() card: { sectionId: number; title: string }): Promise<CardEntity> {
    this.logger.log('POST /cards')

    return this.cardsService.create(card)
  }

  @Patch('move')
  moveCard(@Body() moveCardDto: MoveCardDto): Promise<any> {
    // const { cardId, sourceSectionId, targetSectionId } = moveCardDto
    this.logger.log('PATCH /cards/move');
    return this.cardsService.moveCard(moveCardDto);
  }
}
