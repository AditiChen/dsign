import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../context/firebaseSDK";

import { AuthContext } from "../../context/authContext";
import getFriendsProjects from "../../utils/getFriendsProjects";
import getOtherUsersProject from "../../utils/getOtherUsersProject";
import getAllProject from "../../utils/getAllProject";
import Brick from "../../components/Brick/Brick";

interface FetchedProjectsType {
  uid: string;
  name?: string;
  avatar?: string;
  mainUrl: string;
  projectId: string;
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

const BannerContainer = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 700px;
  max-height: calc(100vh - 80px);
  background-color: #00000090;
`;

const Text = styled.div`
  padding: 50px;
  color: white;
  font-size: 50px;
  text-align: center;
`;

const BricksContainer = styled.div`
  margin: 0 auto;
  padding: 50px 0;
  width: 1620px;
  height: 100%;
  position: relative;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: minmax(4, auto);
  @media screen and (min-width: 1400px) and (max-width: 1699px) {
    width: 1300px;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: minmax(4, auto);
  }
  @media screen and (min-width: 1100px) and (max-width: 1399px) {
    width: 960px;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: minmax(4, auto);
  }
  @media screen and (min-width: 800px) and (max-width: 1099px) {
    width: 630px;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: minmax(2, auto);
  }
  @media screen and (max-width: 799px) {
    padding: 20px 0;
    width: 330px;
    grid-template-columns: repeat(1, 1fr);
    grid-auto-rows: minmax(1, auto);
  }
`;

function PortfolioBricks() {
  const { userId, friendList } = useContext(AuthContext);
  const [projects, setProjects] = useState<FetchedProjectsType[]>([]);

  useEffect(() => {
    if (userId === "") return;
    async function getProjects() {
      const friendProjectsData = await getFriendsProjects(userId, friendList);
      setProjects(friendProjectsData);
      if (friendProjectsData.length < 50) {
        const otherUsersProjectsData = await getOtherUsersProject(
          userId,
          friendList
        );
        setProjects([...friendProjectsData, ...otherUsersProjectsData]);
      }
    }
    getProjects();
  }, [userId]);

  useEffect(() => {
    if (userId !== "") return;
    setProjects([]);
    async function getAllProjects() {
      const allData = await getAllProject();
      setProjects(allData);
    }
    getAllProjects();
  }, []);

  return (
    <Wrapper>
      <BannerContainer>
        <Text>Banner</Text>
      </BannerContainer>
      <BricksContainer>
        {projects &&
          projects.map((project) => (
            <Brick
              key={project.projectId}
              projectId={project.projectId}
              mainUrl={project.mainUrl}
              avatar={project.avatar || ""}
              name={project.name || ""}
            />
          ))}
      </BricksContainer>
    </Wrapper>
  );
}

export default PortfolioBricks;
