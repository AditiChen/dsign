import styled from "styled-components";
import { useEffect, useState, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import Swal from "sweetalert2";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

import { db } from "../../context/firebaseSDK";
import { AuthContext } from "../../context/authContext";
import getUserProjects from "../../utils/getUserProjects";
import templatesImgArr from "../../components/Templates/TemplateImg";
import templatesArr from "../../components/Templates/TemplatesArr";
import SquareOverlay from "../../components/Overlays/squareOverlay";
import templateData from "../../components/Templates/TemplatesData.json";

import closeIcon from "../../icons/close-icon.png";
import closeIconHover from "../../icons/close-icon-hover.png";
import checkedIcon from "../../icons/checked-icon.png";
import uploadPhotoIcon from "../../icons/uploadPhoto-icon.png";

const Wrapper = styled.div`
  padding-top: 95px;
  width: 100%;
  height: 100%;
  min-height: calc(100vh - 110px);
  display: flex;
  position: relative;
  background-color: #787878;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    padding-top: 90px;
  }
  @media screen and (min-width: 800px) and (max-width: 949px) {
    min-height: calc(100vh - 100px);
  }
  @media screen and (max-width: 799px) {
    min-height: calc(100vh - 90px);
  }
`;

const Container = styled.div`
  margin: 50px auto;
  width: 1300px;
  height: 100%;
  min-height: calc(100vh - 240px);
  display: flex;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 900px;
  }
  @media screen and (max-width: 949px) {
    margin: 30px auto;
  }
`;

const EditorContainer = styled.div`
  margin: 0 auto;
  padding: 50px;
  width: 100%;
  height: 100%;
  min-height: 75vh;
  background-color: #f0f0f0;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 20px #3c3c3c;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    padding: 30px;
    border-radius: 14px;
  }
  @media screen and (max-width: 949px) {
    display: none;
  }
`;

const Text = styled.div`
  font-size: 24px;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    font-size: 20px;
  }
`;

const Title = styled.input`
  margin-bottom: 40px;
  padding: 0 20px;
  width: 1200px;
  height: 60px;
  color: #3c3c3c;
  font-size: 26px;
  font-weight: 700;
  background-color: #ffffff90;
  border: 1px solid #787878;
  border-radius: 10px;
  &:focus {
    outline: none;
    background-color: #ffffff;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 840px;
    height: 40px;
    margin-bottom: 30px;
    font-size: 20px;
    border-radius: 6px;
  }
`;

const SingleEditorContainer = styled.div`
  position: relative;
  width: 1200px;
  height: 760px;
  & + & {
    margin-top: 80px;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 840px;
    height: 532px;
  }
  & + & {
    margin-top: 40px;
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
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 30px;
    height: 30px;
    top: -15px;
    right: -14px;
  }
`;

const SelectContainer = styled.div`
  padding: 75px 0 10px 0;
  width: 100vw;
  display: flex;
  position: fixed;
  top: 0;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  box-shadow: 1px 0 5px black;
  z-index: 5;
  ::-webkit-scrollbar {
    display: none;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    max-height: 150px;
    transition: max-height 0.3s ease-in;
    overflow: hidden;
    &:hover {
      max-height: 230px;
    }
  }
  @media screen and (max-width: 949px) {
    display: none;
  }
`;

const SelectInnerContainer = styled.div`
  margin: 0 auto;
  height: 100%;
  width: 1300px;
  overflow: hidden;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 840px;
    height: 150px;
  }
`;

const SelectImgOverflowContainer = styled.div`
  margin: auto;
  display: flex;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    height: 100%;
    flex-wrap: wrap;
  }
`;

const SelectImg = styled.div<{ img: string; cursor?: string }>`
  width: 120px;
  height: 70px;
  background-image: ${(props) => props.img};
  background-size: cover;
  background-position: center;
  border: 1px solid #d4d4d4;
  &:hover {
    cursor: ${(props) => props.cursor || "pointer"};
    box-shadow: 1px 1px 5px gray;
    border: none;
  }
  & + & {
    margin-left: 10px;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin-right: 10px;
    margin-bottom: 10px;
    width: 110px;
    height: 65px;
    & + & {
      margin-left: 0;
    }
  }
`;

const FooterContainer = styled.div`
  margin-top: 40px;
  display: flex;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    margin-top: 30px;
  }
`;

const Btn = styled.button<{
  backgroundColor?: string;
  backgroundColorHover?: string;
}>`
  padding: 0 20px;
  height: 50px;
  font-size: 18px;
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
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    font-size: 16px;
    height: 40px;
    border-radius: 6px;
    & + & {
      margin-left: 20px;
    }
  }
`;

const UploadImgIcon = styled.div`
  margin-left: 10px;
  width: 25px;
  height: 25px;
  background-image: url(${uploadPhotoIcon});
  background-size: cover;
  background-position: center;
  opacity: 0.8;
`;

const CheckMainImgIcon = styled(UploadImgIcon)`
  background-image: url(${checkedIcon});
`;

const WarningText = styled.div`
  display: none;
  @media screen and (max-width: 949px) {
    margin: 0 auto;
    padding: 20px;
    display: block;
    color: #ffffff;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
  }
`;

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

function CreateNewProject() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userId, setUserProjects } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState<
    {
      key: string;
      type: number;
      content?: string[];
      photos?: string[];
      location?: { lat?: number; lng?: number };
    }[]
  >([]);
  const [position, setPosition] = useState<{ lat?: number; lng?: number }>({});
  const [title, setTitle] = useState("");
  const [mainImgSrc, setMainImgSrc] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [hasGoogleMap, setHasGoogleMap] = useState(false);
  const selectAreaRef = useRef(null!);
  const googleMap = templatesArr[9];

  useEffect(() => {
    const sessionStoragePagesData = sessionStorage.getItem("pages");
    const sessionStorageTitleData = sessionStorage.getItem("title");
    const sessionStorageMainImgData = sessionStorage.getItem("mainImg");
    if (sessionStoragePagesData !== null) {
      const pagesParseData = JSON.parse(sessionStoragePagesData);
      setPages(pagesParseData);
    }
    if (sessionStorageTitleData !== null) {
      setTitle(sessionStorageTitleData);
    }
    if (sessionStorageMainImgData !== null) {
      setMainImgSrc(sessionStorageMainImgData);
    }
  }, []);

  useEffect(() => {
    if (pages.length === 0) {
      window.sessionStorage.removeItem("pages");
      window.sessionStorage.removeItem("title");
      window.sessionStorage.removeItem("mainImg");
      return;
    }
    const toJsonFormat = JSON.stringify(pages);
    window.sessionStorage.setItem("pages", toJsonFormat);
    window.sessionStorage.setItem("title", title);
    window.sessionStorage.setItem("mainImg", mainImgSrc);
  }, [pages, title, mainImgSrc]);

  useEffect(() => {
    const checkMapExist = pages.findIndex((page) => page.type === 9);
    if (checkMapExist !== -1) {
      setHasGoogleMap(true);
      return;
    }
    setHasGoogleMap(false);
  }, [pages]);

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const newPagesOrder = [...pages];
    const [remove] = newPagesOrder.splice(source.index, 1);
    newPagesOrder.splice(destination.index, 0, remove);
    setPages(newPagesOrder);
  };

  function deleteHandler(index: number) {
    const removeSelectedPageData = pages.filter((data, i) => index !== i);
    setPages(removeSelectedPageData);
  }

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

    let isLackingDetail = false;
    for (let i = 0; i < pages.length; i += 1) {
      if (pages[i].type === 9) {
        isLackingDetail =
          pages[i].location?.lat === 0 && pages[i].location?.lng === 0 && true;
        break;
      }
      const checkPhoto = pages[i].photos?.findIndex((photo) => photo !== "");
      const checkContent = pages[i].content?.findIndex(
        (content) => content !== ""
      );
      if (checkPhoto === -1 || checkContent === -1) {
        isLackingDetail = true;
        break;
      }
    }
    if (isLackingDetail === true) {
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
    setPosition({});
    setMainImgSrc("");
    window.sessionStorage.removeItem("pages");
    window.sessionStorage.removeItem("title");
    window.sessionStorage.removeItem("mainImg");
    Swal.fire({
      text: t("upload_successfully"),
      icon: "success",
      confirmButtonColor: "#646464",
    });
    setIsLoading(false);
    navigate("/profile");
  }

  if (isLoading) {
    return (
      <Wrapper>
        <Loading type="cylon" color="#ffffff" />
      </Wrapper>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={(e) => onDragEnd(e)}>
        <Wrapper>
          <SelectContainer>
            <SelectInnerContainer>
              <SelectImgOverflowContainer ref={selectAreaRef}>
                {templatesImgArr.map((pic, index) => (
                  <SelectImg
                    key={uuid()}
                    img={`url(${pic})`}
                    cursor={
                      index === 9 && hasGoogleMap ? "not-allowed" : "pointer"
                    }
                    onClick={() => {
                      if (index === 9 && hasGoogleMap) return;
                      setPages((prev) => [
                        ...prev,
                        { key: uuid(), ...templateData[index] },
                      ]);
                    }}
                  />
                ))}
              </SelectImgOverflowContainer>
            </SelectInnerContainer>
          </SelectContainer>
          <Container>
            <EditorContainer>
              {pages.length === 0 ? (
                <Text>{t("create_new_project")}</Text>
              ) : (
                <>
                  <Title
                    value={title}
                    maxLength={60}
                    placeholder={t("project_title")}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Droppable droppableId="drop-id">
                    {(droppableProvided, droppableSnapshot) => (
                      <div
                        {...droppableProvided.droppableProps}
                        ref={droppableProvided.innerRef}
                      >
                        {pages.map((page, index) => {
                          const Template = templatesArr[page.type];
                          return (
                            <Draggable
                              draggableId={page.key}
                              index={index}
                              key={page.key}
                            >
                              {(provided, snapshot) => (
                                <SingleEditorContainer
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <Template
                                    pages={pages}
                                    setPages={setPages}
                                    currentIndex={index}
                                    position={position}
                                    setPosition={setPosition}
                                  />
                                  <CloseIcon
                                    onClick={() => deleteHandler(index)}
                                  />
                                </SingleEditorContainer>
                              )}
                            </Draggable>
                          );
                        })}
                        {droppableProvided.placeholder}
                      </div>
                    )}
                  </Droppable>
                  <FooterContainer>
                    {mainImgSrc === "" ? (
                      <>
                        <Btn
                          backgroundColor="#f5dfa9"
                          backgroundColorHover="#9d8a62"
                          onClick={() => setShowOverlay((prev) => !prev)}
                        >
                          {t("upload_main_photo")}
                          <UploadImgIcon />
                        </Btn>
                        <Btn onClick={() => confirmAllEdit()}>
                          {t("confirm_edit")}
                        </Btn>
                      </>
                    ) : (
                      <>
                        <Btn onClick={() => setShowOverlay((prev) => !prev)}>
                          {t("edit_main_photo")}
                          <CheckMainImgIcon />
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
            <WarningText>{t("small_screen_warning")}</WarningText>
          </Container>
        </Wrapper>
      </DragDropContext>
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
