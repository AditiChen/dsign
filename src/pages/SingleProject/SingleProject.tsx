import { useEffect, useState } from "react";
import styled from "styled-components";
import templatesArr from "../../components/Templates/TemplatesArr";

import miho1 from "../../components/miho1.jpg";
import miho2 from "../../components/miho2.jpg";
import church1 from "../../components/church1.jpg";
import church2 from "../../components/church2.jpg";
import church3 from "../../components/church3.jpg";

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
  width: 1200px;
  height: 100%;
  min-height: calc(100vh - 260px);
  display: flex;
  flex-direction: column;
`;

const SinglePageContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const Title = styled.div`
  font-size: 30px;
  color: #3c3c3c;
`;

const project = {
  author: "Orange",
  id: "lWRhOh8Hh7p65kOoamST",
  mainImg: church1,
  pages: [
    {
      type: 0,
      content: ["Hello, this is apple."],
      url: [miho1, miho2],
    },
    {
      type: 1,
      content: ["The church of light."],
      url: [church1, church2, church3],
      author: "Orange",
      id: "lWRhOh8Hh7p65kOoamST",
    },
  ],
};

function SingleProject() {
  const { pages } = project;
  const types = pages.map((data) => data.type);
  const templateFilter = types?.map((num) => templatesArr[num]);

  return (
    <Wrapper>
      <Container>
        <Title>Title</Title>
        <SinglePageContainer>
          {pages.length === 0 ? (
            ""
          ) : (
            <>
              {templateFilter.map((Template, index) => (
                <Template key={`${index + 1}`} />
              ))}
            </>
          )}
        </SinglePageContainer>
      </Container>
    </Wrapper>
  );
}

export default SingleProject;
