import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
`;

const Button = styled.button`
  width: 100px;
  height: 40px;
`;

function Landing() {
  const navigate = useNavigate();
  return (
    <Wrapper>
      <div>Landing page</div>
      <Button onClick={() => navigate("/portfolioBricks")}>Entry</Button>
    </Wrapper>
  );
}

export default Landing;
