import { useState, useEffect } from "react";
import { t } from "i18next";
import styled from "styled-components";
import produce from "immer";

import Overlay from "../Overlays/templateOverlay";

import leftCircle from "./template3_left_circle.png";
import { uploadPhotoIcon } from "../icons/icons";
import { CreateTemplateProps } from "../tsTypes";

const Wrapper = styled.div`
  width: 1200px;
  height: 760px;
  position: relative;
  display: flex;
  align-items: center;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 840px;
    height: 532px;
  }
`;

const BackgroundImg = styled.div<{ url?: string; backgroundColor?: string }>`
  width: 1200px;
  height: 760px;
  background-image: ${(props) => props.url};
  background-color: ${(props) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  opacity: 0.9;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 840px;
    height: 532px;
  }
`;

const LeftCircle = styled.div`
  height: 100%;
  width: 425px;
  position: absolute;
  left: 0;
  opacity: 0.8;
  background-image: url(${leftCircle});
  background-size: cover;
  background-position: center;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 298px;
  }
`;

const Context = styled.textarea`
  padding: 10px;
  height: 155px;
  width: 245px;
  color: #ffffff;
  font-size: 20px;
  line-height: 26px;
  position: absolute;
  left: 20px;
  bottom: 30px;
  background-color: transparent;
  border: 1px solid #b4b4b4;
  resize: none;
  &::placeholder {
    color: #b4b4b4;
  }
  &:focus {
    outline: none;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    padding: 6px;
    height: 105px;
    width: 168px;
    font-size: 14px;
    line-height: 18px;
    left: 14px;
    bottom: 21px;
  }
`;

const LeftImg = styled.div<{ url?: string; backgroundColor?: string }>`
  width: 330px;
  height: 330px;
  background-image: ${(props) => props.url};
  background-color: ${(props) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 70px;
  left: 50px;
  border-radius: 50%;
  box-shadow: 0 0 5px #3c3c3c;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 230px;
    height: 230px;
    top: 49px;
    left: 35px;
  }
`;

const RightImg = styled.div<{ url?: string; backgroundColor?: string }>`
  margin-left: 30px;
  width: 200px;
  height: 200px;
  background-image: ${(props) => props.url};
  background-color: ${(props) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: absolute;
  right: 70px;
  bottom: 70px;
  border-radius: 50%;
  box-shadow: 0 0 5px #3c3c3c;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin-left: 21px;
    width: 140px;
    height: 140px;
    right: 49px;
    bottom: 49px;
  }
`;

const UploadIcon = styled.div<{
  top?: string;
  left?: string;
  mobileTop?: string;
  mobileLeft?: string;
}>`
  width: 50px;
  height: 50px;
  top: ${(props) => props.top};
  left: ${(props) => props.left};
  z-index: 2;
  position: absolute;
  background-image: url(${uploadPhotoIcon});
  background-size: cover;
  background-position: center;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 36px;
    height: 36px;
    top: ${(props) => props.mobileTop};
    left: ${(props) => props.mobileLeft};
  }
`;

function Template3(props: CreateTemplateProps) {
  const { setPages, currentIndex, pages } = props;
  const [inputText, setInputText] = useState<string[]>(
    pages[currentIndex].content || [""]
  );
  const [showOverlay, setShowOverlay] = useState(false);
  const [storageUrl, setStorageUrl] = useState<string[]>(
    pages[currentIndex].photos || ["", "", ""]
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
    const newPages = produce(pages, (draft) => {
      draft[currentIndex].content = inputText;
      draft[currentIndex].photos = storageUrl;
    });
    setPages(newPages);
  }, [inputText, storageUrl, currentIndex, setPages, pages]);

  const setNewPhotoUrl = (returnedUrl: string) => {
    const newUrl = produce(storageUrl, (draft) => {
      draft[currentImgIndex] = returnedUrl;
    });
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
        <BackgroundImg
          onClick={() => {
            upLoadNewPhoto(0, 1200 / 760);
          }}
          backgroundColor={storageUrl[0] === "" ? "#b4b4b4" : ""}
          url={storageUrl[0] === "" ? "" : `url(${storageUrl[0]})`}
        >
          {storageUrl[0] === "" && (
            <UploadIcon
              top="350px"
              left="650px"
              mobileTop="230px"
              mobileLeft="480px"
            />
          )}
        </BackgroundImg>
        <LeftCircle />
        <Context
          value={inputText}
          maxLength={55}
          onChange={(e) => setInputText([e.target.value])}
          placeholder={t("type_content")}
        />
        <LeftImg
          onClick={() => {
            upLoadNewPhoto(1, 300 / 300);
          }}
          backgroundColor={storageUrl[1] === "" ? "#b4b4b4" : ""}
          url={storageUrl[1] === "" ? "" : `url(${storageUrl[1]})`}
        >
          {storageUrl[1] === "" && (
            <UploadIcon
              top="140px"
              left="145px"
              mobileTop="100px"
              mobileLeft="100px"
            />
          )}
        </LeftImg>
        <RightImg
          onClick={() => {
            upLoadNewPhoto(2, 200 / 200);
          }}
          backgroundColor={storageUrl[2] === "" ? "#b4b4b4" : ""}
          url={storageUrl[2] === "" ? "" : `url(${storageUrl[2]})`}
        >
          {storageUrl[2] === "" && (
            <UploadIcon
              top="75px"
              left="80px"
              mobileTop="55px"
              mobileLeft="57px"
            />
          )}
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

export default Template3;
