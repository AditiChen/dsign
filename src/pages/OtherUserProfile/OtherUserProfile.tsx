import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { doc, getDoc } from "firebase/firestore";
import ReactLoading from "react-loading";

import { db } from "../../context/firebaseSDK";
import getUserProjects from "../../utils/getUserProjects";
import { AuthContext } from "../../context/authContext";
import Brick from "../../components/Brick/Brick";
import FriendIcon from "../../components/IconButtons/FriendIcon";
import { UserProjectsType } from "../../components/tsTypes";

const Wrapper = styled.div`
  padding: 50px 5vw;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  position: relative;
  display: flex;
  @media screen and (max-width: 1049px) {
    padding: 20px 5vw;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  @media screen and (max-width: 1049px) {
    display: none;
  }
`;

const UserInfoContainer = styled.div`
  padding: 30px 20px;
  height: calc(100vh - 260px);
  min-height: 500px;
  width: 15vw;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #b4b4b4;
  border-radius: 10px;
  @media screen and (max-width: 1449px) {
    width: 280px;
  }
  @media screen and (max-width: 1049px) {
    width: 100%;
    max-width: 300px;
  }
`;

const Avatar = styled.div<{ url?: string }>`
  height: 180px;
  width: 180px;
  border-radius: 50%;
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

const AddFriendIconContainer = styled.div`
  position: absolute;
  right: -16px;
  bottom: 0px;
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

const Introduction = styled.textarea`
  padding: 10px 0;
  width: 100%;
  height: 100%;
  max-height: calc(100% - 360px);
  font-size: 18px;
  line-height: 22px;
  resize: none;
  border: none;
  outline: none;
  background-color: transparent;
  @media screen and (max-width: 1449px) {
    padding: 5px 0;
    font-size: 14px;
    max-height: calc(100% - 290px);
  }
`;

const BricksContainer = styled.div`
  margin-left: 40px;
  width: 1640px;
  height: 100%;
  position: relative;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  @media screen and (max-width: 2230px) {
    width: 1300px;
  }
  @media screen and (max-width: 1799px) {
    width: 970px;
  }
  @media screen and (max-width: 1430px) {
    margin-left: 20px;
    width: 650px;
  }
  @media screen and (max-width: 1049px) {
    margin-left: 0;
  }
  @media screen and (max-width: 799px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    width: 540px;
  }
  @media screen and (max-width: 599px) {
    width: 300px;
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
      color: #3c3c3c;
    }
    & + & {
      margin-left: 20px;
    }
  }
`;

const MobileBodyContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

function OtherUserProfile() {
  const { t } = useTranslation();
  const { userId, friendList } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [userProjects, setUserProjects] = useState<UserProjectsType[]>([]);
  const [clickState, setClickState] = useState("profile");
  const [userData, setUserData] = useState<{
    uid: string;
    name: string;
    avatar: string;
    email: string;
    introduction: string;
  }>();

  const urlString = new URL(window.location.href);
  const otherUserId = urlString.searchParams.get("id") as string;

  useEffect(() => {
    setIsLoading(true);
    async function getData() {
      const docSnap = await getDoc(doc(db, "users", otherUserId));
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
    setIsLoading(false);
  }, [otherUserId]);

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
          <Avatar url={userData && `url(${userData.avatar})`}>
            <AddFriendIconContainer>
              {friendList.indexOf(otherUserId) === -1 &&
                otherUserId !== userId &&
                userId !== "" && <FriendIcon requestId={otherUserId} />}
            </AddFriendIconContainer>
          </Avatar>
          <UserName>{userData && userData.name}</UserName>
          <UserEmail>{userData && userData.email}</UserEmail>
          <IntroText>{t("introduction")}</IntroText>
          <Introduction value={userData && userData.introduction} disabled />
        </UserInfoContainer>
        <BricksContainer>
          {userProjects &&
            userProjects.map((project) => (
              <Brick
                key={project.projectId}
                uid={project.uid}
                projectId={project.projectId}
                mainUrl={project.mainUrl}
                title={project.title}
                avatar={userData?.avatar || ""}
                name={userData?.name || ""}
              />
            ))}
        </BricksContainer>
      </Container>
      <MobileContainer>
        <MobileHeaderContainer>
          <MobileSwitchStatusBtn
            color={clickState === "profile" ? "#3c3c3c" : "#b4b4b4"}
            border={clickState === "profile" ? "1px solid #3c3c3c" : "none"}
            onClick={() => setClickState("profile")}
          >
            {t("user_profile")}
          </MobileSwitchStatusBtn>
          <MobileSwitchStatusBtn
            color={clickState === "project" ? "#3c3c3c" : "#b4b4b4"}
            border={clickState === "project" ? "1px solid #3c3c3c" : "none"}
            onClick={() => setClickState("project")}
          >
            {t("project_list")}
          </MobileSwitchStatusBtn>
        </MobileHeaderContainer>
        <MobileBodyContainer>
          {clickState === "profile" && (
            <UserInfoContainer>
              <Avatar url={userData && `url(${userData.avatar})`}>
                <AddFriendIconContainer>
                  {friendList.indexOf(otherUserId) === -1 &&
                    otherUserId !== userId &&
                    userId !== "" && <FriendIcon requestId={otherUserId} />}
                </AddFriendIconContainer>
              </Avatar>
              <UserName>{userData && userData.name}</UserName>
              <UserEmail>{userData && userData.email}</UserEmail>
              <IntroText>{t("introduction")}</IntroText>
              <Introduction
                value={userData && userData.introduction}
                disabled
              />
            </UserInfoContainer>
          )}
          {clickState === "project" && (
            <BricksContainer>
              {userProjects &&
                userProjects.map((project) => (
                  <Brick
                    key={project.projectId}
                    uid={project.uid}
                    projectId={project.projectId}
                    mainUrl={project.mainUrl}
                    title={project.title}
                    avatar={userData?.avatar || ""}
                    name={userData?.name || ""}
                  />
                ))}
            </BricksContainer>
          )}
        </MobileBodyContainer>
      </MobileContainer>
    </Wrapper>
  );
}

export default OtherUserProfile;
