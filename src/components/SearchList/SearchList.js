import React from 'react';
import dateFormat from "date-format";
import {
    faCheck,
    faExclamation, faFile,
    faHistory,
    faSkullCrossbones,
    faStarOfLife,
    faTimes,
    faFilePowerpoint, faPercent, faQuestion, faReply, faAngleDoubleDown, faCopyright
} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import htmlReactParse from 'html-react-parser';
import {Link, NavLink} from "react-router-dom";

export default function SearchList(props) {

    function renderTrackStateIcon(state) {
        let iconName;
        let title;
        let colorName;

        switch (state) {
            case 'APPROVED':
                iconName = faCheck;
                title = 'Проверено';
                colorName = 'success';
                break;
            case 'NOT_APPROVED':
                iconName = faStarOfLife;
                title = 'Не проверено';
                colorName = 'warning';
                break;
            case 'CHECKED':
                iconName = faPercent;
                title = 'Проверяется';
                colorName = 'primary';
                break;
            case 'UNFORMED':
                iconName = faQuestion;
                title = 'Недооформлено';
                colorName = 'danger';
                break;
            case 'NEED_EDIT':
                iconName = faExclamation;
                title = 'Не оформлено';
                colorName = 'danger';
                break;
            case 'REPLAY':
                iconName = faReply;
                title = 'Повтор';
                colorName = 'primary';
                break;
            case 'ABSORBED':
                iconName = faAngleDoubleDown;
                title = 'Поглощено';
                colorName = 'danger';
                break;
            case 'PRE_MODERATION':
                iconName = faFilePowerpoint;
                title = 'Премодерация';
                colorName = 'primary';
                break;
            case 'CLOSED_COPYRIGHT':
                iconName = faCopyright;
                title = 'Закрыто правообладателем';
                colorName = 'danger';
                break;
            case 'DUBIOUSLY':
                iconName = faSkullCrossbones;
                title = 'Сомнительно';
                colorName = 'success';
                break;
            case 'CONSUMED':
                iconName = faTimes;
                title = 'Закрыто';
                colorName = 'danger';
                break;
            case 'TEMPORARY':
                iconName = faHistory;
                title = 'Временная';
                colorName = 'primary';
                break;
            default:
                iconName = faFile;
                title = 'Статус файла не определен';
                colorName = 'secondary';
                break;
        }

        return <FontAwesomeIcon icon={iconName} title={title} className={`text-${colorName}`}/>
    }

    function stringConversion(string) {
        let iterator = string[Symbol.iterator]();
        let theChar = iterator.next();

        let transformedString = '';

        while (!theChar.done) {

            switch (theChar.value) {
                case '(':
                    theChar.value = '<span class="font-weight-normal">(';
                    break;
                case ')':
                    theChar.value = ')</span>';
                    break;
                case '[':
                    theChar.value = '<span class="font-weight-normal">[';
                    break;
                case ']':
                    theChar.value = ']</span>';
                    break;
                default:
                    break;
            }

            transformedString += theChar.value;
            theChar = iterator.next();
        }

        return transformedString;
    }

    return props.data.map(({state, id, url, category, title, author, size, seeds, leeches, downloads, registered}) => (
        <tr className={"shadow-sm rounded"} key={id}>
            <td>{renderTrackStateIcon(state)}</td>
            <td className={"text-muted"}>{category}</td>
            <td className={"text-left search-table-bolder"}>
                <Link to={{
                    pathname: '/topic',
                    search: `?id=${id}`,
                    state: {searchList: true}
                }}>{htmlReactParse(stringConversion(title))}</Link>
            </td>
            <td className={"text-muted"}>{author}</td>
            <td className={"ws-nowrap search-table-bolder"}>
                <a href={`http://rutracker.org/forum/dl.php?t=${id}`} title={"Скачать .torrent"}>
                    {size.toFixed(1)} MB
                </a>
            </td>
            <td title={"Сиды"}>
                <span className="badge badge-success">{seeds > 0 ? seeds : 0}</span>
            </td>
            <td title={"Личи"}>
                <span className="badge badge-danger">{leeches}</span>
            </td>
            <td title={"Торрент скачан"} className={"text-muted"}>{downloads}</td>
            <td className={"text-muted"}>{dateFormat.asString('dd.MM.yy', new Date(registered))}</td>
        </tr>
    ));
}