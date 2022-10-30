import styled from "styled-components";
import { useTranslation } from "react-i18next";

const Wrapper = styled.div`
  padding: 50px 0;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 160px);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function CreateNewProject() {
  const { t } = useTranslation();
  return (
    <Wrapper>
      <div>{t("create_new_project")}</div>
    </Wrapper>
  );
}

export default CreateNewProject;
