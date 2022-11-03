import { useState, Dispatch, SetStateAction } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import ReactCrop from "react-image-crop";

// import ImageCropper from "./utils/crop";

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
  background-color: #00000030;
  z-index: 801;
`;

const OverlayModal = styled.div`
  padding: 50px;
  width: 80vw;
  max-width: 1300px;
  height: 80vh;
  max-height: 800px;
  position: absolute;
  left: 50%;
  top: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -50%);
  z-index: 802;
  background-color: white;
`;

const ImgContainer = styled.div`
  width: 80%;
  height: 80%;
`;

const ImgView = styled.img`
  width: 100%;
  height: 100%;
`;

const UploadPic = styled.label`
  padding: 10px;
  width: 150px;
  line-height: 50px;
  font-size: 20px;
  color: #3c3c3c;
  text-align: center;
  border: 1px solid #3c3c3c;
  background-color: #3c3c3c30;
`;

const Btn = styled.button`
  width: 150px;
  height: 50px;
  font-size: 20px;
  border: 1px solid #3c3c3c;
  background-color: #3c3c3c30;
`;

const portalElement = document.getElementById("overlays") as HTMLElement;

function Overlay({ setShowOverlay }: OverlayProps) {
  // const [imageToCrop, setImageToCrop] = useState<string | ArrayBuffer | null>(
  //   ""
  // );
  // const [croppedImage, setCroppedImage] = useState(undefined);
  const [imgSrc, setImgSrc] = useState<string | ArrayBuffer | null>("");
  // const [image, setImage] = useState(undefined);
  const [crop, setCrop] = useState({
    unit: "px",
    width: 30,
    aspect: 4 / 6,
  });

  const onUploadFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      const viewImg = e.target.files[0];
      reader.readAsDataURL(viewImg);
      reader.onloadend = () => {
        setImgSrc(reader.result);
      };
      // reader.addEventListener("load", () => {
      //   const image = reader.result || "";
      //   setImageToCrop(image);
      // });
      // console.log(e.target.files[0]);
      // reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <>
      {createPortal(
        <Wrapper>
          <Backdrop onClick={() => setShowOverlay((prev) => !prev)} />
          <OverlayModal>
            <ImgContainer>
              {imgSrc ? (
                <ImgView src={imgSrc} alt="preview" />
              ) : (
                <form>
                  <UploadPic
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onUploadFile(e)
                    }
                  >
                    Choose the image
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </UploadPic>
                </form>
              )}

              <ReactCrop
                src={imgSrc}
                crop={crop}
                // onImageLoaded={() => setImage(image)}
                // onChange={() => setCrop(crop)}
                // onComplete={imageCropComplete}
              />
              {/* <ImageCropper
                imageToCrop={imageToCrop}
                onImageCropped={(croppedImg: any) =>
                  setCroppedImage(croppedImg)
                }
              /> */}

              {/* {croppedImage && (
                <div>
                  <h2>Cropped Image</h2>
                  <img alt="Cropped Img" src={croppedImage} />
                </div>
              )} */}
            </ImgContainer>
            {imgSrc ? (
              <>
                <form>
                  <UploadPic
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      onUploadFile(e)
                    }
                  >
                    Change the image
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                    />
                  </UploadPic>
                </form>
                <Btn>crop photo</Btn>
              </>
            ) : (
              ""
            )}
          </OverlayModal>
        </Wrapper>,
        portalElement
      )}
    </>
  );
}

export default Overlay;
