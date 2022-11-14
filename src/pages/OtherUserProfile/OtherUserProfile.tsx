import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { doc, getDoc } from "firebase/firestore";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { db } from "../../context/firebaseSDK";
import getProjects from "../../utils/getUserProjects";
import { AuthContext } from "../../context/authContext";
import { FriendContext } from "../../context/friendContext";

interface Prop {
  url?: string;
  size?: string;
  background?: string;
  text?: string;
  focus?: string;
  position?: string;
  buttomLine?: string;
  img?: string;
}

interface UserProjectsType {
  author: string;
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
  width: 80%;
  max-width: 1500px;
  height: 100%;
  position: relative;
  display: flex;
  @media screen and (max-width: 1300px) {
    width: 1200px;
  }
`;

const UserInfoContainer = styled.div`
  width: 400px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Avatar = styled.div`
  height: 180px;
  width: 180px;
  background-image: ${(props: Prop) => props.url};
  background-size: cover;
  background-position: center;
`;

const UserInfo = styled.div`
  margin-top: 20px;
  font-size: 24px;
  color: #3c3c3c;
  font-size: ${(props: Prop) => props.size};
  & + & {
    margin-top: 12px;
  }
`;

const ProjectListContainer = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const ProjectHeaderContainer = styled.div`
  padding-bottom: 20px;
  display: flex;
`;

const ProjectsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const SingleProjectContainer = styled.div`
  height: 200px;
  width: 100%;
  display: flex;
  border: 1px solid black;
  & + & {
    margin-top: 20px;
  }
`;

const ProjectLeftContainer = styled.div`
  padding: 10px;
  height: 200px;
  width: 40%;
  display: flex;
  flex-direction: column;
`;

const ProjectTitle = styled.div`
  font-size: 24px;
`;

const ProjectRightContainer = styled.div`
  height: 200px;
  width: 60%;
  display: flex;
  align-items: center;
`;

const PhotoUrl = styled.div`
  width: 180px;
  height: 180px;
  background-image: ${(props: Prop) => props.img};
  background-position: center;
  background-size: cover;
  & + & {
    margin-left: 10px;
  }
`;

const Button = styled.button`
  margin-top: 10px;
  width: 170px;
  height: 40px;
`;

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

function OtherUserProfile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setSingleProjectId } = useContext(AuthContext);
  const { clickedUserId } = useContext(FriendContext);
  const [isLoading, setIsloading] = useState(false);
  const [userProjects, setUserProjects] = useState<UserProjectsType[]>([]);
  const [userData, setUserData] = useState<{
    uid: string;
    name: string;
    avatar: string;
    email: string;
    friendList: string[];
  }>();

  useEffect(() => {
    setIsloading(true);
    async function getData() {
      const docSnap = await getDoc(doc(db, "users", clickedUserId));
      const returnedData = docSnap.data() as {
        uid: string;
        name: string;
        avatar: string;
        email: string;
        friendList: string[];
      };
      setUserData(returnedData);
      const userProjectsData = await getProjects(returnedData.uid);
      setUserProjects(userProjectsData);
    }
    getData();

    setIsloading(false);
  }, []);

  function toSingleProjectPage(projectId: string) {
    setSingleProjectId(projectId);
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
          <UserInfo size="24px">{userData && userData.name}</UserInfo>
          <UserInfo size="20px">{userData && userData.email}</UserInfo>
          <UserInfo size="20px">Introduction</UserInfo>
          <UserInfo size="18px">Hello, I am apple!</UserInfo>
        </UserInfoContainer>
        <ProjectListContainer>
          <ProjectHeaderContainer>
            <ProjectTitle>{t("project_list")}</ProjectTitle>
          </ProjectHeaderContainer>
          {userProjects.length === 0 ? (
            ""
          ) : (
            <ProjectsContainer>
              {userProjects.map((projectData) => (
                <SingleProjectContainer key={projectData.projectId}>
                  <ProjectLeftContainer>
                    <ProjectTitle>{projectData.title}</ProjectTitle>
                    {/* <Text>{projectData.time.toDate()}</Text> */}
                    <Button
                      onClick={() => toSingleProjectPage(projectData.projectId)}
                    >
                      {t("view_project_detail")}
                    </Button>
                  </ProjectLeftContainer>
                  <ProjectRightContainer>
                    {projectData.pages[0].url &&
                      projectData.pages[0].url.map((singleUrl: string) => (
                        <PhotoUrl key={singleUrl} img={`url(${singleUrl})`} />
                      ))}
                  </ProjectRightContainer>
                </SingleProjectContainer>
              ))}
            </ProjectsContainer>
          )}
        </ProjectListContainer>
      </Container>
    </Wrapper>
  );
}

export default OtherUserProfile;
