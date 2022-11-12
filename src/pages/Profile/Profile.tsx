import { useContext } from "react";
import styled from "styled-components";
import { doc, deleteDoc } from "firebase/firestore";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { db } from "../../context/firebaseSDK";
import getProjects from "../../utils/getProjects";
import { AuthContext } from "../../context/authContext";

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
  overflow: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const ProjectRightInnerContainer = styled.div`
  height: 200px;
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

function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    isLogin,
    isLoading,
    name,
    email,
    avatar,
    userId,
    userProjects,
    setSingleProjectId,
    setUserProjects,
  } = useContext(AuthContext);

  function toSingleProjectPage(projectId: string) {
    setSingleProjectId(projectId);
    navigate("/singleProject");
  }

  function toEditExistProjectPage(projectId: string) {
    setSingleProjectId(projectId);
    navigate("/editExistProject");
  }

  async function deleteProjectHandler(projectId: string) {
    const ans = window.confirm(t("delete_project_warning"));
    if (ans === false) return;
    await deleteDoc(doc(db, "projects", projectId));
    const userProjectsData = await getProjects(userId);
    setUserProjects(userProjectsData);
  }

  if (isLoading) {
    return (
      <Wrapper>
        <Loading type="spinningBubbles" color="#3c3c3c" />
      </Wrapper>
    );
  }

  if (!isLogin) {
    navigate("/login");
    return (
      <Wrapper>
        <Container>
          <ProjectTitle>{t("please_login")}</ProjectTitle>
        </Container>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        <UserInfoContainer>
          <Avatar url={`url(${avatar})`} />
          <UserInfo size="24px">{name}</UserInfo>
          <UserInfo size="20px">{email}</UserInfo>
          <UserInfo size="20px">Introduction</UserInfo>
          <UserInfo size="18px">Hello, I am orange!</UserInfo>
        </UserInfoContainer>
        <ProjectListContainer>
          <ProjectHeaderContainer>
            <ProjectTitle>{t("project_list")}</ProjectTitle>
          </ProjectHeaderContainer>
          {userProjects.length === 0 ? (
            <ProjectTitle>{t("go_to_create_project")}</ProjectTitle>
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
                    <Button
                      onClick={() =>
                        toEditExistProjectPage(projectData.projectId)
                      }
                    >
                      {t("edit_again")}
                    </Button>
                    <Button
                      onClick={() =>
                        deleteProjectHandler(projectData.projectId)
                      }
                    >
                      {t("delete_project")}
                    </Button>
                  </ProjectLeftContainer>
                  <ProjectRightContainer>
                    <ProjectRightInnerContainer>
                      {projectData.pages[0].url &&
                        projectData.pages[0].url.map((singleUrl: string) => (
                          <PhotoUrl key={singleUrl} img={`url(${singleUrl})`} />
                        ))}
                    </ProjectRightInnerContainer>
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

export default Profile;
