import { useState, useEffect } from "react";
import { LoadScript } from "@react-google-maps/api";
import { IoLocationOutline, IoLocationSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
const libraries = ["places"];

function LocationSearch() {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!inputValue || !scriptLoaded) {
      setSuggestions([]);
      return;
    }

    const autocompleteService =
      new window.google.maps.places.AutocompleteService();
    const placesService = new window.google.maps.places.PlacesService(
      document.createElement("div")
    );

    let autoResults = [];
    let textResults = [];

    function updateSuggestions() {
      const map = new Map();
      [...autoResults, ...textResults].forEach((item) => {
        if (!map.has(item.place_id)) {
          map.set(item.place_id, item);
        }
      });
      setSuggestions(Array.from(map.values()));
    }

    autocompleteService.getPlacePredictions(
      { input: inputValue, types: ["geocode"] },
      (predictions, status) => {
        if (
          status === window.google.maps.places.PlacesServiceStatus.OK &&
          predictions?.length
        ) {
          autoResults = predictions;
        } else {
          autoResults = [];
        }
        updateSuggestions();
      }
    );

    placesService.textSearch({ query: inputValue }, (results, status) => {
      if (
        status === window.google.maps.places.PlacesServiceStatus.OK &&
        results?.length
      ) {
        const plusCodeRegex = /^\S*\+\S*\s?/;

        textResults = results.map((r) => {
          let formattedAddress = r.formatted_address || r.name;
          formattedAddress = formattedAddress.replace(plusCodeRegex, "");

          return {
            place_id: r.place_id,
            description: formattedAddress,
            structured_formatting: {
              main_text: r.name,
              secondary_text: formattedAddress,
            },
          };
        });
      } else {
        textResults = [];
      }
      updateSuggestions();
    });
  }, [inputValue, scriptLoaded]);

  return (
    <div className="search-location">
      <LoadScript
        googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
        libraries={libraries}
        onLoad={() => setScriptLoaded(true)}
      >
        <div className="search-input">
          <input
            type="search"
            placeholder="Manzil qidiruvi"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <div>
          <button onClick={() => navigate("/map")}>Xaritadan tanlash</button>
          <button onClick={() => navigate("/")}>Bosh sahifa</button>
        </div>
        <div className="suggestions">
          {suggestions.length > 0 &&
            suggestions.map((item) => (
              <div
                className="suggestion"
                key={item.place_id}
                onClick={() => {
                  const placesService =
                    new window.google.maps.places.PlacesService(
                      document.createElement("div")
                    );

                  placesService.getDetails(
                    { placeId: item.place_id, fields: ["geometry"] },
                    (result, status) => {
                      if (
                        status ===
                          window.google.maps.places.PlacesServiceStatus.OK &&
                        result?.geometry?.location
                      ) {
                        navigate(
                          `/map?lat=${result.geometry.location.lat()}&long=${result.geometry.location.lng()}`
                        );
                      } else {
                        console.error("Location not found");
                      }
                    }
                  );
                }}
                style={{ cursor: "pointer" }}
              >
                <IoLocationSharp />
                <div>
                  <p
                    dangerouslySetInnerHTML={{
                      __html: item.structured_formatting.main_text.replace(
                        new RegExp(`(${inputValue})`, "gi"),
                        `<span style="color: #1677FF;">$1</span>`
                      ),
                    }}
                  ></p>
                  <span>{item.structured_formatting.secondary_text}</span>
                </div>
              </div>
            ))}
        </div>
      </LoadScript>
    </div>
  );
}

export default LocationSearch;
