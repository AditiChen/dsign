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
  min-height: calc(100vh - 110px);
  position: relative;
  display: flex;
  background-color: #787878;
  @media screen and (max-width: 1049px) {
    padding: 20px 5vw;
    min-height: calc(100vh - 90px);
  }
`;

const Container = styled.div`
  margin: 0 auto;
  width: 650px;
  height: 100%;
  display: flex;
  @media screen and (max-width: 1349px) {
    margin-left: 32vw;
  }
  @media screen and (max-width: 1049px) {
    display: none;
  }
`;

const InnerContainer = styled.div`
  width: 100%;
  position: relative;
`;

const UserInfoContainer = styled.div`
  padding: 30px 20px;
  width: 300px;
  height: calc(100vh - 260px);
  min-height: 500px;
  position: absolute;
  left: -320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  background-color: #f0f0f0;
  box-shadow: 0 0 10px #3c3c3c;
  @media screen and (max-width: 1049px) {
    padding: 30px 20px;
    width: 100%;
    max-width: 280px;
    left: 50%;
    transform: translateX(-50%);
  }
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
  @media screen and (max-width: 1049px) {
    height: 150px;
    width: 150px;
  }
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
  @media screen and (max-width: 1049px) {
    height: 18px;
    width: 18px;
  }
`;

const UserName = styled.div`
  margin-top: 20px;
  font-size: 24px;
  font-weight: 600;
  @media screen and (max-width: 1049px) {
    margin-top: 15px;
    font-size: 18px;
  }
`;

const UserEmail = styled.div`
  margin-top: 10px;
  font-size: 20px;
  @media screen and (max-width: 1049px) {
    font-size: 16px;
  }
`;

const IntroText = styled.div`
  margin-top: 30px;
  padding-bottom: 5px;
  width: 100%;
  font-size: 20px;
  color: #646464;
  border-bottom: 1px solid #969696;
  @media screen and (max-width: 1049px) {
    margin-top: 20px;
    font-size: 14px;
  }
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
  @media screen and (max-width: 1049px) {
    padding: 5px 0;
    font-size: 12px;
  }
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
  @media screen and (max-width: 1049px) {
    height: 30px;
    min-width: 80px;
    font-size: 14px;
    border-radius: 5px;
  }
`;

const ProjectListContainer = styled.div`
  margin: 0 auto;
  width: 600px;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1049px) {
    width: 100%;
  }
`;

const ProjectHeaderContainer = styled.div`
  padding-bottom: 20px;
  display: flex;
  @media screen and (max-width: 1049px) {
    padding-bottom: 15px;
  }
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
  align-items: center;
`;

const SingleProjectContainer = styled.div`
  height: 200px;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 10px #3c3c3c;
  & + & {
    margin-top: 20px;
  }
  @media screen and (max-width: 1049px) {
    min-width: 300px;
    max-width: 500px;
    height: 150px;
    border-radius: 5px;
  }
`;

const ProjectLeftContainer = styled.div`
  padding: 20px;
  height: 200px;
  width: calc(100% - 190px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media screen and (max-width: 1049px) {
    padding: 10px;
    width: calc(100% - 145px);
    height: 150px;
  }
`;

const ProjectTitle = styled.div`
  font-size: 24px;
  @media screen and (max-width: 1049px) {
    font-size: 16px;
  }
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
  @media screen and (max-width: 1049px) {
    width: 20px;
    height: 20px;
  }
`;

const CoverPhoto = styled.div`
  width: 180px;
  height: 180px;
  background-image: ${(props: Prop) => props.img};
  background-position: center;
  background-size: cover;
  @media screen and (max-width: 1049px) {
    width: 140px;
    height: 140px;
  }
`;

const MobileContainer = styled.div`
  display: none;
  @media screen and (max-width: 1049px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

const MobileHeaderContainer = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: center;
`;

const MobileSwitchStatusBtn = styled.div<{ color: string; border: string }>`
  display: none;
  @media screen and (max-width: 1049px) {
    color: ${(props) => props.color};
    font-size: 16px;
    font-weight: 600;
    line-height: 26px;
    display: block;
    border-bottom: ${(props) => props.border};
    position: relative;
    &:hover {
      cursor: pointer;
      color: #ffffff;
    }
    & + & {
      margin-left: 20px;
    }
  }
`;

const MobileBodyContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

function Profile() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
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
  const [clickState, setClickState] = useState("profile");

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
        <Loading type="spinningBubbles" color="#ffffff" />
      </Wrapper>
    );
  }

  return (
    <>
      <Wrapper>
        <Container>
          <InnerContainer>
            <UserInfoContainer>
              <Avatar url={`url(${avatar})`}>
                <CameraIcon onClick={() => setShowOverlay((prev) => !prev)} />
              </Avatar>
              <UserName>{name}</UserName>
              <UserEmail>{email}</UserEmail>
              <IntroText>{t("introduction")}</IntroText>
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
                      <CoverPhoto
                        key={projectData.mainUrl}
                        img={`url(${projectData.mainUrl})`}
                      />
                    </SingleProjectContainer>
                  ))}
                </ProjectsContainer>
              )}
            </ProjectListContainer>
          </InnerContainer>
        </Container>
        <MobileContainer>
          <MobileHeaderContainer>
            <MobileSwitchStatusBtn
              color={clickState === "profile" ? "#ffffff" : "#b4b4b4"}
              border={clickState === "profile" ? "1px solid #ffffff" : "none"}
              onClick={() => setClickState("profile")}
            >
              {t("user_profile")}
            </MobileSwitchStatusBtn>
            <MobileSwitchStatusBtn
              color={clickState === "project" ? "#ffffff" : "#b4b4b4"}
              border={clickState === "project" ? "1px solid #ffffff" : "none"}
              onClick={() => setClickState("project")}
            >
              {t("project_list")}
            </MobileSwitchStatusBtn>
          </MobileHeaderContainer>
          <MobileBodyContainer>
            {clickState === "profile" && (
              <UserInfoContainer>
                <Avatar url={`url(${avatar})`}>
                  <CameraIcon onClick={() => setShowOverlay((prev) => !prev)} />
                </Avatar>
                <UserName>{name}</UserName>
                <UserEmail>{email}</UserEmail>
                <IntroText>{t("introduction")}</IntroText>
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
            )}
            {clickState === "project" && (
              <ProjectListContainer>
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

                        <CoverPhoto
                          key={projectData.mainUrl}
                          img={`url(${projectData.mainUrl})`}
                        />
                      </SingleProjectContainer>
                    ))}
                  </ProjectsContainer>
                )}
              </ProjectListContainer>
            )}
          </MobileBodyContainer>
        </MobileContainer>
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
