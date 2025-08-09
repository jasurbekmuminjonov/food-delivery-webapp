import React, { useState, useCallback, useRef, useEffect } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { TiLocationArrowOutline } from "react-icons/ti";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const initialCenter = {
  lat: 41.2995,
  lng: 69.2401,
};

const Map = () => {
  const [position, setPosition] = useState(initialCenter);
  const mapRef = useRef(null);
  const navigate = useNavigate();

  const onLoad = (map) => {
    mapRef.current = map;
  };

  const onDragEnd = () => {
    if (mapRef.current) {
      const newCenter = {
        lat: mapRef.current.getCenter().lat(),
        lng: mapRef.current.getCenter().lng(),
      };
      setPosition(newCenter);
    }
  };

  const onMapClick = useCallback((event) => {
    const newPos = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    setPosition(newPos);
  }, []);

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLocation = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setPosition(userLocation);
          if (mapRef.current) {
            mapRef.current.panTo(userLocation);
            mapRef.current.setZoom(18);
          }
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            alert("Joylashuvga ruxsat berilmadi");
          } else {
            alert("Joylashuvni olishda xatolik yuz berdi");
          }
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      alert("Brauzeringiz joylashuvni qo'llab-quvvatlamaydi");
    }
  };

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.panTo(position);
    }
  }, [position]);

  const mapOptions = {
    zoomControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    gestureHandling: "greedy",
  };

  return (
    <div className="map-page">
      <button className="arrow-left" onClick={() => navigate("/")}>
        <FaArrowLeftLong />
      </button>
      <button className="location" onClick={handleLocationClick}>
        <TiLocationArrowOutline size={25} />
      </button>
      <div className="map-body">
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={12}
            onClick={onMapClick}
            onLoad={onLoad}
            onDragEnd={onDragEnd}
            options={mapOptions}
          >
            <Marker position={position} />
          </GoogleMap>
        </LoadScript>
      </div>
      <div className="map-footer">
        <button>Manzilni tanlash</button>
      </div>
    </div>
  );
};

export default Map;
