import styled from "styled-components";
import template3 from "./template3.png";

const Template = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 760px;
  background-image: url(${template3});
  background-size: cover;
  background-position: center;
`;

function Template3() {
  return (
    <div>
      <Template />
    </div>
  );
}

export default Template3;
