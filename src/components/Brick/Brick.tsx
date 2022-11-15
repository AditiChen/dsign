import { useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../context/firebaseSDK";

import { AuthContext } from "../../context/authContext";

import likeIcon from "../../icons/like-icon.png";
import likedIcon from "../../icons/liked-icon.png";
import likeIconHover from "../../icons/like-icon-hover.png";

interface Prop {
  img?: string;
  url?: string;
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
`;

const InfoContainer = styled.div`
  padding: 0 15px;
  width: 300px;
  height: 50px;
  display: flex;
  align-items: center;
`;

const Avatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 20px;
  background-image: ${(props: Prop) => props.img};
  background-size: cover;
  background-position: center;
`;

const Author = styled.div`
  margin-left: 10px;
  font-size: 18px;
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

export default function Brick({
  projectId,
  mainUrl,
  avatar,
  name,
}: {
  projectId: string;
  mainUrl: string;
  avatar: string;
  name: string;
}) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userId, setSingleProjectId, favoriteList } = useContext(AuthContext);

  async function likeProjectHandler(clickProjectId: string) {
    if (userId === "") {
      alert(t("please_login"));
      return;
    }
    await updateDoc(doc(db, "users", userId), {
      favoriteList: arrayUnion(clickProjectId),
    });
  }

  async function dislikeProjectHandler(clickProjectId: string) {
    await updateDoc(doc(db, "users", userId), {
      favoriteList: arrayRemove(clickProjectId),
    });
  }

  function toSingleProjectPage(clickProjectId: string) {
    setSingleProjectId(clickProjectId);
    navigate("/singleProject");
  }

  return (
    <SingleProjectContainer key={projectId}>
      <ImgContainer
        img={`url(${mainUrl})`}
        onClick={() => toSingleProjectPage(projectId)}
      />
      <InfoContainer>
        <Avatar img={`url(${avatar})`} />
        <Author>{name}</Author>
        {favoriteList.indexOf(projectId) === -1 ? (
          <LikeIcon onClick={() => likeProjectHandler(projectId)} />
        ) : (
          <LikedIcon onClick={() => dislikeProjectHandler(projectId)} />
        )}
      </InfoContainer>
    </SingleProjectContainer>
  );
}
