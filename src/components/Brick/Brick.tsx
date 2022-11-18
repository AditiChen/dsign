import { useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/authContext";
import { FriendContext } from "../../context/friendContext";
import { LikeIcon, LikedIcon } from "../IconButtoms/LikeIcons";

interface Prop {
  img?: string;
  url?: string;
  fontSize?: string;
}
const TitleContainer = styled.div`
  width: 100%;
  height: 0;
  overflow: hidden;
  display: flex;
  align-items: flex-end;
  background: linear-gradient(to bottom, #3c3c3c00, #3c3c3c);
  position: absolute;
  bottom: 0px;
  left: 0px;
`;

const TitleText = styled.div`
  margin: 20px;
  width: 100%;
  color: #ffffff;
  font-size: 18px;
  line-height: 22px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ImgContainer = styled.div`
  width: 100%;
  height: 300px;
  background-color: lightgray;
  background-image: ${(props: Prop) => props.img};
  background-size: cover;
  background-position: center;
  position: relative;
  &:hover > ${TitleContainer} {
    width: 100%;
    height: 120px;
  }
`;

const InfoContainer = styled.div`
  padding: 0 15px;
  width: 300px;
  height: 50px;
  display: flex;
  align-items: center;
`;

const SingleProjectContainer = styled.div`
  margin: 0 auto 10px auto;
  width: 300px;
  height: 350px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 5px #787878;
  &:hover {
    margin-bottom: 0;
    width: 310px;
    height: 360px;
    box-shadow: 0 0 10px #3c3c3c;
  }
  &:hover > ${ImgContainer} {
    width: 310px;
    height: 310px;
    background-color: #3c3c3c90;
    cursor: pointer;
  }
  &:hover > ${InfoContainer} {
    width: 310px;
  }
`;

// const UserInfoContainer = styled.div`
//   max-height: 0px;
//   background: linear-gradient(to bottom, #ffffff90, #ffffff);
//   transform-origin: bottom;
//   overflow: hidden;
//   transition: max-height 0.3s ease-in;
//   border-radius: 10px 10px 0 0;
//   position: absolute;
//   bottom: calc(-100% + 71px);
//   left: -15px;
// `;

// const UserInfoInnerContainer = styled.div`
//   padding: 20px 15px;
//   max-height: 150px;
//   width: 310px;
// `;

// const UserInfoHeaderContainer = styled.div`
//   display: flex;
//   align-items: center;
// `;

// const InfoAvatar = styled.div`
//   width: 50px;
//   height: 50px;
//   border-radius: 25px;
//   background-image: ${(props: Prop) => props.img};
//   background-size: cover;
//   background-position: center;
//   &:hover {
//     cursor: pointer;
//   }
// `;

// const Intor = styled.div`
//   margin: 10px 0;
//   font-size: 18px;
//   line-height: 22px;
//   color: #616161;
// `;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-image: ${(props: Prop) => props.img};
  background-size: cover;
  background-position: center;
  position: relative;
  &:hover {
    cursor: pointer;
  }
`;

const Author = styled.div`
  margin-left: 10px;
  color: #3c3c3c;
  font-size: ${(props: Prop) => props.fontSize};
`;

export default function Brick({
  uid,
  projectId,
  mainUrl,
  avatar,
  name,
  title,
}: {
  uid: string;
  projectId: string;
  mainUrl: string;
  avatar: string;
  name: string;
  title: string;
}) {
  const navigate = useNavigate();
  const { userId, setSingleProjectId, favoriteList, friendList } =
    useContext(AuthContext);
  const { setClickedUserId } = useContext(FriendContext);

  function toSingleProjectPage() {
    setSingleProjectId(projectId);
    navigate("/singleProject");
  }

  function toProfileHandler() {
    if (uid === userId) {
      navigate("/profile");
      return;
    }
    setClickedUserId(uid);
    navigate("/userProfile");
  }

  return (
    <SingleProjectContainer key={projectId}>
      <ImgContainer
        img={`url(${mainUrl})`}
        onClick={() => toSingleProjectPage()}
      >
        <TitleContainer>
          <TitleText>{title}</TitleText>
        </TitleContainer>
      </ImgContainer>
      <InfoContainer>
        <Avatar img={`url(${avatar})`} onClick={() => toProfileHandler()} />
        {/* <UserInfoContainer>
            <UserInfoInnerContainer>
              <UserInfoHeaderContainer>
                <InfoAvatar
                  img={`url(${avatar})`}
                  onClick={() => {
                    setClickedUserId(uid);
                    navigate("/userProfile");
                  }}
                />
                <Author fontSize="24px">{name}</Author>
                {friendList.indexOf(uid) === -1 &&
                uid !== userId &&
                userId !== "" ? (
                  <FriendIcon requestId={uid} />
                ) : (
                  ""
                )}
              </UserInfoHeaderContainer>
              <Intor>{introduction}</Intor>
            </UserInfoInnerContainer>
          </UserInfoContainer> */}
        {/* </Avatar> */}
        <Author fontSize="18px">{name}</Author>
        {favoriteList.indexOf(projectId) === -1 ? (
          <LikeIcon
            margin="0 0 0 auto"
            width="30px"
            height="30px"
            projectId={projectId}
          />
        ) : (
          <LikedIcon
            projectId={projectId}
            margin="0 0 0 auto"
            width="30px"
            height="30px"
          />
        )}
      </InfoContainer>
    </SingleProjectContainer>
  );
}
