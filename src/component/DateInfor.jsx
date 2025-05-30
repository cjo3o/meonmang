import React from 'react';
import styles from "../css/Map.module.css";
import {Select} from "antd";

function DateInfor({setDateOption, selectDate, setSelectDate}) {
    return (
        <>
            <Select
                className={styles.roundSelect}
                style={{width: "30%", textAlign: "center"}}
                defaultValue="초미세먼지 (PM-2.5)"
                onChange={(value) => setDateOption(value)}
                options={[
                    {value: "PM25", label: "초미세먼지 (PM-2.5)"},
                    {value: "PM10", label: "미세먼지 (PM-10)"},
                    {value: "O3", label: "오존 (O₃)"},
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