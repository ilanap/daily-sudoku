import React from 'react';
import Cell from './Cell.jsx';
import Button from 'components/Button.jsx';

const Grid = ({ cells, onChange }) => {
    return (
        <div className="grid">
            <div className="wrapper">
                {cells.map((cell, i) => {
                    return <Cell key={i} cell={cell} onChange={onChange} />;
                })}
            </div>
            <Button
                name="Undo"
                onClick={function() {
                    console.log('undo');
                }}
            />
        </div>
    );
};

export default Grid;
