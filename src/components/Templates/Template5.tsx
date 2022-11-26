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
  padding: 60px 50px;
  width: 1200px;
  height: 760px;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #b4b4b490;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    padding: 42px 35px;
    width: 840px;
    height: 532px;
  }
`;

const Context = styled.textarea`
  padding: 10px;
  width: 450px;
  height: 100%;
  font-size: 20px;
  line-height: 24px;
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
    width: 315px;
    font-size: 14px;
    line-height: 17px;
  }
`;

const ImgContainer = styled.div`
  margin-left: 40px;
  width: 650px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin-left: 38px;
    width: 455px;
  }
`;

const Img = styled.div`
  width: 295px;
  height: 100%;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 10px;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 206px;
    border-radius: 6px;
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

function Template5(props: InsertProp) {
  const [inputText, setInputText] = useState<string[]>([""]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [storageUrl, setStorageUrl] = useState<string[]>(["", ""]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [currentImgUrl, setCurrentImgUrl] = useState("");
  const [currentAaspect, setCurrentAspect] = useState(1 / 1);
  const [isAddToCollection, setIsAddToCollection] = useState(false);
  const { setPages, currentIndex, pages } = props;

  useEffect(() => {
    setInputText(pages[currentIndex].content || [""]);
    setStorageUrl(pages[currentIndex].photos || ["", ""]);
  }, []);

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

  return (
    <>
      <Wrapper>
        <Context
          value={inputText}
          onChange={(e) => setInputText([e.target.value])}
          placeholder={t("type_content")}
        />
        <ImgContainer>
          <Img
            onClick={() => {
              upLoadNewPhoto(0, 295 / 640);
            }}
            backgroundColor={storageUrl[0] === "" ? "#b4b4b4" : ""}
            url={storageUrl[0] === "" ? "" : `url(${storageUrl[0]})`}
          >
            {storageUrl[0] === "" && <UploadIcon />}
          </Img>
          <Img
            onClick={() => {
              upLoadNewPhoto(1, 295 / 640);
            }}
            backgroundColor={storageUrl[1] === "" ? "#b4b4b4" : ""}
            url={storageUrl[1] === "" ? "" : `url(${storageUrl[1]})`}
          >
            {storageUrl[1] === "" && <UploadIcon />}
          </Img>
        </ImgContainer>
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

export default Template5;
