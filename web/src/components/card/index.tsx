import React from 'react';
import styled from 'styled-components';
import { ICard } from '../../types/card';  // Adjust the import path as needed

interface CardProps {
  card: ICard;
  onContextMenu: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const CardContainer = styled.div`
  border-radius: 3px;
  border-bottom: 1px solid #ccc;
  background-color: #fff;
  position: relative;
  padding: 10px;
  cursor: pointer;
  max-width: 250px;
  margin-bottom: 7px;
  min-width: 230px;
`;

const CardTitle = styled.div``;

const Card: React.FC<CardProps> = ({ card, onContextMenu }) => (
  <CardContainer className='card' onContextMenu={onContextMenu}>
    <CardTitle>{card.title}</CardTitle>
  </CardContainer>
);

export default Card;