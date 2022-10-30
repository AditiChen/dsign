import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
`;

function Landing() {
  return (
    <Wrapper>
      <div>Landing page</div>
    </Wrapper>
  );
}

export default Landing;
