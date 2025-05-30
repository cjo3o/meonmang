import React, {useEffect, useState} from 'react';
import styles from '/src/css/Header.module.css';
import logo from '/src/images/Logo.svg';
import {Link} from 'react-router-dom';
import {DownSquareOutlined} from "@ant-design/icons";
import sidebar from "./Sidebar.jsx";

function Header(props) {
    const [openSidebar, setOpenSidebar] = React.useState(false);

    const [showSubmenu, setShowSubmenu] = useState(false);

    return (
        <>
            <div className={styles.Header}>
                <div className={styles.headerContainer}>
                    <div className={styles.Logo}>
                        <img src={logo} alt="logo" width={"180px"}/>
                    </div>
                    <div className={styles.nav}>
                        <ul className={openSidebar ? styles.open : ''}>
                            <li><Link to="">먼망진창 소개</Link></li>
                            <li><Link to="/airdata">대기 정보</Link></li>
                            <li
                              onMouseEnter={() => setShowSubmenu(true)}
                              onMouseLeave={() => setShowSubmenu(false)}
                              className={styles.hasSubmenu}
                            >
                                <Link to="/airalert">대기오염 알림</Link>
                                {showSubmenu && (
                                  <ul className={styles.submenu}>
                                      <li><Link to="/airalert">경보</Link></li>
                                      <li><Link to="/airclack">알림</Link></li>
                                  </ul>
                                )}
                            </li>
                            <li><Link to="">고객지원</Link></li>
                        </ul>
                    </div>
                    {/*<div className={styles.kakao}>*/}
                    {/*    <h3>카카오 로그인</h3>*/}
                    {/*</div>*/}
                    <div className={styles.mobileMenu} onClick={() => setOpenSidebar(!openSidebar)}>
                        <DownSquareOutlined/>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Header;