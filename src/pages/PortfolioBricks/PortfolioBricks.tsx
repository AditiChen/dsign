import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import ReactLoading from "react-loading";

import { AuthContext } from "../../context/authContext";
import getFriendsProjects from "../../utils/getFriendsProjects";
import getOtherUsersProject from "../../utils/getOtherUsersProject";
import getAllProject from "../../utils/getAllProject";
import Brick from "../../components/Brick/Brick";
import Carousel from "./Carousel";

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
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 80px);
  position: relative;
  display: flex;
  flex-direction: column;
`;

const CarouselContainer = styled.div`
  width: 100%;
  height: 70vh;
  max-height: 700px;
  position: relative;
  @media screen and (min-width: 768px) and (max-width: 1024px) {
    max-height: 500px;
  }
  @media screen and (min-width: 300px) and (max-width: 767px) {
    max-height: 300px;
  }
`;

const BricksContainer = styled.div`
  margin: 0 auto;
  padding: 50px 0;
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
    padding: 30px 0;
    width: 630px;
  }
  @media screen and (min-width: 600px) and (max-width: 799px) {
    width: 530px;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
  @media screen and (max-width: 599px) {
    padding: 20px 0;
    width: 300px;
  }
`;

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

function PortfolioBricks() {
  const { userId, friendList } = useContext(AuthContext);
  const [projects, setProjects] = useState<FetchedProjectsType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userId === "") return;
    async function getProjects() {
      setIsLoading(true);
      const friendProjectsData = await getFriendsProjects(userId, friendList);
      setProjects(friendProjectsData);
      if (friendProjectsData.length < 50) {
        const otherUsersProjectsData = await getOtherUsersProject(
          userId,
          friendList
        );
        setProjects([...friendProjectsData, ...otherUsersProjectsData]);
      }
      setIsLoading(false);
    }
    getProjects();
  }, [friendList, userId]);

  useEffect(() => {
    if (userId !== "") return;
    setProjects([]);
    async function getAllProjects() {
      setIsLoading(true);
      const allData = await getAllProject();
      setProjects(allData);
      setIsLoading(false);
    }
    getAllProjects();
  }, [userId]);

  return (
    <Wrapper>
      <CarouselContainer>
        <Carousel />
      </CarouselContainer>
      {isLoading ? (
        <Loading type="cylon" color="#3c3c3c" />
      ) : (
        <BricksContainer>
          {projects &&
            projects.map((project) => (
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

export default PortfolioBricks;
