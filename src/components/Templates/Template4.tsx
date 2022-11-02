import styled from "styled-components";
import template4 from "./template4.png";

const Template = styled.div`
  margin: 20px auto;
  width: 800px;
  height: 500px;
  background-image: url(${template4});
  background-size: cover;
  background-position: center;
`;

function Template4() {
  return (
    <div>
      <h1>template4</h1>
      <Template />
    </div>
  );
}

export default Template4;
