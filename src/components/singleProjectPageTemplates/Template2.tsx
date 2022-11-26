import styled from "styled-components";

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
  flex-direction: column;
  align-items: center;
  background-color: #696969;
  border-bottom: 1px solid #b4b4b4;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 840px;
    height: 532px;
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
`;

const Context = styled.textarea`
  margin-left: auto;
  padding: 10px;
  height: 180px;
  width: 410px;
  color: #ffffff;
  font-size: 20px;
  line-height: 24px;
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
    height: 126px;
    width: 287px;
    font-size: 14px;
    line-height: 17px;
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
`;

const AsideImg = styled.div`
  width: 430px;
  height: 100%;
  position: relative;
  background-image: ${(props: Prop) => props.url};
  background-size: cover;
  background-position: center;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 300px;
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
`;

const MiddleImg = styled.div`
  width: 320px;
  height: 265px;
  position: relative;
  background-image: ${(props: Prop) => props.url};
  background-size: cover;
  background-position: center;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 224px;
    height: 185px;
  }
`;

function Template2(props: InsertProp) {
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
