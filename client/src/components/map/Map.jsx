import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import './Map.css';
import Marker from './marker/Marker';

const Map = ({
  results = [],
  selectedItem = {},
  userPosition,
  onItemSelect = () => {},
}) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!selectedItem?.latitude || !selectedItem?.longitude || !mapRef.current)
      return;

    const { latitude, longitude } = selectedItem;
    mapRef.current.target.flyTo({ lat: latitude, lng: longitude }, 15);
  }, [selectedItem, selectedItem?.latitude, selectedItem?.longitude]);

  useEffect(() => {
    if (!results.length || !mapRef.current) return;

    const { latitude, longitude } = results[0];

    mapRef.current.target.flyTo({ lat: latitude, lng: longitude });

    // Removing the map markers from keyboard flow
    const mapElement = mapRef.current.target._container;
    const mapMarkersElements = mapElement.getElementsByClassName(
      'leaflet-marker-icon',
    );

    Object.values(mapMarkersElements).forEach((markerElement) =>
      markerElement.setAttribute('tabindex', '-1'),
    );
  }, [results]);

  useEffect(() => {
    if (!mapRef.current) return;

    console.info({ mapRef });
    mapRef.current.target.on({
      click: function () {
        onItemSelect(null);
      },
      popupopen: function (event) {
        // When a popup is opened, then the focus is going to the PopUp, so it's easy to find
        const popUpElement = event.popup._container;
        const popUpCloseButton = popUpElement.getElementsByClassName(
          'leaflet-popup-close-button',
        )[0];

        popUpElement.setAttribute('tabindex', '2');
        popUpCloseButton.setAttribute('tabIndex', '2');
        popUpElement.focus();
      },
      popupclose: () => {
        // When the popup is closed, then the focus is going to the list, so navigate is easy
        const selectedElement = document.getElementById('result-selected');
        const searchBar = document.getElementById('searchInput');

        if (selectedElement) return selectedElement.focus();
        if (searchBar) return searchBar.focus();
      },
    });

    // Removing the map container from keyboard flow
    const mapElement = mapRef.current.target._container;
    mapElement.setAttribute('tabindex', '-1');

    // Moving Zoom in / Zoom out buttons to the last steps in keyboard flow
    const mapZoomPanel = mapElement.getElementsByClassName(
      'leaflet-control-zoom',
    )[0];
    const zoomButtons = mapZoomPanel.getElementsByTagName('a');

    Object.values(zoomButtons).forEach((zoomButton) =>
      zoomButton.setAttribute('tabindex', '3'),
    );

    // Moving attribution credits to the last steps in the keyboard
    const attributionPanelElements = mapElement.querySelectorAll(
      '.leaflet-control-attribution > *',
    );
    Object.values(attributionPanelElements).forEach((panelElement) =>
      panelElement.setAttribute('tabindex', '4'),
    );
  }, []);

  return (
    <div>
      <MapContainer
        className="map"
        center={userPosition}
        zoom={6}
        whenReady={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {results.length &&
          results.map((result) => (
            <Marker
              key={`marker-${result.id}`}
              item={result}
              onItemSelect={onItemSelect}
              selectedItem={selectedItem}
            />
          ))}
      </MapContainer>
    </div>
  );
};

export default Map;
