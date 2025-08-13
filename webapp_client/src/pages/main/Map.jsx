import { useState, useCallback, useRef, useEffect } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { TiLocationArrowOutline } from "react-icons/ti";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateUserMutation } from "../../context/services/user.service";
import { IoSearchOutline } from "react-icons/io5";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const initialCenter = {
  lat: 41.2995,
  lng: 69.2401,
};

const Map = () => {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const long = searchParams.get("long");
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [position, setPosition] = useState(
    lat && long ? { lat: Number(lat), lng: Number(long) } : initialCenter
  );
  const [zoom, setZoom] = useState(lat && long ? 15 : 10);
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

  async function handleSubmit() {
    try {
      await createUser({
        telegram_id: localStorage.getItem("telegram_id"),
        default_address: { lat: position.lat, long: position.lng },
      }).unwrap();
      navigate(-1);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="map-page">
      <button className="arrow-left" onClick={() => navigate(-1)}>
        <FaArrowLeftLong />
      </button>
      <button className="places-button" onClick={() => navigate("/places")}>
        <IoSearchOutline />
      </button>
      <button className="location" onClick={handleLocationClick}>
        <TiLocationArrowOutline size={25} color="#666666" />
      </button>
      <div className="map-body">
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={zoom}
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
        <button onClick={handleSubmit}>Manzilni tanlash</button>
      </div>
    </div>
  );
};

export default Map;
