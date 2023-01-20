import styled from "styled-components";
import ReactLoading from "react-loading";

import {
  closeIcon,
  closeIconHover,
  confirmIcon,
  confirmedIcon,
  arrowIcon,
  arrowIconHover,
} from "../icons/icons";

export const Wrapper = styled.div`
  margin: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  align-items: center;
  z-index: 100;
  font-family: "Roboto", "Noto Sans TC", "Noto Sans JP", sans-serif;
  @media screen and (max-width: 949px) {
    display: none;
  }
`;

export const Backdrop = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: #00000030;
  z-index: 101;
`;

export const CloseIcon = styled.div`
  width: 30px;
  height: 30px;
  position: absolute;
  top: -15px;
  right: -15px;
  opacity: 0.8;
  background-image: url(${closeIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    background-image: url(${closeIconHover});
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 22px;
    height: 22px;
    top: -10px;
    right: -10px;
  }
`;

export const ArrowIcon = styled.div`
  height: 30px;
  width: 30px;
  position: absolute;
  top: 30px;
  left: 50px;
  background-image: url(${arrowIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
    background-image: url(${arrowIconHover});
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 20px;
    height: 20px;
    top: 16px;
    left: 24px;
  }
`;

export const OverlayModal = styled.div`
  padding: 50px;
  width: 1200px;
  height: 80vh;
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -50%);
  z-index: 102;
  background-color: white;
  @media screen and (max-width: 1449px) {
    width: 930px;
  }
  @media screen and (max-width: 1249px) {
    width: 800px;
  }
`;

export const CropperContainer = styled.div`
  width: 80%;
  height: 90%;
  position: relative;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 90%;
  }
`;

export const LoadingBackground = styled.div`
  background-color: #00000090;
  width: 100%;
  height: 100%;
  z-index: 103;
  position: absolute;
`;

export const NewPhotoContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export const NewPhotoHeaderContainer = styled.div`
  padding: 0 20px 0 0;
  height: 40px;
  width: 100%;
  font-size: 18px;
  line-height: 40px;
  align-items: center;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    padding: 0 14px;
    font-size: 14px;
    line-height: 30px;
  }
`;

export const CollectionFolderContainer = styled.div`
  margin-top: 5px;
  width: 100%;
  height: fit-content;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
`;

export const FolderName = styled.div<{
  backgroundColor: string;
  $color: string;
}>`
  padding: 5px 10px;
  font-size: 18px;
  color: ${(props) => props.$color};
  display: flex;
  line-height: 25px;
  border: 1px solid #b4b4b4;
  border-radius: 5px 5px 0 0;
  background-color: ${(props) => props.backgroundColor};
  border-bottom: none;
  &:hover {
    cursor: pointer;
  }
`;

export const FolderIcon = styled.div<{
  img: string;
  $width: string;
  opacity: number;
}>`
  margin-left: 5px;
  height: 24px;
  width: ${(props) => props.$width};
  opacity: ${(props) => props.opacity};
  background-image: ${(props) => props.img};
  background-size: cover;
  background-position: center;
`;

export const CollectionContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: scroll;
  border: 1px solid #b4b4b4;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

export const CollectionInnerContainer = styled.div`
  margin-bottom: 10px;
  padding: 20px;
  width: 100%;
  height: fit-content;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(4, auto);
  @media screen and (max-width: 1449px) {
    grid-template-columns: repeat(6, 1fr);
    padding: 14px;
  }
  @media screen and (max-width: 1249px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

export const CollectionImg = styled.div<{ url: string }>`
  margin: 5px auto;
  width: 100px;
  height: 100px;
  background-color: #b4b4b4;
  background-image: ${(props) => props.url};
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  border: 1px solid #b4b4b4;
  &:hover {
    margin: auto;
    cursor: pointer;
    width: 105px;
    height: 105px;
    box-shadow: 0 0 5px #3c3c3c;
    border: none;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 100px;
    height: 100px;
    border-radius: 6px;
  }
`;

export const UploadPic = styled.label`
  margin-left: 10px;
  padding: 0 15px;
  height: 40px;
  line-height: 40px;
  font-size: 18px;
  text-align: center;
  border: 1px solid #3c3c3c40;
  border-radius: 5px;
  background-color: #3c3c3c30;
  &:hover {
    cursor: pointer;
    color: #ffffff;
    background-color: #616161;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin-left: 7px;
    padding: 0 10px;
    height: 28px;
    line-height: 28px;
    font-size: 14px;
    border-radius: 6px;
  }
`;

export const ControlContainer = styled.div`
  margin-top: 20px;
  width: 80%;
  display: flex;
  align-items: center;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 90%;
  }
`;

export const SliderContainer = styled.div`
  margin-right: 40px;
  width: 150px;
  .spectrum-Slider-labelContainer_e4b6ba,
  .spectrum-Slider-value_e4b6ba {
    color: #3c3c3c;
    font-family: "Roboto", "Noto Sans TC", "Noto Sans JP", sans-serif;
    font-size: 16px;
  }
  .spectrum-Slider-handle_e4b6ba {
    border-color: #646464;
    &:hover {
      cursor: pointer;
    }
  }
  .spectrum-Slider-track_e4b6ba {
    --spectrum-slider-track-gradient: #b4b4b4;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 140px;
    .spectrum-Slider-value_e4b6ba {
      font-size: 14px;
    }
  }
`;

export const Btn = styled.div<{ cursor?: string }>`
  margin-left: 30px;
  padding: 0 10px;
  height: 40px;
  font-size: 16px;
  line-height: 40px;
  color: #3c3c3c;
  border: 1px solid #3c3c3c40;
  border-radius: 10px;
  background-color: #3c3c3c30;
  font-family: "Roboto", "Noto Sans TC", "Noto Sans JP", sans-serif;
  &:hover {
    cursor: ${(props) => props.cursor || "pointer"};
    color: #ffffff;
    background-color: #616161;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin-left: 14px;
    height: 30px;
    line-height: 30px;
    font-size: 14px;
    border-radius: 6px;
  }
`;

export const ConfirmIcon = styled.div`
  margin-left: auto;
  width: 22px;
  height: 22px;
  background-image: url(${confirmIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 18px;
    height: 18px;
  }
`;

export const ConfirmedIcon = styled(ConfirmIcon)`
  background-image: url(${confirmedIcon});
`;

export const Text = styled.div`
  margin-left: 10px;
  font-size: 16px;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin-left: 6px;
    font-size: 14px;
  }
`;

export const Loading = styled(ReactLoading)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-45%, -50%);
  z-index: 104;
`;
