import styled from "styled-components";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import ReactLoading from "react-loading";

const Wrapper = styled.div`
  width: 600px;
  height: 400px;
`;

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

function GoogleMapAPI() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyD4FXJVjSDHR-dZz9zXR2N43ExpSVaA5tQ",
  });

  const center = { lat: 48.8584, lng: 2.2945 };

  if (!isLoaded) {
    return <Loading />;
  }
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
