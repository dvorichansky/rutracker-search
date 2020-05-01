import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faLongArrowAltLeft, faLongArrowAltRight} from "@fortawesome/free-solid-svg-icons";
import {PAGE_NEXT, PAGE_PREV} from "../SearchTypes/SearchTypes";

function SearchPagination({paginationHandler, currentPage, quantityPages}) {
    return (
        <div className={"search-pagination text-center mb-5"}>
            {
                currentPage !== 1
                    ? <button
                        onClick={() => paginationHandler({type: PAGE_PREV})}
                        className={"btn btn-outline-primary"}>
                        <FontAwesomeIcon icon={faLongArrowAltLeft} className={"mr-2"}/>
                        Предыдущая страница
                    </button>
                    : null
            }
            {
                currentPage !== quantityPages
                    ? <button
                        onClick={() => paginationHandler({type: PAGE_NEXT})}
                        className={"btn btn-primary"}>
                        Следующая страница
                        <FontAwesomeIcon icon={faLongArrowAltRight} className={"ml-2"}/>
                    </button>
                    : null
            }
        </div>
    )
}

export default SearchPagination;