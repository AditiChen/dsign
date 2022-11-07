import styled from "styled-components";
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { doc, deleteDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { db } from "../../context/firebaseSDK";
import getProjects from "../../utils/getProjects";

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

const LeftContainer = styled.div`
  padding: 10px;
  height: 200px;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const Text = styled.div`
  font-size: 24px;
`;

const RightContainer = styled.div`
  height: 200px;
  width: 100%;
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
  width: 100px;
  height: 40px;
`;

function ProjectList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId, userProjects, setSingleProjectId, setUserProjects } =
    useContext(AuthContext);

  function toSingleProjectPage(projectId: string) {
    setSingleProjectId(projectId);
    navigate("/singleProject");
  }

  async function deleteProjectHandler(projectId: string) {
    const ans = window.confirm(
      "Are you sure that you want to delete this project?"
    );
    if (ans === false) return;
    await deleteDoc(doc(db, "projects", projectId));
    const userProjectsData = await getProjects(userId);
    setUserProjects(userProjectsData);
  }

  return (
    <Wrapper>
      <Container>
        <HeaderContainer>
          <div>Project List</div>
          <Button onClick={() => navigate("/createNewProject")}>
            {t("create_new_project")}
          </Button>
        </HeaderContainer>
        {userProjects.length === 0 ? (
          ""
        ) : (
          <ProjectsContainer>
            {userProjects.map((projectData) => (
              <SingleProjectContainer key={projectData.projectId}>
                <LeftContainer>
                  <Text>{projectData.title}</Text>
                  {/* <Text>
                      {new Date(projectData.time).toLocaleDateString("zh-TW")}
                    </Text> */}
                  <Button
                    onClick={() => toSingleProjectPage(projectData.projectId)}
                  >
                    view project
                  </Button>
                  <Button
                    onClick={() => deleteProjectHandler(projectData.projectId)}
                  >
                    delete project
                  </Button>
                </LeftContainer>
                <RightContainer>
                  {projectData.pages[0].url &&
                    projectData.pages[0].url.map((singleUrl: string) => (
                      <PhotoUrl key={singleUrl} img={`url(${singleUrl})`} />
                    ))}
                </RightContainer>
              </SingleProjectContainer>
            ))}
          </ProjectsContainer>
        )}
      </Container>
    </Wrapper>
  );
}

export default ProjectList;
