import React from 'react';
import {Card} from "antd";
import styles from "/src/css/Map.module.css";

function Map(props) {
    return (
        <>
            <Card
                className={styles.mapCard}
                title={
                    <div>
                        <div>실시간 대기정보</div>
                        <div>오늘/내일 대기정보</div>
                    </div>
                }
                variant="borderless"
                styles={{
                    header: {
                        backgroundColor: '#67D8F3',
                        color: '#fff',
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 'normal',
                    }
                }}
            >
                dd
            </Card>
        </>
    );
}

export default Map;