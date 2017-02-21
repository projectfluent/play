import React, { Component } from 'react';
import { connect } from 'react-redux';
import query from 'query-string';

import PanelsList from './panels-list';
import Panels from './panels';
import Share from './share';
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

function FixtureError(props) {
    const { error, action } = props;
    let error_message;

    switch (error.type) {
        case 'NETWORK_ERROR': {
            const { data: response } = error;
            error_message = (
                <div className="app__error">
                    {response.status === 404
                        ? 'Gist not found.'
                        : `Error fetching the gist: ${response.statusText}`
                    }
                </div>
            );
            break;
        }
        case 'FIXTURE_ERROR': {
            error_message = (
                <div className="app__error">
                    The gist does not appear to contain valid
                    Playground files.
                </div>
            );
            break;
        }
        default: {
            // Log the error for debugging.
            console.error(error);

            error_message = (
                <div className="app__error">
                    Something went wrong.
                </div>
            );
        }
    }

    return (
        <div className="app__modal">
            { error_message }
            <button className="modal__button" onClick={action}>
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
        const { is_fetching, fixture_error, reset_all } = this.props;

        const content = is_fetching
            ? <Fetching />
            : fixture_error
                ? <FixtureError error={fixture_error} action={reset_all} />
                : <Panels />;

        return (
            <div className="app">
                <header className="app__header">
                    <h1 className="app__title">
                        <span className="app__wordmark">fluent</span>
                        Playground
                    </h1>

                    <nav className="app__buttons">
                        <PanelsList />
                    </nav>

                    <nav className="app__share">
                        <Share />
                    </nav>

                    <nav className="app__links">
                        <a className="link" href="http://projectfluent.io/fluent/guide">Syntax Guide</a>
                        <a className="link" href="http://projectfluent.io">ProjectFluent.io</a>
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
    fixture_error: state.fixture_error
});

const mapDispatch = {
    fetch_gist,
    reset_all
};

export default connect(mapState, mapDispatch)(App);
