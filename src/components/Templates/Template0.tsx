import styled from "styled-components";
import { t } from "i18next";
import { useState, useRef } from "react";
import Overlay from "../../overlay";
import uploadPhotoIcon from "./uploadPhoto.png";

interface Prop {
  border?: string;
  url?: string;
  backgroundColor?: string;
  top?: string;
  left?: string;
}
interface InsertProp {
  edit: boolean;
}

const Wrapper = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 760px;
  position: relative;
  display: flex;
  align-items: center;
`;

const BackgroundImg = styled.div`
  width: 1200px;
  height: 760px;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  opacity: 0.7;
`;

const MiddleContainer = styled.div`
  padding: 100px 80px 50px 30px;
  width: 450px;
  height: 100%;
  position: absolute;
  left: 300px;
  background-color: #616161;
  opacity: 0.9;
  box-shadow: 1px 0 3px #616161, -1px 0 3px #616161;
`;

const Context = styled.textarea`
  padding: 10px;
  width: 100%;
  height: 100%;
  color: #ffffff;
  font-size: 24px;
  line-height: 30px;
  background-color: transparent;
  border: ${(props: Prop) => props.border};
  &::placeholder {
    color: #b4b4b4;
  }
  &:focus {
    outline: none;
  }
`;

const RightImg = styled.div`
  width: 450px;
  height: 645px;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: absolute;
  right: 50px;
  z-index: 1;
  box-shadow: 0 0 5px #3c3c3c;
`;

const UploadIcon = styled.div`
  width: 50px;
  height: 50px;
  top: ${(props: Prop) => props.top};
  left: ${(props: Prop) => props.left};
  z-index: 2;
  position: absolute;
  background-image: url(${uploadPhotoIcon});
  background-size: cover;
  background-position: center;
`;

function Template0(props: InsertProp) {
  const [inputText, setInputText] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string[]>(["", ""]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [currentAaspect, setCurrentAspect] = useState(1 / 1);
  const inputRef = useRef<HTMLTextAreaElement>(null!);

  const { edit } = props;
  const pageData = {
    type: 0,
    content: [`${inputRef.current?.value}`],
    url: photoUrl,
    author: "Orange",
    id: "lWRhOh8Hh7p65kOoamST",
  };

  const setNewUrl = (returnedUrl: string) => {
    const newUrl = [...photoUrl];
    newUrl[currentImgIndex] = returnedUrl;
    setPhotoUrl(newUrl);
  };

  function upLoadNewPhoto(index: number, aspect: number) {
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
          backgroundColor={photoUrl[0] === "" ? "#b4b4b4" : ""}
          url={photoUrl[0] === "" ? "" : `url(${photoUrl[0]})`}
        >
          {photoUrl[0] === "" ? <UploadIcon top="350px" left="140px" /> : ""}
        </BackgroundImg>
        <MiddleContainer>
          <Context
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            border={edit ? "1px solid #b4b4b4" : "none"}
            placeholder={edit ? t("type_content") : ""}
            disabled={!edit}
            ref={inputRef}
          />
        </MiddleContainer>
        <RightImg
          onClick={() => {
            upLoadNewPhoto(1, 450 / 645);
          }}
          backgroundColor={photoUrl[1] === "" ? "#b4b4b4" : ""}
          url={photoUrl[1] === "" ? "" : `url(${photoUrl[1]})`}
        >
          {photoUrl[1] === "" ? <UploadIcon top="300px" left="200px" /> : ""}
        </RightImg>
      </Wrapper>
      {showOverlay && (
        <Overlay
          setShowOverlay={setShowOverlay}
          setNewUrl={setNewUrl}
          currentAaspect={currentAaspect}
        />
      )}
    </>
  );
}

export default Template0;
