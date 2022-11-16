import styled from "styled-components";
import { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import { doc, setDoc } from "firebase/firestore";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";

import { db } from "../../context/firebaseSDK";
import { AuthContext } from "../../context/authContext";
import getSingleProject from "../../utils/getSingleProject";
import getUserProjects from "../../utils/getUserProjects";
import templatesImgArr from "../../components/Templates/TemplateImg";
import templatesArr from "../../components/Templates/TemplatesArr";

import closeIcon from "../../icons/close-icon.png";
import closeIconHover from "../../icons/close-icon-hover.png";

interface Prop {
  img?: string;
}

const Wrapper = styled.div`
  padding-top: 80px;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 80px);
  display: flex;
  position: relative;
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
  border: 1px solid #3c3c3c;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  padding: 6px 10px;
  width: 1200px;
  height: 50px;
  color: #3c3c3c;
  font-size: 18px;
  background-color: #f0f0f090;
  border: 1px solid gray;
  & + & {
    margin-top: 30px;
  }
  &:focus {
    outline: none;
    background-color: #61616130;
  }
`;

const SingleEditorContainer = styled.div`
  margin-top: 80px;
  position: relative;
  width: 1200px;
  height: 760px;
`;

const CloseIcon = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  top: -15px;
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
  box-shadow: 0 -1px 3px #3c3c3c;
  background-color: #ffffff;
  overflow: scroll;
  scrollbar-width: none;
  z-index: 5;
  ::-webkit-scrollbar {
    display: none;
  }
  @media screen and (max-width: 1860px) {
    padding-top: 100px;
    color: #828282;
    top: 0;
    width: 100vw;
    height: 200px;
  }
`;

const SelectInnerContainer = styled.div`
  height: 100%;
  @media screen and (max-width: 1860px) {
    margin: 0 auto;
    display: flex;
  }
`;

const SelectImg = styled.div`
  margin: 20px auto;
  width: 200px;
  height: 120px;
  background-image: ${(props: Prop) => props.img};
  background-size: cover;
  background-position: center;
  &:hover {
    cursor: pointer;
    box-shadow: 1px 1px 5px gray;
  }
  @media screen and (max-width: 1860px) {
    margin: 0 10px 0 0;
    width: 130px;
    height: 80px;
  }
`;

const Btn = styled.button`
  margin-top: 20px;
  height: 50px;
  color: #3c3c3c;
  font-size: 20px;
  border: 1px solid #3c3c3c;
  background-color: #3c3c3c30;
`;

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

function EditExistProject() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { userId, name, setUserProjects, singleProjectId, setSingleProjectId } =
    useContext(AuthContext);
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
  const googleMap = templatesArr[8];

  useEffect(() => {
    if (singleProjectId === "") return;
    async function fetchData() {
      const projectDetail = await getSingleProject(singleProjectId);
      const types = projectDetail[0].pages.map((type) => ({
        uuid: uuid(),
        type: type.type,
      }));
      setAddedTemplate(types);
      setPages(projectDetail[0].pages);
      setTitle(projectDetail[0].title);
      const mapIndex = projectDetail[0].pages.findIndex(
        (page) => page.location !== undefined
      );
      if (mapIndex !== -1) {
        const originalPosition = projectDetail[0].pages[mapIndex].location;
        setPosition(originalPosition || {});
      }
    }
    fetchData();
  }, []);

  async function confirmAllEdit() {
    const checkPage = pages.every((type) => type.type === undefined);
    if (checkPage) {
      alert(t("upload_failed"));
      return;
    }
    setIsLoading(true);
    await setDoc(doc(db, "projects", singleProjectId), {
      author: name,
      uid: userId,
      mainUrl: "",
      projectId: singleProjectId,
      title,
      time: new Date(),
      pages,
    });

    const newProjects = await getUserProjects(userId);
    setUserProjects(newProjects);
    setPages([]);
    setAddedTemplate([]);
    setSingleProjectId("");
    alert(t("upload_successfully"));
    navigate("/profile");
    setIsLoading(false);
  }

  const templateFilter = addedTemplate?.map((num) => ({
    keyUuid: [num.uuid],
    Chosetemplate: templatesArr[num.type],
  }));

  useEffect(() => {
    if (position.lat === undefined && position.lng === undefined) return;

    const mapIndex = templateFilter.findIndex(
      (map) => map.Chosetemplate === googleMap
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
                setPages((prev: any) => [...prev, {}]);
              }}
            />
          ))}
        </SelectInnerContainer>
      </SelectContainer>
      <Container>
        <EditorContainer>
          {addedTemplate.length === 0 ? (
            <div>{t("create_new_project")}</div>
          ) : (
            <>
              <Input
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              {templateFilter.map(
                ({ keyUuid, Chosetemplate }, templateIndex) => (
                  <SingleEditorContainer key={`${keyUuid}`}>
                    <Chosetemplate
                      pages={pages}
                      setPages={setPages}
                      currentIndex={templateIndex}
                      position={position}
                      setPosition={setPosition}
                    />
                    <CloseIcon onClick={() => deleteHandler(templateIndex)} />
                  </SingleEditorContainer>
                )
              )}
              <Btn onClick={() => confirmAllEdit()}>{t("confirm_edit")}</Btn>
              <Btn onClick={() => navigate("/profile")}>{t("drop_edit")}</Btn>
            </>
          )}
        </EditorContainer>
      </Container>
    </Wrapper>
  );
}

export default EditExistProject;
