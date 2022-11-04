import styled from "styled-components";
import template7 from "./template7.png";

const Template = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 760px;
  background-image: url(${template7});
  background-size: cover;
  background-position: center;
`;

function Template7() {
  return (
    <div>
      <Template />
    </div>
  );
}

export default Template7;
