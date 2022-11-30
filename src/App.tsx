import "./stylesSheet/global.css";
import { Suspense } from "react";
import { Outlet, useLocation } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { Reset } from "styled-reset";
import ReactLoading from "react-loading";

import { AuthContextProvider } from "./context/authContext";
import { FriendContextProvider } from "./context/friendContext";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
  body {
    font-family: 'Roboto','Noto Sans TC','Noto Sans JP', sans-serif;
    color:#3c3c3c;
  }
  #root {
     min-height: 100vh;
  }`;

const BodyWrapper = styled.div`
  width: 100vw;
  height: 100%;
  min-height: calc(100vh - 110px);
  @media screen and (min-width: 800px) and (max-width: 949px) {
    min-height: calc(100vh - 100px);
  }
  @media screen and (max-width: 799px) {
    min-height: calc(100vh - 90px);
  }
`;

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
      <AuthContextProvider>
        <FriendContextProvider>
          {/* {location.pathname !== "/" && <Header />} */}
          <Header />
          <BodyWrapper>
            <Outlet />
          </BodyWrapper>
          <Footer />
        </FriendContextProvider>
      </AuthContextProvider>
    </Suspense>
  );
}

export default App;
