import styled from "styled-components";
import ReactLoading from "react-loading";
import {
  closeIcon,
  closeIconHover,
  arrowIconWhite,
  arrowIconHover,
  checkedIcon,
  uploadPhotoIcon,
} from "../icons/icons";

export const Wrapper = styled.div`
  padding-top: 95px;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 110px);
  display: flex;
  position: relative;
  background-color: #787878;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    padding-top: 90px;
  }
  @media screen and (min-width: 800px) and (max-width: 949px) {
    min-height: calc(100vh - 100px);
  }
  @media screen and (max-width: 799px) {
    min-height: calc(100vh - 90px);
  }
`;

export const Container = styled.div`
  margin: 50px auto;
  width: 1300px;
  height: 100%;
  min-height: calc(100vh - 240px);
  display: flex;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 900px;
  }
  @media screen and (max-width: 949px) {
    margin: 30px auto;
  }
`;

export const ArrowIcon = styled.div`
  height: 24px;
  width: 24px;
  position: fixed;
  top: 170px;
  left: 40px;
  background-image: url(${arrowIconWhite});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
    background-image: url(${arrowIconHover});
  }
  @media screen and (max-width: 1449px) {
    height: 20px;
    width: 20px;
    top: 160px;
  }
  @media screen and (max-width: 949px) {
    top: 70px;
    left: 30px;
  }
`;

export const EditorContainer = styled.div`
  margin: 0 auto;
  padding: 50px;
  width: 100%;
  height: 100%;
  min-height: 75vh;
  background-color: #f0f0f0;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 20px #3c3c3c;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    padding: 30px;
    border-radius: 14px;
  }
  @media screen and (max-width: 949px) {
    display: none;
  }
`;

export const EmptyRemindText = styled.div`
  font-size: 24px;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    font-size: 20px;
  }
`;

export const Title = styled.input`
  margin-bottom: 40px;
  padding: 0 20px;
  width: 1200px;
  height: 60px;
  color: #3c3c3c;
  font-size: 26px;
  font-weight: 700;
  background-color: #ffffff90;
  border: 1px solid #787878;
  border-radius: 10px;
  &:focus {
    outline: none;
    background-color: #ffffff;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 840px;
    height: 40px;
    margin-bottom: 30px;
    font-size: 20px;
    border-radius: 6px;
  }
`;

export const SingleEditorContainer = styled.div`
  position: relative;
  width: 1200px;
  height: 760px;
  & + & {
    margin-top: 80px;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 840px;
    height: 532px;
  }
  & + & {
    margin-top: 40px;
  }
`;

export const CloseIcon = styled.div`
  width: 36px;
  height: 36px;
  position: absolute;
  top: -18px;
  right: -15px;
  opacity: 0.8;
  background-image: url(${closeIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    background-image: url(${closeIconHover});
    cursor: pointer;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 30px;
    height: 30px;
    top: -15px;
    right: -14px;
  }
`;

export const SelectContainer = styled.div`
  padding: 75px 0 10px 0;
  width: 100vw;
  display: flex;
  position: fixed;
  top: 0;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 1px 0 5px black;
  z-index: 5;
  ::-webkit-scrollbar {
    display: none;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    max-height: 150px;
    transition: max-height 0.3s ease-in;
    overflow: hidden;
    &:hover {
      max-height: 230px;
    }
  }
  @media screen and (max-width: 949px) {
    display: none;
  }
`;

export const SelectInnerContainer = styled.div`
  margin: 0 auto;
  height: 100%;
  width: 1300px;
  overflow: hidden;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 840px;
    height: 150px;
  }
`;

export const SelectImgOverflowContainer = styled.div`
  margin: auto;
  display: flex;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    height: 100%;
    flex-wrap: wrap;
  }
`;

export const SelectImg = styled.div<{ img: string; cursor?: string }>`
  width: 120px;
  height: 70px;
  background-image: ${(props) => props.img};
  background-size: cover;
  background-position: center;
  border: 1px solid #d4d4d4;
  &:hover {
    cursor: ${(props) => props.cursor || "pointer"};
    box-shadow: 1px 1px 5px gray;
    border: none;
  }
  & + & {
    margin-left: 10px;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin-right: 10px;
    margin-bottom: 10px;
    width: 110px;
    height: 65px;
    & + & {
      margin-left: 0;
    }
  }
`;

export const FooterContainer = styled.div`
  margin-top: 40px;
  display: flex;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin-top: 30px;
  }
`;

export const Btn = styled.button<{
  backgroundColor?: string;
  backgroundColorHover?: string;
}>`
  padding: 0 20px;
  height: 50px;
  font-size: 18px;
  display: flex;
  align-items: center;
  border: 1px solid #3c3c3c40;
  border-radius: 10px;
  background-color: ${(props) => props.backgroundColor || "#3c3c3c30"};
  &:hover {
    cursor: pointer;
    color: #ffffff;
    background-color: ${(props) => props.backgroundColorHover || "#616161"};
  }
  & + & {
    margin-left: 50px;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    font-size: 16px;
    height: 40px;
    border-radius: 6px;
    & + & {
      margin-left: 20px;
    }
  }
`;

export const UploadImgIcon = styled.div`
  margin-left: 10px;
  width: 25px;
  height: 25px;
  background-image: url(${uploadPhotoIcon});
  background-size: cover;
  background-position: center;
  opacity: 0.8;
`;

export const CheckMainImgIcon = styled(UploadImgIcon)`
  background-image: url(${checkedIcon});
`;

export const WarningText = styled.div`
  display: none;
  @media screen and (max-width: 949px) {
    margin: 0 auto;
    padding: 20px;
    display: block;
    color: #ffffff;
    font-size: 16px;
    letter-spacing: 2px;
    line-height: 30px;
    text-align: center;
  }
`;

export const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;
