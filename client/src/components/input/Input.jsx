import React from 'react';
import './Input.css';

const Input = ({
  id,
  placeholder,
  className,
  value,
  name,
  onChange,
  clearable,
  autofocus,
  type = 'text',
  tabIndex = 0,
  readonly = false,
  required = false,
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
      readOnly={readonly}
      required={required}
    />
    {clearable && (
      <button tabIndex={-1} type="reset" className="input__cancel-btn">
        Cancel
      </button>
    )}
  </div>
);

export default Input;
