import React from "react";
import Button from "react-bootstrap/Button";

import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";

import Locate from "../locate";

// STYLE
import "./searchbox.css";
import "@reach/combobox/styles.css";

export default function Search({ panTo, setMarker, savePositions }) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      location: { lat: () => 45.438618, lng: () => 10.993313 },
      radius: 200 * 1000,
    },
  });

  const handleInput = (e) => {
    setValue(e.target.value);
  };

  const handleSelect = async (address) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      panTo({ lat, lng });
      setMarker((currentState) => [
        ...currentState,
        {
          lat: lat,
          lng: lng,
        },
      ]);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  return (
    <div className="searchbox">
      <Combobox onSelect={handleSelect} className="combobox">
        <ComboboxInput
          value={value}
          onChange={handleInput}
          disabled={!ready}
          placeholder="Search your location"
        />
        <ComboboxPopover>
          <ComboboxList>
            {status === "OK" &&
              data.map(({ id, description }) => (
                <ComboboxOption key={id} value={description} />
              ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
      <div className="d-flex justify-content-evenly">
        <Locate panTo={panTo} />
        <Button
          variant="primary"
          onClick={() => {
            savePositions();
          }}
        >
          Salva posizioni
        </Button>
      </div>
    </div>
  );
}
