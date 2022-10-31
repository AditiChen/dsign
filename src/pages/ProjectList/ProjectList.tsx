import styled from "styled-components";

const Wrapper = styled.div`
  width: 100%;
  min-width: 100vw;
  height: 100%;
  min-height: calc(100vh - 160px);
  position: relative;
  display: flex;
`;
function ProjectList() {
  return (
    <Wrapper>
      <div>Project List</div>
    </Wrapper>
  );
}

export default ProjectList;
