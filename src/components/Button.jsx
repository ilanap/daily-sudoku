import React from 'react';

const Button = ({ name, onClick }) => {
    return <input className="button" type="button" value={name} onClick={() => onClick()} />;
};

export default Button;
