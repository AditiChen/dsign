import { useEffect, useState, useContext, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import { doc, setDoc } from "firebase/firestore";
import Swal from "sweetalert2";

import { db } from "../../context/firebaseSDK";
import { AuthContext } from "../../context/authContext";
import { PagesType } from "../../components/tsTypes";
import getUserProjects from "../../utils/getUserProjects";
import templatesImgArr from "../../components/Templates/TemplateImg";
import templatesArr from "../../components/Templates/TemplatesArr";
import SquareOverlay from "../../components/Overlays/squareOverlay";
import templateData from "../../components/Templates/TemplatesData.json";
import {
  Wrapper,
  Container,
  EditorContainer,
  Title,
  EmptyRemindText,
  SingleEditorContainer,
  CloseIcon,
  SelectContainer,
  SelectInnerContainer,
  SelectImgOverflowContainer,
  SelectImg,
  FooterContainer,
  Btn,
  UploadImgIcon,
  CheckMainImgIcon,
  WarningText,
  Loading,
} from "../../components/StyledComponents/ProjectEditor";

function CreateNewProject() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userId, setUserProjects } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [pages, setPages] = useState<PagesType[]>([]);
  const [position, setPosition] = useState<{ lat?: number; lng?: number }>({});
  const [title, setTitle] = useState("");
  const [mainImgSrc, setMainImgSrc] = useState("");
  const [showOverlay, setShowOverlay] = useState(false);
  const [hasGoogleMap, setHasGoogleMap] = useState(false);
  const selectAreaRef = useRef(null);

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
      sessionStorage.removeItem("pages");
      sessionStorage.removeItem("title");
      sessionStorage.removeItem("mainImg");
      return;
    }
    const toJsonFormat = JSON.stringify(pages);
    sessionStorage.setItem("pages", toJsonFormat);
    sessionStorage.setItem("title", title);
    sessionStorage.setItem("mainImg", mainImgSrc);
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

  function insertNewTemplate(index: number) {
    if (index === 9 && hasGoogleMap) return;
    setPages((prev) => [...prev, { key: uuid(), ...templateData[index] }]);
    Swal.fire({
      position: "top",
      text: "Add template successfully",
      showConfirmButton: false,
      timer: 700,
    });
  }

  function deleteHandler(index: number) {
    const removeSelectedPageData = pages.filter((_, i) => index !== i);
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
    sessionStorage.removeItem("pages");
    sessionStorage.removeItem("title");
    sessionStorage.removeItem("mainImg");
    Swal.fire({
      text: t("upload_successfully"),
      icon: "success",
      confirmButtonColor: "#646464",
    });
    setIsLoading(false);
    navigate("/profile");
  }

  const renderMainImgBtnWithPhoto = () => (
    <>
      <Btn
        backgroundColor="#f5dfa9"
        backgroundColorHover="#9d8a62"
        onClick={() => setShowOverlay((prev) => !prev)}
      >
        {t("upload_main_photo")}
        <UploadImgIcon />
      </Btn>
      <Btn onClick={() => confirmAllEdit()}>{t("confirm_edit")}</Btn>
    </>
  );

  const renderUploadMainImgBtn = () => (
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
  );

  const renderCollectionPhotos = () => (
    <>
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
                <Draggable draggableId={page.key} index={index} key={page.key}>
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
        {mainImgSrc === ""
          ? renderMainImgBtnWithPhoto()
          : renderUploadMainImgBtn()}
      </FooterContainer>
    </>
  );

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
              <SelectImgOverflowContainer ref={selectAreaRef}>
                {templatesImgArr.map((pic, index) => (
                  <SelectImg
                    key={uuid()}
                    img={`url(${pic})`}
                    cursor={
                      index === 9 && hasGoogleMap ? "not-allowed" : "pointer"
                    }
                    onClick={() => {
                      insertNewTemplate(index);
                    }}
                  />
                ))}
              </SelectImgOverflowContainer>
            </SelectInnerContainer>
          </SelectContainer>
          <Container>
            <EditorContainer>
              {pages.length === 0 ? (
                <EmptyRemindText>{t("create_new_project")}</EmptyRemindText>
              ) : (
                renderCollectionPhotos()
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
        />
      )}
    </>
  );
}

export default CreateNewProject;
