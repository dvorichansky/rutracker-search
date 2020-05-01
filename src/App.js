import React from 'react';
import {Route} from 'react-router-dom';
import Auth from "./containers/Auth/Auth";
import Header from "./components/Header/Header";
import Search from "./containers/Search/Search";
import Home from "./containers/Home/Home";
import {Loader} from "./components/Loader/Loader";
import LoaderContext, {LoaderProvider} from "./context/loader/loaderContext";
import Topic from "./components/Topic/Topic";

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <LoaderProvider value={LoaderContext}>
                <div className={"min-vh-100 d-flex flex-column"}>

                    <Header/>
                    <Loader/>
                    <div className={"d-flex flex-grow-1"}>
                        <Route path={'/'} component={Home} exact/>
                        <Route path={'/topic'} component={Topic}/>
                        <Route path="/(search|topic)/" component={Search}/>
                        <Route path={'/auth'} component={Auth}/>
                    </div>
                </div>
            </LoaderProvider>
        )
    }
}

export default App;
