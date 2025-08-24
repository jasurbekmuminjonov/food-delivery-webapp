import { useState, useCallback, useRef, useEffect } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { TiLocationArrowOutline } from "react-icons/ti";
import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCreateUserMutation } from "../../context/services/user.service";
import { IoSearchOutline } from "react-icons/io5";
import markerPng from "../../assets/marker.png";
const containerStyle = { width: "100%", height: "100%", outline: "none" };
const initialCenter = { lat: 40.99759001665414, lng: 71.67265238668314 };
const staticCenter = { lat: 40.99759001665414, lng: 71.67265238668314 };
const radius = 15000;
function getDistance(lat1, lng1, lat2, lng2) {
  const R = 6371e3;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lng2 - lng1);
  const a =
    Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
const Map = () => {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get("lat");
  const long = searchParams.get("long");
  const [createUser] = useCreateUserMutation();
  const [isMoving, setIsMoving] = useState(false);
  const [position, setPosition] = useState(
    lat && long ? { lat: Number(lat), lng: Number(long) } : initialCenter
  );
  const [zoom, setZoom] = useState(lat && long ? 20 : 15);
  const [isOutside, setIsOutside] = useState(false);
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
      setIsMoving(false);
    }
  };
  const onMapClick = useCallback((event) => {
    const newPos = { lat: event.latLng.lat(), lng: event.latLng.lng() };
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
            setZoom(18);
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
    const distance = getDistance(
      position.lat,
      position.lng,
      staticCenter.lat,
      staticCenter.lng
    );
    setIsOutside(distance > radius);
  }, [position]);
  const mapOptions = {
    zoomControl: false,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    gestureHandling: "greedy",
    clickableIcons: false,
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
        <div className="marker">
          <img
            style={
              isMoving
                ? { transform: "translateY(-15px)" }
                : { transform: "translateY(0px)" }
            }
            src={markerPng}
            alt=""
          />
        </div>
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={position}
            zoom={zoom}
            onClick={onMapClick}
            onLoad={onLoad}
            onDragStart={() => setIsMoving(true)}
            onDragEnd={onDragEnd}
            options={mapOptions}
          ></GoogleMap>
        </LoadScript>
      </div>
      <div
        className="map-footer"
        style={
          isMoving
            ? { transform: "translateY(100px)" }
            : { transform: "translateY(0px)" }
        }
      >
        {isOutside && <p>Hozircha bu yerga yetkazilmaydi</p>}
        <button
          style={{ fontSize: "16px" }}
          onClick={handleSubmit}
          disabled={isOutside}
        >
          Manzilni tanlash
        </button>
      </div>
    </div>
  );
};
export default Map;
