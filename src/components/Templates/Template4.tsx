import styled from "styled-components";
import template4 from "./template4.png";

const Template = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 760px;
  background-image: url(${template4});
  background-size: cover;
  background-position: center;
`;

function Template4() {
  return (
    <div>
      <Template />
    </div>
  );
}

export default Template4;
