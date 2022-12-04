import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import ReactLoading from "react-loading";
import { v4 as uuid } from "uuid";
import { doc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";
import imageCompression from "browser-image-compression";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

import { db } from "../../context/firebaseSDK";
import { AuthContext } from "../../context/authContext";
import SinglePhotoOverlay from "../../components/Overlays/singlePhotoOverlay";
import upLoadImgToCloudStorage from "../../utils/upLoadImgToCloudStorage";

import uploadPhotoIcon from "../../icons/uploadPhoto-icon.png";
import uploadPhotoIconHover from "../../icons/uploadPhoto-icon-hover.png";
import trashIcon from "../../icons/trash-icon.png";
import trashIconHover from "../../icons/trash-icon-hover.png";
import folderIcon from "../../icons/folder-icon.png";
import openFolderIcon from "../../icons/folderOpen-icon.png";
import addFolderIcon from "../../icons/add-folder-icon.png";
import addFolderIconHover from "../../icons/add-folder-icon-hover.png";

interface Prop {
  url?: string;
}

const Wrapper = styled.div`
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

const FoldersContainer = styled.div`
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
`;

const AddFolderContainer = styled.div`
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
`;

const AddFolderIcon = styled.div`
  width: 40px;
  height: 40px;
  background-image: url(${addFolderIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    background-image: url(${addFolderIconHover});
  }
`;

const FoldersInnerContainer = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SingleFolderContainer = styled.div`
  width: 100%;
  height: fit-content;
  min-width: 80px;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  & + & {
    margin-top: 20px;
  }
`;

const FolderIcon = styled.div`
  width: 80px;
  height: 80px;
  background-image: url(${folderIcon});
  background-position: center;
  background-size: cover;
  &:hover {
    cursor: pointer;
  }
`;

const OpenFolderIcon = styled(FolderIcon)`
  width: 145px;
  background-image: url(${openFolderIcon});
`;

const FolderName = styled.div`
  width: 100%;
  font-size: 18px;
  text-align: center;
  word-wrap: break-word;
  & + & {
    margin-left: 20px;
  }
`;

const FolderContentContainer = styled.div`
  margin: 0 auto;
  padding: 50px 120px;
  width: calc(100vw - 150px);
  display: flex;
  flex-direction: column;
  @media screen and (max-width: 1449px) {
    padding: 30px 120px;
  }
`;

const HeaderContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  @media screen and (min-width: 800px) and (max-width: 1024px) {
    height: 70px;
  }
  @media screen and (max-width: 799px) {
    height: 50px;
  }
`;

const Title = styled.div`
  font-size: 24px;
  text-align: center;
  color: #ffffff;
  font-weight: 600;
  letter-spacing: 2px;
  @media screen and (min-width: 800px) and (max-width: 1024px) {
    font-size: 20px;
  }
  @media screen and (max-width: 799px) {
    padding: 4px 30px 0 30px;
    font-size: 16px;
  }
`;

const AddPhotosIcon = styled.label`
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

const BricksContainer = styled.div`
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
`;

const BricksInnerContainer = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
`;

const Img = styled.div`
  width: 180px;
  height: 180px;
  background-color: #b4b4b4;
  background-image: ${(props: Prop) => props.url};
  background-size: cover;
  background-position: center;
  @media screen and (max-width: 799px) {
    width: 130px;
    height: 130px;
  }
`;

const TrashIcon = styled.div`
  width: 26px;
  height: 26px;
  position: absolute;
  bottom: 5px;
  right: 5px;
  opacity: 0.8;
  background-image: url(${trashIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    background-image: url(${trashIconHover});
  }
  @media screen and (max-width: 799px) {
    width: 20px;
    height: 20px;
  }
`;

const ImgContainer = styled.div`
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

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

const PhotoLoading = styled(ReactLoading)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

function MaterialCollection() {
  const { t } = useTranslation();
  const { userId, collection, folders, isLoading } = useContext(AuthContext);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [progressing, setProgressing] = useState(false);
  const [currentFolderIndex, setCurrentFolderIndex] = useState(0);

  async function addNewFolderHandler() {
    const ans = await Swal.fire({
      title: "enter your folder name",
      inputLabel: "max length 15 letters",
      input: "text",
      confirmButtonColor: "#3c3c3c",
      confirmButtonText: "create",
      showCancelButton: true,
    });
    if (ans.isDismissed === true) return;
    if (ans.value.length > 15) {
      Swal.fire({
        text: "folder name too long",
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      return;
    }
    const newPhotoArray = [...folders];
    newPhotoArray.push({ folderName: ans.value, photos: [] });
    await updateDoc(doc(db, "users", userId), {
      folders: newPhotoArray,
    });
  }

  const onUploadImgFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const newFiles = Array.from(e.target.files);
    newFiles.forEach(async (file: File) => {
      setProgressing(true);
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
      });
      const urlByUuid = `${uuid()}`;
      const downloadUrl = (await upLoadImgToCloudStorage(
        compressedFile,
        userId,
        urlByUuid
      )) as string;
      setProgressing(false);
      const newPhotoArray = [...folders];
      newPhotoArray[currentFolderIndex].photos.push(downloadUrl);
      await updateDoc(doc(db, "users", userId), {
        folders: newPhotoArray,
      });
    });
  };

  const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? "#b4b4b4" : "none",
  });

  async function deleteHandler(url: string, photoIndex: number) {
    const ans = await Swal.fire({
      text: t("delete_photo_warning"),
      icon: "warning",
      confirmButtonColor: "#646464",
      confirmButtonText: t("reject_no_answer"),
      showDenyButton: true,
      denyButtonText: t("reject_yes_answer"),
    });
    if (ans.isConfirmed === true) return;
    const removePhotoArray = [...folders];
    removePhotoArray[currentFolderIndex].photos.splice(photoIndex, 1);
    await updateDoc(doc(db, "users", userId), {
      folders: removePhotoArray,
    });
  }

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const originalFolderIndex = folders.findIndex(
      (name) => name.folderName === folders[currentFolderIndex].folderName
    );
    const destinationFolderIndex = folders.findIndex(
      (name) => name.folderName === destination.droppableId
    );
    const newOrder = [...folders];
    const [remove] = newOrder[originalFolderIndex].photos.splice(
      source.index,
      1
    );
    if (source.droppableId === destination.droppableId) {
      newOrder[currentFolderIndex].photos.splice(destination.index, 0, remove);
      await updateDoc(doc(db, "users", userId), {
        folders: newOrder,
      });
      return;
    }
    newOrder[destinationFolderIndex].photos.push(remove);
    await updateDoc(doc(db, "users", userId), {
      folders: newOrder,
    });
  };

  if (isLoading) {
    return (
      <Wrapper>
        <Loading type="cylon" color="#ffffff" />
      </Wrapper>
    );
  }
  return (
    <>
      <DragDropContext onDragEnd={(e) => onDragEnd(e)}>
        <Wrapper>
          <FoldersContainer>
            <AddFolderContainer>
              <AddFolderIcon onClick={() => addNewFolderHandler()} />
            </AddFolderContainer>
            <FoldersInnerContainer>
              {folders.map((folder, index) => (
                <Droppable
                  droppableId={folder.folderName}
                  key={folder.folderName}
                >
                  {(droppableProvided, droppableSnapshot) => (
                    <SingleFolderContainer
                      {...droppableProvided.droppableProps}
                      ref={droppableProvided.innerRef}
                      key={folder.folderName}
                      style={getListStyle(droppableSnapshot.isDraggingOver)}
                    >
                      {folders[currentFolderIndex].folderName ===
                      folder.folderName ? (
                        <OpenFolderIcon />
                      ) : (
                        <FolderIcon
                          onClick={() => setCurrentFolderIndex(index)}
                        />
                      )}

                      <FolderName>{folder.folderName}</FolderName>
                      {droppableProvided.placeholder}
                    </SingleFolderContainer>
                  )}
                </Droppable>
              ))}
            </FoldersInnerContainer>
          </FoldersContainer>
          <FolderContentContainer>
            <HeaderContainer>
              <Title>{folders[currentFolderIndex]?.folderName}</Title>
              <AddPhotosIcon>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  multiple
                  onChange={(e) => onUploadImgFiles(e)}
                />
              </AddPhotosIcon>
            </HeaderContainer>
            <BricksContainer>
              <Droppable
                droppableId="current"
                direction="horizontal"
                key={folders[currentFolderIndex]?.folderName}
              >
                {(droppableProvided, droppableSnapshot) => (
                  <div
                    {...droppableProvided.droppableProps}
                    ref={droppableProvided.innerRef}
                  >
                    <BricksInnerContainer>
                      {folders &&
                        folders[currentFolderIndex]?.photos.length === 0 && (
                          <div>no photo</div>
                        )}
                      {folders &&
                        folders[currentFolderIndex]?.photos.length !== 0 &&
                        folders[currentFolderIndex]?.photos.map(
                          (photo, photoIndex) => (
                            <Draggable
                              draggableId={photo}
                              index={photoIndex}
                              key={photo}
                            >
                              {(provided, snapshot) => (
                                <ImgContainer
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Img
                                    url={`url(${photo})`}
                                    onClick={() => {
                                      setCurrentUrl(photo);
                                      setShowOverlay(true);
                                    }}
                                  />
                                  <TrashIcon
                                    onClick={() =>
                                      deleteHandler(photo, photoIndex)
                                    }
                                  />
                                </ImgContainer>
                              )}
                            </Draggable>
                          )
                        )}
                      {progressing && (
                        <ImgContainer>
                          <PhotoLoading
                            type="spin"
                            color="#3c3c3c"
                            height="40px"
                            width="40px"
                          />
                        </ImgContainer>
                      )}
                    </BricksInnerContainer>
                    {droppableProvided.placeholder}
                  </div>
                )}
              </Droppable>
            </BricksContainer>
          </FolderContentContainer>
        </Wrapper>
      </DragDropContext>
      {showOverlay && (
        <SinglePhotoOverlay setShowOverlay={setShowOverlay} url={currentUrl} />
      )}
    </>
  );
}

export default MaterialCollection;
