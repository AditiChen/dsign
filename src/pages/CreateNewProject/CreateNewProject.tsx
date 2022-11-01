import styled from "styled-components";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import ReactLoading from "react-loading";

import { getLatLng, getGeocode } from "use-places-autocomplete";
import GoogleMapAPI from "../../components/Templates/GoogleMapAPI";
import templatesImgArr from "../../components/Templates/TemplateImg";
import templatesArr from "../../components/Templates/TemplatesArr";

import Template0 from "../../components/Templates/Template0";

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
  width: 110px;
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

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

function GoogleMapInsert() {
  const { t } = useTranslation();
  const locationRef = useRef<HTMLInputElement>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });
  const [position, setPosition] = useState<{ lat?: number; lng?: number }>({});

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
      const { lat, lng } = getLatLng(result[0]);
      setPosition({ lat, lng });
    }
  }
  return (
    <>
      <Autocomplete>
        <GoogleInput placeholder="type the place" ref={locationRef} />
      </Autocomplete>
      <ConfirmInputBtn onClick={() => locationHandler()}>
        {t("confirm_location")}
      </ConfirmInputBtn>
      <GoogleMapAPI position={position} />
    </>
  );
}

function TemplateInsert({ templateNum }: { templateNum: number[] }) {
  console.log(templateNum, "1111");
  const templateFilter = templateNum;
  return (
    <>
      <div>add_template_or_map</div>
      <Template0 />
      {/* {template.map((i) => (
        <Template img={`url(${template1})`} />
      ))} */}
    </>
  );
}

function CreateNewProject() {
  const { t } = useTranslation();
  const [addedTemplate, setAddedTemplate] = useState<number[]>([]);

  return (
    <Wrapper>
      <Container>
        <EditorContainer>
          <div>{t("create_new_project")}</div>
          {addedTemplate.length === 0 ? (
            ""
          ) : (
            <TemplateInsert templateNum={addedTemplate} />
          )}
          <GoogleMapInsert />
          <Template0 />
        </EditorContainer>
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
      </Container>
    </Wrapper>
  );
}

export default CreateNewProject;
