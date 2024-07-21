import React, { Component } from 'react';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail, web_url, google_data, google_login, facebook_data, facebook_login } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import $ from 'jquery';
import { Helmet } from "react-helmet";
import Loader from "react-loader";
import ShowMoreText from "react-show-more-text";
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
class QuestionList extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        this.validator = new SimpleReactValidator();

        var user_id = user_data ? user_data.u_id : '';
        this.initialState = {
            login_form_data: { email: '', password: '' },
            forgot_form_data: { email: '' },
            register_form_data: { name: '', email: '', mobile: '', password: '', country_id: '', governance_id: '', zone_id: '' },
            country: '',
            governance_list: [],
            governance_list_new: [],
            zone_list: [],
            zone_list_new: [],
            otp_form_data: { otp: '', email: '' },
            forgot_password: 'none',
            sign_in_form: 'flex',
            sign_up_form: 'flex',
            cart_bag_number: '',
            otp_verification: 'none',
            country_list: [],
            login_show: false,
            form_data: {
                title: '',
                descr: '',
                question_list: [],
                u_id: user_id,
            },
            loaded: false,

        }
        this.state = this.initialState;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        // this.openLoginModal = this.openLoginModal.bind(this);
        this.handleTopic = this.handleTopic.bind(this);
        this.handlehideTopic = this.handlehideTopic.bind(this);
        this.handleTopicSearch = this.handleTopicSearch.bind(this);
        this.get_question_list();

        this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
        this.openLoginModal = this.openLoginModal.bind(this);
        this.hideLoginModal = this.hideLoginModal.bind(this);
        this.showSignInPortion = this.showSignInPortion.bind(this);
        this.showSignUpPortion = this.showSignUpPortion.bind(this);
        this.handleLoginWeb = this.handleLoginWeb.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSaveData = this.handleSaveData.bind(this);
        this.handleForgot = this.handleForgot.bind(this);
        this.handleChangeforgot = this.handleChangeforgot.bind(this);
        this.handleOTP = this.handleOTP.bind(this);
        this.handleChangeOTP = this.handleChangeOTP.bind(this);
        this.handleChangeRegister = this.handleChangeRegister.bind(this);
        this.resendOTP = this.resendOTP.bind(this);
        this.handleCountry = this.handleCountry.bind(this);
        this.handleGovernance = this.handleGovernance.bind(this);
        this.handleZone = this.handleZone.bind(this);
        this.showSignUpPortion = this.showSignUpPortion.bind(this);
        this.showSignInPortion = this.showSignInPortion.bind(this);

        this.validator_login = new SimpleReactValidator();

        facebook_data();
        google_data();
    }
    componentDidMount() {

    }

    /* Start */
    handleSubmitLogin(event) {
        var th = this;
        event.preventDefault();
        // validation.validate().then(function(status) {
        // if (!this.validator.allValid()) {
        //     this.validator.showMessages();
        //     this.forceUpdate();
        // } else {

        this.setState({ loaded: false });
        api_option.url = 'user_login';
        api_option.data = this.state.login_form_data;

        axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                const res_data = res.data;
                if (res_data.status) {
                    // alert("123", res_data.status);
                    toast.success("Login Successfully");
                    localStorage.email = this.state.login_form_data.email;
                    localStorage.password = this.state.login_form_data.password;
                    localStorage.setItem('type', 1);
                    localStorage.removeItem('usr_id');
                    // localStorage.type = '1';
                    this.setState({ show: false });
                    //window.$('#access-modal').modal('hide');
                    this.state.login_form_data.email = '';
                    this.state.login_form_data.password = '';
                    setUserSession(res_data.users.token, res_data.users);
                    //this.setState({ redirect: '/My-profile' });
                    // window.location.href = '/shorfa/#/My-profile';
                    if (localStorage.getItem('device_type') == 'web') {
                        // window.location.href = '/shorfa/#/My-profile';
                        // alert("sdf1");
                        console.log(res_data.users);
                        if (window.callback != undefined) {
                            window.callback.login_success('{"user_id":"' + res_data.users.u_id + '","is_login":"1"}');
                        }

                        // window.location.href = web_url + 'My-profile';
                        th.hideLoginModal(null);
                        window.location.href = web_url + 'question-list';

                    } else {
                        console.log(res_data.users.u_id);
                        // window.callback.showToast('{"action":"go_to_login"}');
                        // alert("sdf");
                        if (window.callback != undefined) {
                            window.callback.login_success("Hello");
                        }

                        // window.callback.login_success('{"user_id":"' + res_data.users.id + '","is_login":"1"}');
                        // this.setState({ redirect: '/My-profile' });
                        // alert("123");
                        // window.location.href = web_url + 'My-profile';
                        th.hideLoginModal(null);
                        window.location.href = web_url + 'question-list';
                    }

                } else {
                    toast.error(res_data.message);
                    this.setState({ error: res_data.message });
                }
                this.setState({ button_disabled: false });
            })
            .catch(error => console.log(error));
        //}
        // })

    }

    get_country() {

        api_option.url = 'shipping_country_list_dropdown';
        api_option.data = {};
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var fnldata = [];
                    $.each(res.data.country_list, function (i, item) {
                        var temparr = new Object;
                        temparr['value'] = res.data.country_list[i].id;
                        temparr['label'] = res.data.country_list[i].text;
                        fnldata.push(temparr);
                    });
                    this.setState({ country_list: fnldata });
                } else {

                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }
    async handleCountry(event) {


        const name = event.lable;
        const value = event.value;
        var data = this.state.register_form_data['country_id'] = { label: event.label, value: value };
        this.setState({ data });
        var data = this.state.register_form_data['governance_id'] = null;
        this.setState({ data });
        this.setState({ governance_list: {} });
        if (value != "") {
            api_option.url = 'governance_list_dropdown';

            api_option.data = { country_id: value };
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        var fnldata = [];
                        $.each(res.data.governance_list, function (i, item) {
                            fnldata.push({ 'value': res.data.governance_list[i].id, "label": res.data.governance_list[i].text });
                        });
                        this.setState({ governance_list_new: fnldata });
                        this.setState({ governance_list: fnldata });
                    } else {
                        this.setState({ redirect: '/home/' });
                    }
                })
                .catch(error => {
                    //this.setState({ redirect: '/logout' });
                });
        } else {
            this.setState({ governance_list: {} });
        }
    }

    async handleGovernance(event) {

        const name = event.lable;
        const value = event.value;
        var data = this.state.register_form_data['governance_id'] = { label: event.label, value: value };
        this.setState({ data });

        var data = this.state.register_form_data['zone_id'] = null;
        this.setState({ data });
        this.setState({ zone_list: {} });

        if (value != "") {
            api_option.url = 'zone_list_dropdown';

            api_option.data = { governance_id: value };
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        var fnldata = [];
                        $.each(res.data.zone_list, function (i, item) {
                            fnldata.push({ 'value': res.data.zone_list[i].id, "label": res.data.zone_list[i].text });
                        });
                        this.setState({ zone_list_new: fnldata });
                        this.setState({ zone_list: fnldata });
                    } else {
                        this.setState({ redirect: '/home/' });
                    }
                })
                .catch(error => {
                    //this.setState({ redirect: '/logout' });
                });
        } else {
            this.setState({ zone_list: {} });
        }
    }
    handleLoginWeb(event) {
        var login = { 'action': 'login' };
        //window?.sendDataToIos(login)

        /*  */
        if (this.initialState.device_type == "ios") {
            window.webkit.messageHandlers.callback.postMessage('{"action":"go_to_login"}');
            //window.callback.showToast('{"action":"go_to_login"}');
        } else {
            this.setState({ show: true });
        }
        /*  */

    }
    resendOTP(event) {

        event.preventDefault();
        api_option.url = 'resend_otp';

        api_option.data = { id: localStorage.getItem('usr_id') };

        axios(api_option)
            .then(res => {
                const res_data = res.data;
                if (res_data.status) {
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(error => console.log(error));
    }
    openLoginModal(e) {
        this.setState({ login_show: true });
        // e.preventDefault();
        this.get_country();
        // $("#access-modal").modal("show")
    }
    hideLoginModal(e) {
        this.setState({ login_show: false });
    }
    showSignUpPortion(e) {
        $("#container2").addClass("right-panel-active");
    }
    showSignInPortion(e) {
        $("#container2").removeClass("right-panel-active");
    }
    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
    }
    show_forgot_password() {
        this.setState({ 'forgot_password': 'flex' })
        this.setState({ 'sign_in_form': 'none' })
    }


    // show_sign_in
    show_sign_in() {
        this.setState({ 'forgot_password': 'none' })
        this.setState({ 'sign_in_form': 'flex' })
    }

    handleSaveData(event) {
        event.preventDefault();
        //  if(!this.validator.allValid()){
        //      this.validator.showMessage();
        //      this.forceUpdate();
        //  }else{
        this.setState({ loaded: false });
        api_option.url = 'save_user_data';
        api_option.data = this.state.register_form_data;
        axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                const res_data = res.data;
                if (res_data.status) {

                    var data = this.state.otp_form_data.email = this.state.register_form_data['email'];
                    this.setState({ data });

                    this.state.register_form_data.email = '';
                    this.state.register_form_data.mobile = '';
                    this.state.register_form_data.name = '';
                    this.state.register_form_data.password = '';
                    toast.success(res_data.message);
                    this.setState({ 'sign_up_form': 'none' })
                    // this.setState({ 'sign_in_form': 'none' })
                    // this.setState({ 'forgot_password': 'none' })
                    this.setState({ 'otp_verification': 'flex' })
                    localStorage.setItem('usr_id', res_data.user_id);


                } else {
                    toast.error(res_data.message);
                }
            })
        //}
    }

    handleFormChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.login_form_data[name] = value;
        this.setState({ data });
    }

    async handleZone(event) {

        const name = event.lable;
        const value = event.value;
        var data = this.state.register_form_data['zone_id'] = { label: event.label, value: value };
        this.setState({ data });

    }

    async handleGovernance(event) {

        const name = event.lable;
        const value = event.value;
        var data = this.state.register_form_data['governance_id'] = { label: event.label, value: value };
        this.setState({ data });

        var data = this.state.register_form_data['zone_id'] = null;
        this.setState({ data });
        this.setState({ zone_list: {} });

        if (value != "") {
            api_option.url = 'zone_list_dropdown';

            api_option.data = { governance_id: value };
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        var fnldata = [];
                        $.each(res.data.zone_list, function (i, item) {
                            fnldata.push({ 'value': res.data.zone_list[i].id, "label": res.data.zone_list[i].text });
                        });
                        this.setState({ zone_list_new: fnldata });
                        this.setState({ zone_list: fnldata });
                    } else {
                        this.setState({ redirect: '/home/' });
                    }
                })
                .catch(error => {
                    //this.setState({ redirect: '/logout' });
                });
        } else {
            this.setState({ zone_list: {} });
        }
    }

    async handleCountry(event) {


        const name = event.lable;
        const value = event.value;
        var data = this.state.register_form_data['country_id'] = { label: event.label, value: value };
        this.setState({ data });
        var data = this.state.register_form_data['governance_id'] = null;
        this.setState({ data });
        this.setState({ governance_list: {} });
        if (value != "") {
            api_option.url = 'governance_list_dropdown';

            api_option.data = { country_id: value };
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        var fnldata = [];
                        $.each(res.data.governance_list, function (i, item) {
                            fnldata.push({ 'value': res.data.governance_list[i].id, "label": res.data.governance_list[i].text });
                        });
                        this.setState({ governance_list_new: fnldata });
                        this.setState({ governance_list: fnldata });
                    } else {
                        this.setState({ redirect: '/home/' });
                    }
                })
                .catch(error => {
                    //this.setState({ redirect: '/logout' });
                });
        } else {
            this.setState({ governance_list: {} });
        }
    }

    handleChangeforgot(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.forgot_form_data[name] = value;
        this.setState({ data });
    }

    handleForgot(event) {
        event.preventDefault();
        // if(!this.validator.allValid()){
        //     this.validator.showMessage();
        //     this.forceUpdate();
        // }else{
        this.setState({ loaded: false });
        api_option.url = 'forgot_password';
        api_option.data = this.state.forgot_form_data;
        axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                const res_data = res.data;
                if (res_data.status) {
                    toast.success(res_data.message);
                    this.setState({ login_show: false });
                    // window.$('#access-modal').modal('hide');
                } else {
                    toast.error(res_data.message);
                }
            })
        // }
    }

    resendOTP(event) {

        event.preventDefault();
        api_option.url = 'resend_otp';

        api_option.data = { id: localStorage.getItem('usr_id') };

        axios(api_option)
            .then(res => {
                const res_data = res.data;
                if (res_data.status) {
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(error => console.log(error));
    }

    handleOTP(event) {
        event.preventDefault();
        // if(!this.validator.allValid()){
        //     this.validator.showMessage();
        //     this.forceUpdate();
        // }else{
        this.setState({ loaded: false });
        api_option.url = 'otp_verification';
        api_option.data = this.state.otp_form_data;
        axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                const res_data = res.data;
                if (res_data.status) {
                    this.state.otp_form_data.otp = '';
                    this.state.otp_form_data.email = '';
                    toast.success("Otp verification completed");
                    this.setState({ show: false });
                    //window.$('#access-modal').modal('hide');
                    this.setState({ 'otp_verification': 'none' })
                    this.setState({ 'sign_up_form': 'flex' })
                    localStorage.email = this.state.form_data.email;
                    localStorage.password = this.state.form_data.password;
                    localStorage.setItem('type', 1);
                    localStorage.removeItem('usr_id');
                    this.state.form_data.email = '';
                    this.state.form_data.password = '';
                    setUserSession(res_data.users.token, res_data.users);
                    //this.setState({ redirect: '/My-profile' });
                    if (localStorage.getItem('device_type') == 'web') {
                        // window.location.href = '/shorfa/#/My-profile';
                        window.location.href = web_url;
                    } else {
                        window.location.href = web_url;
                        // this.setState({ redirect: '/My-profile' });
                    }

                } else {
                    toast.error("Invalid Otp");
                }
            })
        // }
    }

    handleChangeOTP(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.otp_form_data[name] = value;
        this.setState({ data });
    }

    handleChangeRegister(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.register_form_data[name] = value;
        this.setState({ data });
    }
    /* End */

    delete_question(event, question_id, comment_id1) {
        if (window.confirm("Are you sure to delete this Topic?")) {
            var user_data = getUserDetail();
            var user_id = user_data ? user_data.u_id : '';
            api_option.url = 'delete_question';
            api_option.data = { user_id: user_id, id: question_id };
            api_option.headers.Authorization = sessionStorage.getItem('token');
            const th = this;
            axios(api_option)
                .then(res => {
                    if (res.data.status) {
                        this.get_question_list();
                        toast.success(res.data.message);
                    } else {
                        toast.error(res.data.message);
                    }
                })
                .catch(error => {
                    // this.setState({ redirect: '/logout' });
                });
        }
    }

    handleTopicSearch(event) {
        console.log(event)
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
    }

    // handleTopic() {

    //     window.$('#new-forum').modal('show')

    // }

    handleTopic(e) {
        this.setState({ show: true });
    }
    handlehideTopic(e) {
        this.setState({ show: false });
    }



    /* openLoginModal(e) {
        e.preventDefault();
        window.$('#new-forum').modal('hide');
        window.$("#access-modal").modal("show")
    } */

    async get_question_list(props) {

        api_option.url = 'get_question_list';

        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {
                    var question_data = res.data.data;
                    this.setState(this.state.form_data.question_list = question_data);
                } else {
                }
            })
            .catch(error => {
            });

    }

    // Add Question
    handleSubmit(event) {
        event.preventDefault();
        if (!this.validator.allValid()) {
            this.validator.showMessages();
            this.forceUpdate();
        } else {
            console.log(event);
            this.setState({ loaded: false });
            api_option.url = 'save_question';
            api_option.data = this.state.form_data;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        this.state.form_data.title = '';
                        this.state.form_data.descr = '';
                        this.setState({ show: false });
                        this.get_question_list();
                        toast.success(res.data.message);
                    } else {
                        toast.error(res.data.message);
                        // this.setState({error:res_data.message});
                    }
                })
                .catch(error => console.log(error));
        }

    }


    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>


                <Helmet>


                </Helmet>
                <div class="forum-wrapper">
                    <div class="container container-small">
                        <div class="forum-top-toolbar">
                            <div class="forum-search">
                                {/* <input type="text" name="topic_search" id="topic_search" onInput={this.handleTopicSearch} class="text-control" placeholder="Search Topic" /> */}
                                {/* <button class="btn plain"><i class="bi bi-search"></i></button> */}
                            </div>
                            <div class="forum-new">

                                {is_login() && (localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && <button class="btn btn-primary btn-long post-forum" onClick={this.handleTopic}>New Topic</button>}
                                {!is_login() && <button class="btn btn-primary btn-long post-forum" onClick={this.openLoginModal}>New Topic</button>}
                            </div>
                        </div>
                        <div class="bwp-top-bar">
                            <div class="bwp-bar">
                                <h1 class="sm-title">Popular Forums</h1>
                            </div>
                        </div>
                        <div class="forum-list">
                            {Object.entries(this.state.form_data.question_list).map(([o, q]) => (
                                <article class="forum-item">
                                    <Link to={`/question-detail/${q.id}`}>  <div class="forum-author">Posted by:{q.u_name}</div> </Link>
                                    <div class="forum-list-title">
                                        <Link to={`/question-detail/${q.id}`}> <h2>{q.title}.</h2></Link>
                                        <p>{q.description}
                                            {is_login() && q.user_id == this.state.form_data.u_id && <button type="button" class="plain text-danger float-right" onClick={this.delete_question.bind(this, o, q.id)}>Delete</button>}
                                        </p>


                                        {/* <ShowMoreText

                                            lines={3}
                                            more="Read More"
                                            less="Read Less"
                                            className="content-css"
                                            anchorClass="my-anchor-css-class"
                                            onClick={this.executeOnClick}
                                            expanded={false}
                                            width={280}
                                            truncatedEndingComponent={"... "}
                                        >
                                            {q.description}{" "}
                                            <a
                                                href="https://www.yahoo.com/"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >

                                            </a>{" "}

                                            <a
                                                href="https://www.google.bg/"
                                                title="Google"
                                                rel="nofollow"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >

                                            </a>
                                        </ShowMoreText> */}
                                    </div>
                                    <Link to={`/question-detail/${q.id}`}>
                                        <div class="forum-list-rt">
                                            <a class="forum-comment"><span><b>{q.comment}</b></span> Comments</a>
                                            <time>{q.created_at}</time>
                                        </div>
                                    </Link>
                                </article>
                            ))}

                            {/* <article class="forum-item">
                                <div class="forum-author">Posted by:<a href="">MT Smith</a></div>
                                <div class="forum-list-title">
                                    <h2>Kitchen design 2 with 2/ islands. Looking for thoughts on everything but especially spacing</h2>
                                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                                </div>
                                <div class="forum-list-rt">
                                    <a href="" class="forum-comment"><span><b>12</b></span> Comments</a>
                                    <time>6 hours ago</time>
                                </div>
                            </article>
                            <article class="forum-item">
                                <div class="forum-author">Posted by:<a href="">MT Smith</a></div>
                                <div class="forum-list-title">
                                    <h2>What's the historical use of purple in interior design?</h2>
                                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                                </div>
                                <div class="forum-list-rt">
                                    <a href="" class="forum-comment"><span><b>65</b></span> Comments</a>
                                    <time>18 hours ago</time>
                                </div>
                            </article>
                            <article class="forum-item">
                                <div class="forum-author">Posted by:<a href="">MT Smith</a></div>
                                <div class="forum-list-title">
                                    <h2>Starting a career in Interior Design, where to learn more?</h2>
                                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                                </div>
                                <div class="forum-list-rt">
                                    <a href="" class="forum-comment"><span><b>20</b></span> Comments</a>
                                    <time>1 day ago</time>
                                </div>
                            </article>
                            <article class="forum-item">
                                <div class="forum-author">Posted by:<a href="">MT Smith</a></div>
                                <div class="forum-list-title">
                                    <h2>Stand up shower or regular bathtub in master bedroom</h2>
                                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                                </div>
                                <div class="forum-list-rt">
                                    <a href="" class="forum-comment"><span><b>4</b></span> Comments</a>
                                    <time>4 days ago</time>
                                </div>
                            </article>
                            <article class="forum-item">
                                <div class="forum-author">Posted by:<a href="">MT Smith</a></div>
                                <div class="forum-list-title">
                                    <h2>How do you break out of the residential design sector?</h2>
                                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                                </div>
                                <div class="forum-list-rt">
                                    <a href="" class="forum-comment"><span><b>26</b></span> Comments</a>
                                    <time>9 days ago</time>
                                </div>
                            </article>
                            <article class="forum-item">
                                <div class="forum-author">Posted by:<a href="">MT Smith</a></div>
                                <div class="forum-list-title">
                                    <h2>Working on hanging curtains in my living room right now. Should I go with two curtain panels per window or one?</h2>
                                    <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                                </div>
                                <div class="forum-list-rt">
                                    <a href="" class="forum-comment"><span>19</span> Comments</a>
                                    <time>27 days ago</time>
                                </div>
                            </article> */}
                        </div>
                    </div>
                </div>


                <Modal show={this.state.show} id="new-forum" onHide={this.handlehideTopic}>
                    <form onSubmit={this.handleSubmit}>
                        <div role="document">
                            <div class="modal-header">
                                <h6 class="modal-title" id="exampleModalLabel">Create New Forum</h6>

                            </div>
                            <div class="modal-body p-4">
                                <div class="form-group">
                                    <label>Forum Title</label>
                                    <input type="text" name="title" id="title" value={this.state.form_data.title} onChange={this.handleChange} class="text-control" />
                                    {this.validator.message('Title', this.state.form_data.title, 'required')}
                                </div>
                                <div class="form-group">
                                    <label>Description</label>
                                    <textarea class="text-control" name="descr" id="descr" value={this.state.form_data.descr} onChange={this.handleChange}></textarea>
                                    {this.validator.message('Description', this.state.form_data.descr, 'required')}
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" onClick={this.handlehideTopic} data-dismiss="modal">Cancel</button>
                                {is_login() && (localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && <button type="submit" class="btn btn-primary">Create</button>}
                                {!is_login() && <button type="submit" class="btn btn-primary" onClick={this.openLoginModal}>Create</button>}

                            </div>
                        </div>
                    </form>
                </Modal>

                <Modal show={this.state.login_show} id="access-modal" size="lg" onHide={this.hideLoginModal}>

                    <div class="access-container login-popup">
                        <div class="container" id="container2">
                            <div class="form-container sign-up-container" style={{ display: this.state.sign_up_form }}>
                                <form className="form" id="kt_login_signin_form" onSubmit={this.handleSaveData}>
                                    <h5 class="title">Create Account</h5>
                                    <div class="social-container">
                                        <a href="javascript:void(0)" class="social" onClick={google_login}><i class="bi bi-google"></i></a>
                                        <a href="javascript:void(0)" class="social" onClick={facebook_login}><i class="bi bi-facebook"></i></a>
                                        {/* <a href="javascript:void(0)" class="social"><i class="bi bi-twitter"></i></a> */}
                                    </div>
                                    <span>or use your email for registration</span>
                                    <div class="access-input-group">
                                        <input type="text" name="name" id="name" placeholder="Name" data-validation="required" value={this.state.register_form_data.name} onChange={this.handleChangeRegister} />
                                        <input type="email" name="email" id="email" placeholder="Email" data-validation="required email" value={this.state.register_form_data.email} onChange={this.handleChangeRegister} />

                                        <input type="text" name="mobile" id="mobile" placeholder="Mobile" data-validation="required mobile" value={this.state.register_form_data.mobile} onChange={this.handleChangeRegister} />

                                        <input type="password" name="password" id="password" placeholder="Password" data-validation="required" value={this.state.register_form_data.password} onChange={this.handleChangeRegister} />

                                        <div class="mb-3">
                                            <Select
                                                value={this.state.register_form_data.country_id}
                                                onChange={this.handleCountry}
                                                isSearchable={true}
                                                options={this.state.country_list}
                                                id="country_id" name="country_id"
                                                placeholder="Select Country"

                                            />
                                        </div>


                                        <div class="mb-3">
                                            <input type='hidden' id="governance_id" name="governance_id" value={this.state.register_form_data.governance_id} />
                                            {/* <Select
                                                value={this.state.register_form_data.governance_id}
                                                onChange={this.handleGovernance}
                                                options={this.state.governance_list_new}
                                                id="governance_id" name="governance_id"
                                                placeholder="Select Governance"

                                            /> */}
                                        </div>

                                        <input type='hidden' id="zone_id" name="zone_id" value={this.state.register_form_data.zone_id} />
                                        {/*  <Select
                                            value={this.state.register_form_data.zone_id}
                                            onChange={this.handleZone}
                                            options={this.state.zone_list_new}
                                            id="zone_id" name="zone_id"
                                            placeholder="Select Zone"
                                        /> */}



                                        <input type='hidden' id="pincode" name="pincode" value={this.state.register_form_data.pincode} />




                                        {/* <input type="text" name="area" id="area" placeholder="Area" data-validation="required" value={this.state.register_form_data.area} onChange={this.handleChangeRegister} /> */}
                                        {/* <input type="text" name="pincode" id="pincode" placeholder="Pincode" data-validation="required" value={this.state.register_form_data.pincode} onChange={this.handleChangeRegister} /> */}

                                    </div>
                                    <button class="btn btn-primary">Sign Up</button>
                                </form>
                                <button onClick={this.showSignInPortion} class="btn btn-primary btn-sign-in " id="signIn">Sign In</button>
                            </div>
                            <div class="form-container sign-up-container" style={{ display: this.state.otp_verification }}>
                                <form className="form w-100" id="kt_login_signin_form" onSubmit={this.handleOTP}>

                                    <span>OTP Verification</span>
                                    <div class="access-input-group w-100">
                                        <input type="hidden" name="email" value={this.state.otp_form_data.email} />
                                        <input type="text" maxLength="4" required name="otp" id="otp" placeholder="OTP" data-validation="required" value={this.state.otp_form_data.otp} onChange={this.handleChangeOTP} />
                                    </div>
                                    <button class="btn btn-primary">Verify OTP</button>
                                    {/* <button class="btn btn-success" style={{ marginLeft: "180px", marginTop: "10px" }} onClick={this.resendOTP}>Resend OTP</button> */}
                                    <a onClick={this.resendOTP} style={{ marginTop: "10px", cursor: "pointer" }}>Don't receive the OTP? Resend OTP</a>
                                </form>
                            </div>
                            <div class="form-container sign-in-container" style={{ display: this.state.sign_in_form }}>
                                <form className="form" id="kt_login_signin_form" onSubmit={this.handleSubmitLogin}>
                                    <h5 class="title">Sign in</h5>
                                    <div class="social-container">
                                        <a href="javascript:void(0)" class="social" onClick={google_login}><i class="bi bi-google"></i></a>
                                        <a href="javascript:void(0)" class="social" onClick={facebook_login}><i class="bi bi-facebook"></i></a>
                                        {/* <a href="javascript:void(0)" class="social"><i class="bi bi-twitter"></i></a> */}
                                    </div>
                                    <span>or use your account</span>
                                    <div class="access-input-group">
                                        <input type="text" placeholder="Email" name="email" id="email" data-validation="required email" value={this.state.login_form_data.email} onChange={this.handleFormChange} />
                                        {this.validator_login.message('email', this.state.login_form_data.email, 'required')}
                                        <input type="password" placeholder="Password" name="password" id="password" value={this.state.login_form_data.password} onChange={this.handleFormChange} data-validation="required" />
                                        {this.validator_login.message('password', this.state.login_form_data.password, 'required')}
                                    </div>
                                    <a href="javascript:void(0)" onClick={this.show_forgot_password.bind(this)} class="pw-recover">Forgot your password?</a>

                                    <button class="btn btn-primary">Sign In</button>
                                </form>
                                <button onClick={this.showSignUpPortion} class="btn btn-primary btn-sign-up" id="signUp">Sign Up</button>
                            </div>


                            <div class="form-container sign-in-container" style={{ display: this.state.forgot_password }} >
                                <form className="form w-100" id="kt_login_signin_form" onSubmit={this.handleForgot}>
                                    <h5 class="title">Forgot password</h5>

                                    <div class="access-input-group w-100" >
                                        <input type="text" placeholder="Email" name="email" id="email" data-validation="required email" value={this.state.forgot_form_data.email} onChange={this.handleChangeforgot} />
                                        {this.validator_login.message('email', this.state.forgot_form_data.email, 'required')}
                                    </div>

                                    <button class="btn btn-primary">Forgot password</button>
                                    <a href="javascript:void(0)" onClick={this.show_sign_in.bind(this)} class="pw-recover btn btn-primary mt-3">Back to login</a>
                                </form>
                            </div>


                            <div class="overlay-container">
                                <div class="overlay">
                                    <div class="overlay-panel overlay-left">
                                        <h5 class="title">Welcome Back!</h5>
                                        <p>To keep connected with us please login with your personal info</p>
                                        <button onClick={this.showSignInPortion} class="btn btn-outline" id="signIn">Sign In</button>
                                    </div>
                                    <div class="overlay-panel overlay-right">
                                        <h5 class="title">Hello, Friend!</h5>
                                        <p>Enter your personal details and start journey with us</p>
                                        <button onClick={this.showSignUpPortion} class="btn btn-outline" id="signUp">Sign Up</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal>

            </>
        )
    }
}
export default QuestionList;