import React from 'react';
import { strategyTypes } from 'components/Grid/GridConstants';

const Strategies = ({ clickStrategy }) => {
    return (
        <div className="helper">
            <label className="label">Solver Helpers: </label>
            <select className="strategy" onChange={evt => clickStrategy(evt)}>
                <option value={strategyTypes.NONE}>
                    --- Choose Strategy ---
                </option>
                <option value={strategyTypes.ONLY_ONE_VALUE}>
                    Cell with only one value
                </option>
                <option value={strategyTypes.ONLY_VALUE_IN_REGION}>
                    Only value for row/cell/grid
                </option>
                <option value={strategyTypes.HELPER_GRID}>Helper Grid</option>
                <option value={strategyTypes.NONE}>None </option>
            </select>
        </div>
    );
};

export default Strategies;
