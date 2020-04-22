import React from 'react';

function Input({type, className, name, label, value, onChange, isInvalid}) {

    const inputId = `name-${Math.random()}`;

    return (
        <div className={`form-group ${className}`}>
            <label htmlFor={inputId}>{label}</label>
            <input
                id={inputId}
                type={type}
                className={`form-control ${isInvalid ? isInvalid.status ? 'is-invalid' : null : null}`}
                name={name}
                value={value}
                onChange={onChange}
            />
            {
                isInvalid
                    ? isInvalid.status
                    ? <div className="invalid-feedback">
                        {isInvalid.value}
                    </div>
                    : null
                    : null
            }
        </div>
    )
}

export default Input;