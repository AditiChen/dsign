import { useContext } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/authContext";
import { FriendContext } from "../../context/friendContext";
import { LikeIcon, LikedIcon } from "../IconButtons/LikeIcons";

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
  @media screen and (max-width: 799px) {
    height: 250px;
  }
`;

const InfoContainer = styled.div`
  padding: 0 15px;
  width: 300px;
  height: 50px;
  display: flex;
  align-items: center;
  @media screen and (max-width: 799px) {
    width: 250px;
    height: 40px;
  }
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
  @media screen and (max-width: 799px) {
    width: 250px;
    height: 290px;
    &:hover {
      width: 250px;
      height: 290px;
    }
    &:hover > ${ImgContainer} {
      width: 250px;
      height: 250px;
    }
    &:hover > ${InfoContainer} {
      width: 250px;
    }
  }
`;

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
  @media screen and (max-width: 799px) {
    width: 30px;
    height: 30px;
  }
`;

const Author = styled.div`
  margin-left: 10px;
  font-size: 18px;
  @media screen and (max-width: 799px) {
    font-size: 16px;
  }
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
  const { userId, favoriteList } = useContext(AuthContext);

  function toProfileHandler() {
    if (uid === userId) {
      navigate("/profile");
      return;
    }
    navigate(`/userProfile/${uid}`);
  }

  return (
    <SingleProjectContainer key={projectId}>
      <ImgContainer
        img={`url(${mainUrl})`}
        onClick={() => navigate(`/singleProject/${projectId}`)}
      >
        <TitleContainer>
          <TitleText>{title}</TitleText>
        </TitleContainer>
      </ImgContainer>
      <InfoContainer>
        <Avatar img={`url(${avatar})`} onClick={() => toProfileHandler()} />
        <Author>{name}</Author>
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
