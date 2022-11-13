import { useContext, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ReactLoading from "react-loading";
import { v4 as uuid } from "uuid";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../context/firebaseSDK";

import { AuthContext } from "../../context/authContext";
import SinglePhotoOverlay from "../../singlePhotoOverlay";

import uploadPhotoIcon from "../../icons/uploadPhoto-icon.png";
import trashIcon from "../../icons/trash-icon.png";
import trashIconHover from "../../icons/trash-icon-hover.png";

interface Prop {
  url?: string;
}

interface FetchedProjectsType {
  uid: string;
  name?: string;
  avatar?: string;
  mainUrl: string;
  projectId: string;
  title: string;
  time: number;
  pages: {
    type: number;
    content?: string[];
    url?: string[];
    location?: { lat?: number; lng?: number };
  }[];
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
  display: flex;
  align-items: center;
`;

const Text = styled.div`
  padding: 50px;
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
`;

const BricksContainer = styled.div`
  margin: 0 auto;
  padding: 50px 0;
  width: 1300px;
  height: 100%;
  position: relative;
  display: grid;
  grid-gap: 20px;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: minmax(4, auto);
`;

const ImgContainer = styled.div`
  position: relative;
`;

const Loading = styled(ReactLoading)`
  margin: 100px;
`;

const Img = styled.div`
  width: 240px;
  height: 240px;
  border: 1px solid #3c3c3c;
  background-image: ${(props: Prop) => props.url};
  background-size: cover;
  background-position: center;
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

function MaterialCollection() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userId, collection } = useContext(AuthContext);
  const [showOverlay, setShowOverlay] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const [isuploading, setIsuploading] = useState(false);
  const [progressing, setProgressing] = useState(100);

  const onUploadImgFiles = (files: File[]) => {
    const newFiles = [...files];
    if (newFiles.length === 0) return;
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
          <Text>Collection</Text>
          <AddFolderIcon
            onChange={(e: any) => {
              onUploadImgFiles(e.target.files);
            }}
          >
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              multiple
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
