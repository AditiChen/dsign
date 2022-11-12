import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../context/firebaseSDK";

import { AuthContext } from "../../context/authContext";
import getFavoriteProjects from "../../utils/getFavoriteProjects";

import likeIcon from "../../icons/like-icon.png";
import likedIcon from "../../icons/liked-icon.png";
import likeIconHover from "../../icons/like-icon-hover.png";

interface Prop {
  img?: string;
  url?: string;
}

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

const Text = styled.div`
  padding: 50px;
  font-size: 50px;
  text-align: center;
`;

const BricksContainer = styled.div`
  margin: 0 auto;
  padding: 50px 0;
  width: 1300px;
  height: 100%;
  position: relative;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: minmax(4, auto);
`;

const SingleProjectContainer = styled.div`
  margin: 0 auto 5px auto;
  width: 300px;
  height: 350px;
  border: 1px solid #787878;
`;

const ImgContainer = styled.div`
  width: 100%;
  height: 300px;
  background-color: lightgray;
  background-image: ${(props: Prop) => props.img};
  background-size: cover;
  background-position: center;
`;

const InfoContainer = styled.div`
  padding: 0 15px;
  width: 300px;
  height: 50px;
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 20px;
  background-image: ${(props: Prop) => props.img};
  background-size: cover;
  background-position: center;
`;

const Author = styled.div`
  margin-left: 10px;
  font-size: 18px;
`;

const LikedIcon = styled.div`
  margin-left: auto;
  width: 30px;
  height: 30px;
  background-image: url(${likedIcon});
  background-size: cover;
  background-position: center;
`;

const LikeIcon = styled(LikedIcon)`
  background-image: url(${likeIcon});
  &:hover {
    background-image: url(${likeIconHover});
  }
`;

function FavoriteList() {
  const navigate = useNavigate();
  const { userId, setSingleProjectId, favoriteList } = useContext(AuthContext);
  const [projects, setProjects] = useState<FetchedProjectsType[]>([]);
  console.log("projects", projects);

  useEffect(() => {
    setProjects([]);
    async function getProjects() {
      const favoriteProjectsData = await getFavoriteProjects(favoriteList);
      setProjects(favoriteProjectsData);
    }
    getProjects();
  }, [userId]);

  async function likeProjectHandler(projectId: string) {
    await updateDoc(doc(db, "users", userId), {
      favoriteList: arrayUnion(projectId),
    });
  }

  async function dislikeProjectHandler(projectId: string) {
    await updateDoc(doc(db, "users", userId), {
      favoriteList: arrayRemove(projectId),
    });
  }

  function toSingleProjectPage(projectId: string) {
    setSingleProjectId(projectId);
    navigate("/singleProject");
  }

  return (
    <Wrapper>
      <Text>Favorite List</Text>
      <BricksContainer>
        {projects.map((project) => (
          <SingleProjectContainer key={project.projectId}>
            <ImgContainer
              img={`url(${project.mainUrl})`}
              onClick={() => toSingleProjectPage(project.projectId)}
            />
            <InfoContainer>
              <Avatar img={`url(${project.avatar})`} />
              <Author>{project.name}</Author>
              {favoriteList.indexOf(project.projectId) === -1 ? (
                <LikeIcon
                  onClick={() => likeProjectHandler(project.projectId)}
                />
              ) : (
                <LikedIcon
                  onClick={() => dislikeProjectHandler(project.projectId)}
                />
              )}
            </InfoContainer>
          </SingleProjectContainer>
        ))}
      </BricksContainer>
    </Wrapper>
  );
}

export default FavoriteList;
