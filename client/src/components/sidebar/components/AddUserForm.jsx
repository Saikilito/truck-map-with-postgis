import React, { useState } from 'react';
import useFetch from 'use-http';

import { Constants } from '../../../utils';
import Input from '../../input/Input';

export const AddUserForm = ({
  userLatitude,
  userLongitude,
  hiddenserForm,
  onHandleHiddenForm,
}) => {
  const [addUserForm, setAddUserForm] = useState({
    username: '',
    latitude: userLatitude ?? '',
    longitude: userLongitude ?? '',
  });

  const { post, loading } = useFetch(Constants.backendBasePath);

  const inputValues = [
    {
      id: 'usenameInput',
      name: 'username',
      placeholder: 'username',
      value: addUserForm.username,
    },
    {
      id: 'latitudeInput',
      type: 'number',
      name: 'latitude',
      placeholder: 'latitude',
      value: addUserForm.latitude,
    },
    {
      id: 'longitudeInput',
      type: 'number',
      name: 'longitude',
      placeholder: 'longitude',
      value: addUserForm.longitude,
    },
  ];

  const onChange = (e) => {
    setAddUserForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmitAddResult = async (e, data) => {
    e.preventDefault();
    let { username, longitude, latitude } = data;

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
        style={{ backgroundColor: hiddenserForm ? '' : '#f44336' }}
        onClick={onHandleHiddenForm}
      >
        {' '}
        {hiddenserForm ? 'Add User' : 'Close form'}
      </button>
      <form
        onSubmit={(e) => {
          onSubmitAddResult(e, addUserForm);
        }}
        className="sidebar__search-bar"
      >
        <div
          style={{
            width: '100%',
            display: hiddenserForm ? 'none' : 'flex',
            flexDirection: 'column',
          }}
        >
          {inputValues.map((inputConfig, index) => (
            <Input
              {...inputConfig}
              key={`inp-${index}`}
              tabIndex="1"
              autofocus
              clearable
              className="sidebar__search-input"
              onChange={onChange}
            />
          ))}
          <button
            tabIndex="1"
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
