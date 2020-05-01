import React from 'react';
import Title from "../../components/Title/Title";
import Input from "../../components/Input/Input";
import {faLongArrowAltLeft, faLongArrowAltRight, faSearch} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import queryString from 'query-string';
import SearchTable from "../../components/SearchTable/SearchTable";
import {PAGE_NEXT, PAGE_PREV, SORT_ASCENDING, SORT_DESCENDING} from "./SearchTypes/SearchTypes";
import LoaderContext from "../../context/loader/loaderContext";
import './Search.scss';
import SearchPagination from "./SearchPagination/SearchPagination";

class Search extends React.Component {

    static contextType = LoaderContext;

    constructor(props) {
        super(props);
        this.state = {
            searchInput: {
                type: 'text',
                name: 'query',
                placeholder: 'Введите запрос',
                value: '',
                /**
                 * Sort variant:
                 * '1' - registered (default); '2' - category; '4' - downloads; '7' - size; '10' - seeds; '11' - leeches
                 */
                sort: '1',
            },
            searchList: [],
            searchListSort: {
                /**
                 * type: 'DESCENDING', 'ASCENDING'
                 */
            },
            currentPage: 1,
            quantityPages: null
        };

        this.paginationHandler = this.paginationHandler.bind(this)
    }

    inputSearchChangeHandler = event => {
        const searchInput = {...this.state.searchInput};

        searchInput.value = event.target.value;

        this.setState({
            searchInput
        })
    };

    inputSearchRender() {
        const {type, name, placeholder, value} = this.state.searchInput;

        return (
            <Input
                type={type}
                className={'m-0 flex-grow-1'}
                classNameInput={'w-100 border-right-radius-0'}
                size={"lg"}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={(event) => this.inputSearchChangeHandler(event)}
            />
        )
    }

    async searchRutrackerAPI(params) {
        this.context.setLoaderStatus(true);

        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');

        const query = (typeof params === 'object' && params.query) ? params.query : this.state.searchInput.value;
        const sort = (typeof params === 'object' && params.sort) ? params.sort : this.state.searchInput.sort;
        const page = (typeof params === 'object' && params.page) ? params.page : this.state.currentPage;

        return fetch(`http://localhost:9000/rutracker?username=${username}&password=${password}&query=${query}&sort=${sort}&page=${page}`)
            .then(res => res.text())
            .then(res => {
                const responseObject = JSON.parse(res);
                console.log(responseObject);
                this.context.setLoaderStatus(false);
                return responseObject;
            });
    }

    updateSearchQueryParams({query = this.state.searchInput.value, sort = this.state.searchInput.sort, page = this.state.currentPage}) {
        const parsed = queryString.parse(this.props.history.location.search);

        parsed.query = query;
        parsed.sort = sort;
        parsed.page = page;

        const stringified = queryString.stringify(parsed);
        this.props.history.push({
            search: stringified
        });
    }

    async searchHandler(event) {
        if (event) {
            event.preventDefault();
        }

        if (this.state.searchInput.value !== '') {
            this.updateSearchQueryParams({query: this.state.searchInput.value});

            const searchList = await this.searchRutrackerAPI();
            this.setState({
                searchList
            });
        }
    };

    sortSearchList = (key) => {
        const searchListSort = {};
        const sortList = this.state.searchList;

        if (this.state.searchListSort[key] === SORT_DESCENDING) {
            searchListSort[key] = SORT_ASCENDING;
            sortList.sort((a, b) => a[key] > b[key] ? 1 : -1);
        } else {
            searchListSort[key] = SORT_DESCENDING;
            sortList.sort((a, b) => a[key] < b[key] ? 1 : -1);
        }

        this.setState({
            searchList: sortList,
            searchListSort
        });
    };

    async searchOptionSortHandler(event) {
        const searchInput = {...this.state.searchInput};
        searchInput.sort = event.target.value;

        if (this.state.searchInput.value !== '') {
            this.updateSearchQueryParams({sort: searchInput.sort});

            const searchList = await this.searchRutrackerAPI({sort: searchInput.sort});
            this.setState({
                searchInput,
                searchList
            })
        }

        this.setState({
            searchInput
        })
    }

    async paginationHandler(action) {
        let page;
        switch (action.type) {
            case PAGE_NEXT:
                page = this.state.currentPage + 1;
                break;
            case PAGE_PREV:
                page = this.state.currentPage - 1;
                break;
            default:
                return;
                break;
        }

        this.updateSearchQueryParams({page});

        const searchList = await this.searchRutrackerAPI({page});
        this.setState({
            searchList,
            currentPage: page
        });
    }

    render() {
        return (
            <div className={"search-wrapper w-100"}>

                <div className="search-header">
                    <div className="container pt-5 pb-5 text-white">
                        <Title value={"Поиск"}/>

                        <form className="mb-3">
                            <div className={"d-flex mb-3"}>
                                {this.inputSearchRender()}
                                <button
                                    type={"submit"}
                                    className={'btn btn-lg btn-primary border-left-radius-0'}
                                    onClick={event => this.searchHandler(event)}>
                                    <FontAwesomeIcon icon={faSearch} className={""}/>
                                </button>
                            </div>

                            <div className="form-group">
                                <label htmlFor="formSearchSortQuery" className={"text-white"}>Упорядочить по</label>
                                <select
                                    className="form-control w-auto"
                                    id={'formSearchSortQuery'}
                                    onChange={event => this.searchOptionSortHandler(event)}
                                    value={this.state.searchInput.sort}
                                >
                                    <option value={'1'}>Зарегистрирован</option>
                                    <option value={'2'}>Название темы</option>
                                    <option value={'4'}>Количество скачиваний</option>
                                    <option value={'10'}>Количество сидов</option>
                                    <option value={'11'}>Количество личей</option>
                                    <option value={'7'}>Размер</option>
                                </select>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="container">
                    {
                        this.state.searchList.length
                            ? <SearchTable
                                searchList={this.state.searchList}
                                sortSearchList={this.sortSearchList}
                                searchListSort={this.state.searchListSort}/>
                            : null
                    }
                    {
                        this.state.searchList.length
                            ? this.state.searchList[0].search_quantity / 50 > 1
                            ? <SearchPagination
                                paginationHandler={this.paginationHandler}
                                currentPage={this.state.currentPage}
                                quantityPages={this.state.searchList[0].search_quantity / 50}/>
                            : null
                            : null
                    }
                </div>
            </div>
        )
    }

    async getQueryParams() {
        const parsed = queryString.parse(this.props.location.search);

        /**
         * Auto search when loading a component
         */
        if (parsed.query) {
            const searchInput = {...this.state.searchInput};
            searchInput.value = parsed.query;
            searchInput.sort = parsed.sort ? parsed.sort : '';
            const currentPage = parsed.page ? parsed.page : this.state.currentPage;

            this.setState({
                searchInput,
                searchList: await this.searchRutrackerAPI({query: parsed.query, sort: parsed.sort, page: currentPage}),
                currentPage
            });
        }
    }

    componentDidMount() {
        this.getQueryParams();
    }
}

export default Search;