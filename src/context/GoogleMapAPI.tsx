import styled from "styled-components";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import ReactLoading from "react-loading";

// interface Prop {
//   lat: number;
//   lng: number;
// }

const Wrapper = styled.div`
  width: 600px;
  height: 400px;
  position: relative;
`;

const Loading = styled(ReactLoading)`
  margin: 50px auto;
`;

function GoogleMapAPI({ position }: any) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyD4FXJVjSDHR-dZz9zXR2N43ExpSVaA5tQ",
    libraries: ["places"],
  });
  const center = { lat: position.lat || 48.8584, lng: position.lng || 2.2945 };

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
