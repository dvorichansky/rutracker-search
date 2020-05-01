import React from 'react';

function Input({type, className, classNameInput, name, label, value, onChange, placeholder, isInvalidStatus, isInvalidValue, size}) {

    const inputId = `name-${Math.random()}`;

    return (
        <div className={`form-group ${className}`}>
            {
                label
                    ? <label htmlFor={inputId}>{label}</label>
                    : null
            }

            <input
                id={inputId}
                type={type}
                className={`form-control ${classNameInput} ${isInvalidStatus ? 'is-invalid' : ''} ${size ? 'form-control-lg' : ''}`}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
            {
                isInvalidStatus
                    ? <div className="invalid-feedback">
                        {isInvalidValue}
                    </div>
                    : null
            }
        </div>
    )
}

export default Input;