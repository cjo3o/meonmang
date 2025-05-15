import React from 'react';
import {Card} from "antd";
import styles from "/src/css/TimeDust.module.css";
function TimeDust(props) {
    return (
        <>
            <Card
                className={styles.tdCard}
                title="시간별 미세먼지 예보"
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
                ㅇㅇㅇㅇ
            </Card>
        </>
    );
}

export default TimeDust;