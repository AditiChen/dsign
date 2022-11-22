import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { doc, getDoc } from "firebase/firestore";
import ReactLoading from "react-loading";

import { db } from "../../context/firebaseSDK";
import getUserProjects from "../../utils/getUserProjects";
import { AuthContext } from "../../context/authContext";
import { FriendContext } from "../../context/friendContext";
import Brick from "../../components/Brick/Brick";
import FriendIcon from "../../components/IconButtons/FriendIcon";

interface Prop {
  url?: string;
  size?: string;
  background?: string;
  text?: string;
  focus?: string;
  position?: string;
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
  padding-right: 80px;
  width: 100%;
  height: 100%;
  display: flex;
`;

const UserInfoContainer = styled.div`
  margin-left: 50px;
  height: calc(100vh - 260px);
  width: 15vw;
  min-width: 300px;
  padding: 50px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #b4b4b4;
  border-radius: 10px;
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

const AddFriendIconContainer = styled.div`
  position: absolute;
  right: -16px;
  bottom: 0px;
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
  max-height: calc(100% - 330px);
  font-size: 18px;
  resize: none;
  border: none;
  outline: none;
  background-color: transparent;
`;

const BricksContainer = styled.div`
  margin: 0 auto;
  padding-bottom: 50px;
  width: 1640px;
  height: 100%;
  position: relative;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  @media screen and (min-width: 1850px) and (max-width: 2230px) {
    width: 1300px;
  }
  @media screen and (min-width: 1450px) and (max-width: 1849px) {
    width: 970px;
  }
  @media screen and (min-width: 1220px) and (max-width: 1449px) {
    width: 640px;
  }
  @media screen and (min-width: 800px) and (max-width: 1219px) {
    width: 530px;
  }
  @media screen and (max-width: 799px) {
    padding: 20px 0;
    width: 330px;
  }
`;

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

function OtherUserProfile() {
  const { userId, friendList } = useContext(AuthContext);
  const { clickedUserId } = useContext(FriendContext);
  const [isLoading, setIsLoading] = useState(false);
  const [userProjects, setUserProjects] = useState<UserProjectsType[]>([]);
  const [userData, setUserData] = useState<{
    uid: string;
    name: string;
    avatar: string;
    email: string;
    introduction: string;
  }>();

  useEffect(() => {
    setIsLoading(true);
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
    setIsLoading(false);
  }, []);

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
              {friendList.indexOf(clickedUserId) === -1 &&
                clickedUserId !== userId &&
                userId !== "" && <FriendIcon requestId={clickedUserId} />}
            </AddFriendIconContainer>
          </Avatar>
          <UserInfo size="24px" weight="600">
            {userData && userData.name}
          </UserInfo>
          <UserInfo size="20px">{userData && userData.email}</UserInfo>
          <IntroText>Introduction</IntroText>
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
    </Wrapper>
  );
}

export default OtherUserProfile;
