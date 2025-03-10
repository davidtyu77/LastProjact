import React, { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 32.0853, // תל אביב כברירת מחדל
  lng: 34.7818,
};

const GoogleMapComponent = ({ onLocationSelect }) => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(newLocation);
          onLocationSelect(newLocation); // שולח את המיקום ל-EventForm
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [onLocationSelect]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyAHe8J0_q7QEj3mlKojUjg0WCKy4FDtRdc">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={location || defaultCenter}
        zoom={15}
      >
        {location && <Marker position={location} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
