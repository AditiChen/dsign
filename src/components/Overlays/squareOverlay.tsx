import { useState, useCallback, useEffect, useContext } from "react";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import produce from "immer";
import Cropper from "react-easy-crop";
import { Slider, defaultTheme, Provider, View } from "@adobe/react-spectrum";
import { doc, updateDoc } from "firebase/firestore";

import { db } from "../../context/firebaseSDK";
import { AuthContext } from "../../context/authContext";
import getCroppedImg from "../../utils/cropImage";
import uploadImgToCloudStorage from "../../utils/uploadImgToCloudStorage";
import { SquareOverlayProps } from "../tsTypes";
import { folderIcon, folderOpenIcon } from "../icons/icons";

import {
  Wrapper,
  Backdrop,
  CloseIcon,
  ArrowIcon,
  CropperContainer,
  LoadingBackground,
  Loading,
  ControlContainer,
  SliderContainer,
  ConfirmedIcon,
  Text,
  Btn,
  ConfirmIcon,
  NewPhotoContainer,
  NewPhotoHeaderContainer,
  UploadPic,
  CollectionFolderContainer,
  FolderName,
  FolderIcon,
  CollectionContainer,
  CollectionInnerContainer,
  CollectionImg,
  OverlayModal,
} from "../StyledComponents/CropImgOverlay";

const portalElement = document.getElementById("overlays") as HTMLElement;

