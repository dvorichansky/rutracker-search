import React from 'react';
import {Route} from 'react-router-dom';
import Auth from "./containers/Auth/Auth";
import Header from "./components/Header/Header";
import Search from "./containers/Search/Search";
import Home from "./containers/Home/Home";

class App extends React.Component {
    render() {
        return (
            <div className={"min-vh-100 d-flex flex-column"}>
                <Header/>

                <div className={"d-flex flex-grow-1"}>
                    <Route path={'/'} component={Home} exact/>
                    <Route path={'/search'} component={Search}/>
                    <Route path={'/auth'} component={Auth}/>
                </div>
            </div>
        )
    }
}

export default App;
