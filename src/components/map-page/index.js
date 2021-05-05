import React from "react";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { useLocation } from "react-router-dom";

// CUSTOM COMPONENTS
import Search from "../search";
import CustomModal from "../modal";

// CONFIGURAZIONE GOOGLE MAPS
const libraries = ["places"];
const mapContainerStyle = {
  wdith: "100vw",
  height: "100vh",
};
const center = {
  lat: 41.871941,
  lng: 12.56738,
};
const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

export default function MapPage() {
  const location = useLocation();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });
  const [modal, setModal] = React.useState(true);
  const [markers, setMarkers] = React.useState([]);
  const [selected, setSelected] = React.useState(null);
  const [currentLocation, setCurrentLocation] = React.useState(null);

  const handleModal = React.useCallback(({ choice }) => {
    setModal((currentState) => !currentState);
    setCurrentLocation(choice);
  }, []);

  const onMapClick = React.useCallback((event) => {
    setMarkers((currentState) => [
      ...currentState,
      {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      },
    ]);
  }, []);

  // MAP REFERENCE
  const mapRef = React.useRef();
  const onMapLoad = React.useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panTo = React.useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(16);
  }, []);

  const saveUser = () => {
    fetch("http://localhost:8080/users/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        console.log(data.some((user) => user.email === location.state.email));


        
      })
      .catch((err) => console.log("error", err));
  };

  const savePositions = (id) => {
    fetch("http://localhost:8080/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: location.state.name,
        lastname: location.state.lastName,
        email: location.state.email,
        markers: markers,
      }),
    }).catch((err) => console.log("error", err));
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";
  if (currentLocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        panTo({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setMarkers((currentState) => [
          ...currentState,
          {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        ]);
      },
      () => null
    );
  }

  return (
    <div>
      <CustomModal
        anagrafica={location.state}
        modalOpen={modal}
        handleModal={handleModal}
      />
      <Search panTo={panTo} setMarker={setMarkers} savePositions={saveUser} />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        onClick={onMapClick}
        onLoad={onMapLoad}
        options={options}
      >
        {markers.map((marker) => (
          <Marker
            key={`${marker.lat}-${marker.lng}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => {
              setSelected(marker);
            }}
          />
        ))}
        {console.log(markers)}
        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
            }}
          >
            <div>
              <div>Hai selezionato le seguenti coordinate:</div>
              <div>
                {selected.lat}, {selected.lng}
              </div>
            </div>
          </InfoWindow>
        ) : null}
      </GoogleMap>
    </div>
  );
}
