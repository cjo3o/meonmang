import React from 'react';
import styles from "../css/Map.module.css";
import {Select} from "antd";

function DateInfor(props) {
    const [selectDate, setSelectDate] = React.useState("today");
    return (
        <>
            <Select
                className={styles.roundSelect}
                style={{width: "30%", textAlign: "center"}}
                defaultValue="초미세먼지 (PM-2.5)"
                options={[
                    {value: "초미세먼지 (PM-2.5)", label: "초미세먼지 (PM-2.5)"},
                    {value: "미세먼지 (PM-10)", label: "미세먼지 (PM-10)"},
                    {value: "오존 (O₃)", label: "오존 (O₃)"},
                    {value: "이산화질소 (NO₂)", label: "이산화질소 (NO₂)"},
                    {value: "일산화탄소 (CO)", label: "일산화탄소 (CO)"},
                    {value: "아황산가스 (SO₂)", label: "아황산가스 (SO₂)"},
                ]}>
            </Select>
            <div className={styles.selectDate}>
                <div className={`${styles.today} ${selectDate === "today" ? styles.select : ""}`}
                     onClick={() => setSelectDate("today")}>
                    오늘
                </div>
                <div className={`${styles.tomorrow} ${selectDate === "tomorrow" ? styles.select : ""}`}
                     onClick={() => setSelectDate("tomorrow")}>
                    내일
                </div>
            </div>
        </>
    );
}

export default DateInfor;