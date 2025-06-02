import React from 'react';
import styles from '/src/css/Footer.module.css';
import whiteLogo from '/src/images/WhiteLogo.svg';
import Top from '/src/images/Top.svg';

function Footer(props) {
    const moveTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }
    return (
        <>
            <div className={styles.Footer}>
                <div className={styles.footerContainer}>
                    <div className={styles.logo}>
                        <img src={whiteLogo} alt="whitelogo" width={"180px"}/>
                    </div>
                    <div className={styles.footerContent}>
                        <p>(41937) 대구광역시 중구 중앙대로 394 제일빌딩 5층</p>
                        <p>대표번호 053) 572 - 1005</p>

                    </div>
                    <div className={styles.moveTop} onClick={moveTop}>
                        <img src={Top} alt="top"/>
                        <p>TOP</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Footer;