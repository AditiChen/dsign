import { useState, useEffect } from "react";
import { t } from "i18next";
import styled from "styled-components";
import produce from "immer";

import Overlay from "../Overlays/templateOverlay";
import { uploadPhotoIcon } from "../icons/icons";
import { CreateTemplateProps } from "../tsTypes";

const Wrapper = styled.div`
  width: 1200px;
  height: 760px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #696969;
  border-bottom: 1px solid #b4b4b4;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 840px;
    height: 532px;
  }
`;

const HeaderContainer = styled.div`
  padding: 20px;
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    padding: 14px;
    height: 154px;
  }
`;

const Context = styled.textarea`
  margin-left: auto;
  padding: 10px;
  height: 180px;
  width: 410px;
  color: #ffffff;
  font-size: 20px;
  line-height: 26px;
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
    height: 126px;
    width: 287px;
    font-size: 14px;
    line-height: 18px;
  }
`;

const ImgContainer = styled.div`
  width: 1200px;
  height: 540px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 840px;
    height: 378px;
  }
`;

const AsideImg = styled.div<{ url?: string; backgroundColor?: string }>`
  width: 430px;
  height: 100%;
  position: relative;
  background-image: ${(props) => props.url};
  background-color: ${(props) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 300px;
  }
`;

const MiddleImgContainer = styled.div`
  width: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 224px;
  }
`;

const MiddleImg = styled.div<{ url?: string; backgroundColor?: string }>`
  width: 320px;
  height: 265px;
  position: relative;
  background-image: ${(props) => props.url};
  background-color: ${(props) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 224px;
    height: 185px;
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

function Template2(props: CreateTemplateProps) {
  const { setPages, currentIndex, pages } = props;
  const [inputText, setInputText] = useState<string[]>(
    pages[currentIndex].content || [""]
  );
  const [showOverlay, setShowOverlay] = useState(false);
  const [storageUrl, setStorageUrl] = useState<string[]>(
    pages[currentIndex].photos || ["", "", "", ""]
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
        <HeaderContainer>
          <Context
            value={inputText}
            maxLength={110}
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
