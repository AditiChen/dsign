import { useState, useEffect } from "react";
import { t } from "i18next";
import styled from "styled-components";
import produce from "immer";

import Overlay from "../Overlays/templateOverlay";
import { uploadPhotoIcon } from "../icons/icons";
import trapezoid from "./template1_trapezoid.png";
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

const Trapezoid = styled.div`
  height: 100%;
  width: 496px;
  position: absolute;
  right: 0;
  opacity: 0.8;
  background-image: url(${trapezoid});
  background-size: cover;
  background-position: center;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 347px;
  }
`;

const Context = styled.textarea`
  padding: 10px;
  width: 270px;
  height: 180px;
  color: #ffffff;
  font-size: 20px;
  line-height: 26px;
  position: absolute;
  right: 50px;
  bottom: 280px;
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
    width: 189px;
    height: 126px;
    font-size: 14px;
    line-height: 18px;
    right: 35px;
    bottom: 196px;
  }
`;

const ImgContainer = styled.div`
  position: absolute;
  right: 50px;
  bottom: 50px;
  display: flex;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    right: 35px;
    bottom: 35px;
  }
`;

const LeftImg = styled.div<{ url?: string; backgroundColor?: string }>`
  width: 300px;
  height: 200px;
  background-image: ${(props) => props.url};
  background-color: ${(props) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  box-shadow: 0 0 5px #3c3c3c;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 210px;
    height: 140px;
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
  box-shadow: 0 0 5px #3c3c3c;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin-left: 21px;
    width: 140px;
    height: 140px;
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

function Template1(props: CreateTemplateProps) {
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
              left="400px"
              mobileTop="240px"
              mobileLeft="280px"
            />
          )}
        </BackgroundImg>
        <Trapezoid />
        <Context
          value={inputText}
          onChange={(e) => setInputText([e.target.value])}
          placeholder={t("type_content")}
        />
        <ImgContainer>
          <LeftImg
            onClick={() => {
              upLoadNewPhoto(1, 300 / 200);
            }}
            backgroundColor={storageUrl[1] === "" ? "#b4b4b4" : ""}
            url={storageUrl[1] === "" ? "" : `url(${storageUrl[1]})`}
          >
            {storageUrl[1] === "" && (
              <UploadIcon
                top="80px"
                left="130px"
                mobileTop="55px"
                mobileLeft="90px"
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
                top="80px"
                left="410px"
                mobileTop="55px"
                mobileLeft="285px"
              />
            )}
          </RightImg>
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

export default Template1;
