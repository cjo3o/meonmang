import {Card} from "antd";
import styles from "/src/css/Map.module.css";
import {useState} from "react";

function Map(props) {
    const [activeTab, setActiveTab] = useState("realTime");
    return (
        <>
            <Card
                className={styles.mapCard}
                title={
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
                {activeTab === "realTime" ? "실시간 대기정보" : "오늘/내일 대기정보"}
            </Card>
        </>
    );
}

export default Map;