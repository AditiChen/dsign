import styled from "styled-components";
import template0 from "./template0.png";
import eiffel from "../EiffelTower.jpeg";
import paris from "../Paris.jpeg";

const Wrapper = styled.div`
  margin: 20px auto;
  width: 1200px;
  height: 760px;
  position: relative;
  display: flex;
  align-items: center;
`;

const BackgroundImg = styled.div`
  width: 1200px;
  height: 760px;
  background-image: url(${eiffel});
  background-size: cover;
  background-position: center;
  opacity: 0.7;
`;

const MiddleContainer = styled.div`
  padding: 100px 80px 50px 30px;
  width: 450px;
  height: 100%;
  position: absolute;
  left: 300px;
  background-color: #7c8fab;
  opacity: 0.9;
  color: #ffffff;
  font-size: 24px;
  line-height: 30px;
`;

const RightPhoto = styled.div`
  height: 85%;
  width: 450px;
  background-image: url(${paris});
  background-size: cover;
  background-position: center;
  position: absolute;
  right: 50px;
  z-index: 1;
  box-shadow: 0 0 5px #3c3c3c;
`;

function Template0() {
  return (
    <div>
      <Wrapper>
        <BackgroundImg />
        <MiddleContainer>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Expedita
          consequuntur quibusdam vero illum aliquid voluptatum sunt? Sapiente
          magni ipsa, quam non, iusto et nisi maiores unde fugiat cum
          perspiciatis iste? Lorem, ipsum dolor sit amet consectetur adipisicing
          elit. Expedita consequuntur quibusdam vero illum aliquid voluptatum
          sunt? Sapiente magni ipsa, quam non, iusto et nisi maiores unde fugiat
          cum perspiciatis iste?
        </MiddleContainer>
        <RightPhoto />
      </Wrapper>
    </div>
  );
}

export default Template0;
