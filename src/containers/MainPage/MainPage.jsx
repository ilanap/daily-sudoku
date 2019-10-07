import React from 'react';
import Loader from 'components/Loader/Loader.js';
import Grid from 'components/Grid/Grid.js';
import { difficulties } from './MainPageConstants.js';

const MainPage = ({ data }) => (
    <div className="main">
        <h3>Daily Sudoku Helper</h3>
        {data.title === undefined && <Loader />}
        {data.title !== undefined && (
            <div>
                <b>
                    {' '}
                    {data.title} - {difficulties[data.difficulty]}
                </b>
                , Copyright:{' '}
                <a href="http://www.dailysudoku.com/">Daily Sudoku</a>
                <br />
                <Grid />
            </div>
        )}
    </div>
);

export default MainPage;
