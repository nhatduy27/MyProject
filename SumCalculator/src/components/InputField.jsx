import React from 'react';

const InputField = ({ label, id, value, onChange, placeholder }) => {
  return (
    <div className="input-group">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="number-input"
      />
    </div>
  );
};

export default InputField;