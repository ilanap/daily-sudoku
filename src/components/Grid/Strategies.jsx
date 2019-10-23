import React from 'react';
import { strategyTypes } from 'components/Grid/GridConstants';

const Strategies = ({ clickStrategy }) => {
    return (
        <div>
            <label className="label">Solver Helpers: </label>
            <select className="strategy" onChange={evt => clickStrategy(evt)}>
                <option value={strategyTypes.NONE}>
                    --- Choose Strategy ---
                </option>
                <option value={strategyTypes.ONLY_ONE_VALUE}>
                    Cell with only one value
                </option>
                <option value={strategyTypes.ONLY_ROW_COL_GRID_VALUE}>
                    Only value for row/cell/grid
                </option>
                <option value={strategyTypes.HELPER_GRID}>Helper Grid</option>
                <option value={strategyTypes.NONE}>None </option>
            </select>
        </div>
    );
};

export default Strategies;
