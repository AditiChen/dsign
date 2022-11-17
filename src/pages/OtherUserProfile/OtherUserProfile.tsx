import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { db } from "../../context/firebaseSDK";
import getUserProjects from "../../utils/getUserProjects";
import { AuthContext } from "../../context/authContext";
import { FriendContext } from "../../context/friendContext";

import likeIcon from "../../icons/like-icon.png";
import likeIconHover from "../../icons/like-icon-hover.png";
import likedIcon from "../../icons/liked-icon.png";
import addFriendIcon from "../../icons/add-friend-icon.png";
import addFriendIconHover from "../../icons/add-friend-icon-hover.png";

interface Prop {
  url?: string;
  size?: string;
  background?: string;
  text?: string;
  focus?: string;
  position?: string;
  buttomLine?: string;
  img?: string;
  weight?: string;
}

interface UserProjectsType {
  uid: string;
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
  padding: 130px 0 50px;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 80px);
  position: relative;
  display: flex;
`;

const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  height: 100%;
  display: flex;
  @media screen and (max-width: 1300px) {
    width: 1200px;
  }
`;

const UserInfoContainer = styled.div`
  height: calc(100vh - 260px);
  width: 20vw;
  min-width: 300px;
  padding: 50px 20px;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #f0f0f0;
`;

const Avatar = styled.div`
  height: 180px;
  width: 180px;
  border-radius: 90px;
  background-image: ${(props: Prop) => props.url || "none"};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const UserInfo = styled.div`
  margin-top: 20px;
  color: #3c3c3c;
  font-size: ${(props: Prop) => props.size};
  font-weight: ${(props: Prop) => props.weight};
  & + & {
    margin-top: 10px;
  }
`;

const IntroText = styled.div`
  margin-top: 30px;
  padding-bottom: 5px;
  width: 100%;
  font-size: 20px;
  color: #646464;
  border-bottom: 1px solid #969696;
`;

const Intruduction = styled.textarea`
  padding: 10px 0;
  width: 100%;
  height: 100%;
  max-height: 500px;
  color: #3c3c3c;
  font-size: 18px;
  resize: none;
  border: none;
  outline: none;
  background-color: transparent;
`;

const BricksContainer = styled.div`
  margin: 0 auto;
  padding: 50px 0;
  width: 1300px;
  height: 100%;
  position: relative;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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

const ImgContainer = styled.div`
  width: 100%;
  height: 250px;
  background-image: ${(props: Prop) => props.img};
  background-size: cover;
  background-position: center;
`;

const SingleProjectContainer = styled.div`
  margin: 0 auto 10px auto;
  width: 250px;
  height: 300px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 5px #787878;
  &:hover {
    margin-bottom: 0;
    width: 260px;
    height: 260px;
    box-shadow: 0 0 10px #3c3c3c;
  }
  &:hover > ${ImgContainer} {
    width: 260px;
    height: 260px;
    cursor: pointer;
  }
  &:hover > ${ImgContainer} {
    background-color: #3c3c3c90;
  }
`;

const InfoContainer = styled.div`
  padding: 0 15px;
  width: 300px;
  height: 50px;
  display: flex;
  align-items: center;
`;

const LikedIcon = styled.div`
  margin-left: auto;
  width: 30px;
  height: 30px;
  background-image: url(${likedIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
`;

const LikeIcon = styled(LikedIcon)`
  background-image: url(${likeIcon});
  &:hover {
    background-image: url(${likeIconHover});
  }
`;

const AddFriendIcon = styled(LikedIcon)`
  background-image: url(${addFriendIcon});
  &:hover {
    background-image: url(${addFriendIconHover});
  }
`;

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

function OtherUserProfile() {
  const navigate = useNavigate();
  const { setSingleProjectId, favoriteList, userId } = useContext(AuthContext);
  const { clickedUserId } = useContext(FriendContext);
  const [isLoading, setIsloading] = useState(false);
  const [userProjects, setUserProjects] = useState<UserProjectsType[]>([]);
  const [userData, setUserData] = useState<{
    uid: string;
    name: string;
    avatar: string;
    email: string;
    introduction: string;
  }>();
  console.log("userData", userData);
  console.log("userProjects", userProjects);

  useEffect(() => {
    setIsloading(true);
    async function getData() {
      const docSnap = await getDoc(doc(db, "users", clickedUserId));
      const returnedData = docSnap.data() as {
        uid: string;
        name: string;
        avatar: string;
        email: string;
        introduction: string;
      };
      setUserData(returnedData);
      const userProjectsData = await getUserProjects(returnedData.uid);
      setUserProjects(userProjectsData);
    }
    getData();

    setIsloading(false);
  }, []);

  async function likeProjectHandler(clickedId: string) {
    await updateDoc(doc(db, "users", userId), {
      favoriteList: arrayUnion(clickedId),
    });
  }

  async function dislikeProjectHandler(clickedId: string) {
    await updateDoc(doc(db, "users", userId), {
      favoriteList: arrayRemove(clickedId),
    });
  }

  function toSingleProjectPage(clickedId: string) {
    setSingleProjectId(clickedId);
    navigate("/singleProject");
  }

  if (isLoading) {
    return (
      <Wrapper>
        <Loading type="cylon" color="#3c3c3c" />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        <UserInfoContainer>
          <Avatar url={userData && `url(${userData.avatar})`} />

          <UserInfo size="24px" weight="600">
            {userData && userData.name}
          </UserInfo>
          <UserInfo size="20px">{userData && userData.email}</UserInfo>
          <IntroText>Introduction</IntroText>
          <Intruduction value={userData && userData.introduction} disabled />
        </UserInfoContainer>

        <BricksContainer>
          {userProjects &&
            userProjects.map((project) => (
              <SingleProjectContainer key={project.projectId}>
                <ImgContainer
                  img={`url(${project.mainUrl})`}
                  onClick={() => toSingleProjectPage(project.projectId)}
                />
                <InfoContainer>
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
          {userProjects &&
            userProjects.map((project) => (
              <SingleProjectContainer key={project.projectId}>
                <ImgContainer
                  img={`url(${project.mainUrl})`}
                  onClick={() => toSingleProjectPage(project.projectId)}
                />

                {favoriteList.indexOf(project.projectId) === -1 ? (
                  <LikeIcon
                    onClick={() => likeProjectHandler(project.projectId)}
                  />
                ) : (
                  <LikedIcon
                    onClick={() => dislikeProjectHandler(project.projectId)}
                  />
                )}
              </SingleProjectContainer>
            ))}
          {userProjects &&
            userProjects.map((project) => (
              <SingleProjectContainer key={project.projectId}>
                <ImgContainer
                  img={`url(${project.mainUrl})`}
                  onClick={() => toSingleProjectPage(project.projectId)}
                />

                {favoriteList.indexOf(project.projectId) === -1 ? (
                  <LikeIcon
                    onClick={() => likeProjectHandler(project.projectId)}
                  />
                ) : (
                  <LikedIcon
                    onClick={() => dislikeProjectHandler(project.projectId)}
                  />
                )}
              </SingleProjectContainer>
            ))}
        </BricksContainer>
      </Container>
    </Wrapper>
  );
}

export default OtherUserProfile;
