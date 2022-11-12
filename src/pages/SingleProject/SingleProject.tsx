import { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useJsApiLoader } from "@react-google-maps/api";
import ReactLoading from "react-loading";

import templatesArr from "../../components/singleProjectPageTemplates/TemplatesArr";
import { GoogleMapAPI } from "../../components/singleProjectPageTemplates/GoogleMapAPI";
import { AuthContext } from "../../context/authContext";
import getSingleProject from "../../utils/getSingleProject";

interface UserProjectType {
  author: string;
  uid: string;
  mainUrl: string;
  projectId: string;
  title: string;
  time: number;
  pages: {
    type: number;
    content?: string[];
    url?: string[];
    location?: { lat?: number; lng?: number };
  }[];
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

function SingleProject() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });
  const { singleProjectId } = useContext(AuthContext);
  const [singleProjectData, setSingleProjectData] = useState<UserProjectType[]>(
    []
  );

  useEffect(() => {
    async function getData() {
      const result = await getSingleProject(singleProjectId);
      setSingleProjectData(result);
    }
    getData();
  }, []);

  const types = singleProjectData[0]?.pages?.map((data) => data.type);
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
        <Title>{singleProjectData && singleProjectData[0]?.title}</Title>
        {singleProjectData.length === 0 ? (
          ""
        ) : (
          <>
            {templateFilter.map((Template, index) => {
              if (Template === googleMap) {
                return (
                  <MapContainer key={`${index + 1}`}>
                    <GoogleMapAPI
                      position={
                        (singleProjectData &&
                          singleProjectData[0]?.pages[index].location) ||
                        {}
                      }
                    />
                  </MapContainer>
                );
              }
              return (
                <Template
                  key={`${index + 1}`}
                  photoUrl={
                    (singleProjectData &&
                      singleProjectData[0]?.pages[index].url) ||
                    []
                  }
                  content={
                    (singleProjectData &&
                      singleProjectData[0]?.pages[index].content) ||
                    []
                  }
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
