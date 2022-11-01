import styled from "styled-components";
import template7 from "./template7.png";

const Template = styled.div`
  margin: 20px auto;
  width: 800px;
  height: 500px;
  background-image: url(${template7});
  background-size: cover;
  background-position: center;
`;

function Template7() {
  return (
    <div>
      <h1>template7</h1>
      <Template />
    </div>
  );
}

export default Template7;
