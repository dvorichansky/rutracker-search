import React, {useContext} from 'react'
import style from './Loader.module.scss';
import LoaderContext from "../../context/loader/loaderContext";

export const Loader = () => {
    const {loaderStatus} = useContext(LoaderContext);

    if (!loaderStatus) return null;

    return (
        <div className={`${style.wrapper} d-flex text-center`}>
            <div role="status" className={`${style.spinner} spinner-border text-secondary m-auto`}>
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    )
};