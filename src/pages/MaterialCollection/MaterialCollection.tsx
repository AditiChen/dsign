import { useContext, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import ReactLoading from "react-loading";
import { v4 as uuid } from "uuid";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import imageCompression from "browser-image-compression";

import { db, storage } from "../../context/firebaseSDK";
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
  min-height: calc(100vh - 140px);
  position: relative;
  display: flex;
  flex-direction: column;
  @media screen and (min-width: 800px) and (max-width: 1024px) {
    min-height: calc(100vh - 120px);
  }
  @media screen and (max-width: 799px) {
    min-height: calc(100vh - 90px);
  }
`;

const HeaderContainer = styled.div`
  margin: 0 auto;
  height: 120px;
  display: flex;
  align-items: center;
  @media screen and (min-width: 800px) and (max-width: 1024px) {
    height: 80px;
  }
  @media screen and (max-width: 799px) {
    height: 50px;
  }
`;

const Title = styled.div`
  padding: 0 50px;
  font-size: 30px;
  text-align: center;
  @media screen and (min-width: 800px) and (max-width: 1024px) {
    font-size: 24px;
  }
  @media screen and (max-width: 799px) {
    padding: 0 30px;
    font-size: 20px;
  }
`;

const AddFolderIcon = styled.label`
  width: 40px;
  height: 40px;
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
    width: 30px;
    height: 30px;
  }
`;

const ContentContainer = styled.div`
  display: flex;
`;

const Content = styled.div`
  width: 100%;
  padding: 0 50px;
  font-size: 24px;
  text-align: center;
`;

const BricksContainer = styled.div`
  margin: 0 auto;
  padding-bottom: 50px;
  width: 1560px;
  height: 100%;
  position: relative;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  @media screen and (min-width: 1400px) and (max-width: 1699px) {
    width: 1300px;
  }
  @media screen and (min-width: 1100px) and (max-width: 1399px) {
    width: 1050px;
  }
  @media screen and (min-width: 820px) and (max-width: 1099px) {
    width: 780px;
  }
  @media screen and (min-width: 570px) and (max-width: 819px) {
    width: 520px;
  }
  @media screen and (max-width: 569px) {
    width: 300px;
  }
`;

const Img = styled.div`
  width: 240px;
  height: 240px;
  background-image: ${(props: Prop) => props.url};
  background-size: cover;
  background-position: center;
`;

const ImgContainer = styled.div`
  margin: 5px auto;
  width: 240px;
  height: 240px;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 5px #616161;
  &:hover {
    margin: 0;
    width: 250px;
    height: 250px;
    box-shadow: 0 0 10px #3c3c3c;
  }
  &:hover > ${Img} {
    width: 250px;
    height: 250px;
  }
  @media screen and (max-width: 799px) {
    margin: 5px auto;
    width: 240px;
    height: 240px;
    &:hover {
      width: 240px;
      height: 240px;
    }
    &:hover > ${Img} {
      width: 240px;
      height: 240px;
    }
  }
`;

const TrashIcon = styled.div`
  width: 30px;
  height: 30px;
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
    width: 24px;
    height: 24px;
  }
`;

const Loading = styled(ReactLoading)`
  margin: 100px;
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
      await updateDoc(doc(db, "users", userId), {
        collection: arrayUnion(downloadUrl),
      });
      setProgressing(false);
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
