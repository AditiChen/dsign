import { useContext } from "react";
import styled from "styled-components";
import { doc, deleteDoc } from "firebase/firestore";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { db } from "../../context/firebaseSDK";
import getUserProjects from "../../utils/getUserProjects";
import { AuthContext } from "../../context/authContext";

import viewIcon from "../../icons/view-icon.png";
import viewIconHover from "../../icons/view-icon-hover.png";
import editIcon from "../../icons/edit-icon.png";
import editIconHover from "../../icons/edit-icon-hover.png";
import trashIcon from "../../icons/trash-icon.png";
import trashIconHover from "../../icons/trash-icon-hover.png";
import cameraIcon from "../../icons/camera-icon.png";
import cameraIconHover from "../../icons/camera-icon-hover.png";

interface Prop {
  url?: string;
  size?: string;
  background?: string;
  text?: string;
  focus?: string;
  position?: string;
  buttomLine?: string;
  img?: string;
  hoverImg?: string;
  marginLift?: string;
}

const Wrapper = styled.div`
  padding: 130px 0 50px;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 80px);
  position: relative;
  display: flex;
  background-color: #b4b4b4;
`;

const Container = styled.div`
  margin: 0 auto;
  width: 80%;
  max-width: 1500px;
  height: 100%;
  display: flex;
  @media screen and (max-width: 1300px) {
    width: 1200px;
  }
`;

const UserInfoContainer = styled.div`
  width: 300px;
  padding: 20px;
  position: absolute;
  left: 5vw;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Avatar = styled.div`
  height: 180px;
  width: 180px;
  background-image: ${(props: Prop) => props.url || "none"};
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
  width: 800px;
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
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 1px 1px 5px #3c3c3c inset;
  & + & {
    margin-top: 20px;
  }
`;

const ProjectLeftContainer = styled.div`
  padding: 20px;
  height: 200px;
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ProjectTitle = styled.div`
  font-size: 24px;
  color: #3c3c3c;
`;

const ProjectIconContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.div`
  margin-left: ${(props: Prop) => props.marginLift};
  width: 30px;
  height: 30px;
  background-image: ${(props: Prop) => props.img};
  background-position: center;
  background-size: cover;
  &:hover {
    background-image: ${(props: Prop) => props.hoverImg};
  }
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
    const userProjectsData = await getUserProjects(userId);
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
                    <ProjectIconContainer>
                      <Icon
                        img={`url(${viewIcon})`}
                        hoverImg={`url(${viewIconHover})`}
                        marginLift="0"
                        onClick={() =>
                          toSingleProjectPage(projectData.projectId)
                        }
                      />
                      <Icon
                        img={`url(${editIcon})`}
                        hoverImg={`url(${editIconHover})`}
                        marginLift="15px"
                        onClick={() =>
                          toEditExistProjectPage(projectData.projectId)
                        }
                      />
                      <Icon
                        img={`url(${trashIcon})`}
                        hoverImg={`url(${trashIconHover})`}
                        marginLift="auto"
                        onClick={() =>
                          deleteProjectHandler(projectData.projectId)
                        }
                      />
                    </ProjectIconContainer>
                  </ProjectLeftContainer>
                  <ProjectRightContainer>
                    <ProjectRightInnerContainer>
                      {/* {projectData.pages[0].url &&
                        projectData.pages[0].url.map((singleUrl: string) => (
                          <PhotoUrl key={singleUrl} img={`url(${singleUrl})`} />
                        ))} */}

                      <PhotoUrl
                        key={projectData.mainUrl}
                        img={`url(${projectData.mainUrl})`}
                      />
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
