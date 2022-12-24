import { useContext, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import ReactLoading from "react-loading";
import { v4 as uuid } from "uuid";
import produce from "immer";
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
} from "../../components/icons/icons";

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
  @media screen and (max-width: 949px) {
    top: 50px;
  }
  @media screen and (max-width: 799px) {
    width: 120px;
    height: 50px;
  }
`;

const AddFolderIcon = styled.div`
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
  position: relative;
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
  @media screen and (max-width: 799px) {
    width: 60px;
    height: 60px;
  }
`;

const OpenFolderIcon = styled(FolderIcon)`
  width: 140px;
  height: 75px;
  background-image: url(${folderOpenIcon});
  @media screen and (max-width: 799px) {
    width: 110px;
  }
`;

const FolderName = styled.div`
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

const FolderContentContainer = styled.div`
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

const HeaderContainer = styled.div`
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  align-items: center;
  @media screen and (max-width: 799px) {
    margin-bottom: 10px;
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
    font-size: 16px;
  }
`;

const RenameFolderIcon = styled.div`
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

const NoPhotoText = styled.div`
  font-size: 18px;
`;

const UploadPhotosIcon = styled.label`
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
  @media screen and (max-width: 949px) {
    height: calc(100vh - 220px);
  }
  @media screen and (max-width: 799px) {
    height: calc(100vh - 200px);
  }
`;

const BricksInnerContainer = styled.div`
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

const Img = styled.div<{ url?: string }>`
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

