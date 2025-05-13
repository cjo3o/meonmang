import {useState} from 'react'
import styles from './App.module.css';
import Header from "./component/Header.jsx";
import Footer from "./component/Footer.jsx";
import Map from "./component/Map.jsx";
import AirInfo from "./component/AirInfo.jsx";

function App() {

    return (
        <>
            <Header/>
            <div className={styles.Content}>
                <div className={styles.contentBox}>
                    <div className={styles.content1}>
                        <Map></Map>
                        <AirInfo></AirInfo>
                    </div>
                </div>
            </div>
            <Footer/>
        </>
    )
}

export default App
