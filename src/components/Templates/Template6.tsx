import styled from "styled-components";
import { t } from "i18next";
import { useState, Dispatch, SetStateAction, useEffect } from "react";

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
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 840px;
    height: 532px;
  }
`;

const LeftContainer = styled.div`
  margin: 0 50px;
  padding: 60px 0;
  width: 600px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin: 0 35px;
    padding: 42px 0;
    width: 420px;
  }
`;

const Context = styled.textarea`
  padding: 10px;
  width: 100%;
  height: 300px;
  font-size: 20px;
  line-height: 26px;
  background-color: transparent;
  border: 1px solid #3c3c3c;
  resize: none;
  &::placeholder {
    color: #646464;
  }
  &:focus {
    outline: none;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    padding: 6px;
    height: 210px;
    font-size: 14px;
    line-height: 18px;
  }
`;

const LeftImg = styled.div`
  width: 100%;
  height: 300px;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 10px;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    height: 210px;
    border-radius: 6px;
  }
`;

const RightImg = styled.div`
  width: 500px;
  height: 100%;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 350px;
  }
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
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 36px;
    height: 36px;
  }
`;

function Template6(props: InsertProp) {
  const { setPages, currentIndex, pages } = props;
  const [inputText, setInputText] = useState<string[]>(
    pages[currentIndex].content || [""]
  );
  const [showOverlay, setShowOverlay] = useState(false);
  const [storageUrl, setStorageUrl] = useState<string[]>(
    pages[currentIndex].photos || ["", ""]
  );
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [currentImgUrl, setCurrentImgUrl] = useState("");
  const [currentAaspect, setCurrentAspect] = useState(1 / 1);
  const [isAddToCollection, setIsAddToCollection] = useState(false);

  useEffect(() => {
    if (
      pages[currentIndex].content === inputText &&
      pages[currentIndex].photos === storageUrl
    )
      return;
    const newPages = [...pages];
    newPages[currentIndex].content = inputText;
    newPages[currentIndex].photos = storageUrl;
    setPages(newPages);
  }, [currentIndex, inputText, pages, setPages, storageUrl]);

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

  return (
    <>
      <Wrapper>
        <LeftContainer>
          <Context
            value={inputText}
            maxLength={280}
            onChange={(e) => setInputText([e.target.value])}
            placeholder={t("type_content")}
          />
          <LeftImg
            onClick={() => {
              upLoadNewPhoto(0, 600 / 300);
            }}
            backgroundColor={storageUrl[0] === "" ? "#b4b4b4" : ""}
            url={storageUrl[0] === "" ? "" : `url(${storageUrl[0]})`}
          >
            {storageUrl[0] === "" && <UploadIcon />}
          </LeftImg>
        </LeftContainer>
        <RightImg
          onClick={() => {
            upLoadNewPhoto(1, 500 / 760);
          }}
          backgroundColor={storageUrl[1] === "" ? "#b4b4b4" : ""}
          url={storageUrl[1] === "" ? "" : `url(${storageUrl[1]})`}
        >
          {storageUrl[1] === "" && <UploadIcon />}
        </RightImg>
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

export default Template6;
