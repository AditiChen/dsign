import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { getLatLng, getGeocode } from "use-places-autocomplete";
import ReactLoading from "react-loading";
import produce from "immer";
import { CreateTemplateProps } from "../tsTypes";

const Wrapper = styled.div`
  width: 1200px;
  height: 760px;
  position: relative;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    width: 840px;
    height: 532px;
  }
  @media screen and (min-width: 650px) and (max-width: 949px) {
    width: 600px;
    height: 380px;
  }
  @media screen and (max-width: 649px) {
    width: 300px;
    height: 185px;
  }
`;

const InputContainer = styled.div`
  padding: 20px;
  display: flex;
  position: absolute;
  right: 0;
  top: 0;
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    padding: 15px;
  }
`;
const GoogleInput = styled.input`
  padding: 5px 10px;
  height: 40px;
  width: 400px;
  color: #3c3c3c;
  border: 1px solid #c3c3c3;
  border-radius: 5px;
  &:focus {
    outline: none;
    background-color: #f9f9f9;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    height: 30px;
    width: 280px;
  }
`;

const ConfirmInputBtn = styled.button`
  margin-left: 10px;
  height: 40px;
  min-width: 110px;
  border: 1px solid #3c3c3c40;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    color: #ffffff;
    background-color: #616161;
  }
  @media screen and (min-width: 950px) and (max-width: 1449px) {
    height: 30px;
    min-width: 75px;
    border-radius: 6px;
    font-size: 8px;
  }
`;

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

export function GoogleMapAPI({
  position,
}: {
  position: { lat?: number; lng?: number };
}) {
  const center = { lat: position.lat || 48.8584, lng: position.lng || 2.2945 };

  return (
    <Wrapper>
      <GoogleMap
        center={center}
        zoom={16}
        mapContainerStyle={{ width: "100%", height: "100%" }}
        options={{
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {position.lat !== undefined && <Marker position={center} />}
      </GoogleMap>
    </Wrapper>
  );
}

const libraries = ["places"] as (
  | "places"
  | "drawing"
  | "geometry"
  | "localContext"
  | "visualization"
)[];

function GoogleMapInsert(props: CreateTemplateProps) {
  const { setPages, currentIndex, pages, position, setPosition } = props;
  const { t } = useTranslation();
  const locationRef = useRef<HTMLInputElement>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

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
      const newPages = produce(pages, (draft) => {
        draft[currentIndex].location = { lat, lng };
      });
      setPages(newPages);
    }
  }

  return (
    <Wrapper>
      <GoogleMapAPI position={position} />
      <InputContainer>
        <Autocomplete>
          <GoogleInput placeholder={t("insert_location")} ref={locationRef} />
        </Autocomplete>
        <ConfirmInputBtn onClick={() => locationHandler()}>
          {t("confirm_location")}
        </ConfirmInputBtn>
      </InputContainer>
    </Wrapper>
  );
}

export default GoogleMapInsert;
