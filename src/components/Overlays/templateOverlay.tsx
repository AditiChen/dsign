import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
} from "react";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import styled from "styled-components";
import Cropper from "react-easy-crop";
import ReactLoading from "react-loading";
import { Slider, defaultTheme, Provider, View } from "@adobe/react-spectrum";
import { doc, updateDoc } from "firebase/firestore";
import Swal from "sweetalert2";

import { db } from "../../context/firebaseSDK";
import { AuthContext } from "../../context/authContext";
import upLoadImgToCloudStorage from "../../utils/upLoadImgToCloudStorage";
import getCroppedImg from "../../utils/cropImage";
import {
  closeIcon,
  closeIconHover,
  confirmIcon,
  confirmedIcon,
  arrowIcon,
  arrowIconHover,
} from "../icons/icons";

interface OverlayProps {
  setShowOverlay: Dispatch<SetStateAction<boolean>>;
  setNewPhotoUrl: (returnedUrl: string) => void;
  currentAaspect: number;
  currentImgUrl: string;
  isAddToCollection: boolean;
  setIsAddToCollection: Dispatch<SetStateAction<boolean>>;
}

const Wrapper = styled.div`
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

const Backdrop = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: #00000030;
  z-index: 101;
`;

const CloseIcon = styled.div`
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

const ArrowIcon = styled.div`
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

const OverlayModal = styled.div`
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

const CropperContainer = styled.div`
  width: 80%;
  height: 90%;
  position: relative;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 90%;
  }
`;

const LoadingBackground = styled.div`
  background-color: #00000090;
  width: 100%;
  height: 100%;
  z-index: 103;
  position: absolute;
`;

const NewPhotoContainer = styled.div`
  width: 100%;
`;

const NewPhotoHeaderContainer = styled.div`
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

const CollectionFolderContainer = styled.div`
  width: 100%;
  height: fit-content;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
`;

const FolderName = styled.div<{ backgroundColor: string; $color: string }>`
  padding: 5px 12px;
  font-size: 18px;
  color: ${(props) => props.$color};
  border: 1px solid #b4b4b4;
  border-radius: 5px 5px 0 0;
  background-color: ${(props) => props.backgroundColor};
  border-bottom: none;
  &:hover {
    cursor: pointer;
  }
`;

const CollectionContainer = styled.div`
  margin-bottom: 10px;
  padding: 20px;
  width: 100%;
  min-height: 140px;
  max-height: 650px;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(7, 1fr);
  grid-auto-rows: minmax(4, auto);
  overflow: scroll;
  scrollbar-width: none;
  border: 1px solid #b4b4b4;
  ::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width: 1449px) {
    grid-template-columns: repeat(6, 1fr);
    padding: 14px;
  }
  @media screen and (max-width: 1249px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const CollectionImg = styled.div<{ url: string }>`
  margin: 5px auto;
  width: 100px;
  height: 100px;
  background-color: #b4b4b4;
  background-image: ${(props) => props.url};
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  &:hover {
    margin: auto;
    cursor: pointer;
    width: 105px;
    height: 105px;
    box-shadow: 0 0 5px #3c3c3c;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 100px;
    height: 100px;
    border-radius: 6px;
  }
`;

const UploadPic = styled.label`
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

const ControlContainer = styled.div`
  margin-top: 20px;
  width: 80%;
  display: flex;
  align-items: center;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 90%;
  }
`;

const SliderContainer = styled.div`
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

const Btn = styled.div<{ cursor?: string }>`
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

const ConfirmIcon = styled.div`
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

const ConfirmedIcon = styled(ConfirmIcon)`
  background-image: url(${confirmedIcon});
`;

const Text = styled.div`
  margin-left: 10px;
  font-size: 16px;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin-left: 6px;
    font-size: 14px;
  }
`;

const Loading = styled(ReactLoading)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-45%, -50%);
  z-index: 104;
`;

const portalElement = document.getElementById("overlays") as HTMLElement;

