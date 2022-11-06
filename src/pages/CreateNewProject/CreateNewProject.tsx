import styled from "styled-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";
import { updateDoc, doc, setDoc } from "firebase/firestore";
import { db } from "../../context/firebaseSDK";

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
  right: 0;
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
  width: 150px;
  height: 50px;
  color: #3c3c3c;
  font-size: 20px;
  border: 1px solid #3c3c3c;
  background-color: #3c3c3c30;
`;

function CreateNewProject() {
  const { t } = useTranslation();
  const [addedTemplate, setAddedTemplate] = useState<
    { uuid: string; type: number }[]
  >([]);
  const [pages, setPages] = useState<
    {
      type: number;
      content: string[];
      url: string[];
    }[]
  >([]);

  async function confirmAllEdit() {
    const projectId = uuid();
    const uid = "JeMKYuyUi7BnXxgrFlfK";
    console.log("pages", pages);
    await setDoc(doc(db, "projects", projectId), {
      author: "Orange",
      uid,
      mainUrl: "",
      projectId,
      title: "update test",
      time: new Date(),
      pages,
    });
    // await updateDoc(doc(db, "users", uid), {
    //   projectList: [...,projectId]
    // });
    console.log("confitm all edit");
  }

  const templateFilter = addedTemplate?.map((num) => ({
    keyUuid: [num.uuid],
    Template: templatesArr[num.type],
  }));

  function deleteHandler(index: number) {
    const removeSelectedTemplate = addedTemplate.filter(
      (data, i) => index !== i
    );
    const removeSelectedPage = pages.filter((data, i) => index !== i);
    setAddedTemplate(removeSelectedTemplate);
    setPages(removeSelectedPage);
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
                setPages((prev) => [
                  ...prev,
                  {
                    type: index,
                    content: [""],
                    url: [""],
                  },
                ]);
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
            templateFilter.map(({ keyUuid, Template }, index) => (
              <SingleEditorContainer key={`${keyUuid}`}>
                <Template
                  pages={pages}
                  setPages={setPages}
                  currentIndex={index}
                />
                <CloseIcon onClick={() => deleteHandler(index)} />
              </SingleEditorContainer>
            ))
          )}
          <Btn onClick={() => confirmAllEdit()}>{t("confirm_edit")}</Btn>
        </EditorContainer>
      </Container>
    </Wrapper>
  );
}

export default CreateNewProject;
