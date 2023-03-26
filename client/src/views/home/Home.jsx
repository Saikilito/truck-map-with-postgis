import React, { useEffect } from 'react';
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
  const [userPosition, setUserPosition] = React.useState(
    new L.LatLng(...generateRandomCoordinates()),
  );
  const [persons, setPersons] = React.useState([]);
  const [selectedPerson, setSelectedPerson] = React.useState(null);

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
  useEffect(async () => {
    if (!persons.length) {
      const user = await get('/all?limit=1');
      const notUsers = user.length === 0;
      if (notUsers) {
        await post('/create', {
          username: 'My Selft',
          latitude: userPosition.lat,
          longitude: userPosition.lng,
        });
      }
    }
  }, []);

  // Load Persons
  useEffect(() => {
    getAPIPersons();
  }, []);

  const getAPIPersons = async () => {
    const rawPersons = await get(`/all`);

    if (response.ok) {
      const persons = rawPersons.data.users;
      const referencedPersons = persons.map((person) => {
        person.ref = React.createRef();
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
      />
      <Map
        userPosition={userPosition}
        selectedItem={selectedPerson}
        results={persons}
        onItemSelect={onPersonSelected}
      />
    </div>
  );
};

export default Home;
