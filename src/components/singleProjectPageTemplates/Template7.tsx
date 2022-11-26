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
  padding: 80px 50px;
  width: 1200px;
  height: 760px;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #b4b4b490;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    padding: 56px 35px;
    width: 840px;
    height: 532px;
  }
`;

const LeftContainer = styled.div`
  margin-right: 50px;
  padding-top: 50px;
  width: 450px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin-right: 35px;
    padding-top: 35px;
    width: 315px;
  }
`;

const Context = styled.textarea`
  padding: 10px;
  width: 100%;
  height: 320px;
  font-size: 20px;
  line-height: 24px;
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
    height: 224px;
    font-size: 14px;
    line-height: 17px;
  }
`;

const LeftImgContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const LeftImg = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 140px;
    height: 140px;
  }
`;

const RightImg = styled.div`
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 420px;
    height: 420px;
  }
`;

function Template7(props: InsertProp) {
  const { photoUrl, content } = props;

  return (
    <Wrapper>
      <LeftContainer>
        <Context value={content} disabled />
        <LeftImgContainer>
          <LeftImg url={`url(${photoUrl[0]})`} />
          <LeftImg url={`url(${photoUrl[1]})`} />
        </LeftImgContainer>
      </LeftContainer>
      <RightImg url={`url(${photoUrl[2]})`} />
    </Wrapper>
  );
}

export default Template7;
