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
  padding: 80px 50px;
  width: 1200px;
  height: 760px;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #b4b4b490;
`;

const LeftContainer = styled.div`
  margin-right: 50px;
  padding-top: 50px;
  width: 450px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Context = styled.textarea`
  padding: 10px;
  width: 100%;
  height: 320px;
  color: #3c3c3c;
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

const LeftImgContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LeftImg = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 100px;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
`;

const RightImg = styled.div`
  width: 600px;
  height: 600px;
  border-radius: 300px;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
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

function Template7(props: InsertProp) {
  const [inputText, setInputText] = useState<string[]>([""]);
  const [showOverlay, setShowOverlay] = useState(false);
  const [storageUrl, setStorageUrl] = useState<string[]>(["", "", ""]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [currentImgUrl, setCurrentImgUrl] = useState("");
  const [currentAaspect, setCurrentAspect] = useState(1 / 1);
  const [isAddToCollection, setIsAddToCollection] = useState(false);
  const { setPages, currentIndex, pages } = props;

  useEffect(() => {
    setInputText(pages[currentIndex].content || [""]);
    setStorageUrl(pages[currentIndex].url || ["", "", ""]);
  }, []);

  useEffect(() => {
    const pageData = {
      type: 7,
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
        <LeftContainer>
          <Context
            value={inputText}
            onChange={(e) => setInputText([e.target.value])}
            placeholder={t("type_content")}
          />
          <LeftImgContainer>
            <LeftImg
              onClick={() => {
                upLoadNewPhoto(0, 1 / 1);
              }}
              backgroundColor={storageUrl[0] === "" ? "#b4b4b4" : ""}
              url={storageUrl[0] === "" ? "" : `url(${storageUrl[0]})`}
            >
              {storageUrl[0] === "" && <UploadIcon />}
            </LeftImg>
            <LeftImg
              onClick={() => {
                upLoadNewPhoto(1, 1 / 1);
              }}
              backgroundColor={storageUrl[1] === "" ? "#b4b4b4" : ""}
              url={storageUrl[1] === "" ? "" : `url(${storageUrl[1]})`}
            >
              {storageUrl[1] === "" && <UploadIcon />}
            </LeftImg>
          </LeftImgContainer>
        </LeftContainer>
        <RightImg
          onClick={() => {
            upLoadNewPhoto(2, 1 / 1);
          }}
          backgroundColor={storageUrl[2] === "" ? "#b4b4b4" : ""}
          url={storageUrl[2] === "" ? "" : `url(${storageUrl[2]})`}
        >
          {storageUrl[2] === "" && <UploadIcon />}
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

export default Template7;
