import { diffProps } from "@react-three/fiber/dist/declarations/src/core/utils";
import styled from "styled-components";
import language from "./language-icon.png";
import logo from "./Logo.png";

interface Prop {
  img?: string;
}

const Wrapper = styled.div`
  padding: 0 30px;
  width: 100vw;
  height: 80px;
  color: #c4c4c4;
  background-color: #3c3c3c;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const LeftContainer = styled.div`
  display: flex;
`;

const Logo = styled.div`
  width: 155px;
  height: 45px;
  background-image: url(${logo});
`;

const RightContainer = styled.div`
  display: flex;
`;

const Icon = styled.div`
  height: 35px;
  width: 35px;
  background-image: ${(props: Prop) => props.img};
  background-size: cover;
  background-position: cehter;
  & + & {
    margin-left: 20px;
  }
`;

function Header() {
  return (
    <Wrapper>
      <LeftContainer>
        <Logo />
      </LeftContainer>
      <RightContainer>
        <Icon img={`url(${language})`} />
      </RightContainer>
    </Wrapper>
  );
}

export default Header;
