import React from 'react';

export const MyLocation = ({ latitude, longitude }) => (
  <div>
    <h3>My Location</h3>
    <p>
      <b>lat:</b> {latitude}
    </p>
    <p>
      <b>lng:</b> {longitude}
    </p>
  </div>
);
