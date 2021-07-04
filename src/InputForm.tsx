import React, { useRef, useEffect} from 'react'
import styled from 'styled-components'
import * as color from './color'
import { Button, ConfirmButton } from './Button'

export function InputForm({
  value,
  onChange,
  onConfirm,
  onCancel,
  className
}: {
  value?: string
  onChange?(value: string): void
  onConfirm?(): void
  onCancel?(): void
  className?: string
}) {
  const disabled = !value?.trim()
  const handleConfirm = () => {
    if(disabled) {
      return
    }
    onConfirm?.()
  }

  /* =========================================下記カスタムフックでまとめる==============================================
  // useRef
  // useStateと違い、内容変更に伴う再レンダリングがない
  // <>は型定義、HTMLTextAreaElementはTextAreaを動的にスタイリングするWebAPI
  // ()は初期値 = null
  const ref = useRef<HTMLTextAreaElement>(null)
  
  useEffect(() => {
    const el = ref.current // currentプロパティに書き換え可能な値を保持する
    if(!el) return
    
    // getComputedStyle() = スタイル要素を計算・検査する
    // 計算結果を分割代入で取得
    const {borderTopWidth, borderBottomWidth} = getComputedStyle(el)
    el.style.height = "auto" // autoにすることで変更可能になる
    el.style.height = `calc(${borderTopWidth} + ${el.scrollHeight}px + ${borderBottomWidth})` // scrollheightは表示上限、cssで指定してないのでpx必要
  },[value]) // valueが変更される（文字が入力される）たびにuseEffectが実行される = レンダリングせず表示を動的に調整する
  
 =================================================================================================================== */

  /* カスタムフックをインスタンス化 */
  const ref = useAutoFitToContentHeight(value)

  return (
    <Container className={className}>
      <Input
      ref={ref}
        autoFocus
        placeholder="Enter a note"
        value={value}
        onChange={(e) => onChange?.(e.currentTarget.value)}
        onKeyDown={event => {
          // if(!((event.metaKey || event.ctrlKey) && event.key === 'Enter')) {
            //なぜ!をここにつけるのか？
          if(((event.metaKey || event.ctrlKey) && event.key === 'Enter')) {
            console.log(value)
            return handleConfirm()
          }
        }}
      />
      <ButtonRow>
        <AddButton disabled={disabled} onClick={handleConfirm} />
        <CancelButton onClick={onCancel} />
      </ButtonRow>
    </Container>
  )
}

/* カスタムフックとして関数化する */
function useAutoFitToContentHeight(content: string | undefined) { // valueを引数に受ける, 型定義はstring or undefined
  const ref = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = ref.current
    if(!el) return

    const {borderTopWidth, borderBottomWidth} = getComputedStyle(el)
    el.style.height = "auto"
    el.style.height = `calc(${borderTopWidth} + ${el.scrollHeight}px + ${borderBottomWidth})`
  },[content]) // 受け取ったvalue => current が変更されるたびに計算処理を行う

  return ref
}

const Container = styled.div``

const Input = styled.textarea`
  display: block;
  width: 100%;
  margin-bottom: 8px;
  border: solid 1px ${color.Silver};
  border-radius: 3px;
  padding: 6px 8px;
  background-color: ${color.White};
  font-size: 14px;
  line-height: 1.7;

  :focus {
    outline: none;
    border-color: ${color.Blue};
  }
`

const ButtonRow = styled.div`
  display: flex;

  > :not(:first-child) {
    margin-left: 8px;
  }
`

const AddButton = styled(ConfirmButton).attrs({
  children: 'Add',
})``

const CancelButton = styled(Button).attrs({
  children: 'Cancel',
})``