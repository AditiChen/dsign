import { useState, Dispatch, SetStateAction } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

interface OverlayProps {
  setShowOverlay: Dispatch<SetStateAction<boolean>>;
}

const Wrapper = styled.div`
  margin: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  align-items: center;
  z-index: 800;
`;

const Backdrop = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 801;
`;

const OverlayModal = styled.div`
  padding: 50px;
  width: 80vw;
  max-width: 1300px;
  height: 80vh;
  max-height: 800px;
  display: flex;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  z-index: 802;
  background-color: white;
`;

const ImgContainer = styled.div`
  width: 80%;
  height: 80%;
`;

const;

const Btn = styled.button`
  width: 150px;
  height: 50px;
  font-size: 20px;
`;

const portalElement = document.getElementById("overlays") as HTMLElement;

function Overlay({ setShowOverlay }: OverlayProps) {
  // const [inputText, setInputText] = useState("");

  return (
    <>
      {createPortal(
        <Wrapper>
          <Backdrop onClick={() => setShowOverlay((prev) => !prev)} />
          <OverlayModal>
            <ImgContainer>
              <div>img</div>
            </ImgContainer>
            <Btn>upload photo</Btn>
            <Btn>crop photo</Btn>
          </OverlayModal>
        </Wrapper>,
        portalElement
      )}
    </>
  );
}

export default Overlay;
