import styled from "styled-components";

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
  flex-direction: column;
  align-items: center;
  background-color: #616161;
  border-bottom: 1px solid #b4b4b4;
`;

const HeaderContainer = styled.div`
  padding: 20px;
  width: 100%;
  height: 220px;
  display: flex;
  align-items: center;
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

const ImgContainer = styled.div`
  width: 1200px;
  height: 540px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const AsideImg = styled.div`
  width: 430px;
  height: 100%;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
`;

const MiddleImgContainer = styled.div`
  width: 320px;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const MiddleImg = styled.div`
  width: 320px;
  height: 265px;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
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
