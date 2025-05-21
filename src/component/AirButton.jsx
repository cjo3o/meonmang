import { Button } from 'antd'
import React from 'react'
import AButton from "../css/AirButton.module.css"

function AirButton() {
  return (
    <div className={AButton.Btn}>
      <Button className={AButton.Btn}>어제</Button>
      <Button className={AButton.Btn}>오늘</Button>
      <Button>내일</Button>
    </div>
  )
}

export default AirButton