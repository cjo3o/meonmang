import {useState} from 'react'
import styles from './App.module.css';
import Header from "./component/Header.jsx";
import Footer from "./component/Footer.jsx";

function App() {

    return (
        <>
            <Header/>
            <div className={styles.Content}>
                dd
            </div>
            <Footer/>
        </>
    )
}

export default App
