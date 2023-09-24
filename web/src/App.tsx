import { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios from 'axios'

import Section from './components/section'
import { ISection } from './types/section'
import { MoveCardDto } from './types/move-card-dto'
import './App.css'

export const BoardContainer = styled.div`
  background-color: rgb(49, 121, 186);
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  color: #393939;
  overflow-y: hidden;
  overflow-x: auto;
  position: absolute;
  padding: 5px;
  align-items: flex-start;
`

function App() {
  const [sections, setSections] = useState<ISection[]>([])

  useEffect(() => {
    axios.get('http://localhost:3001/sections').then((response) => {
      // Section order is determined by ID so sort by ID
      const sortedSections = response.data.sort((a: ISection, b: ISection) => a.id - b.id)
      setSections(sortedSections)
    })
  })

  const onCardSubmit = (ISectiond: number, title: string) => {
    axios({
      method: 'post',
      url: 'http://localhost:3001/cards',
      data: { ISectiond, title }
    }).then((response) => {
      let sectionsClone: ISection[] = [...sections]
      for (let i = 1; i < sectionsClone.length; i++) {
        let section: ISection = sectionsClone[i]
        if (section.id === ISectiond) {
          section.cards.push({
            id: response.data.id,
            title: response.data.title,
            section_id: ISectiond
          })
          setSections(sectionsClone)
        }
      }
    })
  }
  const sectionIds = sections.map((section) => section.id);

  const moveCardToSection = async (dto: MoveCardDto) => {
      await axios.patch('http://localhost:3001/cards/move', dto);

    let updatedSections = [...sections];
    const sourceSection = updatedSections.find(s => s.id === dto.sourceSectionId);
    const targetSection = updatedSections.find(s => s.id === dto.targetSectionId);

    if (sourceSection && targetSection) {
      const cardToMove = sourceSection.cards.find(c => c.id === dto.cardId);
      if (cardToMove) {
        // Remove from source section
        sourceSection.cards = sourceSection.cards.filter(c => c.id !== dto.cardId);
        
        // Add to target section
        targetSection.cards.push(cardToMove);
      }
    }
    
    setSections(updatedSections);
  };
  return (
    <BoardContainer>
      {sections.map((section: ISection) => {
        return <Section key={section.id} section={section} onCardSubmit={onCardSubmit} onCardMove={moveCardToSection} sectionIds={sectionIds}></Section>
      })}
    </BoardContainer>
  )
  }


export default App
