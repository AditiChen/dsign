import { Dispatch, SetStateAction } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";

import closeIcon from "../../icons/close-icon.png";
import closeIconHover from "../../icons/close-icon-hover.png";

const Wrapper = styled.div`
  margin: 0;
  width: 100%;
  height: 100%;
  position: fixed;
  display: flex;
  align-items: center;
  z-index: 100;
`;

const Backdrop = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background-color: #00000030;
  z-index: 101;
`;

const CloseIcon = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  top: -15px;
  right: -15px;
  opacity: 0.8;
  background-image: url(${closeIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    background-image: url(${closeIconHover});
  }
`;

const OverlayModal = styled.div`
  max-width: 1300px;
  max-height: 800px;
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -50%);
  z-index: 102;
  background-color: white;
`;

const Img = styled.img`
  max-width: 1300px;
  max-height: 800px;
`;

const portalElement = document.getElementById("overlays") as HTMLElement;

function SinglePhotoOverlay({
  url,
  setShowOverlay,
}: {
  url: string;
  setShowOverlay: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <>
      {createPortal(
        <Wrapper>
          <Backdrop onClick={() => setShowOverlay((prev) => !prev)} />
          <OverlayModal>
            <CloseIcon onClick={() => setShowOverlay((prev) => !prev)} />
            <Img src={url} />
          </OverlayModal>
        </Wrapper>,
        portalElement
      )}
    </>
  );
}

export default SinglePhotoOverlay;