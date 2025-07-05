// import logo from './logo.svg';
import {
  Routes,
  Route,
  HashRouter
} from "react-router-dom";
import './App.css';
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Wine from "./pages/wine";
import Home from "./pages/home";

function App() {
  return (
    <HashRouter>
      <Nav />
      <div className="App col-lg-12 mx-auto">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="italiano" element={<Wine type='italiano' />} />
          <Route path="rosso" element={<Wine type='rosso' />} />
          <Route path="bianco" element={<Wine type='bianco' />} />
          <Route path="sparkling" element={<Wine type='sparkling' />} />
          <Route path="rose" element={<Wine type='rose' />} />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </div>
      <Footer />
    </HashRouter>
  );
}

export default App;
