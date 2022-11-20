import styled from "styled-components";
import { t } from "i18next";
import { useState, Dispatch, SetStateAction, useEffect } from "react";

import Overlay from "../Overlays/templateOverlay";

import uploadPhotoIcon from "../../icons/uploadPhoto-icon.png";

interface Prop {
  url?: string;
  backgroundColor?: string;
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
  width: 1200px;
  height: 760px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #696969;
  border-bottom: 1px solid #b4b4b4;
`;

const HeaderContainer = styled.div`
  padding: 20px;
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
`;

const Context = styled.textarea`
  margin-left: auto;
  padding: 10px;
  height: 180px;
  width: 410px;
  color: #ffffff;
  font-size: 20px;
  line-height: 24px;
  background-color: transparent;
  border: 1px solid #b4b4b4;
  resize: none;
  &::placeholder {
    color: #b4b4b4;
  }
  &:focus {
    outline: none;
  }
`;

const ImgContainer = styled.div`
  width: 1200px;
  height: 540px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const AsideImg = styled.div`
  width: 430px;
  height: 100%;
  position: relative;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
`;

const MiddleImgContainer = styled.div`
  width: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const MiddleImg = styled.div`
  width: 320px;
  height: 265px;
  position: relative;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
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

function Template2(props: InsertProp) {
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
      type: 2,
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
        <HeaderContainer>
          <Context
            value={inputText}
            onChange={(e) => setInputText([e.target.value])}
            placeholder={t("type_content")}
          />
        </HeaderContainer>
        <ImgContainer>
          <AsideImg
            onClick={() => {
              upLoadNewPhoto(0, 430 / 540);
            }}
            backgroundColor={storageUrl[0] === "" ? "#b4b4b4" : ""}
            url={storageUrl[0] === "" ? "" : `url(${storageUrl[0]})`}
          >
            {storageUrl[0] === "" && <UploadIcon />}
          </AsideImg>
          <MiddleImgContainer>
            <MiddleImg
              onClick={() => {
                upLoadNewPhoto(1, 320 / 265);
              }}
              backgroundColor={storageUrl[1] === "" ? "#b4b4b4" : ""}
              url={storageUrl[1] === "" ? "" : `url(${storageUrl[1]})`}
            >
              {storageUrl[1] === "" && <UploadIcon />}
            </MiddleImg>
            <MiddleImg
              onClick={() => {
                upLoadNewPhoto(2, 320 / 265);
              }}
              backgroundColor={storageUrl[2] === "" ? "#b4b4b4" : ""}
              url={storageUrl[2] === "" ? "" : `url(${storageUrl[2]})`}
            >
              {storageUrl[2] === "" && <UploadIcon />}
            </MiddleImg>
          </MiddleImgContainer>
          <AsideImg
            onClick={() => {
              upLoadNewPhoto(3, 430 / 540);
            }}
            backgroundColor={storageUrl[3] === "" ? "#b4b4b4" : ""}
            url={storageUrl[3] === "" ? "" : `url(${storageUrl[3]})`}
          >
            {storageUrl[3] === "" && <UploadIcon />}
          </AsideImg>
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

export default Template2;
