import React, {useEffect} from 'react';
import styles from '/src/css/Header.module.css';
import logo from '/src/images/Logo.svg';

function Header(props) {
    return (
        <>
            <div className={styles.Header}>
                <div className={styles.headerContainer}>
                    <div className={styles.Logo}>
                        <img src={logo} alt="logo" width={"180px"}/>
                    </div>
                    <div className={styles.nav}>
                        <ul>
                            <li>먼망진창 소개</li>
                            <li>대기 정보</li>
                            <li>대기오염 알림</li>
                            <li>고객지원</li>
                        </ul>
                    </div>
                    <div className={styles.kakao}>
                        <h3>카카오 로그인</h3>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Header;