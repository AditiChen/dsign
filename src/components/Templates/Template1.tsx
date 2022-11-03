import { useState } from "react";
import styled from "styled-components";
import { t } from "i18next";
import Overlay from "../../overlay";

import trapezoid from "./template2_trapezoid.png";
import church1 from "../church1.jpg";
import church2 from "../church2.jpg";
import church3 from "../church3.jpg";

interface Prop {
  border?: string;
  url?: string;
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
  border: ${(props: Prop) => props.border};
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
  height: 200px;
  width: 300px;
  background-image: ${(props: Prop) => props.url};
  background-size: cover;
  background-position: center;
  box-shadow: 0 0 5px #3c3c3c;
`;

const RightImg = styled.div`
  margin-left: 30px;
  height: 200px;
  width: 200px;
  background-image: ${(props: Prop) => props.url};
  background-size: cover;
  background-position: center;
  box-shadow: 0 0 5px #3c3c3c;
`;

// function Template1({ edit }: { edit: boolean }) {
function Template1(props: InsertProp) {
  const [inputText, setInputText] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [photoUrl, setPhotoUrl] = useState<string[]>(["", "", ""]);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const { edit } = props;

  const urls = [church1, church2, church3];

  const setNewUrl = (returnedUrl: string) => {
    const newUrl = [...photoUrl];
    newUrl[currentImgIndex] = returnedUrl;
    setPhotoUrl(newUrl);
  };

  return (
    <>
      <Wrapper>
        <BackgroundImg
          onClick={() => setShowOverlay((prev) => !prev)}
          url={`url(${urls[0]})`}
        />
        <Trapezoid />
        <Context
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          border={edit ? "1px solid #b4b4b4" : "none"}
          placeholder={edit ? t("type_content") : ""}
          disabled={!edit}
        />
        <ImgContainer>
          <LeftImg
            onClick={() => setShowOverlay((prev) => !prev)}
            url={`url(${urls[1]})`}
          />
          <RightImg
            onClick={() => setShowOverlay((prev) => !prev)}
            url={`url(${urls[2]})`}
          />
        </ImgContainer>
      </Wrapper>
      {showOverlay && (
        <Overlay setShowOverlay={setShowOverlay} setNewUrl={setNewUrl} />
      )}
    </>
  );
}

export default Template1;
