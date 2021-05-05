import React from "react";

// STYLE
import "./reset-posizione.css";

export default function Locate({ panTo }) {
  return (
    <button
      onClick={() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          () => null
        );
      }}
      className="reset-posizione"
    >
      La mia posizione
    </button>
  );
}
