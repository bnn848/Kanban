import React, { useState } from 'react'
import styled from 'styled-components'
import * as color from './color'
import { Card } from './Card'
import { PlusIcon } from './icon'
import { InputForm as _InputForm } from './InputForm'

export function Column({ // 受け取るパラメータ
  title,
  filterValue: rawFilterValue,
  cards: rawCards,
}: { // パラメータの型を指定している
  title?: string,
  filterValue?: string
  cards: {id: string; text?: string}[]
}) {

  const filterValue = rawFilterValue?.trim() // パラメータの値の前後の空白を除去
  // タグ付け -> 空白１文字以上で単語を分割し、文章全体を検索
  const keywords = filterValue?.toLowerCase().split(/\s+/g) ?? [] // 小文字にして/\s+/ (g:文章全体)で分割
  // colum内カードでkeywordを含むカードをフィルタリング
  const cards = rawCards.filter(({text}) => keywords?.every((w) => text?.toLowerCase().includes(w))) // every(): 全一致するか検査
  // const totalCount = rawCards.length // カラム内のカード数をインスタンス化
  const totalCount = cards.length // カラム内のカード数をインスタンス化

  /* ステートの管理 */
  const [text, setText] = useState('')
  const [inputMode, setInputMode] = useState(false)
  const confirmInput = () => setText('')
  const toggleInput = () => setInputMode(v => !v)
  const cancelInput = () => setInputMode(false)
  const [draggingCardID, setDraggingCardID] = useState<string | undefined>(undefined)

  return (
    <Container>

      <Header>
        <CountBadge>{totalCount}</CountBadge>
        <ColumnName>{title}</ColumnName>
        <AddButton onClick={toggleInput} />
      </Header>

      {inputMode && (
        <InputForm 
          value={text}
          onChange={setText}
          onConfirm={confirmInput}
          onCancel={cancelInput}
        />
      )}

      {filterValue && <ResultCount>{totalCount} results</ResultCount>}

      <VerticalScroll>
        {cards.map(({id, text}, i) => {
          return (
            <Card.DropArea
              key={id}
              disabled={
                draggingCardID !== undefined &&
                (id === draggingCardID || cards[i -1]?.id === draggingCardID)
              }
            >
              <Card
                text={text}
                onDragStart={() => setDraggingCardID(id)}
                onDragEnd={() => setDraggingCardID(undefined)}
              />
            </Card.DropArea>
          )
        })}
        
        <Card.DropArea
          style={{height: '100%'}}
          disabled={
            draggingCardID !== undefined &&
            cards[cards.length - 1]?.id === draggingCardID
          }
        />
      </VerticalScroll>

    </Container>
  )
}


const Container = styled.div`
  display: flex;
  flex-flow: column;
  width: 355px;
  height: 100%;
  border: solid 1px ${color.Silver};
  border-radius: 6px;
  background-color: ${color.LightSilver};

  > :not(:last-child) {
    flex-shrink: 0;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 8px;
`

const CountBadge = styled.div`
  margin-right: 8px;
  border-radius: 20px;
  padding: 2px 6px;
  color: ${color.Black};
  background-color: ${color.Silver};
  font-size: 12px;
  line-height: 1;
`

const ColumnName = styled.div`
  color: ${color.Black};
  font-size: 14px;
  font-weight: bold;
`

const AddButton = styled.button.attrs({
  type: 'button',
  children: <PlusIcon />,
})`
  margin-left: auto;
  color: ${color.Black};

  :hover {
    color: ${color.Blue};
  }
`

const InputForm = styled(_InputForm)`
  padding: 8px;
`

const ResultCount = styled.div`
  color: ${color.Black};
  font-size: 12px;
  text-align: center;
`

const VerticalScroll = styled.div`
  /* height: 100%; */
  padding: 8px;
  overflow-y: auto;
  flex: 1 1 auto;

  > :not(:first-child) {
    margin-top: 8px;
  }
`