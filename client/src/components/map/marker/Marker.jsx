import React, { useEffect, useState, useRef } from 'react';
import {
  Marker as MapMarker,
  Popup,
  Tooltip,
  useMapEvents,
} from 'react-leaflet';

const Marker = ({ item, onItemSelect, selectedItem }) => {
  const [position, setPosition] = useState(null);
  const map = useMapEvents({
    click() {
      console.info({ map });
      map.locate();
    },
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  const markerRef = useRef(null);

  useEffect(() => {
    console.info(position);
  }, [position]);

  useEffect(() => {
    const isLoaded =
      !!markerRef.current ||
      !!selectedItem?.latitude ||
      !!selectedItem?.longitude;
    const isSelected = item.id === selectedItem?.id;

    if (!isLoaded || !isSelected) return;

    markerRef.current.openPopup();
  }, [selectedItem, selectedItem?.latitude, selectedItem?.longitude]);

  const isSelected = () => selectedItem?.id === item.id;

  return (
    <MapMarker
      ref={markerRef}
      position={{ lat: item.latitude, lng: item.longitude }}
      eventHandlers={{
        click: (e) => {
          console.info('HOLAA', e);
          onItemSelect(item);
        },
      }}
      opacity={!selectedItem?.id || isSelected() ? 1 : 0.3}
    >
      <Popup>
        <h4>{item.username}</h4>
        <i>
          {item.latitude} {item.longitude}
        </i>
      </Popup>
      <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
        {item.username}
      </Tooltip>
    </MapMarker>
  );
};

export default Marker;
