import styled from "styled-components";
import template6 from "./template6.png";

const Template = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 760px;
  background-image: url(${template6});
  background-size: cover;
  background-position: center;
`;

function Template6() {
  return (
    <div>
      <Template />
    </div>
  );
}

export default Template6;
