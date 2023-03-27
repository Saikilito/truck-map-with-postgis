import React, { useEffect, useState } from 'react';
import useFetch from 'use-http';

import { Constants } from '../../../utils';
import Input from '../../input/Input';

export const AddUserForm = ({
  userLatitude,
  userLongitude,
  hiddenUserForm,
  onHandleHiddenForm,
  markerPosition,
  setMarkerPosition,
}) => {
  const { post, loading } = useFetch(Constants.backendBasePath);

  const inputValues = [
    {
      id: 'usenameInput',
      name: 'username',
      placeholder: 'username',
      value: markerPosition?.username ?? '',
      required: true,
    },
    {
      id: 'latitudeInput',
      type: 'number',
      name: 'latitude',
      placeholder: 'latitude',
      value: markerPosition?.latitude ?? '',
      readonly: true,
      required: true,
    },
    {
      id: 'longitudeInput',
      type: 'number',
      name: 'longitude',
      placeholder: 'longitude',
      value: markerPosition?.longitude ?? '',
      readonly: true,
      required: true,
    },
  ];

  useEffect(() => {
    setMarkerPosition((prev) => ({
      ...prev,
      latitude: userLatitude,
      longitude: userLongitude,
    }));
  }, [userLatitude, userLongitude]);

  const onChange = (e) => {
    setMarkerPosition((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitAddResult = async (e, data) => {
    e.preventDefault();
    let { username, longitude, latitude } = data;

    console.log(username, longitude, latitude);

    try {
      if (!username || username.length < 4) {
        throw Error('Invalid User name');
      }

      latitude = parseFloat(latitude);
      longitude = parseFloat(longitude);

      await post('/create', { username, longitude, latitude });

      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button
        className="sidebar__open-close-button"
        style={{ backgroundColor: hiddenUserForm ? '' : '#f44336' }}
        onClick={onHandleHiddenForm}
      >
        {' '}
        {hiddenUserForm ? 'Add User' : 'Close form'}
      </button>
      <form
        onSubmit={(e) => {
          onSubmitAddResult(e, markerPosition);
        }}
        className="sidebar__search-bar"
      >
        <div
          style={{
            width: '100%',
            display: hiddenUserForm ? 'none' : 'flex',
            flexDirection: 'column',
          }}
        >
          {inputValues.map((inputConfig, index) => (
            <Input
              {...inputConfig}
              key={`inp-${index}`}
              tabIndex={1}
              autofocus
              clearable={false}
              className="sidebar__search-input"
              onChange={onChange}
            />
          ))}
          <button
            tabIndex={-1}
            style={{ cursor: 'pointer' }}
            disabled={loading}
            type="submit"
            className="sidebar__search-button"
          >
            Add User
          </button>
        </div>
      </form>
    </div>
  );
};
