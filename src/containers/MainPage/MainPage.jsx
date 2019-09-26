import React from 'react';
import Loader from 'components/Loader/Loader.js';
import Grid from 'components/Grid/Grid.js';
import { difficulties } from './MainPageConstants.js';

const MainPage = ({ data }) => (
    <div className="main">
        <h1>Daily Sudoku Helper</h1>
        {data.title === undefined && <Loader />}
        {data.title !== undefined && (
            <div>
                <h3>{data.title} - {difficulties[data.difficulty]}</h3>
                <Grid />
            </div>
        )}
    </div>
);

export default MainPage;
