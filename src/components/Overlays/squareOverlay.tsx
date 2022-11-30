import {
  useState,
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useContext,
} from "react";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";
import styled from "styled-components";
import Cropper from "react-easy-crop";
import ReactLoading from "react-loading";
import { Slider, Typography } from "@mui/material";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";

import { db } from "../../context/firebaseSDK";
import { AuthContext } from "../../context/authContext";
import getCroppedImg from "../../utils/cropImage";
import upLoadImgToCloudStorage from "../../utils/upLoadImgToCloudStorage";

import closeIcon from "../../icons/close-icon.png";
import closeIconHover from "../../icons/close-icon-hover.png";
import confirmIcon from "../../icons/confirm-icon.png";
import confirmedIcon from "../../icons/confirmed-icon.png";
import arrowIcon from "../../icons/arrow-icon.png";
import arrowIconHover from "../../icons/arrow-icon-hover.png";

interface OverlayProps {
  userId: string;
  setShowOverlay: Dispatch<SetStateAction<boolean>>;
  mainImgSrc: string;
  setMainImgSrc: Dispatch<SetStateAction<string>>;
  shape?: "rect" | "round" | undefined;
  usage?: string;
}

const Wrapper = styled.div`
  margin: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  align-items: center;
  z-index: 100;
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
    width: 1000px;
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

const NewPhotoContainer = styled.div`
  width: 100%;
`;

const NewPhotoHeaderContainer = styled.div`
  padding: 0 20px;
  height: 40px;
  width: 100%;
  font-size: 24px;
  line-height: 40px;
  align-items: center;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    padding: 0 14px;
    font-size: 16px;
    line-height: 30px;
  }
`;

const CollectionContainer = styled.div`
  margin: 10px 0;
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
    margin: 6px 0;
    padding: 14px;
  }
  @media screen and (max-width: 1249px) {
    grid-template-columns: repeat(5, 1fr);
  }
`;

const CollectionImg = styled.div<{ url: string }>`
  margin: 10px auto;
  width: 100px;
  height: 100px;
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
    margin: 6px auto;
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
  font-size: 20px;
  text-align: center;
  border: 1px solid #3c3c3c40;
  border-radius: 10px;
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
    font-size: 16px;
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
  margin: 0 20px;
  width: 150px;
`;

const Btn = styled.button`
  margin-left: 30px;
  padding: 0 10px;
  height: 40px;
  font-size: 18px;
  border: 1px solid #3c3c3c40;
  border-radius: 10px;
  background-color: #3c3c3c30;
  &:hover {
    cursor: pointer;
    color: #ffffff;
    background-color: #616161;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin-left: 14px;
    height: 30px;
    font-size: 14px;
    border-radius: 6px;
  }
`;

const ConfirmIcon = styled.div`
  margin-left: auto;
  width: 25px;
  height: 25px;
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
  font-size: 18px;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin-left: 6px;
    font-size: 14px;
  }
`;

const LoadingBackground = styled.div`
  background-color: #00000090;
  width: 100%;
  height: 100%;
  z-index: 103;
  position: absolute;
`;

const Loading = styled(ReactLoading)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-45%, -50%);
  z-index: 104;
`;

const portalElement = document.getElementById("overlays") as HTMLElement;

function SquareOverlay({
  userId,
  setShowOverlay,
  mainImgSrc,
  setMainImgSrc,
  shape = "rect",
  usage = "",
}: OverlayProps) {
  const { t } = useTranslation();
  const { collection } = useContext(AuthContext);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [progressing, setProgressing] = useState(false);
  const [isAddToCollection, setIsAddToCollection] = useState(false);
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
  }, []);

  const zoomPercent = (value: number) => `${Math.round(value * 100)}%`;

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
    setProgressing(true);
    const { file } = (await getCroppedImg(
      imgSrc,
      croppedAreaPixels,
      rotation
    )) as { file: File; url: string };
    const fileNameByTime = `${+new Date()}`;
    const downloadUrl = (await upLoadImgToCloudStorage(
      file,
      userId,
      fileNameByTime
    )) as string;
    if (isAddToCollection) {
      await updateDoc(doc(db, "users", userId), {
        collection: arrayUnion(downloadUrl),
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
    zoom,
    imgSrc,
    setShowOverlay,
    isAddToCollection,
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
                <ArrowIcon onClick={() => setImgSrc("")} />
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
                    <Typography>
                      {t("zoom_image")}: {zoomPercent(zoom)}
                    </Typography>
                    <Slider
                      valueLabelDisplay="auto"
                      valueLabelFormat={zoomPercent}
                      min={1}
                      max={3}
                      step={0.1}
                      value={zoom}
                      onChange={(e, newZoom: any) => setZoom(newZoom)}
                    />
                  </SliderContainer>
                  <SliderContainer>
                    <Typography>
                      {t("rotate_image")}: {`${rotation} °`}
                    </Typography>
                    <Slider
                      valueLabelDisplay="auto"
                      min={0}
                      max={360}
                      value={rotation}
                      onChange={(e, newRotation: any) => {
                        setRotation(newRotation);
                      }}
                    />
                  </SliderContainer>
                  {isAddToCollection ? (
                    <ConfirmedIcon
                      onClick={() => setIsAddToCollection(false)}
                    />
                  ) : (
                    <ConfirmIcon onClick={() => setIsAddToCollection(true)} />
                  )}
                  <Text>Add to collection?</Text>
                  <Btn onClick={croppedImage}>{t("confirm_crop")}</Btn>
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
                  <CollectionContainer>
                    {collection.length !== 0 &&
                      collection.map((url) => (
                        <CollectionImg
                          key={url}
                          url={`url(${url})`}
                          onClick={() => setImgSrc(url)}
                        />
                      ))}
                  </CollectionContainer>
                  {collection.length === 0 && (
                    <Text>{t("empty_collection")}</Text>
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

export default SquareOverlay;
