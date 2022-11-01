import styled from "styled-components";
import template0 from "./template0.png";

const Template = styled.div`
  margin: 20px auto;
  width: 800px;
  height: 500px;
  background-image: url(${template0});
  background-size: cover;
  background-position: center;
`;

function Template0() {
  return (
    <div>
      <h1>template0</h1>
      <Template />
    </div>
  );
}

export default Template0;
