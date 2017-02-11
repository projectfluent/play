import React from 'react';
import { connect } from 'react-redux';

function Message(props) {
    const { id, value } = props;
    return (
        <div className="message">
            <div className="message__id">
                <code>{id}</code>
            </div>
            <div className="message__value">{value}</div>
        </div>
    );
}

function OutputPanel(props) {
    const { messages } = props;
    
    return (
        <section className="panel">
            <h1 className="panel__title">Output</h1>
            {Array.from(messages).map(([id, value]) => (
                <Message key={id} id={id} value={value} />
            ))}
        </section>
    );
}

const mapState = state => ({
    messages: state.out
});

export default connect(mapState)(OutputPanel);
