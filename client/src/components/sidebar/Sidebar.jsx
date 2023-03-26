import React, { useState } from 'react';

import Loading from '../loading/Loading.jsx';
import { Results, AddUserForm, MyLocation, SearchForm } from './components';
import './Sidebar.css';

const Sidebar = ({
  selectedItem,
  results,
  loading,
  userLatitude,
  userLongitude,
  getAllResults = () => {},
  onSearch = () => {},
  onItemSelect = () => {},
  error,
}) => {
  const [hiddenserForm, setHiddenUserForm] = useState(true);
  const onHandleHiddenForm = () => {
    setHiddenUserForm(!hiddenserForm);
  };

  return (
    <div className={`sidebar sidebar-show`}>
      <MyLocation
        {...{
          latitude: userLatitude,
          longitude: userLongitude,
        }}
      />
      <hr />
      <SearchForm
        {...{
          onSearch,
        }}
      />
      <hr />
      <AddUserForm
        {...{
          userLatitude,
          userLongitude,
          hiddenserForm,
          onHandleHiddenForm,
        }}
      />
      <hr />
      <button className="sidebar__open-close-button" onClick={getAllResults}>
        Show All
      </button>
      <hr />
      {error && <p>{error.message}</p>}
      <Loading show={loading} />
      <Results
        onPersonSelect={onItemSelect}
        persons={results}
        selectedPerson={selectedItem}
      />
    </div>
  );
};

export default Sidebar;
