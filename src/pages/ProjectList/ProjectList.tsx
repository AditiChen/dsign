import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  padding: 130px 0;
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 160px);
  position: relative;
  display: flex;
`;

const Container = styled.div`
  margin: 0 auto;
  width: 1200px;
  height: 100%;
  position: relative;
  display: flex;
`;

const Button = styled.button`
  width: 100px;
  height: 40px;
`;

function ProjectList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <Wrapper>
      <Container>
        <div>Project List</div>
        <Button onClick={() => navigate("/createNewProject")}>
          {t("create_new_project")}
        </Button>
      </Container>
    </Wrapper>
  );
}

export default ProjectList;
