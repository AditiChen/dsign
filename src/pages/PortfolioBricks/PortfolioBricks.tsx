import styled from "styled-components";

const Wrapper = styled.div`
  padding-top: 80px;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 160px);
  position: relative;
  display: flex;
`;

function PortfolioBricks() {
  return (
    <Wrapper>
      <div>Portfolio bricks</div>
    </Wrapper>
  );
}

export default PortfolioBricks;
