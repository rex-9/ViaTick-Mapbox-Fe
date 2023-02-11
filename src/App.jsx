import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoicmV4OSIsImEiOiJjbGR6dnQ2bXgwNWpzNDBxandtZHQ0ZzVzIn0._leMfBVM3NzX9RVigu5Wtg';

export default function App() {
  const [lng, setLng] = useState(-122.662323);
  const [lat, setLat] = useState(45.523751);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: "map",
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [lng, lat],
      zoom: 12
    });
  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('click', (e) => {
      let marker = new mapboxgl.Marker()
      marker.setLngLat(e.lngLat).addTo(map.current);
      console.log("Marker Added")
    });
    ['click', 'ontouchstart'].forEach(event => {
      map.current.on(event, (e) => {
        setLng(e.lngLat.lng);
        setLat(e.lngLat.lat);
      })
    });
  });

  return (
    <>
      <div className="flex flex-col gap-2 justify-center items-center h-screen">
        <div className="sidebarStyle">Longitude: {lng}, Latitude: {lat}</div>
        <div id="map" className='w-[75%] h-[75%]' />
      </div>
    </>
  );
}
