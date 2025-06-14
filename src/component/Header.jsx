import React, { useEffect, useRef, useState } from "react";
import styles from "/src/css/Header.module.css";
import logo from "/src/images/Logo.svg";
import { Link } from "react-router-dom";
import {
  DownSquareOutlined,
  StarFilled,
  UpSquareOutlined,
  HomeOutlined
} from "@ant-design/icons";

function Header({ openSidebar, setOpenSidebar }) {
  const [showSubmenu, setShowSubmenu] = useState(false);

  const menuRef = useRef(null);
  const mobileRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        openSidebar &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        mobileRef.current &&
        !mobileRef.current.contains(e.target)
      ) {
        setOpenSidebar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openSidebar, setOpenSidebar]);

  return (
    <>
      <div className={styles.Header}>
        <div className={styles.headerContainer}>
          <div className={styles.Logo}>
            <Link to="/">
              <img src={logo} alt="logo" width={"180px"} />
            </Link>
          </div>
          <div className={styles.nav} ref={menuRef}>
            <ul className={openSidebar ? styles.open : ""}>
              <li>
                <Link to="/intro">먼망진창 소개</Link>
              </li>
              <li>
                <Link to="/airdata">대기 정보</Link>
              </li>
              <li>
                <Link to="/airalert">대기경보 내역</Link>
              </li>
              <li>
                <Link to="/airclack">대기알림 신청</Link>
              </li>
              <li>
                <Link to="/favorites">즐겨찾기</Link>
              </li>
            </ul>
          </div>
          {/*<div className={styles.kakao}>*/}
          {/*    <h3>카카오 로그인</h3>*/}
          {/*</div>*/}
          <div className={styles.group}>
            <Link to={"/"} className={styles.home}>
            <HomeOutlined/>
            </Link>
            <div
              className={styles.mobileMenu}
              onClick={() => setOpenSidebar(!openSidebar)}
              ref={mobileRef}
            >
              {openSidebar ? <UpSquareOutlined /> : <DownSquareOutlined />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
