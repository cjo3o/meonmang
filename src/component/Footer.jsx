import React from 'react';
import styles from '/src/css/Footer.module.css';
import whiteLogo from '/src/images/WhiteLogo.svg';
function Footer(props) {
    return (
        <>
            <div className={styles.Footer}>
                <img src={whiteLogo} alt="logo" width={"180px"}/>
                <div className={styles.footerContent}>
                    <p>(41937) 대구광역시 중구 중앙대로 394 제일빌딩 5층</p>
                    <p>대표번호 053) 572 - 1005</p>
                </div>
            </div>
        </>
    );
}

export default Footer;