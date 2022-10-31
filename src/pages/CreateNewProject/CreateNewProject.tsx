import styled from "styled-components";
import { useTranslation } from "react-i18next";

import GoogleMapAPI from "../../context/GoogleMapAPI";

import template1 from "../Templates/template1.png";
import template2 from "../Templates/template2.png";
import template3 from "../Templates/template3.png";
import template4 from "../Templates/template4.png";
import template5 from "../Templates/template5.png";
import template6 from "../Templates/template6.png";
import template7 from "../Templates/template7.png";
import template8 from "../Templates/template8.png";
import googleMapPng from "../Templates/googleMapPng.png";

const templatesImg = [
  googleMapPng,
  template1,
  template2,
  template3,
  template4,
  template5,
  template6,
  template7,
  template8,
];

interface Prop {
  img?: string;
}

const Wrapper = styled.div`
  padding: 50px 0;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 160px);
  display: flex;
`;

const Container = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 100%;
  position: relative;
  display: flex;
`;

const EditorContainer = styled.div`
  padding: 20px;
  width: 1000px;
  height: 100%;
  min-height: 80vh;
  border: 1px solid #3c3c3c;
`;

const TemplatesContainer = styled.div`
  margin-left: 30px;
  padding: 20px;
  width: 300px;
  height: 80vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #3c3c3c;
  overflow: scroll;
  scrollbar-width: none;
  ::-webkit-scrollbar {
    display: none;
  }
`;

const TemplatesInnerContainer = styled.div`
  height: 100%;
`;

const Template = styled.div`
  margin: 20px auto;
  width: 200px;
  height: 120px;
  background-image: ${(props: Prop) => props.img};
  background-size: cover;
  background-position: center;
`;

function CreateNewProject() {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <Container>
        <EditorContainer>
          <div>{t("create_new_project")}</div>
          <GoogleMapAPI />
          <Template img={`url("../Templates/template1.png")`} />
        </EditorContainer>

        <TemplatesContainer>
          <TemplatesInnerContainer>
            <div>{t("add_template_or_map")}</div>
            {templatesImg.map((pic) => (
              <Template key={`${pic}`} img={`url(${pic})`} />
            ))}
          </TemplatesInnerContainer>
        </TemplatesContainer>
      </Container>
    </Wrapper>
  );
}

export default CreateNewProject;
