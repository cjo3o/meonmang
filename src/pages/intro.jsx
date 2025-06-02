import React, { useEffect } from "react";
import { Card } from "antd";
import IntroStyle from "../../src/css/Intro.module.css";

function Intro({setOpenSidebar}) {
  useEffect (()=>{
    setOpenSidebar(false);
  },[])

  return (
    <div className={IntroStyle.content}>
      <div className={IntroStyle.center}>
        <Card>
          <div className={IntroStyle.header}>
            <h1>인사말</h1>
          </div>

          <div className={IntroStyle.intro}>
            <div>
              <h2>
                <span className={IntroStyle.intro1}>
                  실시간 미세먼지 알림 서비스,
                </span>
                <span className={IntroStyle.intro2}>
                  {" "}
                  먼망진창에 오신 것을 <span className={IntroStyle.intro4}>환영합니다!</span>
                </span>
              </h2>
            </div>
            <div>
              <h3>
                <span className={IntroStyle.centro1}>
                  먼망진창은 "먼지 망했어,
                </span>{" "}
                <span className={IntroStyle.centro2}>
                  진짜 창문도 못 열어!" 라는
                </span>
                <span className={IntroStyle.centro3}> 의미를 담아</span>
              </h3>
              <h3>
                <span className={IntroStyle.centro4}>
                  실시간 대기오염 정보를
                </span>
                <span className={IntroStyle.centro5}>
                  {" "}
                  쉽고 빠르게 제공합니다.
                </span>
              </h3>
            </div>
          </div>
          <div className={IntroStyle.middle}>
            <div className={IntroStyle.menu}>
              <div>
                <h2>주요기능</h2>
                <h3>- 실시간 대기정보</h3>
                <p>원하는 대기 정보를 한눈에 확인하세요!</p>
                <h3>- 즐겨찾기</h3>
                <p>관심지역을 저장하고 언제든 빠르게 확인하세요!</p>
                <h3>- 대기오염경보 발령 현황</h3>
                <p>대기오염경보가 발령되면 바로 확인할 수 있어요!</p>
                <h3>- 알림 서비스</h3>
                <p>원하는 시간, 지역, 대기정보의 알림을 받으세요!</p>
              </div>
              <img
                src="/icons/icon-256x256.png"
                alt="메뉴 아이콘"
                className={IntroStyle.menuIcon}
              />
            </div>
          </div>
          <div>
            <h2 className={IntroStyle.intro3}><span className={IntroStyle.intro5}>먼망진창과 함께, 맑은 공기와</span><span> 건강한 일상을 만들어보아요.</span></h2>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Intro;
