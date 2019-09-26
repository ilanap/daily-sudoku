import React from 'react';
import LoaderView from './Loader.jsx';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const mapStateToProps = ({ loader }) => {
    return {
        isLoading: loader.isLoading
    };
};

class Loader extends React.Component {
    static propTypes = { isLoading: PropTypes.bool };

    shouldComponentUpdate(nextProps) {
        return nextProps.isLoading !== this.props.isLoading;
    }
    render() {
        let { isLoading } = this.props;
        return (
            <div className="loaderWrapper">{isLoading && <LoaderView />}</div>
        );
    }
}
export default connect(mapStateToProps)(Loader);
