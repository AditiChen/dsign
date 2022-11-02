import styled from "styled-components";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import templatesImgArr from "../../components/Templates/TemplateImg";
import templatesArr from "../../components/Templates/TemplatesArr";

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

const TemplatesContainer = styled.div`
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

const TemplatesInnerContainer = styled.div`
  height: 100%;
`;

const TemplateImg = styled.div`
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

function TemplateInsert({ templateNum }: { templateNum: number[] }) {
  const templateFilter = templateNum?.map((num) => templatesArr[num]);
  return (
    <>
      {templateFilter.map((Template, index) => (
        <Template key={`${index + 1}`} edit />
      ))}
    </>
  );
}

function CreateNewProject() {
  const { t } = useTranslation();
  const [addedTemplate, setAddedTemplate] = useState<number[]>([]);

  return (
    <Wrapper>
      <TemplatesContainer>
        <TemplatesInnerContainer>
          <div>{t("add_template_or_map")}</div>
          {templatesImgArr.map((pic, index) => (
            <TemplateImg
              key={`${pic}`}
              img={`url(${pic})`}
              onClick={() => {
                setAddedTemplate((prev) => [...prev, index]);
              }}
            />
          ))}
        </TemplatesInnerContainer>
      </TemplatesContainer>
      <Container>
        <EditorContainer>
          <div>{t("create_new_project")}</div>
          {addedTemplate.length === 0 ? (
            ""
          ) : (
            <TemplateInsert templateNum={addedTemplate} />
          )}
        </EditorContainer>
      </Container>
    </Wrapper>
  );
}

export default CreateNewProject;
