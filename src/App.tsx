import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { Reset } from "styled-reset";
import ReactLoading from "react-loading";

// import { AuthContextProvider } from "./context/authContext";
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

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

const loadingMarkup = <Loading />;

function App() {
  const location = useLocation();
  return (
    <Suspense fallback={loadingMarkup}>
      <Reset />
      <GlobalStyle />
      {/* <AuthContextProvider> */}
      {location.pathname !== "/" && <Header />}
      <Outlet />
      {location.pathname !== "/" && <Footer />}
      {/* </AuthContextProvider> */}
    </Suspense>
  );
}

export default App;
