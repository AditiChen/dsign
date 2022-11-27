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
  align-items: center;
  border-bottom: 1px solid #b4b4b4;
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
  opacity: 0.7;
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

const MiddleContainer = styled.div`
  padding: 95px 80px 55px 30px;
  width: 450px;
  height: 100%;
  position: absolute;
  left: 300px;
  background-color: #616161;
  opacity: 0.9;
  box-shadow: 1px 0 3px #616161, -1px 0 3px #616161;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    padding: 65px 56px 40px 21px;
    width: 315px;
    left: 210px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    padding: 47px 40px 22px 15px;
    width: 225px;
    left: 150px;
  }
  @media screen and (max-width: 649px) {
    padding: 24px 20px 14px 7px;
    width: 112px;
    left: 75px;
  }
`;

const Context = styled.textarea`
  padding: 10px;
  width: 100%;
  height: 100%;
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
    font-size: 14px;
    line-height: 17px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    padding: 4px;
    font-size: 10px;
    line-height: 12px;
  }
  @media screen and (max-width: 649px) {
    padding: 2px;
    font-size: 5px;
    line-height: 6px;
  }
`;

const RightImg = styled.div`
  width: 450px;
  height: 645px;
  background-image: ${(props: Prop) => props.url};
  background-size: cover;
  background-position: center;
  position: absolute;
  right: 50px;
  z-index: 1;
  box-shadow: 0 0 5px #3c3c3c;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 315px;
    height: 452px;
    right: 35px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    width: 225px;
    height: 322px;
    right: 25px;
  }
  @media screen and (max-width: 649px) {
    width: 112px;
    height: 141px;
    right: 12px;
  }
`;

function Template0(props: InsertProp) {
  const { photoUrl, content } = props;

  return (
    <Wrapper>
      <BackgroundImg url={`url(${photoUrl[0]})`} />
      <MiddleContainer>
        <Context value={content} disabled />
      </MiddleContainer>
      <RightImg url={`url(${photoUrl[1]})`} />
    </Wrapper>
  );
}

export default Template0;