function Overlay({
  setShowOverlay,
  setNewPhotoUrl,
  currentAaspect,
  currentImgUrl,
  isAddToCollection,
  setIsAddToCollection,
}: OverlayProps) {
  const { t } = useTranslation();
  const { userId, folders } = useContext(AuthContext);
  const [imgSrc, setImgSrc] = useState<string>(currentImgUrl);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [progressing, setProgressing] = useState(false);
  const [currentFolderIndex, setCurrentFolderIndex] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  }>(null!);

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

  const showCroppedImage = useCallback(async () => {
    if (progressing) return;
    if (croppedAreaPixels === null) return;
    setProgressing(true);
    const { file } = (await getCroppedImg(
      imgSrc,
      croppedAreaPixels,
      rotation
    )) as { file: File };
    if (file === undefined) {
      Swal.fire({
        text: "there is something wrong, please try again later",
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      return;
    }
    const fileNameByTime = `${+new Date()}`;
    const downloadUrl = (await upLoadImgToCloudStorage(
      file,
      userId,
      fileNameByTime
    )) as string;

    setNewPhotoUrl(downloadUrl);
    if (isAddToCollection) {
      const newPhotoArray = [...folders];
      newPhotoArray[0].photos.push(downloadUrl);
      await updateDoc(doc(db, "users", userId), {
        folders: newPhotoArray,
      });
    }
    setProgressing(false);
    setIsAddToCollection(false);
    setShowOverlay((prev) => !prev);
  }, [
    progressing,
    imgSrc,
    croppedAreaPixels,
    rotation,
    userId,
    setNewPhotoUrl,
    isAddToCollection,
    setIsAddToCollection,
    setShowOverlay,
    folders,
  ]);

  return (
    <>
      {createPortal(
        <Wrapper>
          <Backdrop onClick={() => setShowOverlay((prev) => !prev)} />
          <OverlayModal>
            <CloseIcon onClick={() => setShowOverlay((prev) => !prev)} />
            {imgSrc ? (
              <>
                <ArrowIcon
                  onClick={() => {
                    setImgSrc("");
                    setProgressing(false);
                  }}
                />
                <CropperContainer>
                  {progressing && (
                    <>
                      <LoadingBackground />
                      <Loading
                        type="spokes"
                        color="#ffffff"
                        width="40px"
                        height="40px"
                      />
                    </>
                  )}
                  <Cropper
                    image={imgSrc}
                    crop={crop}
                    rotation={rotation}
                    zoom={zoom}
                    aspect={currentAaspect}
                    onCropChange={setCrop}
                    onRotationChange={setRotation}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
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
                  {isAddToCollection ? (
                    <ConfirmedIcon
                      onClick={() => setIsAddToCollection(false)}
                    />
                  ) : (
                    <ConfirmIcon onClick={() => setIsAddToCollection(true)} />
                  )}
                  <Text>{t("add_to_collection")}</Text>
                  <Btn
                    onClick={showCroppedImage}
                    cursor={
                      croppedAreaPixels === null ? "not-allowed" : "pointer"
                    }
                  >
                    {t("confirm_crop")}
                  </Btn>
                </ControlContainer>
              </>
            ) : (
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
                        onChange={(e) => onUploadFile(e)}
                      />
                    </UploadPic>
                  </NewPhotoHeaderContainer>
                  <CollectionFolderContainer>
                    {folders?.map((folder, index) => (
                      <FolderName
                        key={folder.folderName}
                        $color={
                          currentFolderIndex === index ? "#3c3c3c" : "#b4b4b4"
                        }
                        backgroundColor={
                          currentFolderIndex === index ? "#f0f0f0" : "#787878"
                        }
                        onClick={() => setCurrentFolderIndex(index)}
                      >
                        {folder.folderName}
                      </FolderName>
                    ))}
                  </CollectionFolderContainer>
                  <CollectionContainer>
                    {folders[currentFolderIndex].photos.length !== 0 &&
                      folders[currentFolderIndex].photos?.map((url) => (
                        <CollectionImg
                          key={url}
                          url={`url(${url})`}
                          onClick={() => setImgSrc(url)}
                        />
                      ))}
                  </CollectionContainer>
                  {folders[currentFolderIndex].photos.length === 0 && (
                    <Text>{t("empty_folder")}</Text>
                  )}
                </NewPhotoContainer>
              </CropperContainer>
            )}
          </OverlayModal>
        </Wrapper>,
        portalElement
      )}
    </>
  );
}

export default Overlay;
