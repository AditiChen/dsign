import styled from "styled-components";

import leftCircle from "./template3_left_circle.png";

interface Prop {
  border?: string;
  url?: string;
  backgroundColor?: string;
  top?: string;
  left?: string;
}

interface InsertProp {
  photoUrl: string[];
  content: string[];
}

const Wrapper = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 760px;
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #b4b4b4;
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

const LeftCircle = styled.div`
  height: 100%;
  width: 425px;
  position: absolute;
  left: 0;
  opacity: 0.8;
  background-image: url(${leftCircle});
  background-size: cover;
  background-position: center;
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
  border: 1px solid #b4b4b4;
  border: none;
  resize: none;
  &::placeholder {
    color: #b4b4b4;
  }
  &:focus {
    outline: none;
  }
`;

const LeftImg = styled.div`
  width: 330px;
  height: 330px;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: absolute;
  top: 70px;
  left: 50px;
  border-radius: 50%;
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
  position: absolute;
  right: 70px;
  bottom: 70px;
  border-radius: 50%;
  box-shadow: 0 0 5px #3c3c3c;
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
