import styled from "styled-components";
import { SingleProjectTemplateProps } from "../tsTypes";

const Wrapper = styled.div`
  padding: 60px 50px;
  width: 1200px;
  height: 760px;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #b4b4b490;
  border-top: 1px solid #949494;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    padding: 42px 35px;
    width: 840px;
    height: 532px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    padding: 30px 25px;
    width: 600px;
    height: 380px;
  }
  @media screen and (max-width: 649px) {
    padding: 15px 12px;
    width: 300px;
    height: 185px;
  }
`;

const Context = styled.textarea`
  padding: 10px;
  width: 450px;
  height: 100%;
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
    width: 315px;
    font-size: 14px;
    line-height: 18px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    padding: 4px;
    width: 225px;
    font-size: 10px;
    line-height: 12px;
  }
  @media screen and (max-width: 649px) {
    padding: 2px;
    width: 112px;
    font-size: 5px;
    line-height: 6px;
  }
`;

const ImgContainer = styled.div`
  margin-left: 40px;
  width: 650px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin-left: 38px;
    width: 455px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    margin-left: 20px;
    width: 325px;
  }
  @media screen and (max-width: 649px) {
    margin-left: 10px;
    width: 162px;
  }
`;

const Img = styled.div<{ url?: string; backgroundColor?: string }>`
  width: 295px;
  height: 100%;
  background-image: ${(props) => props.url};
  background-color: ${(props) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 10px;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 206px;
    border-radius: 6px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    width: 148px;
    border-radius: 4px;
  }
  @media screen and (max-width: 649px) {
    width: 74px;
    border-radius: 2px;
  }
`;

function Template5(props: SingleProjectTemplateProps) {
  const { photoUrl, content } = props;

  return (
    <Wrapper>
      <Context value={content} disabled />
      <ImgContainer>
        <Img url={`url(${photoUrl[0]})`} />
        <Img url={`url(${photoUrl[1]})`} />
      </ImgContainer>
    </Wrapper>
  );
}

export default Template5;
