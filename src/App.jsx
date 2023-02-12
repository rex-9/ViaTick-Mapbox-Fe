import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import pins from './helper/data';

mapboxgl.accessToken = 'pk.eyJ1IjoicmV4OSIsImEiOiJjbGR6dnQ2bXgwNWpzNDBxandtZHQ0ZzVzIn0._leMfBVM3NzX9RVigu5Wtg';

export default function App() {

  const center = [-122.662323, 45.523751];
  const [lng, setLng] = useState(center[0]);
  const [lat, setLat] = useState(center[1]);
  const map = useRef(null);

  // Get Route from Mapbox Directions API
  async function getRoute(start, end) {
    const query = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/cycling/${start.lng},${start.lat};${end.lng},${end.lat}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`,
      { method: 'GET' }
    );
    const json = await query.json();
    const data = json.routes[0];
    const route = data.geometry.coordinates;
    const geojson = {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: route
      }
    };
    // if the route already exists on the map, we'll reset it using setData
    if (map.current.getSource(`route-${start.id}`)) {
      map.current.getSource(`route-${start.id}`).setData(geojson);
    }
    // otherwise, we'll make a new request
    else {
      map.current.addLayer({
        id: `route-${start.id}`,
        type: 'line',
        source: {
          type: 'geojson',
          data: geojson
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': '#3887be',
          'line-width': 5,
          'line-opacity': 0.75
        }
      });
    }
    // add turn instructions here at the end
  }
  const separator = (id, pins) => {
    const point = pins.find(pin => pin.id === id);
    const rest = pins.filter(pin => pin.id !== id);
    return {
      point,
      rest,
    }
  }

  const pythagoras = (initial, final) => {
    const lngDiff = Math.abs(initial.lng - final.lng);
    const latDiff = Math.abs(initial.lat - final.lat);
    return Math.sqrt(Math.pow(lngDiff, 2) + Math.pow(latDiff, 2));
  }

  const searcher = (separatedObj) => {
    const distances = []; //Store distances from Pythagoras.
    const mainPin = separatedObj.point;
    const otherPins = separatedObj.rest;
    otherPins.forEach((i) => {
      distances.push(pythagoras(mainPin, i));
    }); // Loop through other pins to collect distances.
    const smallest = Math.min(...distances) // Nearest distance
    const indexOfNearestDistance = distances.indexOf(smallest);
    const nearestPin = separatedObj.rest[indexOfNearestDistance];

    // Add Layer of the Route
    getRoute(mainPin, nearestPin);

    return [nearestPin.id, otherPins];
  };

  const algorithm = ({ id = 1, pins } = {}) => {
    if (pins.length > 1) {
      const sepRes = separator(id, pins);
      const searchRes = searcher(sepRes);
      algorithm({ id: searchRes[0], pins: searchRes[1] });
    }
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: "map",
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center,
      zoom: 12
    });
  }, [map.current]);

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    map.current.on('load', () => {
      // Add My Location
      new mapboxgl.Marker().setLngLat({lng: center[0], lat: center[1]}).addTo(map.current);
      // Add 20 MARKERS
      pins.forEach((pin) => {
        let marker = new mapboxgl.Marker()
        const temp = {
          lng: pin.lng,
          lat: pin.lat
        }
        marker.setLngLat(temp).addTo(map.current);
        // console.log("Added marker at: ", temp.lng, temp.lat);
        // Add a ROUTE
        // const coords = Object.keys(e.lngLat).map((key) => e.lngLat[key]);
        // getRoute(coords);

        // Run the Algorithm
        algorithm({ pins: pins });
      });
    });
    map.current.on('click', (e) => {
      setLng(e.lngLat.lng);
      setLat(e.lngLat.lat);
    });
  }, []);

  return (
    <>
      <div className="flex flex-col gap-2 justify-center items-center h-screen">
        <div className="sidebarStyle">Longitude: {lng}, Latitude: {lat}</div>
        <div id="map" className='w-[75%] h-[75%]' />
      </div>
    </>
  );
}
