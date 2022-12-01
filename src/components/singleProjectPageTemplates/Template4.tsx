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
  @media screen and (min-width: 650px) and (max-width: 949px) {
    width: 165px;
    height: 150px;
    border-radius: 4px;
  }
  @media screen and (max-width: 649px) {
    width: 82px;
    height: 75px;
    border-radius: 2px;
  }
`;

const Context = styled.textarea`
  margin: 0 30px;
  padding: 10px;
  width: 100%;
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
    margin: 0 21px;
    padding: 6px;
    font-size: 14px;
    line-height: 18px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    margin: 0 15px;
    padding: 4px;
    font-size: 10px;
    line-height: 12px;
  }
  @media screen and (max-width: 649px) {
    margin: 0 7px;
    padding: 2px;
    font-size: 5px;
    line-height: 6px;
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
