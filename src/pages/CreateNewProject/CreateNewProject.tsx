import styled from "styled-components";
import { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import Swal from "sweetalert2";

import { db } from "../../context/firebaseSDK";
import { AuthContext } from "../../context/authContext";
import getUserProjects from "../../utils/getUserProjects";
import templatesImgArr from "../../components/Templates/TemplateImg";
import templatesArr from "../../components/Templates/TemplatesArr";
import SquareOverlay from "../../components/Overlays/squareOverlay";

import closeIcon from "../../icons/close-icon.png";
import closeIconHover from "../../icons/close-icon-hover.png";
import checkedIcon from "../../icons/checked-icon.png";

const Wrapper = styled.div`
  padding-top: 80px;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 80px);
  display: flex;
  position: relative;
  background-color: #787878;
  @media screen and (max-width: 1860px) {
    padding-top: 200px;
  }
`;

const Container = styled.div`
  margin: 50px auto;
  width: 1300px;
  height: 100%;
  min-height: calc(100vh - 260px);
  display: flex;
`;

const EditorContainer = styled.div`
  margin: 0 auto;
  padding: 50px;
  width: 100%;
  height: 100%;
  min-height: 80vh;
  background-color: #f0f0f0;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 20px #3c3c3c;
`;

const Text = styled.div`
  font-size: 24px;
`;

const Input = styled.input`
  margin-bottom: 40px;
  padding: 0 20px;
  width: 1200px;
  height: 60px;
  font-size: 30px;
  font-weight: 700;
  background-color: #ffffff90;
  border: 1px solid #787878;
  border-radius: 10px;
  &:focus {
    outline: none;
    background-color: #ffffff;
  }
`;

const SingleEditorContainer = styled.div`
  position: relative;
  width: 1200px;
  height: 760px;
  & + & {
    margin-top: 80px;
  }
`;

const CloseIcon = styled.div`
  width: 36px;
  height: 36px;
  position: absolute;
  top: -18px;
  right: -15px;
  opacity: 0.8;
  background-image: url(${closeIcon});
  background-size: cover;
  background-position: center;
  &:hover {
    background-image: url(${closeIconHover});
  }
`;

const SelectContainer = styled.div`
  padding: 20px;
  width: 270px;
  height: calc(100vh - 160px);
  display: flex;
  position: fixed;
  left: 0;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 0 -1px 3px black;
  overflow: scroll;
  scrollbar-width: none;
  z-index: 5;
  ::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width: 1860px) {
    padding-top: 100px;
    top: 0;
    width: 100vw;
    height: 200px;
    box-shadow: 1px 0 5px black;
  }
`;

const SelectInnerContainer = styled.div`
  height: 100%;
  @media screen and (max-width: 1860px) {
    margin: 0 auto;
    display: flex;
  }
`;

const SelectImg = styled.div<{ img: string }>`
  margin: 20px auto;
  width: 200px;
  height: 120px;
  background-image: ${(props) => props.img};
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
    box-shadow: 1px 1px 5px gray;
  }
  @media screen and (max-width: 1860px) {
    margin: 0;
    width: 130px;
    height: 80px;
    & + & {
      margin-left: 10px;
    }
  }
`;

const FooterContainer = styled.div`
  margin-top: 40px;
  display: flex;
`;
const Btn = styled.button<{
  backgroundColor?: string;
  backgroundColorHover?: string;
}>`
  padding: 0 20px;
  height: 50px;
  font-size: 22px;
  display: flex;
  align-items: center;
  border: 1px solid #3c3c3c40;
  border-radius: 10px;
  background-color: ${(props) => props.backgroundColor || "#3c3c3c30"};
  &:hover {
    cursor: pointer;
    color: #ffffff;
    background-color: ${(props) => props.backgroundColorHover || "#616161"};
  }
  & + & {
    margin-left: 50px;
  }
`;

const CheckedIcon = styled.div`
  margin-left: 10px;
  width: 25px;
  height: 25px;
  background-image: url(${checkedIcon});
  background-size: cover;
  background-position: center;
  opacity: 0.8;
`;

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

function CreateNewProject() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userId, setUserProjects } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [addedTemplate, setAddedTemplate] = useState<
    { uuid: string; type: number }[]
  >([]);
  const [pages, setPages] = useState<
    {
      type?: number;
      content?: string[];
      url?: string[];
      location?: { lat?: number; lng?: number };
    }[]
  >([]);
  const [position, setPosition] = useState<{ lat?: number; lng?: number }>({});
  const [title, setTitle] = useState("");
  const [mainImgSrc, setMainImgSrc] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const googleMap = templatesArr[8];

  async function confirmAllEdit() {
    if (title === "") {
      Swal.fire({
        text: t("lack_main_title"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      return;
    }
    if (mainImgSrc === "") {
      Swal.fire({
        text: t("lack_main_photo"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      return;
    }
    const checkPage = pages.findIndex((type) => type.type === undefined);

    if (checkPage !== -1) {
      Swal.fire({
        text: t("upload_failed"),
        icon: "warning",
        confirmButtonColor: "#646464",
      });
      return;
    }
    setIsLoading(true);
    const projectId = `${+new Date()}`;
    await setDoc(doc(db, "projects", projectId), {
      uid: userId,
      mainUrl: mainImgSrc,
      projectId,
      title,
      time: new Date(),
      pages,
    });

    const newProjects = await getUserProjects(userId);
    setUserProjects(newProjects);
    setPages([]);
    setAddedTemplate([]);
    setMainImgSrc("");
    Swal.fire({
      text: t("upload_successfully"),
      icon: "success",
      confirmButtonColor: "#646464",
    });
    setIsLoading(false);
    navigate("/profile");
  }

  const templateFilter = addedTemplate?.map((num) => ({
    keyUuid: [num.uuid],
    ChoseTemplate: templatesArr[num.type],
  }));

  useEffect(() => {
    if (position.lat === undefined && position.lng === undefined) return;
    const mapIndex = templateFilter.findIndex(
      (map) => map.ChoseTemplate === googleMap
    );
    if (mapIndex === -1) return;
    const googleMapData = { type: 8, location: position };
    const newPages = [...pages];
    newPages[mapIndex] = googleMapData;
    setPages(newPages);
  }, [position]);

  function deleteHandler(index: number) {
    const removeSelectedTemplate = addedTemplate.filter(
      (data, i) => index !== i
    );
    const removeSelectedPageData = pages.filter((data, i) => index !== i);
    setAddedTemplate(removeSelectedTemplate);
    setPages(removeSelectedPageData);
  }

  if (isLoading) {
    return (
      <Wrapper>
        <Loading type="cylon" color="#3c3c3c" />
      </Wrapper>
    );
  }

  return (
    <>
      <Wrapper>
        <SelectContainer>
          <SelectInnerContainer>
            {templatesImgArr.map((pic, index) => (
              <SelectImg
                key={uuid()}
                img={`url(${pic})`}
                onClick={() => {
                  setAddedTemplate((prev) => [
                    ...prev,
                    { uuid: uuid(), type: index },
                  ]);
                  setPages((prev) => [...prev, {}]);
                }}
              />
            ))}
          </SelectInnerContainer>
        </SelectContainer>
        <Container>
          <EditorContainer>
            {addedTemplate.length === 0 ? (
              <Text>{t("create_new_project")}</Text>
            ) : (
              <>
                <Input
                  placeholder={t("project_title")}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {templateFilter.map(({ keyUuid, ChoseTemplate }, index) => (
                  <SingleEditorContainer key={`${keyUuid}`}>
                    <ChoseTemplate
                      pages={pages}
                      setPages={setPages}
                      currentIndex={index}
                      position={position}
                      setPosition={setPosition}
                    />
                    <CloseIcon onClick={() => deleteHandler(index)} />
                  </SingleEditorContainer>
                ))}
                <FooterContainer>
                  {mainImgSrc === "" ? (
                    <Btn
                      backgroundColor="#f5dfa9"
                      backgroundColorHover="#9d8a62"
                      onClick={() => setShowOverlay((prev) => !prev)}
                    >
                      {t("upload_main_photo")}
                    </Btn>
                  ) : (
                    <>
                      <Btn onClick={() => setShowOverlay((prev) => !prev)}>
                        {t("edit_main_photo")}
                        <CheckedIcon />
                      </Btn>
                      <Btn
                        backgroundColor="#f5dfa9"
                        backgroundColorHover="#9d8a62"
                        onClick={() => confirmAllEdit()}
                      >
                        {t("confirm_edit")}
                      </Btn>
                    </>
                  )}
                </FooterContainer>
              </>
            )}
          </EditorContainer>
        </Container>
      </Wrapper>
      {showOverlay && (
        <SquareOverlay
          setShowOverlay={setShowOverlay}
          mainImgSrc={mainImgSrc}
          setMainImgSrc={setMainImgSrc}
          userId={userId}
        />
      )}
    </>
  );
}

export default CreateNewProject;