const TrashIcon = styled.div`
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

const FolderTrashIcon = styled(TrashIcon)`
  width: 20px;
  height: 20px;
  right: 5px;
  top: 51px;
  @media screen and (max-width: 799px) {
    width: 16px;
    height: 16px;
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
  const { userId, folders, isLoading } = useContext(AuthContext);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [progressing, setProgressing] = useState(false);
  const [currentFolderIndex, setCurrentFolderIndex] = useState(0);

  async function updateToFirestore(
    newFolders: {
      folderName: string;
      photos: string[];
    }[]
  ) {
    await updateDoc(doc(db, "users", userId), {
      folders: newFolders,
    });
  }

  async function namingFolderHandler(state: string) {
    const ans = await Swal.fire({
      text: t("folder_name"),
      inputPlaceholder: t("folder_name_length"),
      input: "text",
      confirmButtonColor: "#6d79aa",
      confirmButtonText: t("name_folder"),
      showCancelButton: true,
      cancelButtonText: t("cancel_name_folder"),
    });
    if (ans.isDismissed === true) return;
    if (ans.value.trim() === "") {
      Swal.fire({
        text: t("folder_name_empty"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      return;
    }
    if (ans.value.length > 15) {
      const confirmUnderstandRule = await Swal.fire({
        text: t("folder_name_too_long"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      if (confirmUnderstandRule) {
        namingFolderHandler(state);
      }
      return;
    }
    if (state === "new") {
      const newFolders = produce(folders, (draft) => {
        draft.push({ folderName: ans.value, photos: [] });
      });
      await updateToFirestore(newFolders);
      return;
    }
    produce(folders, async (draft) => {
      draft[currentFolderIndex].folderName = ans.value;
      await updateToFirestore(draft);
    });
  }

  async function deleteFolderHandler(folderIndex: number) {
    const ans = await Swal.fire({
      text: t("delete_folder_warning"),
      icon: "warning",
      confirmButtonColor: "#646464",
      confirmButtonText: t("reject_no_answer"),
      showDenyButton: true,
      denyButtonColor: "tomato",
      denyButtonText: t("reject_yes_answer"),
    });
    if (ans.isConfirmed === true) return;
    const newOrder = produce(folders, (draft) => {
      draft.splice(folderIndex, 1);
    });
    await updateToFirestore(newOrder);
  }

  const onUploadImgFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    if (e.target.files.length > 10) {
      await Swal.fire({
        text: t("maximum_ten_files"),
        icon: "warning",
        confirmButtonColor: "#646464",
        confirmButtonText: t("ok"),
      });
      return;
    }
    const newFolderPhotoLength =
      folders[currentFolderIndex].photos.length + e.target.files.length;
    if (newFolderPhotoLength >= 30) {
      await Swal.fire({
        text: t("maximum_photo_in_folder"),
        icon: "warning",
        confirmButtonColor: "#646464",
        confirmButtonText: t("ok"),
      });
      return;
    }
    const newFiles = Array.from(e.target.files);
    const newPhotos = await Promise.all(
      newFiles.map(async (file: File) => {
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
        return downloadUrl;
      })
    );
    const newOrder = produce(folders, (draft) => {
      draft[currentFolderIndex].photos.push(...newPhotos);
    });
    setProgressing(false);
    await updateToFirestore(newOrder);
    e.target.value = "";
  };

  async function deletePhotoHandler(photoIndex: number) {
    const ans = await Swal.fire({
      text: t("delete_photo_warning"),
      icon: "warning",
      confirmButtonColor: "#646464",
      confirmButtonText: t("reject_no_answer"),
      showDenyButton: true,
      denyButtonColor: "tomato",
      denyButtonText: t("reject_yes_answer"),
    });
    if (ans.isConfirmed === true) return;
    const newOrder = produce(folders, (draft) => {
      draft[currentFolderIndex].photos.splice(photoIndex, 1);
    });
    await updateToFirestore(newOrder);
  }

  const getListStyle = (isDraggingOver: boolean) => ({
    background: isDraggingOver ? "#b4b4b4" : "none",
  });

  const onDragEnd = async (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId) {
      return;
    }
    const originalFolderIndex = folders.findIndex(
      (name) => name.folderName === folders[currentFolderIndex].folderName
    );
    const destinationFolderIndex = folders.findIndex(
      (name) => name.folderName === destination.droppableId
    );
    if (originalFolderIndex === destinationFolderIndex) {
      return;
    }
    const newOrder = produce(folders, (draft) => {
      const [remove] = draft[originalFolderIndex].photos.splice(
        source.index,
        1
      );
      draft[destinationFolderIndex].photos.push(remove);
    });
    await updateToFirestore(newOrder);
  };

  const renderFolderList = () => (
    <FoldersInnerContainer>
      {folders.map((folder, index) => (
        <Droppable droppableId={folder.folderName} key={folder.folderName}>
          {(droppableProvided, droppableSnapshot) => (
            <SingleFolderContainer
              {...droppableProvided.droppableProps}
              ref={droppableProvided.innerRef}
              key={folder.folderName}
              style={getListStyle(droppableSnapshot.isDraggingOver)}
            >
              {folders[currentFolderIndex].folderName === folder.folderName ? (
                <OpenFolderIcon />
              ) : (
                <>
                  <FolderIcon onClick={() => setCurrentFolderIndex(index)} />
                  {folder.folderName !== "Unsorted" && (
                    <FolderTrashIcon
                      onClick={() => deleteFolderHandler(index)}
                    />
                  )}
                </>
              )}
              <FolderName>{folder.folderName}</FolderName>
              {droppableProvided.placeholder}
            </SingleFolderContainer>
          )}
        </Droppable>
      ))}
    </FoldersInnerContainer>
  );

  const renderImgBricks = () => (
    <BricksContainer>
      {folders && folders[currentFolderIndex]?.photos.length === 0 && (
        <NoPhotoText>{t("empty_folder")}</NoPhotoText>
      )}
      <Droppable
        droppableId="current"
        direction="horizontal"
        key={folders[currentFolderIndex]?.folderName}
      >
        {(droppableProvided) => (
          <div
            {...droppableProvided.droppableProps}
            ref={droppableProvided.innerRef}
          >
            <BricksInnerContainer>
              {folders &&
                folders[currentFolderIndex]?.photos.length !== 0 &&
                folders[currentFolderIndex]?.photos.map((photo, photoIndex) => (
                  <Draggable draggableId={photo} index={photoIndex} key={photo}>
                    {(provided) => (
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
                          onClick={() => deletePhotoHandler(photoIndex)}
                        />
                      </ImgContainer>
                    )}
                  </Draggable>
                ))}
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
  );

  if (isLoading) {
    return (
      <Wrapper>
        <Loading type="cylon" color="#ffffff" />
      </Wrapper>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <FoldersContainer>
            <AddFolderContainer>
              <AddFolderIcon onClick={() => namingFolderHandler("new")} />
            </AddFolderContainer>
            {renderFolderList()}
          </FoldersContainer>
          <FolderContentContainer>
            <HeaderContainer>
              <Title>{folders[currentFolderIndex]?.folderName}</Title>
              {folders[currentFolderIndex]?.folderName !== "Unsorted" && (
                <RenameFolderIcon
                  onClick={() => {
                    namingFolderHandler("exist");
                  }}
                />
              )}
              <UploadPhotosIcon>
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  multiple
                  onChange={onUploadImgFiles}
                />
              </UploadPhotosIcon>
            </HeaderContainer>
            {renderImgBricks()}
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
