import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import './index.scss';
import App from './App';

const application = (
    <BrowserRouter>
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    </BrowserRouter>
);

render(application, document.getElementById('root'));
