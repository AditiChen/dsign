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
  border-bottom: 1px solid #b4b4b4;
`;

const LeftContainer = styled.div`
  margin: 0 50px;
  padding: 60px 0;
  width: 600px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Context = styled.textarea`
  padding: 10px;
  width: 100%;
  height: 300px;
  color: #3c3c3c;
  font-size: 20px;
  line-height: 24px;
  background-color: transparent;
  border: 1px solid #3c3c3c;
  resize: none;
  border: none;
  &::placeholder {
    color: #646464;
  }
  &:focus {
    outline: none;
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
`;

const RightImg = styled.div`
  width: 500px;
  height: 100%;
  background-image: ${(props: Prop) => props.url};
  background-color: ${(props: Prop) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
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
