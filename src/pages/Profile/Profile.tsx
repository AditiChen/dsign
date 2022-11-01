import styled from "styled-components";

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

function Profile() {
  return (
    <Wrapper>
      <Container>
        <div>Profile</div>
      </Container>
    </Wrapper>
  );
}

export default Profile;
