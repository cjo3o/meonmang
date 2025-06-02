import React, {useEffect} from 'react';
import styles from "/src/css/MainPage.module.css";
import Map from "/src/component/Map.jsx";
import AirInfo from "/src/component/AirInfo.jsx";
import Sidebar from "../component/Sidebar.jsx";

function MainPage({setOpenSidebar}) {
    useEffect(() => {
        setOpenSidebar(false);
    },[]);

    return (
        <>
            <div className={styles.Content}>
                <div className={styles.contentBox}>
                    <div className={styles.content1}>
                        <Map className={styles.map}/>
                        <AirInfo></AirInfo>
                    </div>
                </div>
            </div>
            <Sidebar></Sidebar>
            <div>
                {

                }
            </div>
        </>
    );
}

export default MainPage;