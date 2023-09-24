import React, { useState, useRef } from 'react'

import Card from '../card'
import { ISection } from '../../types/section'
import { MoveCardDto } from '../../types/move-card-dto'
import {
  AddCardButtonDiv,
  AddCardButtonSpan,
  CardComposerDiv,
  CardsContainer,
  ListCardComponent,
  ListCardDetails,
  ListCardTextArea,
  SectionHeader,
  SectionTitle,
  SubmitCardButton,
  SubmitCardButtonDiv,
  WrappedSection,
  Wrapper
} from './styled-components'
import { ICard } from '../../types/card'

const Section = ({
  section: { id, title, cards },
  onCardSubmit,
  onCardMove,
  sectionIds,
}: {
  section: ISection,
  onCardSubmit: Function,
  onCardMove: (dto: MoveCardDto) => void,
  sectionIds: number[],
}) => {
  const [isTempCardActive, setIsTempCardActive] = useState(false);
  const [cardText, setCardText] = useState<string>('');
  const contextMenuRef = useRef<HTMLUListElement | null>(null); // Ref for the context menu


  const handleContextMenu = (e: React.MouseEvent<HTMLElement>, cardId: number) => {
    e.preventDefault();

    const target = e.target as HTMLElement;
    const cardRect = target.getBoundingClientRect();

    // Fixed position relative to the clicked card, for example, at the bottom right corner
    const x = cardRect.width;
    const y = cardRect.height;

    if (contextMenuRef.current) {
      contextMenuRef.current.style.top = `${y}px`;
      contextMenuRef.current.style.left = `${x}px`;
      contextMenuRef.current.style.display = "flex";
      contextMenuRef.current.onclick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        const targetSectionId = parseInt(target.dataset.sectionId || '', 10);
        if (!isNaN(targetSectionId)) {
          handleSectionSelect(targetSectionId, cardId);
        }
      };
    }
  };
  const contextMenuStyle: React.CSSProperties = {
    display: 'none',
    position: 'absolute',
    zIndex: 1000,
    backgroundColor: '#fff',
    border: '1px solid #ccc',
    borderRadius: '3px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
  };


  const handleSectionSelect = (targetSectionId: number, cardId: number) => {
    const dto: MoveCardDto = {
      cardId,
      sourceSectionId: id,
      targetSectionId
    };
    onCardMove(dto);

    if (contextMenuRef.current) {
      contextMenuRef.current.style.display = "none";
    }
  };

  return (
    <Wrapper>
      <WrappedSection>
        <SectionHeader>
          <SectionTitle>{title}</SectionTitle>
        </SectionHeader>
        <CardsContainer>
          {cards.length &&
            cards.map((card: ICard) => (
              <Card
                key={card.id}
                card={card}
                onContextMenu={(e: React.MouseEvent<HTMLElement>) => handleContextMenu(e, card.id)}
              ></Card>
            ))}
          <ul ref={contextMenuRef} style={contextMenuStyle}>
            {sectionIds.map((targetSectionId) => (
              <li key={targetSectionId}>
                <button data-section-id={targetSectionId}>
                  Move to section {targetSectionId}
                </button>
              </li>
            ))}
          </ul>        </CardsContainer>
        {isTempCardActive ? (
          <CardComposerDiv>
            <ListCardComponent>
              <ListCardDetails>
                <ListCardTextArea
                  placeholder='Enter a title for the new card'
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                    setCardText(e.target.value)
                  }
                />
              </ListCardDetails>
            </ListCardComponent>
            <SubmitCardButtonDiv>
              <SubmitCardButton
                type='button'
                value='Add card'
                onClick={(e: React.MouseEvent<HTMLElement>) => {
                  e.preventDefault();

                  if (cardText) {
                    onCardSubmit(id, cardText);
                  }

                  setIsTempCardActive(false);
                }}
              />
            </SubmitCardButtonDiv>
          </CardComposerDiv>
        ) : (
          <AddCardButtonDiv onClick={() => setIsTempCardActive(true)}>
            <AddCardButtonSpan>Add another card</AddCardButtonSpan>
          </AddCardButtonDiv>
        )}
      </WrappedSection>
    </Wrapper>
  );
};
export default Section
