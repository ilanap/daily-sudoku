const delay = require('mocker-api/utils/delay');

const noProxy = process.env.NO_PROXY === 'true';

const proxy = {
    _proxy: {
        proxy2: {
            '/sudoku.*': 'http://mysudokuhelper.appspot.com/'
        },
        changeHost: true
    },
    'GET /sudoku': (req) => {
        console.log('-sudoku--->', req.params)
        return {
            difficulty: 4,
            numbers:
                '...49..1.1.5..7..32....56..3.1.6.....5.....9.....5.3.7..69....89..3..5.2.2..48...',
            title: 'Daily Sudoku: Tue 24-Sep-2019'
        };
    }
}
module.exports = (noProxy ? {} : delay(proxy, 500));
