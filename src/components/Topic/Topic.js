import React, {Component, createRef} from 'react';
import './Topic.scss';
import {withRouter} from 'react-router-dom';
import queryString from "query-string";
import LoaderContext from "../../context/loader/loaderContext";
import htmlReactParse from "html-react-parser";
import {faHome, faTimes} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

class Topic extends Component {

    static contextType = LoaderContext;

    constructor(props) {
        super(props);

        this.state = {
            topicId: '',
            topic: {},
            topicContentFixed: false
        };

        this.buttonClose = createRef();
    }

    topicRutrackerAPI(params) {
        this.context.setLoaderStatus(true);

        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');

        const id = (typeof params === 'object' && params.id) ? params.id : this.state.topicId;

        return fetch(`http://localhost:9000/rutracker?username=${username}&password=${password}&id=${id}`)
            .then(res => res.text())
            .then(res => {
                const responseObject = JSON.parse(res);
                console.log(responseObject);
                this.context.setLoaderStatus(false);
                return responseObject;
            });
    }

    async getTopic() {
        const parsed = queryString.parse(this.props.location.search);

        const topic = await this.topicRutrackerAPI({id: parsed.id});

        // fix topic
        const content = this.fixedTopicContent(topic.content);
        topic.content = content;

        this.setState({
            topicId: parsed.id,
            topic
        })
    }

    fixedTopicContent(content) {
        const newTopicContentImages = this.fixedTopicContentImg(content);
        const newTopicContentImagesAndWrappers = this.fixedTopicContentWrappers(newTopicContentImages);
        const newTopicContentImagesAndWrappersAndLink = this.fixedTopicContentLinks(newTopicContentImagesAndWrappers);

        return newTopicContentImagesAndWrappersAndLink;
    }

    fixedTopicContentLinks(content) {
        const div = document.createElement('div');
        div.innerHTML = content;

        const newContent = div;

        const elementsLinksNode = newContent.querySelectorAll('.postLink');

        elementsLinksNode.forEach((link) => {
            link.target = '_blank';
        });
        return newContent.outerHTML;
    }

    fixedTopicContentWrappers(content) {
        const div = document.createElement('div');
        div.innerHTML = content;

        const newContent = div;
        const elementsWrapperNode = newContent.querySelectorAll('.sp-wrap');

        elementsWrapperNode.forEach((element) => {
            const id = Math.floor(Math.random() * (+1000 - +1)) + +1;

            const elementCheckbox = document.createElement('input');
            elementCheckbox.className = 'sp-wrap-checkbox btn';
            elementCheckbox.id = id;
            elementCheckbox.type = 'checkbox';

            const elementHeadNode = element.querySelector('.sp-head');
            const elementLabel = document.createElement('label');
            elementLabel.htmlFor = id;
            elementLabel.className = 'sp-head folded';
            elementLabel.innerHTML = elementHeadNode.textContent;

            elementHeadNode.remove();

            element.insertAdjacentHTML('afterbegin', elementLabel.outerHTML);
            element.insertAdjacentHTML('afterbegin', elementCheckbox.outerHTML);
        });
        return newContent.outerHTML;
    }

    fixedTopicContentImg(content) {
        const div = document.createElement('div');
        div.innerHTML = content;

        const newContent = div;
        const elementsVarNode = newContent.querySelectorAll('var');

        elementsVarNode.forEach((element) => {
            const elementVar = newContent.querySelector(`[title="${element.title}"]`);
            const elementImg = document.createElement('img');
            elementImg.src = element.title;
            elementImg.className = elementVar.className;
            elementVar.parentNode.replaceChild(elementImg, elementVar);
        });
        return newContent.outerHTML;
    }

    renderTopicData() {
        const {created, since, image, content, magnet} = this.state.topic;

        return (
            <>
                <div className={"d-flex mb-3"}>
                    <small className={""}>
                        <span className={"text-primary"}>{created} </span>
                        <span className={"text-muted"}>{since}</span>
                    </small>
                    <a
                        className={"btn btn-sm btn-info ml-auto"}
                        href={magnet}
                    >Скачать по magnet-ссылке</a>
                    <a
                        className={"btn btn-sm btn-success ml-3"}
                        href={`http://rutracker.org/forum/dl.php?t=${this.state.topicId}`}
                    >Скачать .torrent</a>

                </div>

                {htmlReactParse(content)}
            </>
        )
    }

    goBackTopicHandler() {
        this.props.history.goBack()
    }

    clickOutsideModalHandler(event) {
        if(!event.target.classList.contains('modal-topic')) {
            return;
        }

        this.goBackTopicHandler();
    }

    render() {
        return (
            <>
                {
                    typeof this.props.history.location.state === 'object' && this.props.history.location.state.hasOwnProperty('searchList')
                        ? <div
                            className={`modal-topic modal fade ${Object.keys(this.state.topic).length ? 'show d-block' : null}`}
                            onClick={event => this.clickOutsideModalHandler(event)}
                        >
                            <button
                                type="button"
                                className="close"
                                aria-label="Close"
                                ref={this.buttonClose}
                                onClick={() => this.goBackTopicHandler()}
                            >
                                <span aria-hidden="true"><FontAwesomeIcon icon={faTimes} className={""} /></span>
                            </button>
                            <div className="modal-dialog">
                                <div className="modal-content">
                                    <div className="modal-body">
                                        <div className="topic-content">
                                            {
                                                Object.keys(this.state.topic).length
                                                    ? this.renderTopicData()
                                                    : null
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        : <div className={"topic-wrapper container mt-5 mb-5"}>
                            <div className="topic-content">
                                {
                                    Object.keys(this.state.topic).length
                                        ? this.renderTopicData()
                                        : null
                                }
                            </div>
                        </div>
                }
            </>

        );
    }

    componentDidMount() {
        if (typeof this.props.history.location.state === 'object' && this.props.history.location.state.hasOwnProperty('searchList')) {
            document.body.classList.add('modal-open');
        }

        if (!Object.keys(this.state.topic).length) {
            this.getTopic();
        }
    }

    componentDidUpdate() {
        console.log(this.buttonClose.current);
        if (this.buttonClose.current) {
            this.buttonClose.current.focus();
        }
    }

    componentWillUnmount() {
        document.body.classList.remove('modal-open');
    }
}

export default withRouter(Topic);