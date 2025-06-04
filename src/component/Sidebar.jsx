import React from 'react';
import styles from '/src/css/Sidebar.module.css';
import alert from '/src/images/alert.svg';
import { Link } from "react-router-dom";

function Sidebar(props) {
    return (
        <>
            <Link to="/airclack">
            <div className={styles.sidebar}>
                <img src={alert} alt="알림" width={"40px"}/>
                <p>대기알림</p>
                <p>신청</p>

            </div>
            </Link>
        </>
    );
}

export default Sidebar;