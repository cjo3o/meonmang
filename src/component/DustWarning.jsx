import React from 'react';
import styles from '/src/css/DustWarning.module.css';
import warning from '/src/images/warning.svg';

function DustWarning(props) {
    return (
        <>
            <div className={styles.warning}>
                <div className={styles.warning_content}>
                    <p>미세먼지 주의보/경보</p>
                    <img src={warning} alt="경고" width="50px"/>
                    <p className={styles.warning_date}>2025년 05월 15일 13시</p>
                    <p>발령없음</p>
                </div>
                <div className={styles.warning_footer}>
                    (주의보 0건, 경보 0건)
                </div>
            </div>
        </>
    );
}

export default DustWarning;