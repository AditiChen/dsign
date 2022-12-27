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
import {
  editProjectIcon,
  editProjectIconHover,
  viewProjectIcon,
  viewProjectIconHover,
  deleteIcon,
  deleteIconHover,
  cameraIcon,
  cameraIconHover,
} from "../../components/icons/icons";

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
  @media screen and (max-width: 1449px) {
    width: 280px;
    padding: 20px;
  }
  @media screen and (max-width: 1049px) {
    width: 100%;
    max-width: 300px;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Avatar = styled.div<{ url?: string }>`
  height: 180px;
  width: 180px;
  border-radius: 90px;
  background-image: ${(props) => props.url || "none"};
  background-size: cover;
  background-position: center;
  position: relative;
  box-shadow: 0 0 5px #3c3c3c;
  @media screen and (max-width: 1449px) {
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
  @media screen and (max-width: 1449px) {
    height: 18px;
    width: 18px;
  }
`;

const UserName = styled.div`
  margin-top: 20px;
  font-size: 24px;
  font-weight: 600;
  @media screen and (max-width: 1449px) {
    margin-top: 15px;
    font-size: 18px;
  }
`;

const UserEmail = styled.div`
  margin-top: 10px;
  font-size: 16px;
  @media screen and (max-width: 1449px) {
    font-size: 14px;
  }
`;

const IntroText = styled.div`
  margin-top: 30px;
  margin-bottom: 10px;
  padding-bottom: 5px;
  width: 100%;
  font-size: 20px;
  color: #646464;
  border-bottom: 1px solid #969696;
  @media screen and (max-width: 1449px) {
    margin-top: 20px;
    font-size: 16px;
  }
`;

const Introduction = styled.textarea<{ border?: string }>`
  margin-bottom: 10px;
  padding-bottom: 10px;
  width: 100%;
  height: 100%;
  max-height: calc(100% - 360px);
  font-size: 18px;
  line-height: 22px;
  resize: none;
  border: ${(props) => props.border};
  outline: none;
  border-radius: 5px;
  @media screen and (max-width: 1449px) {
    padding: 5px 0;
    font-size: 14px;
    max-height: calc(100% - 290px);
  }
`;

const EditBtn = styled.button<{ cursor?: string }>`
  padding: 0 10px;
  height: 40px;
  min-width: 120px;
  color: #3c3c3c;
  font-size: 18px;
  position: relative;
  border: 1px solid #3c3c3c40;
  border-radius: 10px;
  background-color: #3c3c3c30;
  &:hover {
    cursor: ${(props) => props.cursor};
    color: #ffffff;
    background-color: #616161;
  }
  @media screen and (max-width: 1449px) {
    height: 30px;
    min-width: 80px;
    font-size: 16px;
    border-radius: 5px;
  }
  @media screen and (max-width: 1049px) {
    min-width: 80px;
    font-size: 14px;
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
  align-items: center;
  @media screen and (max-width: 1049px) {
    padding-bottom: 15px;
  }
`;

const Title = styled.div`
  padding-left: 10px;
  font-size: 24px;
  color: #ffffff;
  font-weight: 500;
  text-align: center;
  @media screen and (min-width: 800px) and (max-width: 1449px) {
    font-size: 20px;
  }
  @media screen and (max-width: 799px) {
    font-size: 16px;
  }
`;

const EmptyReminder = styled.div`
  padding-left: 10px;
  font-size: 18px;
  color: #ffffff;
  @media screen and (min-width: 800px) and (max-width: 1449px) {
    font-size: 14px;
  }
  @media screen and (max-width: 799px) {
    font-size: 12px;
  }
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
  font-size: 22px;
  color: #3c3c3c;
  word-wrap: break-word;
  @media screen and (max-width: 1449px) {
    font-size: 18px;
  }
  @media screen and (max-width: 1049px) {
    font-size: 16px;
  }
`;

const ProjectIconContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Icon = styled.div<{
  marginLift?: string;
  img?: string;
  hoverImg?: string;
}>`
  margin-left: ${(props) => props.marginLift};
  width: 28px;
  height: 28px;
  background-image: ${(props) => props.img};
  background-position: center;
  background-size: cover;
  &:hover {
    background-image: ${(props) => props.hoverImg};
    cursor: pointer;
  }
  @media screen and (max-width: 1049px) {
    width: 20px;
    height: 20px;
  }
`;

const CoverPhoto = styled.div<{ url?: string }>`
  width: 180px;
  height: 180px;
  background-image: ${(props) => props.url};
  background-position: center;
  background-size: cover;
  border-radius: 5px;
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

const LoadingInBtn = styled(ReactLoading)`
  position: absolute;
  top: 10px;
  right: -30px;
  @media screen and (max-width: 1449px) {
    top: 3px;
  }
`;

const DeleteLoading = styled(ReactLoading)`
  margin-left: 20px;
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
  const [isBtnLoading, setIsBtnLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

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
    setDeleteLoading(true);
    await deleteDoc(doc(db, "projects", projectId));
    const userProjectsData = await getUserProjects(userId);
    setDeleteLoading(false);
    setUserProjects(userProjectsData);
  }
  async function updateIntro() {
    setIsBtnLoading(true);
    await updateDoc(doc(db, "users", userId), {
      introduction: inputText,
    });
    setIsEdit(false);
    setIsBtnLoading(false);
  }

  const renderDesktopProjectList = () => (
    <ProjectsContainer>
      {userProjects.map((projectData) => (
        <SingleProjectContainer key={projectData.projectId}>
          <ProjectLeftContainer>
            <ProjectTitle>{projectData.title}</ProjectTitle>
            <ProjectIconContainer>
              <Icon
                img={`url(${viewProjectIcon})`}
                hoverImg={`url(${viewProjectIconHover})`}
                marginLift="0"
                onClick={() =>
                  navigate(`/singleProject?id=${projectData.projectId}`)
                }
              />
              <Icon
                img={`url(${editProjectIcon})`}
                hoverImg={`url(${editProjectIconHover})`}
                marginLift="15px"
                onClick={() =>
                  navigate(`/editExistProject?id=${projectData.projectId}`)
                }
              />
              <Icon
                img={`url(${deleteIcon})`}
                hoverImg={`url(${deleteIconHover})`}
                marginLift="auto"
                onClick={() => deleteProjectHandler(projectData.projectId)}
              />
            </ProjectIconContainer>
          </ProjectLeftContainer>
          <CoverPhoto
            key={projectData.mainUrl}
            url={`url(${projectData.mainUrl})`}
          />
        </SingleProjectContainer>
      ))}
    </ProjectsContainer>
  );

  const renderMobileProjectList = () => (
    <ProjectsContainer>
      {userProjects.map((projectData) => (
        <SingleProjectContainer key={projectData.projectId}>
          <ProjectLeftContainer>
            <ProjectTitle>{projectData.title}</ProjectTitle>
            <ProjectIconContainer>
              <Icon
                img={`url(${viewProjectIcon})`}
                hoverImg={`url(${viewProjectIconHover})`}
                marginLift="0"
                onClick={() =>
                  navigate(`/singleProject?id=${projectData.projectId}`)
                }
              />
              <Icon
                img={`url(${editProjectIcon})`}
                hoverImg={`url(${editProjectIconHover})`}
                marginLift="15px"
                onClick={() =>
                  navigate(`/editExistProject?id=${projectData.projectId}`)
                }
              />
              <Icon
                img={`url(${deleteIcon})`}
                hoverImg={`url(${deleteIconHover})`}
                marginLift="auto"
                onClick={() => deleteProjectHandler(projectData.projectId)}
              />
            </ProjectIconContainer>
          </ProjectLeftContainer>
          <CoverPhoto
            key={projectData.mainUrl}
            url={`url(${projectData.mainUrl})`}
          />
        </SingleProjectContainer>
      ))}
    </ProjectsContainer>
  );

  if (isLoading) {
    return (
      <Wrapper>
        <Loading type="cylon" color="#ffffff" />
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
                maxLength={115}
              />
              {isEdit && (
                <EditBtn
                  onClick={() => updateIntro()}
                  cursor={isBtnLoading ? " not-allowed" : "pointer"}
                >
                  {t("confirm_introduction")}
                  {isBtnLoading && (
                    <LoadingInBtn
                      type="spokes"
                      width={20}
                      height={20}
                      color="#646464"
                    />
                  )}
                </EditBtn>
              )}
              {!isEdit && (
                <EditBtn onClick={() => setIsEdit(true)} cursor=" pointer">
                  {t("edit_introduction")}
                </EditBtn>
              )}
            </UserInfoContainer>
            <ProjectListContainer>
              <ProjectHeaderContainer>
                <Title>{t("project_list")}</Title>
                {deleteLoading && (
                  <DeleteLoading
                    type="spokes"
                    width={25}
                    height={25}
                    color="#ffffff"
                  />
                )}
              </ProjectHeaderContainer>
              {userProjects.length === 0 ? (
                <EmptyReminder>{t("go_to_create_project")}</EmptyReminder>
              ) : (
                renderDesktopProjectList()
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
                {isEdit && (
                  <EditBtn
                    onClick={() => updateIntro()}
                    cursor={isBtnLoading ? " not-allowed" : "pointer"}
                  >
                    Confirm Edit
                    {isBtnLoading && (
                      <LoadingInBtn
                        type="spokes"
                        width={20}
                        height={20}
                        color="#646464"
                      />
                    )}
                  </EditBtn>
                )}
                {!isEdit && (
                  <EditBtn onClick={() => setIsEdit(true)} cursor="pointer">
                    Edit
                  </EditBtn>
                )}
              </UserInfoContainer>
            )}
            {clickState === "project" && (
              <ProjectListContainer>
                {userProjects.length === 0 ? (
                  <ProjectTitle>{t("go_to_create_project")}</ProjectTitle>
                ) : (
                  renderMobileProjectList()
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
          shape="round"
          usage="avatar"
        />
      )}
    </>
  );
}

export default Profile;
