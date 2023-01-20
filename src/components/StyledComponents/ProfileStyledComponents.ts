import styled from "styled-components";
import ReactLoading from "react-loading";

import { cameraIcon, cameraIconHover } from "../icons/icons";

export const Wrapper = styled.div`
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

export const Container = styled.div`
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

export const InnerContainer = styled.div`
  width: 100%;
  position: relative;
`;

export const UserInfoContainer = styled.div`
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

export const Avatar = styled.div<{ url?: string }>`
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

export const CameraIcon = styled.div`
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

export const UserName = styled.div`
  margin-top: 20px;
  font-size: 24px;
  font-weight: 600;
  @media screen and (max-width: 1449px) {
    margin-top: 15px;
    font-size: 18px;
  }
`;

export const UserEmail = styled.div`
  margin-top: 10px;
  font-size: 16px;
  @media screen and (max-width: 1449px) {
    font-size: 14px;
  }
`;

export const IntroText = styled.div`
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

export const Introduction = styled.textarea<{ border?: string }>`
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

export const EditBtn = styled.button<{ cursor?: string }>`
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

export const ProjectListContainer = styled.div`
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

export const ProjectHeaderContainer = styled.div`
  padding-bottom: 20px;
  display: flex;
  align-items: center;
  @media screen and (max-width: 1049px) {
    padding-bottom: 15px;
  }
`;

export const Title = styled.div`
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

export const EmptyReminder = styled.div`
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

export const ProjectsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SingleProjectContainer = styled.div`
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

export const ProjectLeftContainer = styled.div`
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

export const ProjectTitle = styled.div`
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

export const Icon = styled.div<{
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

export const ProjectIconContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const CoverPhoto = styled.div<{ url?: string }>`
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

export const MobileContainer = styled.div`
  display: none;
  @media screen and (max-width: 1049px) {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

export const MobileHeaderContainer = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: center;
`;

export const MobileSwitchStatusBtn = styled.div<{
  color: string;
  border: string;
}>`
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

export const MobileBodyContainer = styled.div`
  margin-top: 20px;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

export const LoadingInBtn = styled(ReactLoading)`
  position: absolute;
  top: 10px;
  right: -30px;
  @media screen and (max-width: 1449px) {
    top: 3px;
  }
`;

export const DeleteLoading = styled(ReactLoading)`
  margin-left: 20px;
`;
