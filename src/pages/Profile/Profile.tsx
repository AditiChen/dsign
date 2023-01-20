import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";

import { db } from "../../context/firebaseSDK";
import getUserProjects from "../../utils/getUserProjects";
import SquareOverlay from "../../components/Overlays/squareOverlay";
import { AuthContext } from "../../context/authContext";
import {
  Wrapper,
  Container,
  InnerContainer,
  UserInfoContainer,
  Avatar,
  CameraIcon,
  UserName,
  UserEmail,
  IntroText,
  Introduction,
  EditBtn,
  ProjectListContainer,
  ProjectHeaderContainer,
  Title,
  EmptyReminder,
  ProjectsContainer,
  SingleProjectContainer,
  ProjectLeftContainer,
  ProjectTitle,
  Icon,
  ProjectIconContainer,
  CoverPhoto,
  MobileContainer,
  MobileHeaderContainer,
  MobileSwitchStatusBtn,
  MobileBodyContainer,
  Loading,
  LoadingInBtn,
  DeleteLoading,
} from "../../components/StyledComponents/ProfileStyledComponents";
import {
  editProjectIcon,
  editProjectIconHover,
  viewProjectIcon,
  viewProjectIconHover,
  deleteIcon,
  deleteIconHover,
} from "../../components/icons/icons";

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
