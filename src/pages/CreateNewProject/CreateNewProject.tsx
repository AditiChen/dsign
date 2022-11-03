import styled from "styled-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { v4 as uuid } from "uuid";

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
  margin-top: 30px;
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
  ::-webkit-scrollbar {
    display: none;
  }
`;

const SelectInnerContainer = styled.div`
  height: 100%;
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
`;

function CreateNewProject() {
  const { t } = useTranslation();
  const [addedTemplate, setAddedTemplate] = useState<
    { uuid: string; type: number }[]
  >([]);

  const templateFilter = addedTemplate?.map((num) => ({
    keyUuid: [num.uuid],
    Template: templatesArr[num.type],
  }));

  function deleteHandler(index: number) {
    const newAddedTemplate = addedTemplate.filter((data, i) => index !== i);
    setAddedTemplate(newAddedTemplate);
  }

  return (
    <Wrapper>
      <SelectContainer>
        <SelectInnerContainer>
          <div>{t("add_template_or_map")}</div>
          {templatesImgArr.map((pic, index) => (
            <SelectImg
              key={uuid()}
              img={`url(${pic})`}
              onClick={() => {
                setAddedTemplate((prev) => [
                  ...prev,
                  { uuid: uuid(), type: index },
                ]);
              }}
            />
          ))}
        </SelectInnerContainer>
      </SelectContainer>
      <Container>
        <EditorContainer>
          <div>{t("create_new_project")}</div>
          {addedTemplate.length === 0
            ? ""
            : templateFilter.map(({ keyUuid, Template }, index) => (
                <SingleEditorContainer key={`${keyUuid}`}>
                  <Template edit />
                  <CloseIcon onClick={() => deleteHandler(index)} />
                </SingleEditorContainer>
              ))}
        </EditorContainer>
      </Container>
    </Wrapper>
  );
}

export default CreateNewProject;
