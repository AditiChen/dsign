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
  padding: 60px 50px;
  width: 1200px;
  height: 760px;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #b4b4b490;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    padding: 42px 35px;
    width: 840px;
    height: 532px;
  }
`;

const ImgContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Img = styled.div`
  width: 330px;
  height: 300px;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
  border-radius: 10px;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 230px;
    height: 210px;
    border-radius: 6px;
  }
`;

const Context = styled.textarea`
  margin: 0 30px;
  padding: 10px;
  width: 100%;
  height: 100%;
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
    margin: 0 21px;
    padding: 6px;
    font-size: 14px;
    line-height: 17px;
  }
`;

function Template4(props: InsertProp) {
  const { photoUrl, content } = props;

  return (
    <Wrapper>
      <ImgContainer>
        <Img url={`url(${photoUrl[0]})`} />
        <Img url={`url(${photoUrl[1]})`} />
      </ImgContainer>
      <Context value={content} disabled />
      <ImgContainer>
        <Img url={`url(${photoUrl[2]})`} />
        <Img url={`url(${photoUrl[3]})`} />
      </ImgContainer>
    </Wrapper>
  );
}

export default Template4;
