import { useContext, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import ReactLoading from "react-loading";
import { v4 as uuid } from "uuid";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../context/firebaseSDK";

import { AuthContext } from "../../context/authContext";
import SinglePhotoOverlay from "../../components/Overlays/singlePhotoOverlay";

import uploadPhotoIcon from "../../icons/uploadPhoto-icon.png";
import uploadPhotoIconHover from "../../icons/uploadPhoto-icon-hover.png";
import trashIcon from "../../icons/trash-icon.png";
import trashIconHover from "../../icons/trash-icon-hover.png";

interface Prop {
  url?: string;
}

const Wrapper = styled.div`
  padding-top: 80px;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 80px);
  position: relative;
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  margin: 0 auto;
  height: 120px;
  display: flex;
  align-items: center;
`;

const Text = styled.div`
  padding: 0 50px;
  font-size: 30px;
  text-align: center;
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
`;

const Loading = styled(ReactLoading)`
  margin: 100px;
`;

function MaterialCollection() {
  const { t } = useTranslation();
  const { userId, collection } = useContext(AuthContext);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [progressing, setProgressing] = useState(100);

  const onUploadImgFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files === null) return;
    const newFiles = Array.from(e.target.files);
    newFiles.forEach((file: File) => {
      const urlByUuid = `${uuid()}`;
      const imgRef = ref(storage, `images/${userId}/${urlByUuid}`);
      const uploadTask = uploadBytesResumable(imgRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgressing(progress);
        },
        (error) => {},
        async () => {
          const downloadURL = await getDownloadURL(
            ref(storage, `images/${userId}/${urlByUuid}`)
          );
          await updateDoc(doc(db, "users", userId), {
            collection: arrayUnion(downloadURL),
          });
        }
      );
    });
  };

  async function deleteHandler(url: string) {
    const ans = window.confirm(t("delete_photo_warning"));
    if (ans === false) return;
    await updateDoc(doc(db, "users", userId), {
      collection: arrayRemove(url),
    });
  }

  return (
    <>
      <Wrapper>
        <HeaderContainer>
          <Text>{t("your_collection")}</Text>
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
          {progressing === 100 ? (
            ""
          ) : (
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
