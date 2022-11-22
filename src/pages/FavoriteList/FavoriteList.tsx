import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import ReactLoading from "react-loading";

import { AuthContext } from "../../context/authContext";
import getFavoriteProjects from "../../utils/getFavoriteProjects";
import Brick from "../../components/Brick/Brick";

interface FetchedProjectsType {
  uid: string;
  name?: string;
  avatar?: string;
  mainUrl: string;
  projectId: string;
  introduction: string;
  title: string;
  time: number;
  pages: {
    type: number;
    content?: string[];
    url?: string[];
    location?: { lat?: number; lng?: number };
  }[];
}

const Wrapper = styled.div`
  padding-top: 80px;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 80px);
  position: relative;
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  margin: 0 auto;
  height: 120px;
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  padding: 0 50px;
  font-size: 30px;
  text-align: center;
`;

const ContentContainer = styled.div`
  display: flex;
`;

const Content = styled.div`
  width: 100%;
  padding: 0 50px;
  font-size: 24px;
  text-align: center;
`;

const BricksContainer = styled.div`
  margin: 0 auto;
  padding-bottom: 50px;
  width: 1620px;
  height: 100%;
  position: relative;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  @media screen and (min-width: 1400px) and (max-width: 1699px) {
    width: 1300px;
  }
  @media screen and (min-width: 1100px) and (max-width: 1399px) {
    width: 960px;
  }
  @media screen and (min-width: 800px) and (max-width: 1099px) {
    width: 630px;
  }
  @media screen and (max-width: 799px) {
    padding: 20px 0;
    width: 330px;
  }
`;

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

function FavoriteList() {
  const { t } = useTranslation();
  const { userId, favoriteList } = useContext(AuthContext);
  const [projects, setProjects] = useState<FetchedProjectsType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getProjects() {
      setIsLoading(true);
      const favoriteProjectsData = await getFavoriteProjects(favoriteList);
      setProjects(favoriteProjectsData || []);
      setIsLoading(false);
    }
    getProjects();
  }, [userId, favoriteList]);

  return (
    <Wrapper>
      <HeaderContainer>
        <Title>{t("favorite_list")}</Title>
      </HeaderContainer>
      {isLoading && <Loading type="cylon" color="#3c3c3c" />}
      {!isLoading && favoriteList.length === 0 && (
        <ContentContainer>
          <Content>{t("empty_favorite_list")}</Content>
        </ContentContainer>
      )}
      {!isLoading && favoriteList.length !== 0 && (
        <BricksContainer>
          {projects.map((project) => (
            <Brick
              key={project.projectId}
              uid={project.uid}
              projectId={project.projectId}
              mainUrl={project.mainUrl}
              title={project.title}
              avatar={project.avatar || ""}
              name={project.name || ""}
            />
          ))}
        </BricksContainer>
      )}
    </Wrapper>
  );
}

export default FavoriteList;
