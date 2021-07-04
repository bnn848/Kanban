import React, { useState, useRef} from 'react'
import styled from "styled-components"
import * as color from './color'
import { CheckIcon as _CheckIcon, TrashIcon } from './icon'

Card.DropArea = DropArea

/* Card */
export function Card({
  text,
  onDragStart,
  onDragEnd
  }: {
  text?: string
  onDragStart?(): void
  onDragEnd?(): void
  }) {
  const [drag, setDrag] = useState(false) 
  
  return (
    <Container
      style={{opacity: drag ? 0.5 : undefined}} // ドラッグ中は半透明
      onDragStart={() => {
        onDragStart?.()
        setDrag(true)
      }}
      onDragEnd={() => {
        onDragEnd?.()
        setDrag(false)
      }}
    >
    
    <CheckIcon />

      {text?.split(/(https?:\/\/\S+)/g).map((fragment, i) =>
        i % 2 === 0 ? (
          <Text key={i}>{fragment}</Text>
          ) : (
          <Link key={i} href={fragment}>{fragment}</Link>
        ),
      )}
      <DeleteButton />
    </Container>
  )
}


/* DropArea */
function DropArea({
  // Props
  disabled,
  onDrop,
  children,
  className,
  style
}: {
  // Types
  disabled?: boolean
  onDrop?(): void
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const [isTarget, setIsTarget] = useState(false) // Cardがドラッグ中かどうか
  const visible = !disabled && isTarget // not disable かつ ドラッグ中のアイテムにvisibleプロパティ（true）をつける
  const [dragOver, onDragOver] = useDragAutoLeave() // カスタムフック : ドラッグ中かどうかのフラグ

  return (
    <DropAreaContainer
      style={style}
      className={className}
      onDragOver={(e) => {
        if(disabled) return // disabled === true の場合、処理をスルー
        e.preventDefault() // ロードを回避する
        onDragOver(() => setIsTarget(false)) // isTargetのステートを初期値falseに戻す
      }}
      onDragEnter={() => {
        if(disabled || dragOver.current) { // disabled === true もしくは useRefのdragOverが現在trueの場合、処理をスルー
          return
        }
        setIsTarget(true)
      }}
      onDrop={() => {
        if(disabled) {
          return
        }
        setIsTarget(false)
        onDrop?.()
      }}
    >
      
      <DropAreaIndicator
        style={{height: !visible ? 0 : undefined, borderWidth: !visible ? 0 : undefined}}
      >
        {children}
      </DropAreaIndicator>

    </DropAreaContainer>
  )
}

/* useDragAutoLeave（カスタムフックの作成） */
function useDragAutoLeave(timeout: number = 100) {
  const dragOver = useRef(false) // DragOverしても再描画しない（表示上は変更する）
  const timer = useRef(0)

  return [ // [] as const  とは？
    dragOver,
    (onDragLeave?: () => void) => { // 引数に関数を持つことができる(関数の返値はなし)
      clearTimeout(timer.current) // 下記timer.currentをクリア
      dragOver.current = true // ドラッグ中を示すフラグを継続
      timer.current = setTimeout(() => {
        dragOver.current = false
        onDragLeave?.()
      }, timeout) // コンポーネントのパラメータで受け取ったtimeout後に処理を実行
    }
  ] as const
}



/* Styles */

// Card
const Container = styled.div.attrs({
  draggable: true,
})`
  position: relative;
  border: solid 1px ${color.Silver};
  border-radius: 6px;
  box-shadow: 0 1px 3px hsla(0, 0%, 7%, 0.1);
  padding: 8px 32px;
  background-color: ${color.White};
  cursor: move;
`

const CheckIcon = styled(_CheckIcon)`
  position: absolute;
  top: 12px;
  left: 8px;
  color: ${color.Green};
`

const DeleteButton = styled.button.attrs({
  type: 'button',
  children: <TrashIcon />,
})`
  position: absolute;
  top: 12px;
  right: 8px;
  font-size: 14px;
  color: ${color.Gray};

  :hover {
    color: ${color.Red};
  }
`
const Text = styled.span`
  color: ${color.Black};
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
`
const Link = styled.a.attrs({
  target: '_blank',
  rel: 'noopener noreferrer',
})`
  color: ${color.Blue};
  font-size: 14px;
  line-height: 1.7;
  white-space: pre-wrap;
`

// DropArea
const DropAreaContainer = styled.div`
  > :not(:first-child) {
    margin-top: 8px;
  }
`

const DropAreaIndicator = styled.div`
  height: 40px;
  border: dashed 3px ${color.Gray};
  border-radius: 6px;
  transition: all 50ms ease-out;
`