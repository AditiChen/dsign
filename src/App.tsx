import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styled, { Global, css } from "@emotion/react";
import { Reset } from "styled-reset";
import ReactLoading from "react-loading";

import { AuthContextProvider } from "./context/authContext";
import { FriendContextProvider } from "./context/friendContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

const GlobalStyle = css`
  * {
    box-sizing: border-box;
  }

  body {
    font-family: "Montserrat";
  }
  #root {
    min-height: 100vh;
  }
`;

const loadingMarkup = <ReactLoading />;

function App() {
  const location = useLocation();
  return (
    <Suspense fallback={loadingMarkup}>
      <Reset />
      <Global styles={GlobalStyle} />
      <AuthContextProvider>
        <FriendContextProvider>
          {location.pathname !== "/" && <Header />}
          <Outlet />
          {location.pathname !== "/" && <Footer />}
        </FriendContextProvider>
      </AuthContextProvider>
    </Suspense>
  );
}

export default App;
