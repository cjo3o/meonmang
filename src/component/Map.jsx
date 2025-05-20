import React from 'react';
import {Card} from "antd";
import styles from "/src/css/Map.module.css";

function Map(props) {
    return (
        <>
            <Card
                className={styles.mapCard}
                title={
                    <div className={styles.mapTitle}>
                        <div className={styles.realTime}>실시간 대기정보</div>
                        <div className={styles.dateInfor}>오늘/내일 대기정보</div>
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
                dd
            </Card>
        </>
    );
}

export default Map;