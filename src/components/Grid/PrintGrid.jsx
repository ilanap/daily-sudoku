import React from 'react';

const PrintGrid = ({ cells }) => {
    return (
        <div className="grids-wrapper">
            <div className="wrapper">
                {cells.map((cell, i) => {
                    return <div key={i}>{cell.value}</div>;
                })}
            </div>
        </div>
    );
};

export default PrintGrid;
