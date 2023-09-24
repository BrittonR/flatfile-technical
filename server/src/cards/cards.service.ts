import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CardEntity } from '../entities/Card';
import { SectionEntity } from '../entities/Section';
import { MoveCardDto } from './move-card.dto';

@Injectable()
export class CardsService {
  constructor(
    @InjectRepository(CardEntity)
    private cardsRepository: Repository<CardEntity>,
    @InjectRepository(SectionEntity)
    private sectionRepository: Repository<SectionEntity>,
  ) {}

  create({ sectionId, title }: { sectionId: number; title: string }): Promise<CardEntity> {
    let card = new CardEntity()
    card.title = title
    card.section_id = sectionId
    return this.cardsRepository.save(card)
  }

async moveCard(moveCardDto: MoveCardDto): Promise<void> {
    const { cardId, sourceSectionId, targetSectionId } = moveCardDto;

    const card = await this.cardsRepository.findOne(cardId);
    if (!card) {
      throw new NotFoundException(`Card with id ${cardId} not found`);
    }

    const sourceSection = await this.sectionRepository.findOne(sourceSectionId);
    if (!sourceSection) {
      throw new NotFoundException(`Source section with id ${sourceSectionId} not found`);
    }

    const targetSection = await this.sectionRepository.findOne(targetSectionId);
    if (!targetSection) {
      throw new NotFoundException(`Target section with id ${targetSectionId} not found`);
    }

    // Assuming that your CardEntity has a property `section` to hold its section.
    card.section = targetSection;

    await this.cardsRepository.save(card);
  }
}