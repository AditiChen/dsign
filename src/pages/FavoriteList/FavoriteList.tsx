import styled from "styled-components";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/authContext";
import { db } from "../../context/firebaseSDK";

interface Prop {
  img?: string;
}

const Wrapper = styled.div`
  padding: 130px 0;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 80px);
  position: relative;
  display: flex;
`;

const Container = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  padding-bottom: 20px;
  display: flex;
`;

function FavoriteList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId, userProjects, setSingleProjectId, setUserProjects } =
    useContext(AuthContext);

  return (
    <Wrapper>
      <Container>
        <HeaderContainer>
          <div>Favorite List</div>
        </HeaderContainer>
      </Container>
    </Wrapper>
  );
}

export default FavoriteList;
