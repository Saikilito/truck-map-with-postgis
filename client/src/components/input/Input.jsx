import React from 'react';
import './Input.css';

const Input = ({
  type,
  id,
  placeholder,
  className,
  value,
  name,
  onChange,
  clearable,
  autofocus,
  tabIndex = '0',
}) => (
  <div className="input-container">
    <input
      id={id}
      name={name}
      tabIndex={tabIndex}
      autoFocus={autofocus}
      type={type}
      placeholder={placeholder}
      className={`input ${className}`}
      value={value}
      onChange={onChange}
    />
    {clearable && (
      <button tabIndex="-1" type="reset" className="input__cancel-btn"></button>
    )}
  </div>
);

export default Input;
