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
`;

const Img = styled.div<{ url?: string; backgroundColor?: string }>`
  width: 1200px;
  height: 760px;
  background-image: ${(props) => props.url};
  background-color: ${(props) => props.backgroundColor};
  background-size: cover;
  background-position: center;
  position: relative;
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
