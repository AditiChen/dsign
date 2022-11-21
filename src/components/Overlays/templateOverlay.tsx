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
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { db, storage } from "../../context/firebaseSDK";
import { AuthContext } from "../../context/authContext";

import getCroppedImg from "../../utils/cropImage";
import closeIcon from "../../icons/close-icon.png";
import closeIconHover from "../../icons/close-icon-hover.png";
import confirmIcon from "../../icons/confirm-icon.png";
import confirmedIcon from "../../icons/confirmed-icon.png";
import arrowIcon from "../../icons/arrow-icon.png";
import arrowIconHover from "../../icons/arrow-icon-hover.png";

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
`;

const Backdrop = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: #00000030;
  z-index: 101;
`;

const CloseIcon = styled.div`
  width: 35px;
  height: 35px;
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
`;

const ArrowIcon = styled.div`
  height: 35px;
  width: 35px;
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
`;

const OverlayModal = styled.div`
  padding: 50px;
  width: 80vw;
  max-width: 1300px;
  height: 80vh;
  max-height: 800px;
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -50%);
  z-index: 102;
  background-color: white;
`;

const CropperContainer = styled.div`
  width: 80%;
  height: 90%;
  position: relative;
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
  left: 425px;
  top: 280px;
  z-index: 104;
`;

const NewPhotoContainer = styled.div`
  width: 100%;
`;

const NewPhotoHeaderContainer = styled.div`
  padding: 0 20px;
  height: 40px;
  width: 100%;
  color: #3c3c3c;
  font-size: 24px;
  line-height: 40px;
  align-items: center;
`;

const CollectionContainer = styled.div`
  margin: 10px 0;
  padding: 20px;
  width: 100%;
  min-height: 200px;
  max-height: 650px;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: minmax(4, auto);
  overflow: scroll;
  scrollbar-width: none;
  border: 1px solid #b4b4b4;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const CollectionImg = styled.div<{ url: string }>`
  margin: 10px auto;
  width: 150px;
  height: 150px;
  background-image: ${(props) => props.url};
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  &:hover {
    margin: auto;
    cursor: pointer;
    width: 155px;
    height: 155px;
    box-shadow: 0 0 5px #3c3c3c;
  }
`;

const UploadPic = styled.label`
  margin-left: 10px;
  padding: 0 15px;
  height: 40px;
  line-height: 40px;
  font-size: 20px;
  color: #3c3c3c;
  text-align: center;
  border: 1px solid #3c3c3c40;
  border-radius: 10px;
  background-color: #3c3c3c30;
  &:hover {
    cursor: pointer;
    color: #ffffff;
    background-color: #616161;
  }
`;

const ControlContainer = styled.div`
  margin-top: 20px;
  width: 80%;
  display: flex;
  align-items: center;
`;

const SliderContainer = styled.div`
  margin: 0 20px;
  width: 150px;
`;

const Btn = styled.button`
  margin-left: 20px;
  height: 40px;
  color: #3c3c3c;
  font-size: 18px;
  border: 1px solid #3c3c3c40;
  border-radius: 10px;
  background-color: #3c3c3c30;
  &:hover {
    cursor: pointer;
    color: #ffffff;
    background-color: #616161;
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
`;

const ConfirmedIcon = styled(ConfirmIcon)`
  background-image: url(${confirmedIcon});
`;

const Text = styled.div`
  margin-left: 10px;
  font-size: 18px;
  color: #3c3c3c;
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
  const { collection, userId } = useContext(AuthContext);
  const [imgSrc, setImgSrc] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [progressing, setProgressing] = useState(false);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
  }>(null!);

  useEffect(() => {
    if (currentImgUrl) {
      setImgSrc(currentImgUrl);
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

  const showCroppedImage = useCallback(async () => {
    setProgressing(true);
    const { file } = (await getCroppedImg(
      imgSrc,
      croppedAreaPixels,
      rotation
    )) as { file: File; url: string };
    const urlByTime = `${+new Date()}`;
    const imgRef = ref(storage, `images/${userId}/${urlByTime}`);
    const uploadTask = uploadBytesResumable(imgRef, file);
    await new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        },
        (error) => {
          console.log("Upload err", error);
        },
        async () => {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setNewPhotoUrl(downloadUrl);
          if (isAddToCollection) {
            await updateDoc(doc(db, "users", userId), {
              collection: arrayUnion(downloadUrl),
            });
          }
          resolve(downloadUrl);
        }
      );
    });
    setProgressing(false);
    setIsAddToCollection(false);
    setShowOverlay((prev) => !prev);
  }, [croppedAreaPixels, rotation, imgSrc, setNewPhotoUrl, setShowOverlay]);

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
                      <Loading type="spokes" color="#ffffff" />
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
                      onChange={(e, newRotation: any) =>
                        setRotation(newRotation)
                      }
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
                  <Btn onClick={showCroppedImage}>{t("confirm_crop")}</Btn>
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

export default Overlay;
