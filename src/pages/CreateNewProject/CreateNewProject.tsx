import styled from "styled-components";
import { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import ReactLoading from "react-loading";
import { db } from "../../context/firebaseSDK";
import { AuthContext } from "../../context/authContext";
import getProjects from "../../utils/getProjects";

import templatesImgArr from "../../components/Templates/TemplateImg";
import templatesArr from "../../components/Templates/TemplatesArr";
import closeIcon from "./close.png";

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

function CreateNewProject() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { userId, name, setUserProjects } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [addedTemplate, setAddedTemplate] = useState<
    { uuid: string; type: number }[]
  >([]);
  const [pages, setPages] = useState<
    {
      type: number;
      content?: string[];
      url?: string[];
      location?: { lat?: number; lng?: number };
    }[]
  >([]);
  const [position, setPosition] = useState<{ lat?: number; lng?: number }>({});
  const [title, setTitle] = useState("");
  const googleMap = templatesArr[8];

  async function confirmAllEdit() {
    if (!userId) {
      alert("please login first");
      navigate("/login");
      return;
    }
    const checkPage = pages.every((type) => type.type === undefined);
    if (checkPage) {
      alert(t("upload_failed"));
      return;
    }
    setIsLoading(true);
    const projectId = uuid();
    await setDoc(doc(db, "projects", projectId), {
      author: name,
      uid: userId,
      mainUrl: "",
      projectId,
      title,
      time: new Date(),
      pages,
    });

    const newProjects = await getProjects(userId);
    setUserProjects(newProjects);
    setPages([]);
    setAddedTemplate([]);
    alert(t("upload_successfully"));
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
              <Btn onClick={() => confirmAllEdit()}>{t("confirm_edit")}</Btn>
            </>
          )}
        </EditorContainer>
      </Container>
    </Wrapper>
  );
}

export default CreateNewProject;
