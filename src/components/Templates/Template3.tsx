import styled from "styled-components";
import template3 from "./template3.png";

const Template = styled.div`
  margin: 20px auto;
  width: 800px;
  height: 500px;
  background-image: url(${template3});
  background-size: cover;
  background-position: center;
`;

function Template3() {
  return (
    <div>
      <h1>template3</h1>
      <Template />
    </div>
  );
}

export default Template3;
