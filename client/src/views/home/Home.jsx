import React, { useEffect } from 'react';
import L from 'leaflet';

import Sidebar from '../../components/sidebar/Sidebar';
import Map from '../../components/map/Map';
import useFetch from 'use-http';
import './Home.css';

const searchParams = new URLSearchParams(document.location.search);

const Home = () => {
  const [userPosition, setUserPosition] = React.useState(
    new L.LatLng(43.6007847, -116.3039377),
  );
  const [persons, setPersons] = React.useState();
  const [selectedPerson, setSelectedPerson] = React.useState(null);
  const [query, setQuery] = React.useState('');
  const { get, post, response, loading, error } = useFetch(
    'http://localhost:8089/api/user',
  );

  const [isOpenSidebar] = React.useState(true);

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
      console.log('Geolacation Not Available');
    }
  }, []);

  useEffect(() => {
    const paramQuery = searchParams.get('q');
    if (paramQuery) loadInitialPersons(paramQuery);
    else getAPIPersons();
  }, [searchParams]);

  const loadInitialPersons = async (paramQuery = '') => {
    const initialPersons = await get(`/resource/rqzj-sfat?$q=${paramQuery}`);
    if (response.ok) {
      const referencedPersons = initialPersons.map((person) => {
        person.ref = React.createRef();
        return person;
      });

      setPersons(referencedPersons);
      setQuery(paramQuery);
    }
  };

  const getAPIPersons = async () => {
    const rawPersons = await get('/all');
    const persons = rawPersons.data.users;

    if (response.ok) {
      const referencedPersons = persons.map((person) => {
        person.ref = React.createRef();
        return person;
      });
      console.info('GET API PERSONS', { referencedPersons });
      setPersons(referencedPersons);
      if (query.length) setQuery(query);
    }
  };

  const onPersonSelected = (person) => {
    person?.ref?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    setSelectedPerson(person);
  };

  const onSubmit = async (e, data) => {
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

  const onSubmitSearch = async (e, searchByKm) => {
    e.preventDefault();

    if (!searchByKm) {
      return;
    }
    const persons = await get(
      `/all?km=${searchByKm}&longitude=${userPosition.lng}&latitude=${userPosition.lat}`,
    );

    console.info({ persons });
    try {
    } catch (error) {
      console.error(error);
    }
  };

  // const onSearch = (e) => {
  //   e.preventDefault();
  //   getAPIPersons();
  //   searchParams.set('q', query);
  //   window.history.pushState({}, null, `?${searchParams.toString()}`);
  // };

  const onReset = (e) => {
    e.preventDefault();
    setQuery('');
    window.history.pushState({}, null, `?${searchParams.toString()}`);
    searchParams.set('q', '');
    loadInitialPersons();
  };

  return (
    <div className="home">
      <Sidebar
        onItemSelect={onPersonSelected}
        currentLatitude={userPosition.lat}
        currentLongitude={userPosition.lng}
        selectedItem={selectedPerson}
        results={persons}
        loading={loading}
        error={error}
        showSidebar={isOpenSidebar}
        query={query}
        setQuery={setQuery}
        onSubmit={onSubmit}
        onSearch={onSubmitSearch}
        onReset={onReset}
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
