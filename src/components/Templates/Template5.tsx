import styled from "styled-components";
import template5 from "./template5.png";

const Template = styled.div`
  margin: 20px auto;
  width: 800px;
  height: 500px;
  background-image: url(${template5});
  background-size: cover;
  background-position: center;
`;

function Template5() {
  return (
    <div>
      <h1>template5</h1>
      <Template />
    </div>
  );
}

export default Template5;
