import React from 'react';
import {Card} from "antd";
import styles from "/src/css/AirInfo.module.css";
function AirInfo(props) {
    return (
        <>
            <div className={styles.airInfor}>
                <Card
                    title="오늘의 대기질"
                    bordered={false}
                    headStyle={{
                        backgroundColor: '#67D8F3',
                        color: '#fff',
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 'normal',
                    }}
                >
                    dd
                </Card>
                <Card
                    title="대기정보 예보"
                    bordered={false}
                    headStyle={{
                        backgroundColor: '#67D8F3',
                        color: '#fff',
                        textAlign: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 'normal',
                    }}
                >
                    dd
                </Card>
            </div>
        </>
    );
}

export default AirInfo;