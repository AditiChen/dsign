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
  width: 1200px;
  height: 760px;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #b4b4b490;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 840px;
    height: 532px;
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
`;

const Context = styled.textarea`
  padding: 10px;
  width: 100%;
  height: 300px;
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
    height: 210px;
    font-size: 14px;
    line-height: 17px;
  }
`;

const LeftImg = styled.div`
  width: 100%;
  height: 300px;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 10px;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    height: 210px;
    border-radius: 6px;
  }
`;

const RightImg = styled.div`
  width: 500px;
  height: 100%;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 350px;
  }
`;

function Template3(props: InsertProp) {
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
