import React from 'react';
import classnames from 'classnames';

const Button = ({ name, onClick, classNames, value }) => {
    return (
        <input
            className={classnames('button', classNames)}
            type="button"
            value={name}
            onClick={() => onClick(value)}
        />
    );
};

export default Button;
