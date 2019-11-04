import React from 'react';
import Loader from 'components/Loader/Loader.js';
import Grid from 'components/Grid/Grid.js';
import { difficulties } from './MainPageConstants.js';

const MainPage = ({ data, onPrevious, onNext, isLoading }) => (
    <div className="main">
        <h3> Daily Sudoku Helper</h3>
        {isLoading && <Loader />}
        {!isLoading && (
            <div>
                <b>
                    {' '}
                    {data.title} - {difficulties[data.difficulty]}
                </b>
                , Copyright:{' '}
                <a href="http://www.dailysudoku.com/">Daily Sudoku</a>
                <br />
                <a href="#" onClick={onPrevious}>
                    Previous Day
                </a>{' '}
                |{' '}
                <a href="#" onClick={onNext}>
                    Next Day
                </a>
                <Grid />
            </div>
        )}
    </div>
);

export default MainPage;
