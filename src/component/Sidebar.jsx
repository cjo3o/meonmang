import React from 'react';
import styles from '/src/css/Sidebar.module.css';
import alert from '/src/images/alert.svg';

function Sidebar(props) {
    return (
        <>
            <div className={styles.sidebar}>
                <img src={alert} alt="알림" width={"40px"}/>
                <p>대기알림</p>
                <p>신청</p>
            </div>
        </>
    );
}

export default Sidebar;