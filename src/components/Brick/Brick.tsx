import { useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";
import { db } from "../../context/firebaseSDK";

import { AuthContext } from "../../context/authContext";
import { FriendContext } from "../../context/friendContext";

import likeIcon from "../../icons/like-icon.png";
import likeIconHover from "../../icons/like-icon-hover.png";
import likedIcon from "../../icons/liked-icon.png";
import addFriendIcon from "../../icons/add-friend-icon.png";
import addFriendIconHover from "../../icons/add-friend-icon-hover.png";

interface Prop {
  img?: string;
  url?: string;
  fontSize?: string;
}

const ImgContainer = styled.div`
  width: 100%;
  height: 300px;
  background-color: lightgray;
  background-image: ${(props: Prop) => props.img};
  background-size: cover;
  background-position: center;
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
    cursor: pointer;
  }
  &:hover > ${ImgContainer} {
    background-color: #3c3c3c90;
  }
`;

const InfoContainer = styled.div`
  padding: 0 15px;
  width: 300px;
  height: 50px;
  display: flex;
  align-items: center;
`;

const UserInfoContainer = styled.div`
  max-height: 0px;
  background: linear-gradient(to bottom, #ffffff90, #ffffff);
  transform-origin: bottom;
  overflow: hidden;
  transition: max-height 0.3s ease-in;
  border-radius: 10px 10px 0 0;
  position: absolute;
  bottom: calc(-100% + 71px);
  left: -14px;
`;

const UserInfoInnerContainer = styled.div`
  padding: 20px 15px;
  max-height: 150px;
  width: 310px;
`;

const UserInfoHeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

const InfoAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 25px;
  background-image: ${(props: Prop) => props.img};
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
`;

const Intor = styled.div`
  margin: 10px 0;
  font-size: 18px;
  line-height: 22px;
  color: #616161;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-image: ${(props: Prop) => props.img};
  background-size: cover;
  background-position: center;
  position: relative;
  &:hover > ${UserInfoContainer} {
    max-height: 150px;
  }
`;

const Author = styled.div`
  margin-left: 10px;
  color: #3c3c3c;
  font-size: ${(props: Prop) => props.fontSize};
`;

const LikedIcon = styled.div`
  margin-left: auto;
  width: 30px;
  height: 30px;
  background-image: url(${likedIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
`;

const LikeIcon = styled(LikedIcon)`
  background-image: url(${likeIcon});
  &:hover {
    background-image: url(${likeIconHover});
  }
`;

const AddFriendIcon = styled(LikedIcon)`
  background-image: url(${addFriendIcon});
  &:hover {
    background-image: url(${addFriendIconHover});
  }
`;

export default function Brick({
  uid,
  projectId,
  mainUrl,
  avatar,
  name,
  introduction,
}: {
  uid: string;
  projectId: string;
  mainUrl: string;
  avatar: string;
  name: string;
  introduction: string;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userId, setSingleProjectId, favoriteList, friendList } =
    useContext(AuthContext);
  const { setClickedUserId } = useContext(FriendContext);

  async function likeProjectHandler() {
    if (userId === "") {
      alert(t("please_login"));
      return;
    }
    await updateDoc(doc(db, "users", userId), {
      favoriteList: arrayUnion(projectId),
    });
  }

  async function dislikeProjectHandler() {
    await updateDoc(doc(db, "users", userId), {
      favoriteList: arrayRemove(projectId),
    });
  }

  function toSingleProjectPage() {
    setSingleProjectId(projectId);
    navigate("/singleProject");
  }

  async function addFriendHandler() {
    const requestId = uuid();
    await setDoc(doc(db, "friendRequests", requestId), {
      from: userId,
      to: uid,
    });
    alert(t("sen_request_successfully"));
  }

  return (
    <SingleProjectContainer key={projectId}>
      <ImgContainer
        img={`url(${mainUrl})`}
        onClick={() => toSingleProjectPage()}
      />
      <InfoContainer>
        <Avatar img={`url(${avatar})`}>
          <UserInfoContainer>
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
                {friendList.indexOf(uid) === -1 && uid !== userId ? (
                  <AddFriendIcon onClick={() => addFriendHandler()} />
                ) : (
                  ""
                )}
              </UserInfoHeaderContainer>
              <Intor>{introduction}</Intor>
            </UserInfoInnerContainer>
          </UserInfoContainer>
        </Avatar>
        <Author fontSize="18px">{name}</Author>
        {favoriteList.indexOf(projectId) === -1 ? (
          <LikeIcon onClick={() => likeProjectHandler()} />
        ) : (
          <LikedIcon onClick={() => dislikeProjectHandler()} />
        )}
      </InfoContainer>
    </SingleProjectContainer>
  );
}