function SquareOverlay({
  setShowOverlay,
  mainImgSrc,
  setMainImgSrc,
  shape,
  usage,
}: SquareOverlayProps) {
  const { t } = useTranslation();
  const { folders, userId } = useContext(AuthContext);
  const [imgSrc, setImgSrc] = useState<string>(mainImgSrc);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [progressing, setProgressing] = useState(false);
  const [isAddToCollection, setIsAddToCollection] = useState(false);
  const [currentFolderIndex, setCurrentFolderIndex] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  }>(null!);

  useEffect(() => {
    if (mainImgSrc) {
      setImgSrc(mainImgSrc);
    }
  }, [mainImgSrc]);

  const onUploadFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onloadend = () => {
        const result = String(reader.result);
        setImgSrc(result);
      };
    }
  };

  const onCropComplete = useCallback(
    (
      croppedArea: { width: number; height: number; x: number; y: number },
      croppedAreainPixel: {
        width: number;
        height: number;
        x: number;
        y: number;
      }
    ) => {
      setCroppedAreaPixels(croppedAreainPixel);
    },
    []
  );

  const croppedImage = useCallback(async () => {
    if (progressing) return;
    if (croppedAreaPixels === null) return;
    setProgressing(true);
    const { file } = (await getCroppedImg(
      imgSrc,
      croppedAreaPixels,
      rotation
    )) as { file: File; url: string };
    const fileNameByTime = `${+new Date()}`;
    const downloadUrl = (await uploadImgToCloudStorage(
      file,
      userId,
      fileNameByTime
    )) as string;
    if (isAddToCollection) {
      const newPhotoArray = produce(folders, (draft) => {
        draft[0].photos.push(downloadUrl);
      });
      await updateDoc(doc(db, "users", userId), {
        folders: newPhotoArray,
      });
    }
    if (usage === "avatar") {
      await updateDoc(doc(db, "users", userId), {
        avatar: downloadUrl,
      });
    }
    setMainImgSrc(downloadUrl);
    setProgressing(false);
    setShowOverlay((prev) => !prev);
  }, [
    croppedAreaPixels,
    rotation,
    imgSrc,
    setShowOverlay,
    isAddToCollection,
    progressing,
    setMainImgSrc,
    usage,
    userId,
    folders,
  ]);

  const renderCropImgModal = () => (
    <>
      <ArrowIcon onClick={() => setImgSrc("")} />
      <CropperContainer>
        {progressing && (
          <>
            <LoadingBackground />
            <Loading type="spokes" color="#ffffff" width="40px" height="40px" />
          </>
        )}
        <Cropper
          image={imgSrc}
          crop={crop}
          rotation={rotation}
          zoom={zoom}
          aspect={1 / 1}
          onCropChange={setCrop}
          onRotationChange={setRotation}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          cropShape={shape}
        />
      </CropperContainer>
      <ControlContainer>
        <SliderContainer>
          <Provider theme={defaultTheme}>
            <View UNSAFE_style={{ backgroundColor: "white" }}>
              <Slider
                label={t("zoom_image")}
                minValue={1}
                maxValue={3}
                isFilled
                width={150}
                step={0.1}
                value={zoom}
                onChange={setZoom}
              />
            </View>
          </Provider>
        </SliderContainer>
        <SliderContainer>
          <Provider theme={defaultTheme}>
            <View UNSAFE_style={{ backgroundColor: "white" }}>
              <Slider
                label={t("rotate_image")}
                minValue={0}
                maxValue={360}
                isFilled
                width={150}
                step={5}
                value={rotation}
                onChange={setRotation}
              />
            </View>
          </Provider>
        </SliderContainer>
        {isAddToCollection && (
          <ConfirmedIcon onClick={() => setIsAddToCollection(false)} />
        )}
        {!isAddToCollection && (
          <ConfirmIcon onClick={() => setIsAddToCollection(true)} />
        )}
        <Text>Add to collection?</Text>
        <Btn
          onClick={croppedImage}
          cursor={croppedAreaPixels === null ? "not-allowed" : "pointer"}
        >
          {t("confirm_crop")}
        </Btn>
      </ControlContainer>
    </>
  );

  const renderSelectImgModal = () => (
    <CropperContainer>
      <NewPhotoContainer>
        <NewPhotoHeaderContainer>
          {t("choose_photo")}
          <UploadPic>
            {t("upload_image")}
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={onUploadFile}
            />
          </UploadPic>
        </NewPhotoHeaderContainer>
        <CollectionFolderContainer>
          {folders?.map((folder, index) => (
            <FolderName
              key={folder.folderName}
              $color={currentFolderIndex === index ? "#3c3c3c" : "#b4b4b4"}
              backgroundColor={
                currentFolderIndex === index ? "#f0f0f0" : "#787878"
              }
              onClick={() => setCurrentFolderIndex(index)}
            >
              {folder.folderName}
              <FolderIcon
                $width={currentFolderIndex === index ? "42px" : "26px"}
                opacity={currentFolderIndex === index ? 1 : 0.7}
                img={
                  currentFolderIndex === index
                    ? `url(${folderOpenIcon})`
                    : `url(${folderIcon})`
                }
              />
            </FolderName>
          ))}
        </CollectionFolderContainer>
        <CollectionContainer>
          <CollectionInnerContainer>
            {folders[currentFolderIndex].photos.length !== 0 &&
              folders[currentFolderIndex].photos?.map((url) => (
                <CollectionImg
                  key={url}
                  url={`url(${url})`}
                  onClick={() => setImgSrc(url)}
                />
              ))}
          </CollectionInnerContainer>
        </CollectionContainer>
        {folders[currentFolderIndex].photos.length === 0 && (
          <Text>{t("empty_folder")}</Text>
        )}
      </NewPhotoContainer>
    </CropperContainer>
  );

  return (
    <>
      {createPortal(
        <Wrapper>
          <Backdrop onClick={() => setShowOverlay((prev) => !prev)} />
          <OverlayModal>
            <CloseIcon onClick={() => setShowOverlay((prev) => !prev)} />
            {imgSrc ? renderCropImgModal() : renderSelectImgModal()}
          </OverlayModal>
        </Wrapper>,
        portalElement
      )}
    </>
  );
}

SquareOverlay.defaultProps = {
  shape: "rect",
  usage: "",
};

export default SquareOverlay;
