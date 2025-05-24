import {Card, Select} from "antd";
import styles from "/src/css/Map.module.css";
import React, {useState} from "react";
import RealTime from "./RealTime.jsx";
import DateInfor from "./DateInfor.jsx";
import RealTimeMap from "./RealTimeMap.jsx";

function Map(props) {
    const [activeTab, setActiveTab] = useState("realTime");
    const [selectOption, setSelectOption] = useState("PM25");

    return (
        <>
            <Card
                className={styles.mapCard}
                title={
                    <>
                        <div className={styles.mapTitle}>
                            <div className={`${styles.realTime} ${activeTab === "realTime" ? styles.active : ""}`}
                                 onClick={() => setActiveTab("realTime")}>
                                실시간 대기정보
                            </div>
                            <div className={`${styles.dateInfor} ${activeTab === "dateInfor" ? styles.active : ""}`}
                                 onClick={() => setActiveTab("dateInfor")}>
                                오늘/내일 대기정보
                            </div>
                        </div>
                        <div className={styles.subTitle}>
                            {activeTab === "realTime" ? <RealTime selectOption={selectOption} setSelectOption={setSelectOption}/> : <DateInfor/>}
                        </div>
                    </>
                }
                variant="borderless"
                styles={{
                    header: {
                        padding: 0,
                        border: "none",
                        minHeight: 0
                    }
                }}
            >

                {
                    activeTab === "realTime" ? <RealTimeMap selectOption={selectOption}/> : "오늘/내일 대기정보"
                }

            </Card>
        </>
    );
}

export default Map;