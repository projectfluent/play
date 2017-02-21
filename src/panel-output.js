import React from 'react';
import { connect } from 'react-redux';

function Message(props) {
    const { id, value, dir } = props;
    return (
        <div className="message">
            <div className="message__id">
                <code>{id}</code>
            </div>
            <div className="message__value" dir={dir}>{value}</div>
        </div>
    );
}

function Junk(props) {
    const { value, dir } = props;
    return (
        <div className="junk">
            <div className="junk__id">
                <code>ParseError</code>
            </div>
            <div className="junk__value">
                <code dir={dir}>{value}</code>
            </div>
        </div>
    );
}

function OutputPanel(props) {
    const { body, messages, dir } = props;
    
    return (
        <section className="panel">
            <h1 className="panel__title">Output</h1>
            {body.map(entry => {
                switch (entry.type) {
                    case 'Message': {
                        const { id: { name: id } } = entry;
                        const value = messages.get(id);
                        return <Message key={id} id={id} value={value} dir={dir}/>;
                    }
                    case 'Junk': {
                        const { content } = entry;
                        return <Junk key={Date.now()} value={content} dir={dir}/>;
                    }
                    case 'Comment':
                    case 'Section':
                    default:
                        return null;
                }
            })}
        </section>
    );
}

const mapState = state => ({
    body: state.ast.body,
    messages: state.out,
    dir: state.dir
});

export default connect(mapState)(OutputPanel);
