import styled from "styled-components";
import { t } from "i18next";
import { v4 as uuid } from "uuid";
import { useState, Dispatch, SetStateAction, useEffect } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import { storage } from "../../context/firebaseSDK";
import Overlay from "../../overlay";

import trapezoid from "./template2_trapezoid.png";
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
        type: number;
        content?: string[];
        url?: string[];
        location?: { lat?: number; lng?: number };
      }[]
    >
  >;
  pages: {
    type: number;
    content?: string[];
    url?: string[];
    location?: { lat?: number; lng?: number };
  }[];
  currentIndex: number;
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
  opacity: 0.9;
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
`;

const Context = styled.textarea`
  padding: 10px;
  height: 180px;
  width: 270px;
  color: #ffffff;
  font-size: 24px;
  line-height: 30px;
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
`;

const ImgContainer = styled.div`
  position: absolute;
  right: 50px;
  bottom: 50px;
  display: flex;
`;

const LeftImg = styled.div`
  width: 300px;
  height: 200px;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  box-shadow: 0 0 5px #3c3c3c;
`;

const RightImg = styled.div`
  margin-left: 30px;
  width: 200px;
  height: 200px;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
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

function Template1(props: InsertProp) {
  const [inputText, setInputText] = useState<string[]>([""]);
  const [showOverlay, setShowOverlay] = useState(false);
  // for better user experience
  const [photoUrl, setPhotoUrl] = useState<string[]>(["", "", ""]);
  // the actual upload url
  const [storageUrl, setStorageUrl] = useState<string[]>(["", "", ""]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [currentImgUrl, setCurrentImgUrl] = useState("");
  const [currentAaspect, setCurrentAspect] = useState(1 / 1);

  const { setPages, currentIndex, pages } = props;

  useEffect(() => {
    setPhotoUrl(pages[currentIndex].url || ["", "", ""]);
    setInputText(pages[currentIndex].content || [""]);
    setStorageUrl(pages[currentIndex].url || ["", "", ""]);
  }, []);

  useEffect(() => {
    const pageData = {
      type: 1,
      content: inputText,
      url: storageUrl,
    };
    const contentCheck = pageData.content.every((text) => text !== "");
    const urlCheck = storageUrl.every((url) => url !== "");
    if (contentCheck === false || urlCheck === false) return;

    const newPages = [...pages];
    newPages[currentIndex] = pageData;
    setPages(newPages);
  }, [inputText, storageUrl, photoUrl]);

  function upLoadImgToFirebase(file: File) {
    if (!file) return;
    const urlByUuid = uuid();
    const imgRef = ref(storage, `images/${urlByUuid}`);
    const uploadTask = uploadBytesResumable(imgRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      },
      (error) => {
        console.log("Upload err", error);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        const newStorageUrl = [...storageUrl];
        newStorageUrl[currentImgIndex] = downloadURL;
        setStorageUrl(newStorageUrl);
      }
    );
  }

  const setNewPhotoDetail = (returnedUrl: string, returnedFile: File) => {
    const newUrl = [...photoUrl];
    newUrl[currentImgIndex] = returnedUrl;
    setPhotoUrl(newUrl);
    upLoadImgToFirebase(returnedFile);
  };

  function upLoadNewPhoto(index: number, aspect: number) {
    setCurrentImgUrl(photoUrl[index]);
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
          {photoUrl[0] === "" ? <UploadIcon top="350px" left="400px" /> : ""}
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
            backgroundColor={photoUrl[1] === "" ? "#b4b4b4" : ""}
            url={photoUrl[1] === "" ? "" : `url(${photoUrl[1]})`}
          >
            {photoUrl[1] === "" ? <UploadIcon top="80px" left="130px" /> : ""}
          </LeftImg>
          <RightImg
            onClick={() => {
              upLoadNewPhoto(2, 200 / 200);
            }}
            backgroundColor={photoUrl[2] === "" ? "#b4b4b4" : ""}
            url={photoUrl[2] === "" ? "" : `url(${photoUrl[2]})`}
          >
            {photoUrl[2] === "" ? <UploadIcon top="80px" left="410px" /> : ""}
          </RightImg>
        </ImgContainer>
      </Wrapper>
      {showOverlay && (
        <Overlay
          setShowOverlay={setShowOverlay}
          setNewPhotoDetail={setNewPhotoDetail}
          currentAaspect={currentAaspect}
          currentImgUrl={currentImgUrl}
        />
      )}
    </>
  );
}

export default Template1;
