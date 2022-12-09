import styled from "styled-components";
import { SingleProjectTemplateProps } from "../tsTypes";

const Wrapper = styled.div`
  width: 1200px;
  height: 760px;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #b4b4b490;
  border-top: 1px solid #949494;
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

const LeftContainer = styled.div`
  margin: 0 50px;
  padding: 60px 0;
  width: 600px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin: 0 35px;
    padding: 42px 0;
    width: 420px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    margin: 0 25px;
    padding: 30px 0;
    width: 300px;
  }
  @media screen and (max-width: 649px) {
    margin: 0 12px;
    padding: 15px 0;
    width: 150px;
  }
`;

const Context = styled.textarea`
  padding: 10px;
  width: 100%;
  height: 300px;
  font-size: 20px;
  line-height: 26px;
  background-color: transparent;
  border: none;
  resize: none;
  &::placeholder {
    color: #646464;
  }
  &:focus {
    outline: none;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    padding: 6px;
    height: 210px;
    font-size: 14px;
    line-height: 18px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    padding: 4px;
    height: 150px;
    font-size: 10px;
    line-height: 12px;
  }
  @media screen and (max-width: 649px) {
    padding: 2px;
    height: 75px;
    font-size: 5px;
    line-height: 6px;
  }
`;

const LeftImg = styled.div<{ url?: string; backgroundColor?: string }>`
  width: 100%;
  height: 300px;
  background-image: ${(props) => props.url};
  background-color: ${(props) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 10px;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    height: 210px;
    border-radius: 6px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    height: 150px;
    border-radius: 4px;
  }
  @media screen and (max-width: 649px) {
    height: 75px;
    border-radius: 2px;
  }
`;

const RightImg = styled.div<{ url?: string; backgroundColor?: string }>`
  width: 500px;
  height: 100%;
  background-image: ${(props) => props.url};
  background-color: ${(props) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 350px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    width: 250px;
  }
  @media screen and (max-width: 649px) {
    width: 125px;
  }
`;

function Template3(props: SingleProjectTemplateProps) {
  const { photoUrl, content } = props;

  return (
    <Wrapper>
      <LeftContainer>
        <Context value={content} disabled />
        <LeftImg url={`url(${photoUrl[0]})`} />
      </LeftContainer>
      <RightImg url={`url(${photoUrl[1]})`} />
    </Wrapper>
  );
}

export default Template3;
