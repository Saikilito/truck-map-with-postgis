import React from 'react';
import {
  Marker as MapMarker,
  Popup,
  Tooltip,
  useMapEvents,
} from 'react-leaflet';

import { Icon } from 'leaflet';

const Markers = ({
  results,
  onItemSelect,
  selectedItem,
  hiddenUserForm,
  markerPosition,
  setMarkerPosition,
}) => {
  const map = useMapEvents({
    click(e) {
      if (hiddenUserForm) {
        map.locate();
        return;
      }
      setMarkerPosition((prev) => ({
        ...prev,
        latitude: e.latlng.lat,
        longitude: e.latlng.lng,
      }));
    },
    locationfound(e) {
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  const markerIcon = () =>
    new Icon({
      iconUrl: `/images/marker-icon-2x.png`,
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [30, 46],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

  return (
    <>
      {results &&
        results.map((item) => {
          const isSelected = () => selectedItem?.id === item.id;
          return (
            <MapMarker
              key={item.id}
              icon={markerIcon()}
              position={{ lat: item.latitude, lng: item.longitude }}
              eventHandlers={{
                click: () => {
                  onItemSelect(item);
                },
              }}
              opacity={!selectedItem?.id || isSelected() ? 1 : 0.3}
            >
              <Popup>
                <h4>{item.username}</h4>
                <i>
                  {item.latitude}, {item.longitude}
                </i>
              </Popup>
              <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
                {item.username}
              </Tooltip>
            </MapMarker>
          );
        })}
      {markerPosition && !hiddenUserForm && (
        <MapMarker
          icon={markerIcon()}
          position={{
            lat: markerPosition.latitude,
            lng: markerPosition.longitude,
          }}
        >
          <Popup>
            <h4>{markerPosition.username}</h4>
            <i>
              {markerPosition.latitude}, {markerPosition.longitude}
            </i>
          </Popup>
          <Tooltip direction="bottom" offset={[0, 20]} opacity={1}>
            {markerPosition.username}
          </Tooltip>
        </MapMarker>
      )}
    </>
  );
};

export default Markers;
