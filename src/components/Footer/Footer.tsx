import styled from "styled-components";

const Wrapper = styled.div`
  width: 100vw;
  height: 50px;
  color: #c4c4c4;
  background-color: #3c3c3c;
  @media screen and (max-width: 799px) {
    height: 40px;
  }
`;

function Footer() {
  return <Wrapper />;
}

export default Footer;
