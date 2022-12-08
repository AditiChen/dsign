import styled from "styled-components";

interface InsertProp {
  photoUrl: string[];
}

const Wrapper = styled.div`
  width: 1200px;
  height: 760px;
  position: relative;
  display: flex;
  align-items: center;
  background-color: #b4b4b490;
  border-top: 1px solid #949494;
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

const Img = styled.div<{ url?: string; backgroundColor?: string }>`
  width: 1200px;
  height: 760px;
  background-image: ${(props) => props.url};
  background-color: ${(props) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
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

function Template8(props: InsertProp) {
  const { photoUrl } = props;

  return (
    <Wrapper>
      <Img url={`url(${photoUrl[0]})`} />
    </Wrapper>
  );
}

export default Template8;
