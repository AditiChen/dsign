import styled from "styled-components";

import trapezoid from "./template1_trapezoid.png";

interface Prop {
  url?: string;
}

interface InsertProp {
  photoUrl: string[];
  content: string[];
}

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

const BackgroundImg = styled.div`
  width: 1200px;
  height: 760px;
  background-image: ${(props: Prop) => props.url};
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
  line-height: 24px;
  position: absolute;
  right: 50px;
  bottom: 280px;
  background-color: transparent;
  border: none;
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
    line-height: 17px;
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

const LeftImg = styled.div`
  width: 300px;
  height: 200px;
  background-image: ${(props: Prop) => props.url};
  background-size: cover;
  background-position: center;
  box-shadow: 0 0 5px #3c3c3c;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 210px;
    height: 140px;
  }
`;

const RightImg = styled.div`
  margin-left: 30px;
  width: 200px;
  height: 200px;
  background-image: ${(props: Prop) => props.url};
  background-size: cover;
  background-position: center;
  box-shadow: 0 0 5px #3c3c3c;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin-left: 21px;
    width: 140px;
    height: 140px;
  }
`;

function Template1(props: InsertProp) {
  const { photoUrl, content } = props;

  return (
    <Wrapper>
      <BackgroundImg url={`url(${photoUrl[0]})`} />
      <Trapezoid />
      <Context value={content} disabled />
      <ImgContainer>
        <LeftImg url={`url(${photoUrl[1]})`} />
        <RightImg url={`url(${photoUrl[2]})`} />
      </ImgContainer>
    </Wrapper>
  );
}

export default Template1;
