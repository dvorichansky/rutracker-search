import React from 'react';
import SearchList from "../SearchList/SearchList";
import './SearchTable.scss';

import {faSort, faSortDown, faSortUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {SORT_ASCENDING, SORT_DESCENDING} from "../../containers/Search/SearchTypes/SearchTypes";

class SearchTable extends React.Component {

    sortIconRender(key) {
        const keyValue = this.props.searchListSort[key];

        switch (keyValue) {
            case SORT_ASCENDING:
                return <FontAwesomeIcon icon={faSortUp}/>;
            case SORT_DESCENDING:
                return <FontAwesomeIcon icon={faSortDown}/>;
            default:
                return <FontAwesomeIcon icon={faSort}/>;
        }
    }

    renderSearchList() {
        return <SearchList data={this.props.searchList}/>;
    }

    render() {
        return (
            <table className={"search-table table w-100 small text-center"}>
                <thead>
                    <tr className={""}>
                        <th></th>
                        <th className={"w-25"}>
                            <button
                                className={'btn'}
                                onClick={() => this.props.sortSearchList('category')}
                            >Категория {this.sortIconRender('category')}</button>
                        </th>
                        <th className={"w-75"}>
                            <button
                                className={'btn'}
                                onClick={() => this.props.sortSearchList('title')}
                            >Тема {this.sortIconRender('title')}</button>
                        </th>
                        <th>
                            <button
                                className={'btn'}
                                onClick={() => this.props.sortSearchList('author')}
                            >Автор {this.sortIconRender('author')}</button>
                        </th>
                        <th>
                            <button
                                className={'btn'}
                                onClick={() => this.props.sortSearchList('size')}
                            >Размер {this.sortIconRender('size')}</button>
                        </th>
                        <th title={"Сиды"}>
                            <button
                                className={'btn'}
                                onClick={() => this.props.sortSearchList('seeds')}
                            >S {this.sortIconRender('seeds')}</button>
                        </th>
                        <th title={"Личи"}>
                            <button
                                className={'btn'}
                                onClick={() => this.props.sortSearchList('leeches')}
                            >L {this.sortIconRender('leeches')}</button>
                        </th>
                        <th title={"Торрент скачан"}>
                            <button
                                className={'btn'}
                                onClick={() => this.props.sortSearchList('downloads')}
                            >C {this.sortIconRender('downloads')}</button>
                        </th>
                        <th>
                            <button
                                className={'btn'}
                                onClick={() => this.props.sortSearchList('registered')}
                            >Добавлен {this.sortIconRender('registered')}</button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                {
                    this.props.searchList.length
                        ? this.renderSearchList()
                        : null
                }
                </tbody>
            </table>
        )
    }
}

export default SearchTable;
