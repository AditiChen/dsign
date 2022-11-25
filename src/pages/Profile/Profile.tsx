import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";

import { db } from "../../context/firebaseSDK";
import getUserProjects from "../../utils/getUserProjects";
import SquareOverlay from "../../components/Overlays/squareOverlay";
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
  img?: string;
  hoverImg?: string;
  marginLift?: string;
  weight?: string;
  border?: string;
}

const Wrapper = styled.div`
  padding: 50px 0;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 140px);
  position: relative;
  display: flex;
  background-color: #787878;
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
  margin-left: 50px;
  height: calc(100vh - 260px);
  width: 15vw;
  min-width: 300px;
  padding: 30px 20px;
  position: fixed;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  background-color: #f0f0f0;
  box-shadow: 0 0 10px #3c3c3c;
`;

const Avatar = styled.div`
  height: 180px;
  width: 180px;
  border-radius: 90px;
  background-image: ${(props: Prop) => props.url || "none"};
  background-size: cover;
  background-position: center;
  position: relative;
  box-shadow: 0 0 5px #3c3c3c;
`;

const CameraIcon = styled.div`
  height: 24px;
  width: 24px;
  position: absolute;
  right: 4px;
  bottom: -4px;
  background-image: url(${cameraIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    background-image: url(${cameraIconHover});
    cursor: pointer;
  }
`;

const UserInfo = styled.div`
  margin-top: 20px;
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

const Introduction = styled.textarea`
  padding: 10px 0;
  width: 100%;
  height: 100%;
  max-height: calc(100% - 350px);
  font-size: 18px;
  resize: none;
  border: ${(props: Prop) => props.border};
  outline: none;
`;

const EditBtn = styled.button`
  margin-top: auto;
  padding: 0 10px;
  height: 40px;
  min-width: 120px;
  font-size: 18px;
  border: 1px solid #3c3c3c40;
  border-radius: 10px;
  background-color: #3c3c3c30;
  &:hover {
    cursor: pointer;
    color: #ffffff;
    background-color: #616161;
  }
`;

const ProjectListContainer = styled.div`
  margin: 0 auto;
  width: 45vw;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  /* @media screen and (min-width: 1400px) and (max-width: 1699px) {
    width: 800px;
  } */
`;

const ProjectHeaderContainer = styled.div`
  padding-bottom: 20px;
  display: flex;
`;

const Title = styled.div`
  padding-left: 10px;
  font-size: 30px;
  color: #ffffff;
  font-weight: 500;
  text-align: center;
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
  box-shadow: 0 0 10px #3c3c3c;
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
    introduction,
    userProjects,
    setUserProjects,
  } = useContext(AuthContext);
  const [mainImgSrc, setMainImgSrc] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    setInputText(introduction);
  }, [introduction]);

  async function deleteProjectHandler(projectId: string) {
    const ans = await Swal.fire({
      text: t("delete_project_warning"),
      icon: "warning",
      confirmButtonColor: "#646464",
      confirmButtonText: t("reject_no_answer"),
      showDenyButton: true,
      denyButtonText: t("reject_yes_answer"),
    });
    if (ans.isConfirmed === true) return;

    await deleteDoc(doc(db, "projects", projectId));
    const userProjectsData = await getUserProjects(userId);
    setUserProjects(userProjectsData);
  }
  async function updateIntro() {
    await updateDoc(doc(db, "users", userId), {
      introduction: inputText,
    });
    setIsEdit(false);
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
    <>
      <Wrapper>
        <Container>
          <UserInfoContainer>
            <Avatar url={`url(${avatar})`}>
              <CameraIcon onClick={() => setShowOverlay((prev) => !prev)} />
            </Avatar>
            <UserInfo size="24px" weight="500">
              {name}
            </UserInfo>
            <UserInfo size="20px">{email}</UserInfo>
            <IntroText>Introduction</IntroText>
            <Introduction
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t("type_content")}
              disabled={!isEdit && true}
              border={!isEdit ? "none" : "1px solid #787878"}
              maxLength={150}
            />
            {isEdit ? (
              <EditBtn onClick={() => updateIntro()}>Confirm Edit</EditBtn>
            ) : (
              <EditBtn onClick={() => setIsEdit(true)}>Edit</EditBtn>
            )}
          </UserInfoContainer>
          <ProjectListContainer>
            <ProjectHeaderContainer>
              <Title>{t("project_list")}</Title>
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
                            navigate(
                              `/singleProject?id=${projectData.projectId}`
                            )
                          }
                        />
                        <Icon
                          img={`url(${editIcon})`}
                          hoverImg={`url(${editIconHover})`}
                          marginLift="15px"
                          onClick={() =>
                            navigate(
                              `/editExistProject?id=${projectData.projectId}`
                            )
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
                        {/* {projectData.pages[0].photos &&
                          projectData.pages[0].photos.map(
                            (singleUrl: string) => (
                              <PhotoUrl
                                key={singleUrl}
                                img={`url(${singleUrl})`}
                              />
                            )
                          )} */}

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
      {showOverlay && (
        <SquareOverlay
          setShowOverlay={setShowOverlay}
          mainImgSrc={mainImgSrc}
          setMainImgSrc={setMainImgSrc}
          userId={userId}
          shape="round"
          usage="avatar"
        />
      )}
    </>
  );
}

export default Profile;
