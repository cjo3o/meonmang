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
            <div className={styles.selectCity}>
                <p>시/도</p>
                <Select
                    className={styles.roundSelect}
                    style={{width: "100%", textAlign: "center"}}
                    defaultValue="-전체-"
                    options={[
                        {value: "서울특별시", label: "서울특별시"},
                        {value: "부산광역시", label: "부산광역시"},
                        {value: "대구광역시", label: "대구광역시"},
                        {value: "인천광역시", label: "인천광역시"},
                        {value: "광주광역시", label: "광주광역시"},
                        {value: "대전광역시", label: "대전광역시"},
                        {value: "울산광역시", label: "울산광역시"},
                        {value: "세종특별자치시", label: "세종특별자치시"},
                        {value: "경기도", label: "경기도"},
                        {value: "강원도", label: "강원도"},
                        {value: "충청북도", label: "충청북도"},
                        {value: "충청남도", label: "충청남도"},
                        {value: "전라북도", label: "전라북도"},
                        {value: "전라남도", label: "전라남도"},
                        {value: "경상북도", label: "경상북도"},
                        {value: "경상남도", label: "경상남도"},
                        {value: "제주특별자치도", label: "제주특별자치도"}
                    ]}>
                </Select>
            </div>
            <div className={styles.time}>
                2025년 05월 21일 16시
            </div>
        </>
    );
}

export default RealTime;