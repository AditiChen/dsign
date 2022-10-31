import styled from "styled-components";

const Wrapper = styled.div`
  padding: 0 30px;
  width: 100vw;
  height: 80px;
  color: #c4c4c4;
  background-color: #3c3c3c;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

function Footer() {
  return (
    <Wrapper>
      <div>footer</div>
    </Wrapper>
  );
}

export default Footer;
