import React from 'react';
import './Results.css';

import personImg from '../../../assets/icons/someone.png';

const Results = ({
  selectedPerson,
  persons = [],
  onPersonSelect = () => {},
}) => {
  const handleOnKeyDown = (event, person) => {
    const { key } = event;

    if (['Enter', ' '].includes(key)) {
      event.preventDefault();
      onPersonSelect(person);
    }
  };

  return !!persons.length ? (
    <ul tabIndex="-1" className="results">
      {persons.map((person, id) => (
        <li
          key={`people-${person.id}-${id}`}
          className={`${
            selectedPerson?.id === person.id ? 'result--selected ' : ''
          }results__item`}
          id={selectedPerson?.id === person.id ? 'result-selected' : ''}
          onClick={() => onPersonSelect(person)}
          onKeyDown={(event) => handleOnKeyDown(event, person)}
          tabIndex="1"
        >
          <img className="results__image" src={personImg} />
          <div className="results__info">
            <h4 className="results__item-name">{person.username}</h4>
            <i className="results__item-address">
              <p>
                <b>lat:</b> {person.latitude}
              </p>
              <p>
                <b>lng:</b> {person.longitude}
              </p>
            </i>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p>No results for this query</p>
  );
};

export default Results;
