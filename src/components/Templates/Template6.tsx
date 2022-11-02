import styled from "styled-components";
import template6 from "./template6.png";

const Template = styled.div`
  margin: 20px auto;
  width: 800px;
  height: 500px;
  background-image: url(${template6});
  background-size: cover;
  background-position: center;
`;

function Template6() {
  return (
    <div>
      <h1>template6</h1>
      <Template />
    </div>
  );
}

export default Template6;
