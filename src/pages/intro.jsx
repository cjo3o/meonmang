import React from "react";
import {Card} from "antd";
import IntroStyle from "../../src/css/Intro.module.css";

function Intro() {
    return (
        <div className={IntroStyle.content}>
            <div className={IntroStyle.center}>
                <Card>
                    <div className={IntroStyle.header}>
                        <h1>인사말</h1>
                    </div>

                        <div className={IntroStyle.intro}>
                            <h2>실시간 미세먼지 알림 서비스, 먼망진창에 오신 것을 환영합니다!</h2>
                            <h3>먼망진창은 "먼지 망했네, 진짜 창문도 못 열어!" 라는 의미를 담아 <br/>
                                 실시간 대기오염 정보를 쉽고 빠르게 제공합니다.</h3>
                        </div>
                    <div className={IntroStyle.middle}>
                        <div className={IntroStyle.menu}>
                            <div>
                            <h2>주요기능</h2>
                            <h3>- 실시간 대기정보</h3>
                            <p>원하는 대기 정보를 한눈에 확인하세요!</p>
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
                    <div className={IntroStyle.intro}>
                        <h2>먼망진창과 함께, 맑은 공기와 건강한 일상을 만들어보아요.</h2>
                    </div>
                </Card>
            </div>
        </div>
    );
}

export default Intro;