import React, { Component } from 'react';
import { connect } from 'react-redux';

import { create_gist } from './actions';

class GistURL extends Component {
    componentDidMount() {
        this.input.focus();
        this.input.select();
    }

    render() {
      const { id } = this.props;
      const { origin, pathname } = window.location;
      const url = `${origin}${pathname}?gist=${id}`;
      return (
          <input
              readonly={true}
              type="text"
              value={url}
              ref={node => this.input = node}
          />
      );
  }
}

function GistError(props) {
    const { error } = props;
    console.error(error);
    return <em className="share__error">Network Error</em>;
}

function Share(props) {
    const {
        is_fetching, fixture_error, is_creating, create_error, gist_id,
        create_gist
    } = props;

    if (is_fetching || fixture_error) {
        return (
            <button className="share__button" disabled={true}>
                Share via Gist
            </button>
        );
    }

    if (is_creating) {
        return (
            <button className="share__button" disabled={true}>
                Creating…
            </button>
        );
    }

    const more = gist_id
        ? <GistURL id={gist_id} />
        : create_error
            ? <GistError error={create_error} />
            : null;

    return (
      <div>
          <button className="share__button" onClick={create_gist}>
              Share via Gist
          </button>
          { more }
      </div>
    );
}

const mapState = state => ({
    is_fetching: state.is_fetching,
    fixture_error: state.fixture_error,
    is_creating: state.is_creating,
    create_error: state.create_error,
    gist_id: state.gist_id
});

const mapDispatch = {
    create_gist,
};

export default connect(mapState, mapDispatch)(Share);
