import styled from "styled-components";
import { t } from "i18next";
import {
  useState,
  Dispatch,
  SetStateAction,
  useEffect,
  useContext,
} from "react";

import { AuthContext } from "../../context/authContext";
import upLoadImgToCloudStorage from "../../utils/upLoadImgToCloudStorage";
import Overlay from "../Overlays/templateOverlay";

import uploadPhotoIcon from "../../icons/uploadPhoto-icon.png";

interface Prop {
  url?: string;
  backgroundColor?: string;
  top?: string;
  left?: string;
}
interface InsertProp {
  setPages: Dispatch<
    SetStateAction<
      {
        key: string;
        type: number;
        content?: string[];
        photos?: string[];
        location?: { lat?: number; lng?: number };
      }[]
    >
  >;
  pages: {
    key: string;
    type: number;
    content?: string[];
    photos?: string[];
    location?: { lat?: number; lng?: number };
  }[];
  currentIndex: number;
}

const Wrapper = styled.div`
  width: 1200px;
  height: 760px;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #b4b4b490;
`;

const Text = styled.div`
  margin: auto;
  padding-bottom: 100px;
  font-size: 24px;
  text-align: center;
`;

const UploadIcon = styled.div`
  width: 50px;
  height: 50px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
  position: absolute;
  background-image: url(${uploadPhotoIcon});
  background-size: cover;
  background-position: center;
`;

const InputContainer = styled.label`
  width: 1200px;
  height: 760px;
  position: absolute;
`;

function Template8(props: InsertProp) {
  const { userId } = useContext(AuthContext);
  const [showOverlay, setShowOverlay] = useState(false);
  const [inputText, setInputText] = useState<string[]>([""]);
  const [storageUrl, setStorageUrl] = useState<string[]>(["", "", ""]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [currentImgUrl, setCurrentImgUrl] = useState("");
  const [currentAaspect, setCurrentAspect] = useState(1 / 1);
  const [isAddToCollection, setIsAddToCollection] = useState(false);
  const { setPages, currentIndex, pages } = props;

  useEffect(() => {
    const newPages = [...pages];
    newPages[currentIndex].content = inputText;
    newPages[currentIndex].photos = storageUrl;
    setPages(newPages);
  }, [inputText, storageUrl]);

  const setNewPhotoUrl = (returnedUrl: string) => {
    const newUrl = [...storageUrl];
    newUrl[currentImgIndex] = returnedUrl;
    setStorageUrl(newUrl);
  };

  function upLoadNewPhoto(index: number, aspect: number) {
    setCurrentImgUrl(storageUrl[index]);
    setShowOverlay((prev) => !prev);
    setCurrentImgIndex(index);
    setCurrentAspect(aspect);
  }

  const onUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const fileNameByTime = `${+new Date()}`;
    const imgUrl = await upLoadImgToCloudStorage(
      e.target.files[0],
      userId,
      fileNameByTime
    );
    console.log("imgUrl", imgUrl);
  };

  return (
    <>
      <Wrapper>
        <Text>{t("upload_image")}</Text>
        <UploadIcon />
        <InputContainer>
          <input
            type="file"
            accept="image/*"
            style={{
              display: "none",
              width: "1200px",
              height: "760px",
            }}
            onChange={(e) => onUploadFile(e)}
          />
        </InputContainer>
      </Wrapper>
      {showOverlay && (
        <Overlay
          setShowOverlay={setShowOverlay}
          setNewPhotoUrl={setNewPhotoUrl}
          currentAaspect={currentAaspect}
          currentImgUrl={currentImgUrl}
          isAddToCollection={isAddToCollection}
          setIsAddToCollection={setIsAddToCollection}
        />
      )}
    </>
  );
}

export default Template8;
