import React from 'react';

import PanelList from './panel-list';
import Panels from './panels';

import './style.css';

export default function App() {
    return (
        <div className="app">
            <header className="app__header">
                <h1 className="app__title">Fluent Playground</h1>
                <nav className="app__nav">
                    <PanelList />
                </nav>
            </header>

            <section className="app__panels">
                <Panels />
            </section>
        </div>
    );
}
