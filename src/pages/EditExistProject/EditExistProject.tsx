import { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import { doc, setDoc } from "firebase/firestore";

import { db } from "../../context/firebaseSDK";
import { AuthContext } from "../../context/authContext";
import { PagesType } from "../../components/tsTypes";
import getSingleProject from "../../utils/getSingleProject";
import getUserProjects from "../../utils/getUserProjects";
import templatesImgArr from "../../components/Templates/TemplateImg";
import templatesArr from "../../components/Templates/TemplatesArr";
import SquareOverlay from "../../components/Overlays/squareOverlay";
import templateData from "../../components/Templates/TemplatesData.json";

// import { arrowIconWhite, arrowIconHover } from "../../components/icons/icons";
import {
  Wrapper,
  Container,
  ArrowIcon,
  EditorContainer,
  Title,
  SingleEditorContainer,
  CloseIcon,
  SelectContainer,
  SelectInnerContainer,
  SelectImgOverflowContainer,
  SelectImg,
  FooterContainer,
  Btn,
  WarningText,
  Loading,
} from "../../components/StyledComponents/ProjectEditorStyledComponents";

function EditExistProject() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId, setUserProjects } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState<PagesType[]>([]);
  const [position, setPosition] = useState<{ lat?: number; lng?: number }>({});
  const [title, setTitle] = useState("");
  const [mainImgSrc, setMainImgSrc] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);

  const urlString = new URL(window.location.href);
  const singleProjectId = urlString.searchParams.get("id") as string;

  useEffect(() => {
    async function fetchData() {
      const projectDetail = await getSingleProject(singleProjectId);
      setPages(projectDetail[0].pages);
      setTitle(projectDetail[0].title);
      setMainImgSrc(projectDetail[0].mainUrl);
      const mapIndex = projectDetail[0].pages.findIndex(
        (page) => page.location !== undefined
      );
      if (mapIndex !== -1) {
        const originalPosition = projectDetail[0].pages[mapIndex].location;
        setPosition(originalPosition || {});
      }
    }
    fetchData();
  }, [singleProjectId]);

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
    await setDoc(doc(db, "projects", singleProjectId), {
      uid: userId,
      mainUrl: mainImgSrc,
      projectId: singleProjectId,
      title,
      time: new Date(),
      pages,
    });
    const newProjects = await getUserProjects(userId);
    setUserProjects(newProjects);
    setPages([]);
    setPosition({});
    setMainImgSrc("");
    Swal.fire({
      text: t("upload_successfully"),
      icon: "success",
      confirmButtonColor: "#646464",
    });
    setIsLoading(false);
    navigate("/profile");
  }

  function deleteHandler(index: number) {
    const removeSelectedPageData = pages.filter((_, i) => index !== i);
    setPages(removeSelectedPageData);
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    const newPagesOrder = [...pages];
    const [remove] = newPagesOrder.splice(source.index, 1);
    newPagesOrder.splice(destination.index, 0, remove);
    setPages(newPagesOrder);
  };

  if (isLoading) {
    return (
      <Wrapper>
        <Loading type="cylon" color="#ffffff" />
      </Wrapper>
    );
  }

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <Wrapper>
          <SelectContainer>
            <SelectInnerContainer>
              <SelectImgOverflowContainer>
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
              </SelectImgOverflowContainer>
            </SelectInnerContainer>
          </SelectContainer>
          <Container>
            <ArrowIcon onClick={() => navigate(-1)} />
            <EditorContainer>
              <Title
                value={title}
                maxLength={60}
                placeholder={t("project_title")}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Droppable droppableId="drop-id">
                {(droppableProvided) => (
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
                          {(provided) => (
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
                              <CloseIcon onClick={() => deleteHandler(index)} />
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
                <Btn onClick={() => setShowOverlay((prev) => !prev)}>
                  {t("edit_main_photo")}
                </Btn>
                <Btn
                  backgroundColor="#f5dfa9"
                  backgroundColorHover="#9d8a62"
                  onClick={() => confirmAllEdit()}
                >
                  {t("confirm_edit")}
                </Btn>
                <Btn
                  backgroundColor="#ffe8ee"
                  backgroundColorHover="#81484f"
                  onClick={() => navigate("/profile")}
                >
                  {t("drop_edit")}
                </Btn>
              </FooterContainer>
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
        />
      )}
    </>
  );
}

export default EditExistProject;
