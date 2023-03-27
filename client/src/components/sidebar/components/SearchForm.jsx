import React, { useState } from 'react';
import Input from '../../input/Input.jsx';

export const SearchForm = ({ onSearch }) => {
  const [searchByKm, setSearchByKm] = useState('');
  const onChange = ({ target: { value } }) => {
    setSearchByKm(value);
  };
  return (
    <div style={{ border: 1, borderRadius: '0.5rem' }}>
      <form
        onSubmit={(e) => {
          setSearchByKm('');
          onSearch(e, searchByKm);
        }}
        className="sidebar__search-bar"
      >
        <Input
          id="search"
          name="searchByKm"
          placeholder={'Search By Km'}
          tabIndex={1}
          autofocus
          clearable={false}
          className="sidebar__search-input"
          value={searchByKm}
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
  );
};
