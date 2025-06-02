import React, { useEffect, useRef, useState } from "react";
import styles from "/src/css/Header.module.css";
import logo from "/src/images/Logo.svg";
import { Link } from "react-router-dom";
import { DownSquareOutlined, UpSquareOutlined } from "@ant-design/icons";

function Header({ openSidebar, setOpenSidebar }) {
  const [showSubmenu, setShowSubmenu] = useState(false);

  // 메뉴(<ul>) 영역을 가리킬 ref
  const menuRef = useRef(null);
  // 모바일 토글 버튼을 가리킬 ref
  const mobileRef = useRef(null);
  // 외부 클릭 감지: 메뉴가 열려 있을 때, menuRef나 mobileRef 밖을 클릭하면 close
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
              <li
                onMouseEnter={() => setShowSubmenu(true)}
                onMouseLeave={() => setShowSubmenu(false)}
                className={styles.hasSubmenu}
              >
                <Link to="/airalert">대기오염 알림</Link>
                {showSubmenu && (
                  <ul className={styles.submenu}>
                    <li>
                      <Link to="/airalert">경보</Link>
                    </li>
                    <li>
                      <Link to="/airclack">알림</Link>
                    </li>
                  </ul>
                )}
              </li>
              <li>
                <Link to="/favorites">즐겨찾기</Link>
              </li>
            </ul>
          </div>
          {/*<div className={styles.kakao}>*/}
          {/*    <h3>카카오 로그인</h3>*/}
          {/*</div>*/}
          <div
            className={styles.mobileMenu}
            onClick={() => setOpenSidebar(!openSidebar)}
            ref={mobileRef}
          >
            {openSidebar ? <UpSquareOutlined /> : <DownSquareOutlined />}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
