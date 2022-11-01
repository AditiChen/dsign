import styled from "styled-components";
import { GoogleMap, Marker } from "@react-google-maps/api";

const Wrapper = styled.div`
  width: 600px;
  height: 400px;
  position: relative;
`;

function GoogleMapAPI({
  position,
}: {
  position: { lat?: number; lng?: number };
}) {
  const center = { lat: position.lat || 48.8584, lng: position.lng || 2.2945 };

  return (
    <Wrapper>
      <GoogleMap
        center={center}
        zoom={15}
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

export default GoogleMapAPI;
