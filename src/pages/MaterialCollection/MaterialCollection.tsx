import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
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
import uploadImgToCloudStorage from "../../utils/uploadImgToCloudStorage";
import {
  Wrapper,
  FoldersContainer,
  AddFolderContainer,
  AddFolderIcon,
  FoldersInnerContainer,
  SingleFolderContainer,
  FolderIcon,
  OpenFolderIcon,
  FolderName,
  FolderContentContainer,
  HeaderContainer,
  Title,
  RenameFolderIcon,
  NoPhotoText,
  UploadPhotosIcon,
  BricksContainer,
  BricksInnerContainer,
  Img,
  TrashIcon,
  FolderTrashIcon,
  ImgContainer,
  Loading,
  PhotoLoading,
} from "../../components/StyledComponents/MaterialCollectionStyledComponents";

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
      cancelButtonText: t("cancel_button"),
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
        const downloadUrl = (await uploadImgToCloudStorage(
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
