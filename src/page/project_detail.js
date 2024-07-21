import React, { Component } from 'react';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail, web_url, google_data, google_login, facebook_data, facebook_login } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import { Helmet } from "react-helmet";
import Loader from "react-loader";
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import { appendScript } from '../utils/appendScript'

class ProjectDetail extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.comment_validator = new SimpleReactValidator();
        var user_data = getUserDetail();

        var user_id = user_data ? user_data.u_id : '';
        var user_email = (user_data) ? user_data.u_email : '';
        var user_name = (user_data) ? user_data.u_name : '';
        var user_mobile = (user_data) ? user_data.u_mobile : '';
        var user_image = (user_data) ? user_data.u_image : '/assets/images/avatar-1.jpg';
        const project_comment_id = this.props.match.params.project_id;

        this.state = {
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
            show: false,
            form_data: {
                project_detail_data: '',
                project_tag_data: '',
                user_project_tag_data: '',
                similar_product_detail: '',
                seller_product_detail: '',
                is_favourite: 0,
                is_like: 0,
                project_view_count: 0,
                is_follow: 0,
                liked_count: 0,
                detail_list: [],
                u_id: user_id,
                seller_project: '',
            },

            comment_data: {
                comment: '',
                comment_count: 0,
                user_comment_id: user_id,
                project_comment_id: project_comment_id,
                comment_data: [],
            },
            add_more_title: '',
            user_image: user_image,
            loaded: false,
            error: ''
        }
        this.get_country();
        this.get_project_detail();
        this.get_liked_project();
        this.get_liked_count();
        this.get_comment_project();
        this.get_comment_count();
        this.get_project_favourite();
        //this.get_seller_follow();
        // console.log("uidd", user_id);
        if (user_id) {

            this.add_project_view();
            this.get_project_view();
        }
        this.openLoginModal = this.openLoginModal.bind(this);
        this.hideLoginModal = this.hideLoginModal.bind(this);
        this.showSignInPortion = this.showSignInPortion.bind(this);
        this.showSignUpPortion = this.showSignUpPortion.bind(this);
        this.handleLoginWeb = this.handleLoginWeb.bind(this);
        this.handleFavourite = this.handleFavourite.bind(this);
        this.handleLike = this.handleLike.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
        this.handleCountry = this.handleCountry.bind(this);
        this.handleGovernance = this.handleGovernance.bind(this);
        this.handleZone = this.handleZone.bind(this);
        this.handleSaveData = this.handleSaveData.bind(this);
        this.handleChangeRegister = this.handleChangeRegister.bind(this);
        this.handleForgot = this.handleForgot.bind(this);
        this.handleChangeLogin = this.handleChangeLogin.bind(this);
        this.handleChangeOTP = this.handleChangeOTP.bind(this);
        this.handleOTP = this.handleOTP.bind(this);
        this.get_seller_project();
        setTimeout(() => {
            // this.add_project_view();
        }, 3000);
        setTimeout(() => {
            this.setState({ loaded: true });
        }, 5000);

        facebook_data();
        google_data();
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
    handleChangeLogin(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.login_form_data[name] = value;
        this.setState({ data });
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
    handleSubmitLogin(event) {
        //var th = this;
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
                        if (window.callback != undefined) {
                            window.callback.login_success('{"user_id":"' + res_data.users.u_id + '","is_login":"1"}');
                        }

                        window.location.reload();
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
                        window.location.reload();
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
    handleChangeforgot(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.forgot_form_data[name] = value;
        this.setState({ data });
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
    async handleZone(event) {

        const name = event.lable;
        const value = event.value;
        var data = this.state.register_form_data['zone_id'] = { label: event.label, value: value };
        this.setState({ data });

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
                    this.setState({ show: false });
                    // window.$('#access-modal').modal('hide');
                } else {
                    toast.error(res_data.message);
                }
            })
        // }
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
        this.setState({ show: true });
        // e.preventDefault();
        //this.get_country();
        // $("#access-modal").modal("show")
    }
    hideLoginModal(e) {
        this.setState({ show: false });
    }
    showSignUpPortion(e) {

        $("#container").addClass("right-panel-active");
    }
    showSignInPortion(e) {
        $("#container").removeClass("right-panel-active");
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
    async get_seller_project() {
        var th = this;
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var login_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_fav_project';
        api_option.data = { login_id: login_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var seller_project = res.data.data;
                    th.setState(this.state.form_data.seller_project = seller_project);
                    // this.state.form_data.project_view_count = project_view_count
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    delete_comment(event, comment_id, comment_id1) {
        if (window.confirm("Are you sure to delete this Review?")) {
            var user_data = getUserDetail();
            var user_id = user_data ? user_data.u_id : '';
            api_option.url = 'delete_comment_project';
            api_option.data = { user_id: user_id, id: comment_id };
            api_option.headers.Authorization = sessionStorage.getItem('token');
            const th = this;
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        /*  */
                        this.get_comment_project();
                        /* var data = this.state.comment_data.comment_data;
                        var commentIndex = data.findIndex(function (c) {
                            return c.tcp_id == comment_id;
                        });
                        this.state.comment_data.comment_data.splice(commentIndex, 1); */
                        /*  */

                        /* console.log("f", res.data);
                        this.state.form_data.is_follow = 1; */

                        // th.setState(th.state.form_data.is_follow = 1);
                        //event.preventDefault();

                        // console.log(1);
                        // window.location.href = web_url + "Seller-detail/352";

                        toast.success(res.data.message);
                        // window.location.reload(false);

                        // this.setState({ redirect: "/Seller-detail/352" });

                        // th.get_seller_follow();

                        // th.setState({ redirect: '/productdetail/' + product_id });


                    } else {
                        /*   console.log("u", res.data);
                          this.state.form_data.is_follow = 0; */
                        // th.setState(th.state.form_data.is_follow = 0);
                        //event.preventDefault();
                        // console.log(2);
                        // window.location.href = web_url + "Seller-detail/352";
                        toast.error(res.data.message);
                        // window.location.reload(false);
                        // this.setState({ redirect: "/Seller-detail/352" });
                        // th.get_seller_follow();

                        // this.setState({ redirect: '/logout' });

                    }
                })
                .catch(error => {
                    // this.setState({ redirect: '/logout' });
                });
        }
    }

    componentDidMount() {
        appendScript("https://unpkg.com/swiper/swiper-bundle.min.js" + "?ts=" + new Date().getTime());
        appendScript("/assets/js/dropdown_toggle.js" + "?ts=" + new Date().getTime());
        appendScript("/assets/js/developer_signup_popup.js" + "?ts=" + new Date().getTime());
        appendScript("/assets/js/home_init.js" + "?ts=" + new Date().getTime());
        appendScript("/assets/js/custom.js" + "?ts=" + new Date().getTime());
    }

    async add_project_view(props) {
        var user_data = getUserDetail();

        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const project_id = this.props.match.params.project_id;

        api_option.url = 'add_project_view';
        api_option.data = { project_id: project_id, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    // var is_like = res.data.is_liked;
                    // this.setState(this.state.form_data.is_like = is_like);
                } else {
                    // var is_like = res.data.is_liked;
                    // this.setState(this.state.form_data.is_like = is_like);
                    // this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                //  this.setState({ redirect: '/logout' });
            });

    }
    async get_project_view(props) {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const project_id = this.props.match.params.project_id;
        api_option.url = 'get_project_view';
        api_option.data = { project_id: project_id, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {

                var project_view_count = res.data.project_view_count;

                this.setState(this.state.form_data.project_view_count = project_view_count);
                console.log(this.state.form_data.project_view_count)
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });

    }
    async get_liked_project(props) {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const project_id = this.props.match.params.project_id;
        api_option.url = 'get_liked_project';
        api_option.data = { project_id: project_id, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var is_like = res.data.is_liked;
                    this.setState(this.state.form_data.is_like = is_like);
                } else {
                    var is_like = res.data.is_liked;
                    this.setState(this.state.form_data.is_like = is_like);
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });

    }


    openTagDetail(event) {

        $(".lg-hotspot").removeClass("lg-hotspot--selected");
        $(event.target).parents(".lg-hotspot").toggleClass("lg-hotspot--selected");
    }
    handleFollow1(event, sellerid) {

        var user_data = getUserDetail();
        console.log('sellerid', sellerid)
        /* console.log(user_data.u_id)
        console.log(sellerid)
        return false; */
        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'follow_unfollow_seller';
        api_option.data = { user_id: user_id, sellerid: sellerid };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    /* console.log("f", res.data);
                    this.state.form_data.is_follow = 1; */

                    // th.setState(th.state.form_data.is_follow = 1);
                    //event.preventDefault();

                    // console.log(1);
                    // window.location.href = web_url + "Seller-detail/352";

                    toast.success(res.data.message);
                    window.location.reload(false);

                    // this.setState({ redirect: "/Seller-detail/352" });

                    // th.get_seller_follow();

                    // th.setState({ redirect: '/productdetail/' + product_id });


                } else {
                    /*   console.log("u", res.data);
                      this.state.form_data.is_follow = 0; */
                    // th.setState(th.state.form_data.is_follow = 0);
                    //event.preventDefault();
                    // console.log(2);
                    // window.location.href = web_url + "Seller-detail/352";
                    toast.error(res.data.message);
                    window.location.reload(false);
                    // this.setState({ redirect: "/Seller-detail/352" });
                    // th.get_seller_follow();

                    // this.setState({ redirect: '/logout' });

                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
            });
    }

    handleFollow(event, sellerid) {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'follow_unfollow_seller';
        api_option.data = { user_id: user_id, sellerid: sellerid };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        axios(api_option)
            .then(res => {
                if (res.data.status) {

                    toast.success(res.data.message);
                    window.location.reload(false);
                    // th.get_seller_follow();

                    // th.setState({ redirect: '/productdetail/' + product_id });


                } else {
                    toast.error(res.data.message);
                    window.location.reload(false);
                    // th.get_seller_follow();

                    // this.setState({ redirect: '/logout' });

                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }


    async get_seller_follow(props) {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        console.log("project", this.state.form_data.project_detail_data);
        if (this.state.form_data.project_detail_data.u_id != undefined) {
            var seller_id = this.state.form_data.project_detail_data.u_id;
            var user_id = user_data ? user_data.u_id : '';
            api_option.url = 'get_seller_follow_check';
            api_option.data = { user_id: user_id, seller_id: seller_id };
            api_option.headers.Authorization = sessionStorage.getItem('token');

            const th = this;
            await axios(api_option)
                .then(res => {

                    if (res.data.status) {

                        th.setState(this.state.form_data.is_follow = 1);

                        // this.state.form_data.is_follow = 1;
                        /* var is_follow = res.data.data;

                        this.setState(this.state.form_data.is_follow = is_follow.follow); */

                        console.log("1", this.state.form_data.is_follow);
                    } else {
                        th.setState(this.state.form_data.is_follow = 0);
                        /*  var is_follow = res.data.is_follow;

                         this.setState(this.state.form_data.is_follow = is_follow); */

                        // this.setState({ redirect: '/logout' });
                        // this.state.form_data.is_follow = 0;
                        console.log("0", this.state.form_data.is_follow);
                    }
                })
                .catch(error => {
                    this.setState({ redirect: '/logout' });
                });
        }


    }



    async get_comment_project(props) {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const project_id = this.props.match.params.project_id;
        api_option.url = 'get_comment_project';
        api_option.data = { project_id: project_id, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {

                if (res.data.status) {

                    var comment_data = res.data.comment_list;
                    this.setState(this.state.comment_data.comment_data = comment_data);
                } else {
                    var comment_data = [];
                    this.setState(this.state.comment_data.comment_data = comment_data);
                    //this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });

    }


    async get_liked_count(props) {
        var user_data = getUserDetail();
        const project_id = this.props.match.params.project_id;

        api_option.url = 'get_liked_count';
        api_option.data = { project_id: project_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {

                if (res.data.status) {
                    var liked_count = res.data.liked_count;
                    this.setState(this.state.form_data.liked_count = liked_count);


                } else {

                    var liked_count = res.data.liked_count;

                    this.setState(this.state.form_data.liked_count = liked_count);
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });

    }
    async get_comment_count(props) {
        var user_data = getUserDetail();
        const project_id = this.props.match.params.project_id;
        api_option.url = 'get_comment_count';
        api_option.data = { project_id: project_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {

                if (res.data.status) {
                    var comment_count = res.data.comment_count;
                    this.setState(this.state.comment_data.comment_count = comment_count);
                } else {
                    var comment_count = res.data.comment_count;
                    this.setState(this.state.form_data.comment_count = comment_count);
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });

    }


    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.comment_data[name] = value;
        this.setState({ data });
    }

    // form submit event
    handleSubmit(event) {
        event.preventDefault();
        if (!this.comment_validator.allValid()) {
            this.comment_validator.showMessages();
            this.forceUpdate();
        } else {
            this.setState({ loaded: false });
            api_option.url = 'save_project_comment';
            api_option.data = this.state.comment_data;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        this.state.comment_data.comment = '';
                        toast.success(res.data.message);
                        this.get_comment_project();
                        this.get_comment_count();
                    } else {

                        toast.error(res.data.message);

                        // this.setState({error:res_data.message});
                    }
                })
                .catch(error => console.log(error));
        }

    }

    handleFavourite() {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const project_id = this.props.match.params.project_id;
        api_option.url = 'add_to_favourite';
        api_option.data = { project_id: project_id, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    toast.success(res.data.message);
                    th.get_project_favourite();
                    // th.setState({ redirect: '/productdetail/' + product_id });
                } else {
                    toast.error(res.data.message);
                    th.get_project_favourite();
                    // this.setState({ redirect: '/logout' });

                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    async get_project_favourite(props) {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const project_id = this.props.match.params.project_id;
        api_option.url = 'get_favourite_project';
        api_option.data = { project_id: project_id, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {

                if (res.data.status) {

                    var is_favourite = res.data.is_favourite;


                    this.setState(this.state.form_data.is_favourite = is_favourite);


                } else {
                    var is_favourite = res.data.is_favourite;

                    this.setState(this.state.form_data.is_favourite = is_favourite);
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });

    }

    async get_project_detail() {
        var user_data = getUserDetail();
        const project_id = this.props.match.params.project_id;
        var user_id = user_data ? user_data.u_id : '';
        this.setState({ loaded: false });
        api_option.url = 'get_front_project_detail';
        api_option.data = { project_id: project_id, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {
                    var detail_data = res.data.data;

                    this.setState(this.state.form_data.project_detail_data = detail_data);
                    this.setState(this.state.form_data.project_tag_data = res.data.project_tag_data);

                    this.setState(this.state.form_data.user_project_tag_data = res.data.user_project_tag_data);

                    this.setState({ add_more_title: this.state.form_data.project_tag_data[0].tpd_title })

                    this.get_seller_follow();
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }



    handleLike() {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const project_id = this.props.match.params.project_id;
        api_option.url = 'add_to_like';
        api_option.data = { project_id: project_id, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        axios(api_option)
            .then(res => {
                if (res.data.status) {

                    toast.success(res.data.message);
                    th.get_liked_project();
                    th.get_liked_count();
                    // th.setState({ redirect: '/productdetail/' + product_id });


                } else {
                    toast.error(res.data.message);
                    th.get_liked_project();
                    th.get_liked_count();
                    // this.setState({ redirect: '/logout' });

                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }


    handleFavourite(event, pid, sellerid) {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const project_id = this.props.match.params.project_id;
        api_option.url = 'add_to_favourite_project';
        api_option.data = { project_id: project_id, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        axios(api_option)
            .then(res => {
                if (res.data.status) {

                    toast.success(res.data.message);
                    th.get_project_favourite();
                    // th.setState({ redirect: '/productdetail/' + product_id });


                } else {
                    toast.error(res.data.message);
                    th.get_project_favourite();

                    // this.setState({ redirect: '/logout' });

                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }







    //view load home page
    render() {

        return (
            <>
                <Helmet>
                    <script src="/assets/js/project_detail.js"></script>
                    <script src="/assets/js/jquery-3.2.1.min.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
                    <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>

                    <script src="/assets/js/custom.js"></script>
                </Helmet>
                <Loader
                    loaded={this.state.loaded}
                    lines={15}
                    length={20}
                    width={10}
                    radius={30}
                    corners={1}
                    rotate={0}
                    direction={1}
                    color="#fff"
                    speed={1}
                    trail={60}
                    shadow={true}
                    hwaccel={false}
                    className="spinner"
                    position="fixed"
                    zIndex={2e9}
                    top="50%"
                    left="50%"
                    scale={0.5}
                    loadedClassName="loadedContent"
                />
                <Modal show={this.state.show} id="access-modal" size="lg" onHide={this.hideLoginModal}>

                    <div class="access-container login-popup">
                        <div class="container" id="container">
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
                                        <input type="text" placeholder="Email" name="email" id="email" data-validation="required email" value={this.state.login_form_data.email} onChange={this.handleChangeLogin} />
                                        {this.validator.message('email', this.state.login_form_data.email, 'required')}
                                        <input type="password" placeholder="Password" name="password" id="password" value={this.state.login_form_data.password} onChange={this.handleChangeLogin} data-validation="required" />
                                        {this.validator.message('password', this.state.login_form_data.password, 'required')}
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
                                        {this.validator.message('email', this.state.forgot_form_data.email, 'required')}
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
                <div class="page-breadcrumb">
                    <div class="container">
                        <ul>
                            <li><i class="bi-house"></i></li>
                            <li><Link to={`/projects`} class="hs-p-name">Projects</Link></li>
                            <li>{this.state.form_data.project_detail_data.tpro_name}</li>
                        </ul>
                    </div>
                </div>

                <div class="projectFull-page">
                    <div class="project-page-top">
                        <div class="container">
                            <div class="projectDetials-header">
                                <div class="projectDetials-header-left">
                                    <h1>{this.state.form_data.project_detail_data.tpro_name}</h1>
                                </div>
                                <div class="projectDetials-header-right">

                                    <p>{this.state.form_data.project_detail_data.tpro_short_desc}</p>
                                    <div class="projectDetials-counter">
                                        <span class="like-counter"><i class="bi bi-hand-thumbs-up-fill"></i>{this.state.form_data.liked_count}</span>
                                        <span class="review-counter"><i class="bi bi-eye-fill"></i> {this.state.form_data.project_detail_data.tpro_view_count}</span>
                                    </div>
                                    {this.state.form_data.project_detail_data.u_type == 3 && <div class="projectDetials-author">
                                        <Link to={`/Seller-detail/${this.state.form_data.project_detail_data.u_id}`}>
                                            <div class="author-list">
                                                <img src={this.state.form_data.project_detail_data.u_image} />
                                                <div class="auth-dec">
                                                    <strong>{this.state.form_data.project_detail_data.u_name}</strong>
                                                    <span>{this.state.form_data.project_detail_data.tpro_created_date}</span>
                                                </div>
                                            </div>
                                        </Link>
                                        {this.state.form_data.is_follow == 1 && <NavLink exact to class="btn btn-white" onClick={this.handleFollow.bind(this, this.state.form_data.project_detail_data.u_id, this.state.form_data.project_detail_data.u_id)}>Following</NavLink>}
                                        {this.state.form_data.is_follow == 0 && <NavLink exact to class="btn btn-white" onClick={this.handleFollow.bind(this, this.state.form_data.project_detail_data.u_id, this.state.form_data.project_detail_data.u_id)}>Follow</NavLink>}
                                    </div>
                                    }
                                    {this.state.form_data.project_detail_data.u_type == 2 && <div class="projectDetials-author">
                                        <Link to={`/Professional-detail/${this.state.form_data.project_detail_data.u_id}`}>
                                            <div class="author-list">
                                                <img src={this.state.form_data.project_detail_data.u_image} />
                                                <div class="auth-dec">
                                                    <strong>{this.state.form_data.project_detail_data.u_name}</strong>
                                                    <span>{this.state.form_data.project_detail_data.tpro_created_date}</span>
                                                </div>
                                            </div>
                                        </Link>
                                        {is_login() && this.state.form_data.is_follow == 1 && <NavLink exact to class="btn btn-white 1" onClick={this.handleFollow1.bind(this, this.state.form_data.project_detail_data.u_id, this.state.form_data.project_detail_data.u_id)}>Following</NavLink>}
                                        {is_login() && this.state.form_data.is_follow == 0 && <NavLink exact to class="btn btn-white 2" onClick={this.handleFollow1.bind(this, this.state.form_data.project_detail_data.u_id, this.state.form_data.project_detail_data.u_id)}>Follow</NavLink>}
                                        {!is_login() && <button class="btn btn-white" onClick={this.openLoginModal}>Follow</button>}
                                    </div>
                                    }

                                </div>
                            </div>
                        </div>
                        <div class="project-banner-section">
                            <img src={this.state.form_data.project_detail_data.tpro_image} />

                        </div>
                    </div>
                    <div class="container container-small">
                        <div class="project-features">
                            <div class="pFeature-list">
                                <img src="/assets/images/pFeature-1.svg" />
                                <div>
                                    <span>Type</span>
                                    <strong>Apartment</strong>
                                </div>
                            </div>
                            <div class="pFeature-list">
                                <img src="/assets/images/pFeature-2.svg" />
                                <div>
                                    <span>Size</span>
                                    <strong>{this.state.form_data.project_detail_data.tpro_size}</strong>
                                </div>
                            </div>
                            <div class="pFeature-list">
                                <img src="/assets/images/pFeature-3.svg" />
                                <div>
                                    <span>Work</span>
                                    <strong>{this.state.form_data.project_detail_data.tpro_work}</strong>
                                </div>
                            </div>
                            <div class="pFeature-list">
                                <img src="/assets/images/pFeature-4.svg" />
                                <div>
                                    <span>Time</span>
                                    <strong>{this.state.form_data.project_detail_data.tpro_time}</strong>
                                </div>
                            </div>
                        </div>
                        <div class="project-detail-metadata">
                            <div>Detailed construction:</div>

                            {Object.entries(this.state.form_data.user_project_tag_data).map(([i, sp]) => (
                                <span>{sp.pt_tag}</span>
                            ))}

                        </div>
                        <div class="project-actionButtons">
                            {is_login() && this.state.form_data.is_like == 1 && <button class="like" onClick={this.handleLike}><i class="bi bi-hand-thumbs-up-fill"></i> </button>}
                            {is_login() && this.state.form_data.is_like == 0 && <button class="like" onClick={this.handleLike}><i class="bi bi-hand-thumbs-up"></i> </button>}
                            {!is_login() && <button class="like" onClick={this.openLoginModal}><i class="bi bi-hand-thumbs-up"></i> </button>
                            }
                            {/* <button class="like"><i class="bi bi-hand-thumbs-up-fill"></i></button> */}
                            {/* <button class="comment"><i class="bi bi-chat-dots-fill"></i></button> */}
                            {is_login() && this.state.form_data.is_favourite == 1 && <button class="bookmark" onClick={this.handleFavourite}><i class="bi bi-heart-fill"></i></button>}
                            {is_login() && this.state.form_data.is_favourite == 0 && <button class="bookmark" onClick={this.handleFavourite}><i class="bi bi-heart"></i> </button>}

                            {!is_login() && <button class="bookmark" onClick={this.openLoginModal}><i class="bi bi-heart"></i></button>
                            }
                            {/* <button class="bookmark"><i class="bi bi-heart-fill"></i></button> */}
                            {/* <button class="share"><i class="bi bi-share-fill"></i></button> */}
                        </div>
                        <div class="project-detail-content">
                            {Object.entries(this.state.form_data.project_tag_data).map(([i, sp]) => (
                                <div>
                                    {sp.tpd_title && <h4>{sp.tpd_title}</h4>}
                                    {sp.tpd_desc && <p>{sp.tpd_desc}</p>}


                                    {/* {sp.tpd_image && !sp.tpd_tag_data &&
                                        <div class="media-image"><img src={sp.tpd_image} /></div>
                                    } */}
                                    {sp.tpd_image && sp.tag_data &&
                                        <div class="spot-container">
                                            <div class="lg-container">
                                                <img src={sp.tpd_image} class="lg-image" />


                                                {Object.entries(sp.tag_data).map(([i, td]) => (
                                                    <div style={{ 'top': td.image_y, 'left': td.image_x }} data-spot={i} class="lg-hotspot lg-hotspot--top-left">
                                                        <div class="lg-hotspot__button" onClick={this.openTagDetail.bind(this)}></div>
                                                        <div class="lg-hotspot__label">
                                                            <div class="hotspot-product">
                                                                {td.product_image != undefined && <img src={td.product_image} />}
                                                                <div>
                                                                    <Link to={`/productdetail/${td.product}`} class="hs-p-name">{td.product_name}</Link>
                                                                    <span class="hs-p-price">RO {td.product_price}</span>
                                                                    <Link to={`/productdetail/${td.product}`} class="hs-p-link">View Product</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* <div class="spot-thumb">
                                                {Object.entries(sp.tag_data).map(([i, td]) => (
                                                    <div class="spot-items" data-id={i}><a href=""><img src={td.product_image} /></a></div>
                                                ))}
                                               <div class="spot-items" data-id="2"><a href=""><img src="/assets/images/product-2.jpg" /></a></div>
                                                <div class="spot-items" data-id="3"><a href=""><img src="/assets/images/product-3.jpg" /></a></div>
                                                <div class="spot-items" data-id="4"><a href=""><img src="/assets/images/product-4.jpg" /></a></div>
                                            </div> */}
                                        </div>
                                    }

                                    {Object.entries(this.state.form_data.project_tag_data).map(([i, sp]) => (
                                        <div class="products-listing-wrapper">
                                            <div class="products-grid">
                                                {sp.tpd_image && sp.tag_data &&

                                                    Object.entries(sp.tag_data).map(([i, sp]) => (
                                                        <div class="product-item">
                                                            <div class="product-thumb">
                                                                <div class="thumbtag">
                                                                    {/* <span class="sale">Sale</span> */}
                                                                </div>
                                                                <Link to={`/productdetail/${sp.product}`}>
                                                                    <img src={sp.product_image} />
                                                                </Link>
                                                            </div>
                                                            <div class="product-info" style={{ "display": "none" }}>
                                                                <h4 class="product-name"><Link to={`/productdetail/${sp.product}`}>{sp.product_name}</Link></h4>
                                                                <div class="just-in">

                                                                    <div class="product-price">{sp.product_price > 0 && <del>RO {sp.product_price}</del>}<span>RO {sp.product_sale_price}</span></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }

                                            </div>
                                        </div>
                                    ))}



                                </div>
                            ))}
                        </div>


                        {/* <div class="browse-wrapper">
                            <h5 class="md-title">Browse other houses</h5>
                            <div class="project-tags">
                                <a href="">Apartment</a>
                                <a href="">1440 sq.ft</a>
                                <a href="">Expert</a>
                                <a href="">Remodeling</a>
                                <a href="">House with preschool children</a>
                                <a href="">natural</a>
                                <a href="">Wooden floor</a>
                                <a href="">Porcelain Tile</a>
                                <a href="">Kitchen remodeling</a>
                                <a href="">Lighting construction</a>
                            </div>
                        </div> */}

                        <div class="commentbox">
                            <h5 class="md-title"><span class="text-primary">{this.state.comment_data.comment_count}</span> Reviews</h5>
                            <form class="post-comment" onSubmit={this.handleSubmit}>

                                <div class="comment-user-thumb"><img src={this.state.user_image} /></div>
                                <div class="comment-input">
                                    <input type="text" name="comment" value={this.state.comment_data.comment} onChange={this.handleChange} placeholder="Write here..." />
                                    <input type="hidden" name="project_id" value={this.state.comment_data.project_comment_id} />
                                    <input type="hidden" name="user_id" value={this.state.comment_data.user_comment_id} />
                                    {this.comment_validator.message('Comment', this.state.comment_data.comment, 'required')}
                                    {localStorage.getItem('type') == 1 && is_login() && <button class="plain text-primary">Post</button> || <p style={{ color: 'red' }}>Only login user can post the comment</p>}
                                </div>
                            </form>
                            <ul class="comment-feed-list">

                                {Object.entries(this.state.comment_data.comment_data).map(([o, comment]) => (

                                    <li class="comment-feed-item">
                                        <article>
                                            <p class="comment-feed-content">
                                                <a href=""><img src={comment.u_image} />{comment.u_name}</a>
                                                <span> {comment.tpc_comment}</span>
                                            </p>
                                            <time>{comment.tpc_created_at}</time>
                                            {is_login() && comment.tpc_user_id == this.state.form_data.u_id && <button type="button" class="plain text-danger" onClick={this.delete_comment.bind(this, o, comment.tpc_id)}>Delete</button>}
                                        </article>
                                    </li>
                                ))}
                                {/* <li class="comment-feed-item">
                                    <article>
                                        <p class="comment-feed-content">
                                            <a href=""><img src="/assets/images/avatar-4.jpg" />Mark Burks</a>
                                            <span>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span>
                                        </p>
                                        <time>12 hours ago</time>
                                    </article>
                                </li>
                                <li class="comment-feed-item">
                                    <article>
                                        <p class="comment-feed-content">
                                            <a href=""><img src="/assets/images/avatar-5.jpg" />Ramiro Lovett</a>
                                            <span>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                                        </p>
                                        <time>12 hours ago</time>
                                    </article>
                                </li>
                                <li class="comment-feed-item">
                                    <article>
                                        <p class="comment-feed-content">
                                            <a href=""><img src="/assets/images/avatar-6.jpg" />Jill Carrington</a>
                                            <span>Sed ut perspiciatis unde omnis iste natus error sit voluptatem</span>
                                        </p>
                                        <time>12 hours ago</time>
                                    </article>
                                </li>
                                <li class="comment-feed-item">
                                    <article>
                                        <p class="comment-feed-content">
                                            <a href=""><img src="/assets/images/avatar-7.jpg" />Marcella Woods</a>
                                            <span>accusantium doloremque laudantium</span>
                                        </p>
                                        <time>12 hours ago</time>
                                    </article>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                </div>


                <div class="stories-section">
                    <div class="uncol">
                        <h5 class="md-title">How about a story like this?</h5>
                        {/* project-slider */}
                        <div class="swiper-container project-slider">
                            <div class="swiper-wrapper">
                                {Object.entries(this.state.form_data.seller_project).map(([o, p]) => (
                                    <div class="swiper-slide">
                                        <a onClick={() => { document.location = web_url + "projectdetail/" + p.tpro_id; }} style={{ cursor: 'pointer' }}>
                                            <div class="sl-story-item" style={{ width: 'max-content', margin: 'auto' }}>
                                                <Link to={`/projectdetail/${p.tpro_id}`}></Link>
                                                <div class="sl-story-cover">
                                                    <img src={p.tpro_image} className={'sliderimgsize'} />
                                                </div>
                                                <div class="sl-story-info">
                                                    <h6>{p.u_name}</h6>
                                                    <h3>{p.tpro_name}</h3>

                                                    <span>
                                                        <a onClick={() => { document.location = web_url + "projectdetail/" + p.tpro_id; }} style={{ cursor: 'pointer' }}>Read More</a>

                                                        {/* <a href={web_url + `projectdetail/${p.tpro_id}`}>Read More</a> */}
                                                        {/* <Link to={`/projectdetail/${p.tpro_id}`} someProp={p.tpro_id} >Read More</Link> */}
                                                    </span>
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                ))}

                            </div>
                            <div class="swiper-pagination"></div>
                        </div>

                        {/*  */}
                        {/* <div class="swiper-slide">
                                    <div class="sl-story-item">
                                        <a href=""></a>
                                        <div class="sl-story-cover">
                                            <img src="/assets/images/story-1.jpg" />
                                        </div>
                                        <div class="sl-story-info">
                                            <h6>Online housewarming</h6>
                                            <h3>Soryu-heon, a house where the smiles of a couple of potters flow</h3>
                                            <span>Read More</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="swiper-slide">
                                    <div class="sl-story-item">
                                        <a href=""></a>
                                        <div class="sl-story-cover">
                                            <img src="/assets/images/story-2.jpg" />
                                        </div>
                                        <div class="sl-story-info">
                                            <h6>Online housewarming</h6>
                                            <h3>Soryu-heon, a house where the smiles of a couple of potters flow</h3>
                                            <span>Read More</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="swiper-slide">
                                    <div class="sl-story-item">
                                        <a href=""></a>
                                        <div class="sl-story-cover">
                                            <img src="/assets/images/story-3.jpg" />
                                        </div>
                                        <div class="sl-story-info">
                                            <h6>Online housewarming</h6>
                                            <h3>Soryu-heon, a house where the smiles of a couple of potters flow</h3>
                                            <span>Read More</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="swiper-slide">
                                    <div class="sl-story-item">
                                        <a href=""></a>
                                        <div class="sl-story-cover">
                                            <img src="/assets/images/story-4.jpg" />
                                        </div>
                                        <div class="sl-story-info">
                                            <h6>Online housewarming</h6>
                                            <h3>Soryu-heon, a house where the smiles of a couple of potters flow</h3>
                                            <span>Read More</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="swiper-slide">
                                    <div class="sl-story-item">
                                        <a href=""></a>
                                        <div class="sl-story-cover">
                                            <img src="/assets/images/story-5.jpg" />
                                        </div>
                                        <div class="sl-story-info">
                                            <h6>Online housewarming</h6>
                                            <h3>Soryu-heon, a house where the smiles of a couple of potters flow</h3>
                                            <span>Read More</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="swiper-slide">
                                    <div class="sl-story-item">
                                        <a href=""></a>
                                        <div class="sl-story-cover">
                                            <img src="/assets/images/story-6.jpg" />
                                        </div>
                                        <div class="sl-story-info">
                                            <h6>Online housewarming</h6>
                                            <h3>Soryu-heon, a house where the smiles of a couple of potters flow</h3>
                                            <span>Read More</span>
                                        </div>
                                    </div>
                                </div> */}
                        {/*  */}

                    </div>
                </div>

            </>
        );
    }
}


export default ProjectDetail;
