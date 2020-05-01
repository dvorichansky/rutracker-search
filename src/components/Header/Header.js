import React from 'react';
import {NavLink} from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSearch, faSignInAlt  } from '@fortawesome/free-solid-svg-icons';
import './Header.scss';

class Header extends React.Component {
    render() {
        return (
            <header className={"header"}>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark">
                    <NavLink className="navbar-brand h1 mb-0" to="/" exact>Rutracker Search</NavLink>

                    <button className="navbar-toggler" type="button">
                        <span className="navbar-toggler-icon"></span>
                    </button>

                    <div className="collapse navbar-collapse">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/" exact><FontAwesomeIcon icon={faHome} className={"mr-2"} />Главная</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/search"><FontAwesomeIcon icon={faSearch} className={"mr-2"} />Поиск</NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/auth"><FontAwesomeIcon icon={faSignInAlt} className={"mr-2"} />Вход</NavLink>
                            </li>
                        </ul>
                    </div>
                </nav>
            </header>
        );
    }
}

export default Header;