import React, { useState } from 'react';
import Input from '../input/Input.jsx';
import Loading from '../loading/Loading.jsx';
import Results from './components/Results.jsx';
import './Sidebar.css';

const Sidebar = (
  {
    selectedItem,
    results,
    loading,
    showSidebar,
    currentLatitude,
    currentLongitude,
    query,
    onChangesetQuery = () => {},
    onSubmit = () => {},
    onSearch = () => {},
    onItemSelect = () => {},
    onReset = () => {},
  },
  error,
) => {
  const initState = {
    username: '',
    latitude: currentLatitude ?? '',
    longitude: currentLatitude ?? '',
    searchByKm: undefined,
  };
  const [addUserForm, setAddUserForm] = useState(initState);
  const [hiddenserForm, setHiddenUserForm] = useState(true);
  const onHandleHiddenForm = () => {
    setHiddenUserForm(!hiddenserForm);
  };
  const onChange = (e) => {
    setAddUserForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    console.info(addUserForm);
  };
  return (
    <div
      style={{ minWidth: 270 }}
      className={`sidebar ${showSidebar ? 'sidebar-show' : ''}`}
    >
      <div>
        <p>Mi Location</p>
        <p>lat: {currentLatitude},</p>
        <p>lng: {currentLongitude}</p>
      </div>
      <hr />
      <div style={{ border: 1, borderRadius: '0.5rem' }}>
        <form
          onReset={onReset}
          onSubmit={(e) => {
            setAddUserForm(initState);
            onSearch(e, addUserForm.searchByKm);
          }}
          className="sidebar__search-bar"
        >
          <Input
            id="search"
            name="searchByKm"
            placeholder={'Search By Km'}
            tabIndex="1"
            autofocus
            clearable
            className="sidebar__search-input"
            value={addUserForm.searchByKm}
            onInput={console.info}
            onChange={onChange}
          />
          <button
            className="sidebar__open-close-button"
            style={{ borderRadius: '1rem', maxWidth: 66 }}
            type="submit"
          >
            Search
          </button>
        </form>
      </div>
      <hr />
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
          onReset={onReset}
          onSubmit={(e) => {
            onSubmit(e, addUserForm);
            setAddUserForm(initState);
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
            <Input
              id="usenameInput"
              name="username"
              placeholder={'username'}
              tabIndex="1"
              autofocus
              clearable
              className="sidebar__search-input"
              value={addUserForm.username}
              onInput={console.info}
              onChange={onChange}
            />
            <Input
              id="latitudeInput"
              type={'number'}
              name="latitude"
              placeholder={'latitude'}
              tabIndex="1"
              autofocus
              clearable
              className="sidebar__search-input"
              value={addUserForm.latitude}
              onInput={console.info}
              onChange={onChange}
            />
            <Input
              id="longitudeInput"
              type={'number'}
              name="longitude"
              placeholder={'longitude'}
              tabIndex="1"
              autofocus
              clearable
              className="sidebar__search-input"
              value={addUserForm.longitude}
              onInput={console.info}
              onChange={onChange}
            />
            <button
              tabIndex="1"
              style={{ cursor: 'pointer' }}
              disabled={loading}
              type="submit"
              className="sidebar__search-button"
            >
              Add
            </button>
          </div>
        </form>
      </div>
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
