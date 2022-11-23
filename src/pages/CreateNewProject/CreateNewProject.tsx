import styled from "styled-components";
import { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import Swal from "sweetalert2";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
  const googleMap = templatesArr[9];

  useEffect(() => {
    const sessionStorageData = sessionStorage.getItem("pages");
    if (sessionStorageData !== null) {
      const parseData = JSON.parse(sessionStorageData);
      setPages(parseData);
    }
  }, []);

  useEffect(() => {
    if (pages.length === 0) {
      window.sessionStorage.removeItem("pages");
      return;
    }
    const toJsonFormat = JSON.stringify(pages);
    window.sessionStorage.setItem("pages", toJsonFormat);
  }, [pages]);

  useEffect(() => {
    if (position.lat === undefined && position.lng === undefined) return;
    const mapIndex = pages.findIndex(
      ({ type }) => templatesArr[type] === googleMap
    );
    if (mapIndex === -1) return;
    const newPages = [...pages];
    newPages[mapIndex].location = position;
    setPages(newPages);
  }, [position]);

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
    setPosition({});
    setMainImgSrc("");
    window.sessionStorage.removeItem("pages");
    Swal.fire({
      text: t("upload_successfully"),
      icon: "success",
      confirmButtonColor: "#646464",
    });
    setIsLoading(false);
    navigate("/profile");
  }

  function deleteHandler(index: number) {
    const removeSelectedPageData = pages.filter((data, i) => index !== i);
    setPages(removeSelectedPageData);
  }

  const onDragEnd = (e: any) => {
    const { source, destination } = e;
    if (!destination) return;
    const newPagesOrder = [...pages];
    const [remove] = newPagesOrder.splice(source.index, 1);
    newPagesOrder.splice(destination.index, 0, remove);
    setPages(newPagesOrder);
  };

  if (isLoading) {
    return (
      <Wrapper>
        <Loading type="cylon" color="#3c3c3c" />
      </Wrapper>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={(e) => onDragEnd(e)}>
        <Wrapper>
          <SelectContainer>
            <SelectInnerContainer>
              {templatesImgArr.map((pic, index) => (
                <SelectImg
                  key={uuid()}
                  img={`url(${pic})`}
                  onClick={() => {
                    setPages((prev) => [
                      ...prev,
                      { key: uuid(), ...templateData[index] },
                    ]);
                  }}
                />
              ))}
            </SelectInnerContainer>
          </SelectContainer>
          <Container>
            <EditorContainer>
              {pages.length === 0 ? (
                <Text>{t("create_new_project")}</Text>
              ) : (
                <>
                  <Input
                    value={title}
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
