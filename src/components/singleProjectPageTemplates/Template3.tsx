import styled from "styled-components";

import leftCircle from "./template3_left_circle.png";

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
  @media screen and (min-width: 650px) and (max-width: 949px) {
    width: 212px;
  }
  @media screen and (max-width: 649px) {
    width: 106px;
  }
`;

const Context = styled.textarea`
  padding: 10px;
  height: 150px;
  width: 240px;
  color: #ffffff;
  font-size: 20px;
  line-height: 24px;
  position: absolute;
  left: 30px;
  bottom: 30px;
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
    height: 105px;
    width: 168px;
    font-size: 14px;
    line-height: 17px;
    left: 21px;
    bottom: 21px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    padding: 4px;
    height: 74px;
    width: 129px;
    font-size: 10px;
    line-height: 12px;
    left: 15px;
    bottom: 15px;
  }
  @media screen and (max-width: 649px) {
    padding: 2px;
    height: 37px;
    width: 60px;
    font-size: 5px;
    line-height: 6px;
    left: 7px;
    bottom: 7px;
  }
`;

const LeftImg = styled.div`
  width: 330px;
  height: 330px;
  background-image: ${(props: Prop) => props.url};
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
  @media screen and (min-width: 650px) and (max-width: 949px) {
    width: 165px;
    height: 165px;
    top: 35px;
    left: 25px;
  }
  @media screen and (max-width: 649px) {
    width: 82px;
    height: 82px;
    top: 17px;
    left: 12px;
  }
`;

const RightImg = styled.div`
  margin-left: 30px;
  width: 200px;
  height: 200px;
  background-image: ${(props: Prop) => props.url};
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
  @media screen and (min-width: 650px) and (max-width: 949px) {
    margin-left: 15px;
    width: 100px;
    height: 100px;
    right: 35px;
    bottom: 35px;
  }
  @media screen and (max-width: 649px) {
    margin-left: 7px;
    width: 50px;
    height: 50px;
    right: 17px;
    bottom: 17px;
  }
`;

function Template3(props: InsertProp) {
  const { photoUrl, content } = props;

  return (
    <Wrapper>
      <BackgroundImg url={`url(${photoUrl[0]})`} />
      <LeftCircle />
      <Context value={content} disabled />
      <LeftImg url={`url(${photoUrl[1]})`} />
      <RightImg url={`url(${photoUrl[2]})`} />
    </Wrapper>
  );
}

export default Template3;
