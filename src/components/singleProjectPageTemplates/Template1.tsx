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
  border-top: 1px solid #b4b4b4;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 840px;
    height: 532px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    width: 600px;
    height: 380px;
  }
  @media screen and (max-width: 649px) {
    width: 300px;
    height: 185px;
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
  @media screen and (min-width: 650px) and (max-width: 949px) {
    width: 600px;
    height: 380px;
  }
  @media screen and (max-width: 649px) {
    width: 300px;
    height: 185px;
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
  @media screen and (min-width: 650px) and (max-width: 949px) {
    width: 248px;
  }
  @media screen and (max-width: 649px) {
    width: 124px;
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
    line-height: 18px;
    right: 35px;
    bottom: 196px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    padding: 4px;
    width: 135px;
    height: 90px;
    font-size: 10px;
    line-height: 12px;
    right: 25px;
    bottom: 140px;
  }
  @media screen and (max-width: 649px) {
    padding: 2px;
    width: 67px;
    height: 45px;
    font-size: 5px;
    line-height: 6px;
    right: 12px;
    bottom: 70px;
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
  @media screen and (min-width: 650px) and (max-width: 949px) {
    right: 25px;
    bottom: 25px;
  }
  @media screen and (max-width: 649px) {
    right: 12px;
    bottom: 12px;
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
  @media screen and (min-width: 650px) and (max-width: 949px) {
    width: 150px;
    height: 100px;
  }
  @media screen and (max-width: 649px) {
    width: 75px;
    height: 50px;
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
  @media screen and (min-width: 650px) and (max-width: 949px) {
    margin-left: 15px;
    width: 100px;
    height: 100px;
  }
  @media screen and (max-width: 649px) {
    margin-left: 12px;
    width: 50px;
    height: 50px;
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
