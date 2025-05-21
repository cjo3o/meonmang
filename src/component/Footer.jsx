import React from 'react';
import styles from '/src/css/Footer.module.css';
import whiteLogo from '/src/images/WhiteLogo.svg';
import Top from '/src/images/Top.svg';

function Footer(props) {
    return (
        <>
            <div className={styles.Footer}>
                <div className={styles.footerContainer}>
                    <img src={whiteLogo} alt="whitelogo" width={"180px"}/>
                    <div className={styles.footerContent}>
                        <p>(41937) 대구광역시 중구 중앙대로 394 제일빌딩 5층</p>
                        <p>대표번호 053) 572 - 1005</p>
                        <p>개인정보처리방침</p>
                    </div>
                    <div className={styles.moveTop}>
                        <img src={Top} alt="top"/>
                        <p>TOP</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Footer;