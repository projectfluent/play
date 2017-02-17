import React, { Component } from 'react';
import { connect } from 'react-redux';
import query from 'query-string';

import PanelsList from './panels-list';
import Panels from './panels';
import { fetch_gist, reset_all } from './actions';

import './style.css';

function Fetching() {
    return (
        <div className="app__modal">
            <div className="app__info">
               Fetching…
            </div>
        </div>
    );
}

function FetchError(props) {
    const { error, action } = props;
    return (
        <div className="app__modal">
            <div className="app__error">
                { error }
            </div>
            <button className="app__button" onClick={action}>
                Use defaults
            </button>
        </div>
    );
}

class App extends Component {
    componentWillMount() {
        const { gist } = query.parse(location.search);

        if (gist) {
            const { fetch_gist } = this.props;
            fetch_gist(gist);
        }
    }

    render() {
        const { is_fetching, fetch_error, reset_all } = this.props;

        const content = is_fetching
            ? <Fetching />
            : fetch_error
            ? <FetchError error={fetch_error} action={reset_all} />
            : <Panels />;

        return (
            <div className="app">
                <header className="app__header">
                    <h1 className="app__title">
                        <span className="app__wordmark">fluent</span>
                        Playground
                    </h1>
                    <nav className="app__nav">
                        <PanelsList />
                    </nav>
                </header>

                <section className="app__panels">
                    { content }
                </section>
            </div>
        );
    }
}

const mapState = state => ({
    is_fetching: state.is_fetching,
    fetch_error: state.fetch_error
});

const mapDispatch = {
    fetch_gist,
    reset_all
};

export default connect(mapState, mapDispatch)(App);
