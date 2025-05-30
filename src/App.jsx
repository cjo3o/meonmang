import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from "./component/Header.jsx";
import Footer from "./component/Footer.jsx";
import MainPage from "./pages/MainPage.jsx";
import AirData from "./pages/AirData.jsx";
import styles from "./App.module.css";

function App() {
    return (
        <>
            <div className={styles.wrap}>
                <Router>
                    <Header/>
                    <Routes>
                        <Route path="/" element={<MainPage/>}/>
                        <Route path="/airdata" element={<AirData/>}/>
                    </Routes>
                    <Footer/>
                </Router>
            </div>
        </>
    );
}

export default App;
