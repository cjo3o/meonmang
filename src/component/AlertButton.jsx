import { Button } from 'antd'
import React from 'react'
import AButton from "../css/AirButton.module.css"

function AlertButton() {
    return (
        <div className={AButton.Btn}>
            <Button className={AButton.Btn}>전체</Button>
            <Button className={AButton.Btn}>미세먼지</Button>
            <Button className={AButton.Btn}>초미세먼지</Button>
            <Button>오존</Button>
        </div>
    )
}

export default AlertButton