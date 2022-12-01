import { useContext, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import ReactLoading from "react-loading";
import { v4 as uuid } from "uuid";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import Swal from "sweetalert2";
import imageCompression from "browser-image-compression";

import { db } from "../../context/firebaseSDK";
import { AuthContext } from "../../context/authContext";
import SinglePhotoOverlay from "../../components/Overlays/singlePhotoOverlay";
import upLoadImgToCloudStorage from "../../utils/upLoadImgToCloudStorage";

import uploadPhotoIcon from "../../icons/uploadPhoto-icon.png";
import uploadPhotoIconHover from "../../icons/uploadPhoto-icon-hover.png";
import trashIcon from "../../icons/trash-icon.png";
import trashIconHover from "../../icons/trash-icon-hover.png";

interface Prop {
  url?: string;
}

const Wrapper = styled.div`
  width: 100%;
  min-width: 100vw;
  height: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  margin: 0 auto;
  height: 100px;
  display: flex;
  align-items: center;
  @media screen and (min-width: 800px) and (max-width: 1024px) {
    height: 70px;
  }
  @media screen and (max-width: 799px) {
    height: 50px;
  }
`;

const Title = styled.div`
  padding: 0 50px;
  font-size: 24px;
  text-align: center;
  @media screen and (min-width: 800px) and (max-width: 1024px) {
    font-size: 20px;
  }
  @media screen and (max-width: 799px) {
    padding: 4px 30px 0 30px;
    font-size: 16px;
  }
`;

const AddFolderIcon = styled.label`
  width: 32px;
  height: 32px;
  background-color: transparent;
  border: none;
  background-image: url(${uploadPhotoIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
    background-image: url(${uploadPhotoIconHover});
  }
  @media screen and (max-width: 799px) {
    width: 24px;
    height: 24px;
  }
`;

const ContentContainer = styled.div`
  display: flex;
`;

const Content = styled.div`
  width: 100%;
  padding: 0 50px;
  font-size: 18px;
  text-align: center;
  @media screen and (min-width: 800px) and (max-width: 1024px) {
    font-size: 14px;
  }
  @media screen and (max-width: 799px) {
    font-size: 12px;
  }
`;

const BricksContainer = styled.div`
  margin: 0 auto;
  padding-bottom: 50px;
  width: 1390px;
  height: 100%;
  position: relative;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
  @media screen and (min-width: 1400px) and (max-width: 1699px) {
    width: 1190px;
  }
  @media screen and (min-width: 1100px) and (max-width: 1399px) {
    width: 990px;
  }
  @media screen and (min-width: 800px) and (max-width: 1099px) {
    width: 590px;
  }
  @media screen and (max-width: 799px) {
    grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
    grid-gap: 6px;
    width: 570px;
  }
  @media screen and (max-width: 629px) {
    width: 420px;
  }
  @media screen and (max-width: 470px) {
    width: 280px;
  }
`;

const Img = styled.div`
  width: 180px;
  height: 180px;
  background-image: ${(props: Prop) => props.url};
  background-size: cover;
  background-position: center;
  @media screen and (max-width: 799px) {
    width: 130px;
    height: 130px;
  }
`;

const ImgContainer = styled.div`
  margin: 5px auto;
  width: 180px;
  height: 180px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 5px #616161;
  &:hover {
    margin: 0;
    width: 190px;
    height: 190px;
    box-shadow: 0 0 10px #3c3c3c;
  }
  &:hover > ${Img} {
    width: 190px;
    height: 190px;
  }
  @media screen and (max-width: 799px) {
    margin: 3px auto;
    width: 130px;
    height: 130px;
    &:hover {
      width: 130px;
      height: 130px;
    }
    &:hover > ${Img} {
      width: 130px;
      height: 130px;
    }
  }
`;

const TrashIcon = styled.div`
  width: 26px;
  height: 26px;
  position: absolute;
  bottom: 5px;
  right: 5px;
  opacity: 0.8;
  background-image: url(${trashIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    background-image: url(${trashIconHover});
  }
  @media screen and (max-width: 799px) {
    width: 20px;
    height: 20px;
  }
`;

const Loading = styled(ReactLoading)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

function MaterialCollection() {
  const { t } = useTranslation();
  const { userId, collection } = useContext(AuthContext);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [progressing, setProgressing] = useState(false);

  const onUploadImgFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const newFiles = Array.from(e.target.files);
    newFiles.forEach(async (file: File) => {
      setProgressing(true);
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1,
      });
      const urlByUuid = `${uuid()}`;
      const downloadUrl = (await upLoadImgToCloudStorage(
        compressedFile,
        userId,
        urlByUuid
      )) as string;
      setProgressing(false);
      await updateDoc(doc(db, "users", userId), {
        collection: arrayUnion(downloadUrl),
      });
    });
  };

  async function deleteHandler(url: string) {
    const ans = await Swal.fire({
      text: t("delete_photo_warning"),
      icon: "warning",
      confirmButtonColor: "#646464",
      confirmButtonText: t("reject_no_answer"),
      showDenyButton: true,
      denyButtonText: t("reject_yes_answer"),
    });
    if (ans.isConfirmed === true) return;

    await updateDoc(doc(db, "users", userId), {
      collection: arrayRemove(url),
    });
  }

  return (
    <>
      <Wrapper>
        <HeaderContainer>
          <Title>{t("your_collection")}</Title>
          <AddFolderIcon>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              multiple
              onChange={(e) => onUploadImgFiles(e)}
            />
          </AddFolderIcon>
        </HeaderContainer>
        {collection.length === 0 && (
          <ContentContainer>
            <Content>{t("empty_collection")}</Content>
          </ContentContainer>
        )}
        <BricksContainer>
          {collection.length !== 0 &&
            collection.map((url) => (
              <ImgContainer key={url}>
                <Img
                  url={`url(${url})`}
                  onClick={() => {
                    setCurrentUrl(url);
                    setShowOverlay(true);
                  }}
                />
                <TrashIcon onClick={() => deleteHandler(url)} />
              </ImgContainer>
            ))}
          {progressing && (
            <ImgContainer>
              <Loading type="spin" color="#3c3c3c" height="40px" width="40px" />
            </ImgContainer>
          )}
        </BricksContainer>
      </Wrapper>
      {showOverlay && (
        <SinglePhotoOverlay setShowOverlay={setShowOverlay} url={currentUrl} />
      )}
    </>
  );
}

export default MaterialCollection;
