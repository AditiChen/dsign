import styled from "styled-components";
import template1 from "./template0.png";

const Template = styled.div`
  margin: 20px auto;
  width: 800px;
  height: 500px;
  background-image: url(${template1});
  background-size: cover;
  background-position: center;
`;

function Template1() {
  return (
    <div>
      <h1>template1</h1>
      <Template />
    </div>
  );
}

export default Template1;
