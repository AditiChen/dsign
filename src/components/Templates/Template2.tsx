import styled from "styled-components";
import template2 from "./template2.png";

const Template = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 760px;
  background-image: url(${template2});
  background-size: cover;
  background-position: center;
`;

function Template2() {
  return (
    <div>
      <Template />
    </div>
  );
}

export default Template2;
