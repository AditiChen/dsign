import styled from "styled-components";
import { SingleProjectTemplateProps } from "../tsTypes";

const Wrapper = styled.div`
  width: 1200px;
  height: 760px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #696969;
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

const HeaderContainer = styled.div`
  padding: 20px;
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    padding: 14px;
    height: 154px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    padding: 10px;
    height: 110px;
  }
  @media screen and (max-width: 649px) {
    padding: 5px;
    height: 55px;
  }
`;

const Context = styled.textarea`
  margin-left: auto;
  padding: 10px;
  width: 410px;
  height: 180px;
  color: #ffffff;
  font-size: 20px;
  line-height: 26px;
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
    width: 287px;
    height: 126px;
    font-size: 14px;
    line-height: 18px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    padding: 4px;
    width: 205px;
    height: 90px;
    font-size: 10px;
    line-height: 12px;
  }
  @media screen and (max-width: 649px) {
    padding: 2px;
    width: 102px;
    height: 45px;
    font-size: 5px;
    line-height: 6px;
  }
`;

const ImgContainer = styled.div`
  width: 1200px;
  height: 540px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 840px;
    height: 378px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    width: 600px;
    height: 270px;
  }
  @media screen and (max-width: 649px) {
    width: 300px;
    height: 135px;
  }
`;

const AsideImg = styled.div<{ url?: string }>`
  width: 430px;
  height: 100%;
  position: relative;
  background-image: ${(props) => props.url};
  background-size: cover;
  background-position: center;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 300px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    width: 215px;
  }
  @media screen and (max-width: 649px) {
    width: 107px;
  }
`;

const MiddleImgContainer = styled.div`
  width: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 224px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    width: 160px;
  }
  @media screen and (max-width: 649px) {
    width: 80px;
  }
`;

const MiddleImg = styled.div<{ url?: string }>`
  width: 320px;
  height: 265px;
  position: relative;
  background-image: ${(props) => props.url};
  background-size: cover;
  background-position: center;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 224px;
    height: 185px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    width: 160px;
    height: 132px;
  }
  @media screen and (max-width: 649px) {
    width: 80px;
    height: 66px;
  }
`;

function Template2(props: SingleProjectTemplateProps) {
  const { photoUrl, content } = props;

  return (
    <Wrapper>
      <HeaderContainer>
        <Context value={content} disabled />
      </HeaderContainer>
      <ImgContainer>
        <AsideImg url={`url(${photoUrl[0]})`} />
        <MiddleImgContainer>
          <MiddleImg url={`url(${photoUrl[1]})`} />
          <MiddleImg url={`url(${photoUrl[2]})`} />
        </MiddleImgContainer>
        <AsideImg url={`url(${photoUrl[3]})`} />
      </ImgContainer>
    </Wrapper>
  );
}

export default Template2;
