import { useContext } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../../context/authContext";
import { LikeIcon, LikedIcon } from "../IconButtons/LikeIcons";

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
  word-wrap: break-word;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ImgContainer = styled.div<{ url?: string }>`
  width: 100%;
  height: 300px;
  background-color: lightgray;
  background-image: ${(props) => props.url};
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
  border-top: 1px solid #f0f0f0;
  @media screen and (max-width: 799px) {
    width: 250px;
    height: 40px;
  }
`;

const appear = keyframes`
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }`;

const SingleProjectContainer = styled.div`
  margin: 0 auto 10px auto;
  width: 300px;
  height: 350px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 5px #787878;
  animation: ${appear} 0.5s ease-in-out;
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

const Avatar = styled.div<{ url?: string }>`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-image: ${(props) => props.url};
  background-size: cover;
  background-position: center;
  position: relative;
  border: 1px solid #b4b4b4;
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
    navigate(`/userProfile?id=${uid}`);
  }

  return (
    <SingleProjectContainer key={projectId}>
      <ImgContainer
        url={`url(${mainUrl})`}
        onClick={() => navigate(`/singleProject?id=${projectId}`)}
      >
        <TitleContainer>
          <TitleText>{title}</TitleText>
        </TitleContainer>
      </ImgContainer>
      <InfoContainer>
        <Avatar url={`url(${avatar})`} onClick={() => toProfileHandler()} />
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
