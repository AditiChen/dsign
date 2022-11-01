import styled from "styled-components";
import template2 from "./template2.png";

const Template = styled.div`
  margin: 20px auto;
  width: 800px;
  height: 500px;
  background-image: url(${template2});
  background-size: cover;
  background-position: center;
`;

function Template2() {
  return (
    <div>
      <h1>template2</h1>
      <Template />
    </div>
  );
}

export default Template2;
