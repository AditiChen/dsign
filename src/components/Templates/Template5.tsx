import styled from "styled-components";
import template5 from "./template5.png";

const Template = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 760px;
  background-image: url(${template5});
  background-size: cover;
  background-position: center;
`;

function Template5() {
  return (
    <div>
      <Template />
    </div>
  );
}

export default Template5;
