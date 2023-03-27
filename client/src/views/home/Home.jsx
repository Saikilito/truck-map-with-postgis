import React, { createRef, useEffect, useState } from 'react';
import useFetch from 'use-http';
import L from 'leaflet';

import Sidebar from '../../components/sidebar/Sidebar';
import Map from '../../components/map/Map';
import { Constants } from '../../utils';
import './Home.css';

function generateRandomCoordinates() {
  const latitud = Math.random() * 180 - 90;
  const longitud = Math.random() * 360 - 180;

  return [latitud, longitud];
}

const Home = () => {
  const [userPosition, setUserPosition] = useState(
    // @ts-ignore
    new L.LatLng(...generateRandomCoordinates()),
  );
  const [persons, setPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState({
    latitude: '',
    longitude: '',
  });
  const [markerPosition, setMarkerPosition] = useState({
    username: '',
    latitude: '',
    longitude: '',
  });
  const [hiddenUserForm, setHiddenUserForm] = useState(true);

  const { get, post, response, loading, error } = useFetch(
    Constants.backendBasePath,
  );

  // Get User Location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(function (position) {
        const { latitude, longitude } = position.coords;
        latitude &&
          longitude &&
          setUserPosition(new L.LatLng(latitude, longitude));
      });
    } else {
      console.info('Geolacation Not Available');
    }
  }, []);

  // Create first user
  useEffect(() => {
    const getUserOrCreate = async () => {
      const user = await get('/all?limit=1');
      const notUsers = user.length === 0;
      if (notUsers) {
        await post('/create', {
          username: 'My Self',
          latitude: userPosition.lat,
          longitude: userPosition.lng,
        });
      }
    };
    if (!persons.length) {
      getUserOrCreate();
    }
  }, []);

  // Load Persons
  useEffect(() => {
    getAPIPersons();
  }, []);

  useEffect(() => {
    setMarkerPosition({
      username: '',
      latitude: '',
      longitude: '',
    });
  }, [hiddenUserForm]);

  const getAPIPersons = async () => {
    const rawPersons = await get(`/all`);

    if (response.ok) {
      const persons = rawPersons.data.users;
      const referencedPersons = persons.map((person) => {
        person.ref = createRef();
        return person;
      });

      setPersons(referencedPersons);
    }
  };

  const onPersonSelected = (person) => {
    person?.ref?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    setSelectedPerson(person);
  };

  const onSubmitSearch = async (e, searchByKm) => {
    e.preventDefault();

    if (!searchByKm || searchByKm < 1) {
      return;
    }

    const drawPersons = await get(
      `/all?km=${searchByKm}&longitude=${userPosition.lng}&latitude=${userPosition.lat}`,
    );

    if (drawPersons.success) {
      const persons = drawPersons.data.users;
      setPersons(persons);
    }
  };

  const onHandleHiddenForm = () => {
    setHiddenUserForm(!hiddenUserForm);
  };

  return (
    <div className="home">
      <Sidebar
        userLatitude={userPosition.lat}
        userLongitude={userPosition.lng}
        selectedItem={selectedPerson}
        results={persons}
        loading={loading}
        error={error}
        getAllResults={getAPIPersons}
        onSearch={onSubmitSearch}
        onItemSelect={onPersonSelected}
        hiddenUserForm={hiddenUserForm}
        onHandleHiddenForm={onHandleHiddenForm}
        markerPosition={markerPosition}
        setMarkerPosition={setMarkerPosition}
      />
      <Map
        userPosition={userPosition}
        selectedItem={selectedPerson}
        results={persons}
        onItemSelect={onPersonSelected}
        hiddenUserForm={hiddenUserForm}
        markerPosition={markerPosition}
        setMarkerPosition={setMarkerPosition}
      />
    </div>
  );
};

export default Home;
