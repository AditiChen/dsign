import styled from "styled-components";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import ReactLoading from "react-loading";

import { getLatLng, getGeocode } from "use-places-autocomplete";
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
  width: 900px;
  height: 100%;
  min-height: 80vh;
  border: 1px solid #3c3c3c;
`;

const GoogleInput = styled.input`
  margin: 10px 0;
  padding: 5px 10px;
  height: 40px;
  width: 400px;
  color: #3c3c3c;
  border: 1px solid #c3c3c3;
  border-radius: 5px;
`;

const ConfirmInputBtn = styled.button`
  height: 40px;
  width: 100px;
  border: 1px solid #c3c3c3;
`;

const TemplatesContainer = styled.div`
  margin-left: 30px;
  padding: 20px;
  width: 270px;
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

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

function CreateNewProject() {
  const { t } = useTranslation();
  const locationRef = useRef<HTMLInputElement>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyD4FXJVjSDHR-dZz9zXR2N43ExpSVaA5tQ",
    libraries: ["places"],
  });
  const [position, setPosition] = useState({});

  if (!isLoaded) {
    return (
      <Wrapper>
        <Loading />
      </Wrapper>
    );
  }

  async function locationHandler() {
    if (locationRef.current && locationRef.current.value) {
      const address: string = locationRef.current.value;
      const result = await getGeocode({ address });
      const { lat, lng } = await getLatLng(result[0]);
      setPosition({ lat, lng });
    }
  }

  return (
    <Wrapper>
      <Container>
        <EditorContainer>
          <div>{t("create_new_project")}</div>
          <Autocomplete>
            <GoogleInput placeholder="type the place" ref={locationRef} />
          </Autocomplete>
          <ConfirmInputBtn onClick={() => locationHandler()}>
            Confirm Location
          </ConfirmInputBtn>
          <GoogleMapAPI position={position} />
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
