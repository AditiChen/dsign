import { Outlet, useLocation } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import { Reset } from "styled-reset";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Montserrat';
  }
  #root {
     min-height: 100vh;
  }`;

function App() {
  const location = useLocation();
  return (
    <>
      <Reset />
      <GlobalStyle />
      {location.pathname !== "/" && <Header />}
      <Outlet />
      {location.pathname !== "/" && <Footer />}
      {/* <Footer /> */}
    </>
  );
}

export default App;
