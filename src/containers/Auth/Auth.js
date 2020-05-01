import React from 'react';
import Input from "../../components/Input/Input";
import Title from "../../components/Title/Title";
import LoaderContext from "../../context/loader/loaderContext";

class Auth extends React.Component {

    static contextType = LoaderContext;

    constructor(props) {
        super(props);
        this.state = {
            formControls: {
                username: {
                    value: '',
                    type: 'text',
                    className: '',
                    name: 'username',
                    label: 'Логин',
                    isInvalid: {
                        value: "Введите корректный логин",
                        status: false,
                    }
                },
                password: {
                    value: '',
                    type: 'password',
                    className: '',
                    name: 'password',
                    label: 'Пароль',
                    isInvalid: {
                        value: "Введите корректный пароль",
                        status: false,
                    }
                }
            },
            authorized: false,
            captcha: {
                status: false,
                img: '',
                sid: '',
                code: '',
                value: '',
                isInvalid: {
                    value: "Введите корректный код",
                    status: false,
                }
            }
        };
    }

    redirectHomePage() {
        this.props.history.push({
            pathname: '/'
        })
    }

    loginRutrackerAPI() {
        this.context.setLoaderStatus(true);

        const {username, password} = this.state.formControls;

        const captcha = this.state.captcha;
        const captchaParams = captcha.status
            ? `&cap_code_name=${captcha.code}&cap_code_value=${captcha.value}&cap_sid=${captcha.sid}`
            : '';

        fetch(`http://localhost:9000/rutracker?username=${username.value}&password=${password.value}${captchaParams}`)
            .then(res => res.text())
            .then(res => {
                const responseObject = JSON.parse(res);

                if (responseObject === true) {
                    this.setPersonalData();
                    this.setState({
                        authorized: true
                    });
                    this.redirectHomePage();
                } else {
                    this.captchaHandler(responseObject);
                }

                this.context.setLoaderStatus(false);
            });
    }

    captchaHandler({captcha, cap_sid, cap_code}) {
        const captchaNew = {...this.state.captcha};

        captchaNew.status = true;
        captchaNew.img = captcha.replace('http:', '').replace('https:', '');
        captchaNew.sid = cap_sid;
        captchaNew.code = cap_code;

        this.setState({
            captcha: captchaNew
        });

        console.log(this.state);
    }

    setPersonalData() {
        const {username, password} = this.state.formControls;
        localStorage.setItem('username', username.value);
        localStorage.setItem('password', password.value);
    }

    componentDidMount() {
        const username = localStorage.getItem('username');
        const password = localStorage.getItem('password');

        if (username && password) {
            const formControls = {...this.state.formControls};
            formControls.username.value = username;
            formControls.password.value = password;

            this.setState({
                formControls,
                authorized: true
            });
        }
    }

    loginHandler = event => {
        event.preventDefault();

        this.inputIsInvalid();

        if (!this.state.formControls.username.isInvalid.status && !this.state.formControls.password.isInvalid.status) {
            this.loginRutrackerAPI();
        }

    };

    inputIsInvalid() {
        const formControls = {...this.state.formControls};

        if (formControls.username.value === '') {
            formControls.username.isInvalid.status = true;
        } else {
            formControls.username.isInvalid.status = false;
        }

        if (formControls.password.value === '') {
            formControls.password.isInvalid.status = true;
        } else {
            formControls.password.isInvalid.status = false;
        }

        this.setState({
            formControls
        });
    }

    inputCaptchaChangeHandler = (event) => {
        const captcha = {...this.state.captcha};
        captcha.value = event.target.value;
        const newCaptcha = captcha;

        this.setState({
            captcha: newCaptcha
        })

    };

    inputChangeHandler = (event, controlName) => {
        const formControls = {...this.state.formControls};
        const control = {...formControls[controlName]};

        control.value = event.target.value;

        if (control.value === '') {
            control.isInvalid.status = true;
        } else {
            control.isInvalid.status = false;
        }

        formControls[controlName] = control;

        this.setState({
            formControls
        });
    };

    render() {
        return (
            <div className="container m-auto">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-5 col-xl-4 my-5">

                        {
                            this.state.authorized
                                ? <h1>Вы авторизированны</h1>
                                : <>
                                    <Title value={"Вход"}/>
                                    <form>
                                        {
                                            Object.keys(this.state.formControls).map((controlName, index) => {
                                                const control = this.state.formControls[controlName];
                                                return (
                                                    <Input
                                                        key={controlName + index}
                                                        type={control.type}
                                                        className={control.className}
                                                        name={control.name}
                                                        label={control.label}
                                                        value={control.value}
                                                        isInvalidStatus={control.isInvalid.status}
                                                        isInvalidValue={control.isInvalid.value}
                                                        onChange={(event) => this.inputChangeHandler(event, controlName)}
                                                    />
                                                )
                                            })
                                        }
                                        {
                                            this.state.captcha.status
                                                ? <>
                                                    <div className={"d-flex align-items-center"}>
                                                        <img className={"mr-3"} src={this.state.captcha.img} alt=""/>
                                                        <Input
                                                            type={'text'}
                                                            className={'w-100 m-0'}
                                                            name={this.state.captcha.code}
                                                            label={'Введите код с картинки'}
                                                            value={this.state.captcha.value}
                                                            onChange={(event) => this.inputCaptchaChangeHandler(event)}
                                                        />
                                                    </div>
                                                    <small className="text-danger text-center d-block mt-3">Пожалуйста,
                                                        введите код
                                                        подтверждения (символы, изображенные на картинке)</small>
                                                </>
                                                : null
                                        }
                                        <button className={"btn btn-lg btn-block btn-primary mb-2 mt-4"}
                                                onClick={event => this.loginHandler(event)}>Ввойти
                                        </button>
                                        <div className="text-center">
                                            <small className="text-muted text-center">
                                                У вас еще нет аккаунта? <a
                                                href="https://rutracker.org/forum/profile.php?mode=register"
                                                target={"_blank"}>Зарегистрироваться</a>.
                                            </small>
                                        </div>
                                    </form>
                                </>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Auth;
