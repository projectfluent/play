import React from 'react';
import { connect } from 'react-redux';

function Attribute({id, value, dir}) {
    return (
        <div className="attribute">
            <div className="attribute__id">
                <code>.{id}</code>
            </div>
            <div className="attribute__value" dir={dir}>{value}</div>
        </div>
    );
}

function Message(props) {
    const { id, value, attributes, dir } = props;
    return (
        <div className="panel__row">
            <div className="message">
                <div className="message__id">
                    <code>{id}</code>
                </div>
                <div className="message__value" dir={dir}>{value}</div>
            </div>
            {attributes.map(
                attr => <Attribute key={`${id}.${attr.id}`}
                    {...attr}
                    dir={dir}/>
            )}
        </div>
    );
}

function Junk(props) {
    const { value, dir } = props;
    return (
        <div className="panel__row junk">
            <div className="junk__id">
                <code>Parsing error</code>
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
                        const {value, attributes} = messages.get(id);
                        return <Message key={id}
                            id={id}
                            value={value}
                            attributes={attributes}
                            dir={dir}/>;
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
