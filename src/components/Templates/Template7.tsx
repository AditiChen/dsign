import { useState, useEffect } from "react";
import { t } from "i18next";
import styled from "styled-components";
import produce from "immer";

import Overlay from "../Overlays/templateOverlay";
import { uploadPhotoIcon } from "../icons/icons";
import { CreateTemplateProps } from "../tsTypes";

const Wrapper = styled.div`
  padding: 80px 50px;
  width: 1200px;
  height: 760px;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #b4b4b490;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    padding: 56px 35px;
    width: 840px;
    height: 532px;
  }
`;

const LeftContainer = styled.div`
  margin-right: 50px;
  padding-top: 50px;
  width: 450px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin-right: 35px;
    padding-top: 35px;
    width: 315px;
  }
`;

const Context = styled.textarea`
  padding: 10px;
  width: 100%;
  height: 320px;
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
    height: 224px;
    font-size: 14px;
    line-height: 18px;
  }
`;

const LeftImgContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LeftImg = styled.div<{ url?: string; backgroundColor?: string }>`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-image: ${(props) => props.url};
  background-color: ${(props) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 140px;
    height: 140px;
  }
`;

const RightImg = styled.div<{ url?: string; backgroundColor?: string }>`
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background-image: ${(props) => props.url};
  background-color: ${(props) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 420px;
    height: 420px;
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

function Template7(props: CreateTemplateProps) {
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
        <LeftContainer>
          <Context
            value={inputText}
            maxLength={250}
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
