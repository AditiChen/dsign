import styled from "styled-components";
import { useTranslation } from "react-i18next";
import { useRef, useState } from "react";

import {
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import { getLatLng, getGeocode } from "use-places-autocomplete";
import ReactLoading from "react-loading";

interface InsertProp {
  edit: boolean;
}

const Wrapper = styled.div`
  width: 1200px;
  height: 700px;
  position: relative;
`;

const InputContainer = styled.div`
  padding: 20px;
  display: flex;
  position: absolute;
  right: 0;
  top: 0;
`;
const GoogleInput = styled.input`
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
        <Marker position={center} />
      </GoogleMap>
    </Wrapper>
  );
}

function GoogleMapInsert(props: InsertProp) {
  const { t } = useTranslation();
  const locationRef = useRef<HTMLInputElement>(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });
  const [position, setPosition] = useState<{ lat?: number; lng?: number }>({});
  const { edit } = props;

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
    <Wrapper>
      <GoogleMapAPI position={position} />
      {edit ? (
        <InputContainer>
          <Autocomplete>
            <GoogleInput placeholder="type the place" ref={locationRef} />
          </Autocomplete>
          <ConfirmInputBtn onClick={() => locationHandler()}>
            {t("confirm_location")}
          </ConfirmInputBtn>
        </InputContainer>
      ) : (
        ""
      )}
    </Wrapper>
  );
}

export default GoogleMapInsert;
// export { GoogleMapInsert as default, GoogleMapAPI };
