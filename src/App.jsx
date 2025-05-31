import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from "./component/Header.jsx";
import Footer from "./component/Footer.jsx";
import MainPage from "./pages/MainPage.jsx";
import AirData from "./pages/AirData.jsx";
import styles from "./App.module.css";
import AirAlert from "./pages/Clack/AirAlert.jsx";
import AirClack from "./pages/Clack/AirClack.jsx";
import Intro from "./pages/intro.jsx";
import {useState} from "react";

function App() {
    const [openSidebar, setOpenSidebar] = useState(false);

    return (
        <>
            <div className={styles.wrap}>
                <Router>
                    <Header openSidebar={openSidebar} setOpenSidebar={setOpenSidebar} />
                    <Routes>
                        <Route path="/" element={<MainPage setOpenSidebar={setOpenSidebar}/>}/>
                        <Route path="/intro" element={<Intro setOpenSidebar={setOpenSidebar}/>}/>
                        <Route path="/airdata" element={<AirData setOpenSidebar={setOpenSidebar}/>}/>
                        <Route path="/airalert" element={<AirAlert setOpenSidebar={setOpenSidebar}/>}/>
                        <Route path="/airclack" element={<AirClack setOpenSidebar={setOpenSidebar}/>}/>
                    </Routes>
                    <Footer/>
                </Router>
            </div>
        </>
    );
}

export default App;
