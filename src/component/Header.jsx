import React, {useEffect} from 'react';
import {Layout} from "antd";
import styles from '/src/css/Header.module.css';
import logo from '/src/images/Logo.svg';
function Header(props) {
    return (
        <>
            <div className={styles.Header}>
                <div className={styles.nav}>
                    {/*<img src={logo} alt="logo" />*/}
                    <h3>먼망진창 소개</h3>
                    <h3>대기 정보</h3>
                    <h3>대기오염 알림</h3>
                    <h3>고객지원</h3>
                </div>
            </div>
        </>
    );
}

export default Header;