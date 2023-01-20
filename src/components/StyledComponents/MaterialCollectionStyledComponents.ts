import styled from "styled-components";
import ReactLoading from "react-loading";

import {
  addFolderIcon,
  addFolderIconHover,
  pencilIcon,
  pencilIconHover,
  folderIcon,
  folderOpenIcon,
  deleteIcon,
  deleteIconHover,
  uploadPhotoIcon,
  uploadPhotoIconHover,
} from "../icons/icons";

export const Wrapper = styled.div`
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 110px);
  display: flex;
  background-color: #787878;
  position: relative;
  @media screen and (min-width: 800px) and (max-width: 949px) {
    min-height: calc(100vh - 100px);
  }
  @media screen and (max-width: 799px) {
    min-height: calc(100vh - 90px);
  }
`;

export const FoldersContainer = styled.div`
  padding: 80px 0 20px;
  width: 150px;
  height: calc(100vh - 110px);
  background-color: #f0f0f0;
  box-shadow: 0 -1px 3px #3c3c3c;
  overflow: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width: 949px) {
    padding: 70px 0 20px;
    height: calc(100vh - 100px);
  }
  @media screen and (max-width: 799px) {
    padding: 60px 0 20px;
    width: 120px;
    height: calc(100vh - 90px);
  }
`;

export const AddFolderContainer = styled.div`
  padding-top: 10px;
  width: 150px;
  height: 60px;
  position: fixed;
  top: 60px;
  left: 0;
  background-color: #f0f0f0;
  box-shadow: 1px 0 3px #646464;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media screen and (max-width: 949px) {
    top: 50px;
  }
  @media screen and (max-width: 799px) {
    width: 120px;
    height: 50px;
  }
`;

export const AddFolderIcon = styled.div`
  width: 40px;
  height: 40px;
  background-image: url(${addFolderIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    background-image: url(${addFolderIconHover});
    cursor: pointer;
  }
  @media screen and (max-width: 799px) {
    width: 30px;
    height: 30px;
  }
`;

export const FoldersInnerContainer = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const SingleFolderContainer = styled.div`
  width: 100%;
  height: fit-content;
  min-width: 80px;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  & + & {
    margin-top: 20px;
  }
`;

export const FolderIcon = styled.div`
  width: 80px;
  height: 80px;
  background-image: url(${folderIcon});
  background-position: center;
  background-size: cover;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 799px) {
    width: 60px;
    height: 60px;
  }
`;

export const OpenFolderIcon = styled(FolderIcon)`
  width: 140px;
  height: 75px;
  background-image: url(${folderOpenIcon});
  @media screen and (max-width: 799px) {
    width: 110px;
  }
`;

export const FolderName = styled.div`
  width: 100%;
  font-size: 18px;
  text-align: center;
  word-wrap: break-word;
  & + & {
    margin-left: 20px;
  }
  @media screen and (max-width: 799px) {
    font-size: 14px;
  }
`;

export const FolderContentContainer = styled.div`
  margin: 0 auto;
  padding: 50px 120px;
  width: calc(100vw - 150px);
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1449px) {
    padding: 30px 80px;
  }
  @media screen and (max-width: 1024px) {
    padding: 30px 50px;
  }
  @media screen and (max-width: 799px) {
    padding: 10px 0;
  }
`;

export const HeaderContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  @media screen and (max-width: 799px) {
    margin-bottom: 10px;
  }
`;

export const Title = styled.div`
  font-size: 24px;
  text-align: center;
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 2px;
  @media screen and (min-width: 800px) and (max-width: 1024px) {
    font-size: 20px;
  }
  @media screen and (max-width: 799px) {
    font-size: 16px;
  }
`;

export const RenameFolderIcon = styled.div`
  margin-left: 20px;
  width: 24px;
  height: 24px;
  background-image: url(${pencilIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
    background-image: url(${pencilIconHover});
  }
  @media screen and (max-width: 799px) {
    width: 20px;
    height: 20px;
  }
`;

export const NoPhotoText = styled.div`
  font-size: 18px;
`;

export const UploadPhotosIcon = styled.label`
  margin-right: 10px;
  margin-left: auto;
  width: 40px;
  height: 40px;
  background-color: transparent;
  border: none;
  background-image: url(${uploadPhotoIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
    background-image: url(${uploadPhotoIconHover});
  }
  @media screen and (max-width: 1449px) {
    width: 32px;
    height: 32px;
  }
  @media screen and (max-width: 799px) {
    width: 24px;
    height: 24px;
  }
`;

export const BricksContainer = styled.div`
  padding: 20px;
  width: 100%;
  height: calc(100vh - 270px);
  background-color: #f0f0f0;
  border-radius: 10px;
  overflow: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width: 949px) {
    height: calc(100vh - 220px);
  }
  @media screen and (max-width: 799px) {
    height: calc(100vh - 200px);
  }
`;

export const BricksInnerContainer = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  @media screen and (max-width: 799px) {
    grid-template-columns: repeat(auto-fill, minmax(135px, 1fr));
  }
`;

export const Img = styled.div<{ url?: string }>`
  width: 180px;
  height: 180px;
  background-color: #b4b4b4;
  background-image: ${(props) => props.url};
  background-size: cover;
  background-position: center;
  @media screen and (max-width: 799px) {
    width: 130px;
    height: 130px;
  }
`;

export const TrashIcon = styled.div`
  width: 26px;
  height: 26px;
  position: absolute;
  bottom: 5px;
  right: 5px;
  opacity: 0.8;
  background-image: url(${deleteIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
    background-image: url(${deleteIconHover});
  }
  @media screen and (max-width: 799px) {
    width: 20px;
    height: 20px;
  }
`;

export const FolderTrashIcon = styled(TrashIcon)`
  width: 20px;
  height: 20px;
  right: 5px;
  top: 51px;
  @media screen and (max-width: 799px) {
    width: 16px;
    height: 16px;
  }
`;

export const ImgContainer = styled.div`
  margin: 5px auto;
  width: 180px;
  height: 180px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 5px #616161;
  &:hover {
    margin: 0 auto;
    width: 190px;
    height: 190px;
    box-shadow: 0 0 10px #3c3c3c;
  }
  &:hover > ${Img} {
    width: 190px;
    height: 190px;
  }
  &:active > ${Img} {
    width: 190px;
    height: 190px;
  }
  @media screen and (max-width: 799px) {
    margin: 3px auto;
    width: 130px;
    height: 130px;
    &:hover {
      width: 130px;
      height: 130px;
    }
    &:hover > ${Img} {
      width: 130px;
      height: 130px;
    }
  }
`;

export const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

export const PhotoLoading = styled(ReactLoading)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;
