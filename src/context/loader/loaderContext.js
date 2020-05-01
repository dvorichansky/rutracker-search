import React, {Component, createContext} from 'react';

const LoaderContext = createContext(false);

class LoaderProvider extends Component {
    state = {
        loaderStatus: false
    };

    setLoaderStatus = loaderStatus => {
        this.setState(prevState => ({
            loaderStatus
        }))
    };

    render() {
        const {children} = this.props;
        const {loaderStatus} = this.state;
        const {setLoaderStatus} = this;

        return (
            <LoaderContext.Provider
                value={{
                    loaderStatus,
                    setLoaderStatus,
                }}
            >
                {children}
            </LoaderContext.Provider>
        )
    }
}

export {LoaderProvider}

export default LoaderContext;