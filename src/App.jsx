import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./component/Header.jsx";
import Footer from "./component/Footer.jsx";
import MainPage from "./pages/MainPage.jsx";
import AirData from "./pages/AirData.jsx";

function App() {
  return (
    <>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/airdata" element={<AirData />} />
        </Routes>
        <Footer />
      </Router>
    </>
  );
}

export default App;
