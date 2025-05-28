import React, {useEffect} from 'react';
import {Select} from "antd";
import styles from "../css/Map.module.css";

function RealTime({selectOption, setSelectOption}) {
    useEffect(() => {

    }, []);
    return (
        <>
            <Select
                className={styles.roundSelect}
                style={{width: "30%", textAlign: "center"}}
                defaultValue="초미세먼지 (PM-2.5)"
                onChange={(value) => setSelectOption(value)}
                options={[
                    { value: "PM25", label: "초미세먼지 (PM-2.5)" },
                    { value: "PM10", label: "미세먼지 (PM-10)" },
                    { value: "O3", label: "오존 (O₃)" },
                    { value: "NO2", label: "이산화질소 (NO₂)" },
                    { value: "CO", label: "일산화탄소 (CO)" },
                    { value: "SO2", label: "아황산가스 (SO₂)" },
                ]}
            >
            </Select>
            <div className={styles.time}>
                2025년 05월 21일 16시
            </div>
        </>
    );
}

export default RealTime;