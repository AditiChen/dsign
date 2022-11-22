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
        type?: number;
        content?: string[];
        url?: string[];
        location?: { lat?: number; lng?: number };
      }[]
    >
  >;
  pages: {
    type?: number;
    content?: string[];
    url?: string[];
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
`;

const ImgContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Img = styled.div`
  width: 330px;
  height: 300px;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 10px;
`;

const Context = styled.textarea`
  margin: 0 30px;
  padding: 10px;
  width: 100%;
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

function Template4(props: InsertProp) {
  const [inputText, setInputText] = useState<string[]>([""]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [storageUrl, setStorageUrl] = useState<string[]>(["", "", "", ""]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [currentImgUrl, setCurrentImgUrl] = useState("");
  const [currentAaspect, setCurrentAspect] = useState(1 / 1);
  const [isAddToCollection, setIsAddToCollection] = useState(false);
  const { setPages, currentIndex, pages } = props;

  useEffect(() => {
    setInputText(pages[currentIndex].content || [""]);
    setStorageUrl(pages[currentIndex].url || ["", "", "", ""]);
  }, []);

  useEffect(() => {
    const pageData = {
      type: 4,
      content: inputText,
      url: storageUrl,
    };
    const contentCheck = pageData.content.every((text) => text !== "");
    const urlCheck = storageUrl.every((url) => url !== "");
    if (contentCheck === false || urlCheck === false) return;
    const newPages = [...pages];
    newPages[currentIndex] = pageData;
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
        <ImgContainer>
          <Img
            onClick={() => {
              upLoadNewPhoto(0, 320 / 300);
            }}
            backgroundColor={storageUrl[0] === "" ? "#b4b4b4" : ""}
            url={storageUrl[0] === "" ? "" : `url(${storageUrl[0]})`}
          >
            {storageUrl[0] === "" && <UploadIcon />}
          </Img>
          <Img
            onClick={() => {
              upLoadNewPhoto(1, 320 / 300);
            }}
            backgroundColor={storageUrl[1] === "" ? "#b4b4b4" : ""}
            url={storageUrl[1] === "" ? "" : `url(${storageUrl[1]})`}
          >
            {storageUrl[1] === "" && <UploadIcon />}
          </Img>
        </ImgContainer>

        <Context
          value={inputText}
          onChange={(e) => setInputText([e.target.value])}
          placeholder={t("type_content")}
        />
        <ImgContainer>
          <Img
            onClick={() => {
              upLoadNewPhoto(2, 320 / 300);
            }}
            backgroundColor={storageUrl[2] === "" ? "#b4b4b4" : ""}
            url={storageUrl[2] === "" ? "" : `url(${storageUrl[2]})`}
          >
            {storageUrl[2] === "" && <UploadIcon />}
          </Img>
          <Img
            onClick={() => {
              upLoadNewPhoto(3, 320 / 300);
            }}
            backgroundColor={storageUrl[3] === "" ? "#b4b4b4" : ""}
            url={storageUrl[3] === "" ? "" : `url(${storageUrl[3]})`}
          >
            {storageUrl[3] === "" && <UploadIcon />}
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

export default Template4;
