import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoicmV4OSIsImEiOiJjbGR6dnQ2bXgwNWpzNDBxandtZHQ0ZzVzIn0._leMfBVM3NzX9RVigu5Wtg';

export default function App() {

  const center = [-122.662323, 45.523751];
  const [lng, setLng] = useState(center[0]);
  const [lat, setLat] = useState(center[1]);
  const map = useRef(null);
  const [pins, setPins] = useState([]);
  const [newPinsStatus, setNewPinsStatus] = useState(false);
  const [render, setRender] = useState(false);

  const loadPins = (data) => {
    map.current.on('load', () => {
      // Add My Location
      new mapboxgl.Marker().setLngLat({ lng: center[0], lat: center[1] }).addTo(map.current);
      // Add 20 Markers and PopUps
      data.forEach((pin) => {
        // Create Marker
        let marker = new mapboxgl.Marker()
        const temp = {
          lng: pin.lng,
          lat: pin.lat
        }
        marker.setLngLat(temp).addTo(map.current);
      });
    });
  }

  const initPinsAndMap = async () => {
    const response = await fetch('http://127.0.0.1:3000/pins');
    const data = await response.json();
    setPins(data);

    if (data.length > 0) {
      if (map.current) return; // Initialize map only once
      map.current = new mapboxgl.Map({
        container: "map",
        style: 'mapbox://styles/mapbox/streets-v11',
        center: center,
        zoom: 12
      });
      loadPins(data);
    }
  }

  useEffect(() => {
    initPinsAndMap();
  }, []);

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
  }

  const separator = (id, pins) => {
    const point = pins.find(pin => pin.id === id);
    const rest = pins.filter(pin => pin.id !== id);
    return {
      point,
      rest,
    }
  }

  const pythagoras = async (initial, final) => {
  const lngDiff = Math.abs(initial.lng - final.lng);
  const latDiff = Math.abs(initial.lat - final.lat);
  return Math.sqrt(Math.pow(lngDiff, 2) + Math.pow(latDiff, 2));
  }

  let orderToVisit = 1;

  // Search Nearest Pin
  const searcher = async (separatedObj) => {
    const distances = []; //Store distances from Pythagoras Theorem.
    const mainPin = separatedObj.point;
    const otherPins = separatedObj.rest;
    otherPins.forEach(async (i) => {
      distances.push(pythagoras(mainPin, i));
    }); // Loop through other pins to collect distances.

    const smallest = Math.min(...distances) // Nearest distance
    const indexOfNearestDistance = distances.indexOf(smallest);
    const nearestPin = separatedObj.rest[indexOfNearestDistance];
    nearestPin.label = orderToVisit;
    setRender(!render);
    orderToVisit += 1;

    // Add Layer of the Routes
    getRoute(mainPin, nearestPin);

    return [nearestPin.id, otherPins];
  };

  const algorithm = ({ id = 1, pins } = {}) => {
    if (pins.length > 1) {
      const sepRes = separator(id, pins);
      const searchRes = searcher(sepRes);
      algorithm({ id: searchRes[0], pins: searchRes[1] });
      setNewPinsStatus(false);
    }
  }

  useEffect(() => {
    if (!map.current) return; // Wait for map to initialize
    algorithm({ pins: pins });
  }, [pins]);

  // Add New Markers
  useEffect(() => {
    if (!map.current) return; // Wait for map to initialize
    map.current.on('click', (e) => {
      // Create new Markers
      if (newPinsStatus) new mapboxgl.Marker().setLngLat(e.lngLat).addTo(map.current);

      // Add new Marker Data to Pins
      pins.push({
        id: pins.length,
        label: 'Unknown Order',
        lng: e.lngLat.lng,
        lat: e.lngLat.lat,
      })
    });
  }, [newPinsStatus]);

  useEffect(() => {
    if (!map.current) return; // Wait for map to initialize
    map.current.on('click', (e) => {
      setLng(e.lngLat.lng);
      setLat(e.lngLat.lat);
    });
  });

  const displayPopup = (pin) => {
    // Create PopUp
    const popup = new mapboxgl.Popup({ closeOnClick: false })
      .setLngLat([Number(pin.lng) - 0.002, Number(pin.lat) + 0.003])
      .setHTML(`<h1>${pin.label}</h1>`)
      .addTo(map.current);
    map.current.on('closeAllPopups', () => {
      popup.remove();
    });
  };

  const closeAllPopups = () => {
    map.current.fire('closeAllPopups');
  }

  return (
    <>
      <div className="flex">
        <div className="w-[18vw] bg-black/20 h-screen text-center flex flex-col items-center justify-center">
          <p className="font-bold text-lg">Places to Visit</p>
          {
            pins.sort((a, b) => a.label - b.label).map(pin =>
              <div className="mb-1">
                {
                  typeof pin.label === "string" ?
                    <button type="button" onClick={() => displayPopup(pin)}>
                      {pin.label}
                    </button> :
                    <button type="button" onClick={() => displayPopup(pin)}>
                      Location {pin.label} to visit
                    </button>
                }
              </div>
            )
          }
        </div>
        <div className="flex flex-col gap-2 justify-center items-center w-[82vw] h-screen">
          <h1 className="text-lg">Clicked Location</h1>
          <div className="text-lg">
            Longitude: {lng}, Latitude: {lat}
          </div>
          <div id="map" className="w-full h-[75%] my-4" />
          <div className="flex justify-between w-[80%]">
            <button type="button" className={newPinsStatus ? "bg-red-500 px-4 py-2 text-lg font-bold rounded-full text-white" : "bg-green-500 px-4 py-2 text-lg font-bold rounded-full text-white"} onClick={() => setNewPinsStatus(true)}>
              {newPinsStatus ? "Adding New Pins..." : "Add New Pins"}
            </button>
            <button type="button" className="bg-red-500 px-4 py-2 text-lg font-bold rounded-full text-white" onClick={() => closeAllPopups()}>Close All Popups</button>
            <button type="button" className="bg-blue-500 px-4 py-2 text-lg font-bold rounded-full text-white" onClick={() => algorithm({ pins: pins })}>Calculate the Route</button>
          </div>
        </div>
      </div>
    </>
  );
}
