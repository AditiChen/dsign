import styled from "styled-components";
import { useJsApiLoader } from "@react-google-maps/api";
import ReactLoading from "react-loading";
import templatesArr from "../../components/singleProjectPageTemplates/TemplatesArr";
import { GoogleMapAPI } from "../../components/singleProjectPageTemplates/GoogleMapAPI";

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

const MapContainer = styled.div`
  width: 1200px;
  height: 700px;
`;

const Title = styled.div`
  font-size: 30px;
  color: #3c3c3c;
`;

const Loading = styled(ReactLoading)`
  margin: 50px auto;
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
    },
    {
      type: 8,
      location: { lat: 34.818529, lng: 135.53703 },
    },
  ],
};

function SingleProject() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });
  const { pages } = project;
  const types = pages.map((data) => data.type);
  const templateFilter = types?.map((num) => templatesArr[num]);
  const googleMap = templatesArr[8];

  if (!isLoaded) {
    return (
      <Wrapper>
        <Loading />
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Container>
        <Title>Title</Title>
        {pages.length === 0 ? (
          ""
        ) : (
          <>
            {templateFilter.map((Template, index) => {
              if (Template === googleMap) {
                return (
                  <MapContainer key={`${index + 1}`}>
                    <GoogleMapAPI position={pages[index].location || {}} />
                  </MapContainer>
                );
              }
              return (
                <Template
                  key={`${index + 1}`}
                  photoUrl={pages[index].url || []}
                  content={pages[index].content || []}
                />
              );
            })}
          </>
        )}
      </Container>
    </Wrapper>
  );
}

export default SingleProject;
