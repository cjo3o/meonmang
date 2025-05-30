import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Header from "./component/Header.jsx";
import Footer from "./component/Footer.jsx";
import MainPage from "./pages/MainPage.jsx";
import AirData from "./pages/AirData.jsx";
import styles from "./App.module.css";
import AirAlert from "./pages/Clack/AirAlert.jsx";
import AirClack from "./pages/Clack/AirClack.jsx";
import Intro from "./pages/intro.jsx";

function App() {
  return (
    <>
        <div className={styles.wrap}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
            <Route path="/intro" element={<Intro />} />
          <Route path="/airdata" element={<AirData />} />
          <Route path="/airalert" element={<AirAlert />} />
          <Route path="/airclack" element={<AirClack />} />
        </Routes>
        <Footer />
      </Router>
        </div>
    </>
  );
}

export default App;
