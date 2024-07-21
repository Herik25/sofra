import React, { Component } from 'react';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail, getUserId, web_url, google_data, google_login, facebook_data, facebook_login } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import $ from 'jquery';
import Select from 'react-select';
import Loader from "react-loader";
import { Helmet } from "react-helmet";
import Modal from 'react-bootstrap/Modal';
class ProfessionalDetail extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        this.booking_validator = new SimpleReactValidator();
        this.validator = new SimpleReactValidator();
        this.comment_validator = new SimpleReactValidator();

        var user_id = user_data ? user_data.u_id : '';

        const professional_id = this.props.match.params.professional_id;

        var cat_id = localStorage.getItem('category_id')
        var subcat_id = localStorage.getItem('subcategory_id')

        this.initialState = {
            form_data: {
                listing: '',
                services: '',
                title: '',
                location: '',
                message: '',
                descr: '',
                category: cat_id,
                subcategory: subcat_id,
                u_id: user_id,
                professional_id: professional_id,
                services_price: '',
                services_area: '',
                is_follow: 0,
            },
            comment_data: {
                comment: '',
                comment_count: '',
                user_comment_id: user_id,
                professional_comment_id: professional_id,
                comment_data: [],
            },
            u_id: user_id,
            is_exist_service: 0,
            loaded: false,

            professional_knowhow_data: '',
            professional_project_data: '',
            professional_detail_data: '',
            professional_social_media: '',
            error: '',
            gtotal: '',
            is_data: '',
            cart_array: [],
            login_form_data: { email: '', password: '' },
            forgot_form_data: { email: '' },
            register_form_data: { name: '', email: '', password: '', country_id: '', governance_id: '', zone_id: '' },
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
            showBookingModal: false,
            showReportModal: false,
        }

        this.state = this.initialState;
        this.get_country();
        this.get_professional_detail();
        this.get_professional_project();
        this.get_professional_knowhow();
        this.get_comment_professional();
        this.get_professional_cat_service();
        this.get_seller_service_area();
        this.get_comment_count();
        this.get_service_price();
        this.get_seller_follow();
        this.delete_comment = this.delete_comment.bind(this);

        this.get_service_is_exist_cart(localStorage.getItem('subcategory_id'));


        // this.handleDelete = this.handleDelete.bind(this);
        // this.handleQuantity = this.handleQuantity.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBookChange = this.handleBookChange.bind(this);
        this.handleBookNow = this.handleBookNow.bind(this);
        this.handleReportChange = this.handleReportChange.bind(this);

        this.openLoginModal = this.openLoginModal.bind(this);
        this.hideLoginModal = this.hideLoginModal.bind(this);
        this.hideBookingModal = this.hideBookingModal.bind(this);
        this.showSignInPortion = this.showSignInPortion.bind(this);
        this.showSignUpPortion = this.showSignUpPortion.bind(this);
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
        this.openReportModal = this.openReportModal.bind(this);
        this.hideReportModal = this.hideReportModal.bind(this);

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
        this.setState({ show: true });
        // e.preventDefault();

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

    show_forgot_password() {
        this.setState({ 'forgot_password': 'flex' })
        this.setState({ 'sign_in_form': 'none' })
    }
    handleChangeRegister(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.register_form_data[name] = value;
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
                    this.setState({ show: false });
                    // window.$('#access-modal').modal('hide');
                } else {
                    toast.error(res_data.message);
                }
            })
        // }
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

    // show_sign_in
    show_sign_in() {
        this.setState({ 'forgot_password': 'none' })
        this.setState({ 'sign_in_form': 'flex' })
    }
    async get_seller_follow(props) {
        var user_data = getUserDetail();
        // console.log("new ", user_data); return false;

        var seller_id = this.props.match.params.professional_id;
        var user_id = user_data ? user_data.u_id : '';
        // var user_id = this.props.match.params.seller_id;
        api_option.url = 'get_seller_follow_check';
        api_option.data = { user_id: user_id, seller_id: seller_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                console.log(res.data.status);
                if (res.data.status) {

                    // var is_follow = res.data.data;

                    this.state.form_data.is_follow = 1;
                    console.log("flw1", this.state.form_data.is_follow);
                    // this.setState(this.state.form_data.is_follow = 1);


                } else {
                    console.log("flw", th.state.form_data.is_follow);
                    // var is_follow = res.data.is_follow;
                    this.state.form_data.is_follow = 0
                    // this.setState(this.state.form_data.is_follow = 0);

                    // this.setState(this.state.form_data.is_follow = is_follow);

                    //this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });

    }

    // openLoginModal(e) {
    //     e.preventDefault();
    //     window.$("#access-modal").modal("show")
    // }

    componentDidMount() {

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
    delete_comment(event, comment_id, comment_id1) {
        if (window.confirm("Are you sure to delete this Review?")) {
            var user_data = getUserDetail();
            var user_id = user_data ? user_data.u_id : '';
            api_option.url = 'delete_comment';
            api_option.data = { user_id: user_id, id: comment_id };
            api_option.headers.Authorization = sessionStorage.getItem('token');
            const th = this;
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        /*  */
                        this.get_comment_professional();
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
    handleServData(subcat_id, event) {

        localStorage.setItem('subcategory_id', subcat_id);
        this.get_service_is_exist_cart(subcat_id);
        this.get_professional_cat_service();
    }

    handleOpenBook(event) {
        //window.$('#booking').modal('show');

        this.setState({ showBookingModal: true });
    }
    hideBookingModal(e) {
        this.setState({ showBookingModal: false });
    }
    openReportModal(event) {
        //window.$('#booking').modal('show');

        this.setState({ showReportModal: true });
    }
    hideReportModal(e) {
        this.setState({ showReportModal: false });
    }
    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.comment_data[name] = value;
        this.setState({ data });
    }
    handleBookChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
    }
    handleReportChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
    }





    handleReportAbuse(user_id, professional_id, event) {

        event.preventDefault();
        // if (!this.validator.allValid()) {
        //     this.validator.showMessages();
        //     this.forceUpdate();
        // } else {
        this.setState({ loaded: false });
        var message = $('#message').val();

        if (message == '') {
            toast.info('Please enter message');
            this.setState({ loaded: true });
            return false
        }
        api_option.url = 'save_report_abuse';
        api_option.data = { user_id: user_id, professional_id: professional_id, message: message };

        axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                const res_data = res.data;
                console.log(res_data)

                if (res_data.status) {
                    $('#message').val('');
                    this.setState({ showReportModal: false });
                    toast.success(res.data.message);


                } else {
                    $('#message').val('');
                    window.$('#report').modal('hide');
                    toast.error(res.data.message);

                    // this.setState({error:res_data.message});
                }
            })
            .catch(error => console.log(error));
        // }
    }


    async get_comment_professional(props) {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const professional_id = this.props.match.params.professional_id;
        this.setState({ loaded: false });
        api_option.url = 'get_comment_professional';
        api_option.data = { professional_id: professional_id, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {

                    var comment_data = res.data.comment_list;
                    this.setState(this.state.comment_data.comment_data = comment_data);


                } else {

                    //this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });

    }


    async get_service_price(props) {

        api_option.url = 'get_service_price';

        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {

                    var services_data = res.data.service_list;
                    this.setState(this.state.form_data.services_price = services_data);
                    // console.log(this.state.form_data.services_price.sp_price)

                } else {
                }
            })
            .catch(error => {
            });

    }
    async get_service_is_exist_cart(subcat) {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const professional_id = this.props.match.params.professional_id;
        api_option.url = 'get_service_is_exist_cart';
        api_option.data = { user_id: user_id, sub_cat: subcat };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {

                if (res.data.status) {

                    var is_exist_service = res.data.is_exist_service;
                    this.setState({ is_exist_service: res.data.is_exist_service });




                } else {

                    var is_exist_service = res.data.is_exist_service;
                    this.setState({ is_exist_service: res.data.is_exist_service });

                    //  this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
            });

    }

    async get_seller_service_area(props) {

        // console.log(user_data.u_id)
        var category_id = localStorage.getItem('category_id');
        var subcategory_id = localStorage.getItem('subcategory_id');

        var professional_id = this.props.match.params.professional_id;

        api_option.url = 'get_seller_service_area';
        api_option.data = { user_id: professional_id };
        // api_option.data = { category_id: category_id, subcategory_id: subcategory_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {

                    var services_area = res.data.comment_list;
                    this.setState(this.state.form_data.services_area = services_area);
                    //console.log(this.state.form_data.services)

                } else {

                    //this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });

    }

    async get_professional_cat_service(props) {

        // console.log(user_data.u_id)
        var category_id = localStorage.getItem('category_id');
        var subcategory_id = localStorage.getItem('subcategory_id');

        var professional_id = this.props.match.params.professional_id;

        api_option.url = 'get_professional_cat_service';
        api_option.data = { professional_id: professional_id };
        // api_option.data = { category_id: category_id, subcategory_id: subcategory_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {

                    var services_data = res.data.service_list;
                    this.setState(this.state.form_data.services = services_data);
                    //console.log(this.state.form_data.services)

                } else {

                    //this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });

    }

    async get_cart_data(props) {

        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_cart_detail';
        api_option.data = { user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var cart_data = res.data.cart_list;

                    var service_data = res.data.service_list;
                    var cart_array = [];
                    for (var i = 0; i < cart_data.length; i++) {
                        cart_array.push({
                            image: cart_data[i]['image'],
                            cart_id: cart_data[i]['cart_id'],
                            user_id: cart_data[i]['user_id'],
                            product_id: cart_data[i]['product_id'],
                            quantity: cart_data[i]['quantity'],
                            tp_price: cart_data[i]['price'],
                            size: cart_data[i]['size'],
                            color: cart_data[i]['color'],
                            seller_id: cart_data[i]['seller_id'],
                            tp_id: cart_data[i]['tp_id'],
                            tp_title: cart_data[i]['tp_title'],
                            tc_color: cart_data[i]['tc_color'],
                            s_title: cart_data[i]['s_title'],
                            type: 'Product',
                        })
                    }
                    for (var i = 0; i < service_data.length; i++) {
                        cart_array.push({
                            image: service_data[i]['sc_image'],
                            cart_id: service_data[i]['cart_id'],
                            user_id: service_data[i]['user_id'],
                            product_id: service_data[i]['subcategory_id'],
                            quantity: service_data[i]['quantity'],
                            tp_price: service_data[i]['price'],
                            size: service_data[i]['size'],
                            color: service_data[i]['color'],
                            seller_id: service_data[i]['professional_id'],
                            tp_id: service_data[i]['tp_id'],
                            tp_title: service_data[i]['sc_title'],
                            type: 'Service',
                        })
                    }
                    this.setState(this.state.cart_array = cart_array);
                    // this.setState(this.state.form_data = res.data.cart_list);
                    // this.setState(this.state.service_data = res.data.service_list);
                    this.setState({ gtotal: res.data.grand_total });
                    this.setState({ is_data: true });
                } else {
                    this.setState({ is_data: false });
                    // this.setState({ redirect: '/ProductList/' });
                }
            })
            .catch(error => {
                //  this.setState({ redirect: '/logout' });
            });


    }



    async get_comment_count(props) {

        var user_data = getUserDetail();
        const professional_id = this.props.match.params.professional_id;
        api_option.url = 'get_comment_professional_count';
        api_option.data = { professional_id: professional_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var comment_count = res.data.comment_count;
                    this.setState(this.state.comment_data.comment_count = comment_count);
                } else {
                    var comment_count = res.data.comment_count;
                    this.setState(this.state.comment_data.comment_count = comment_count);
                    // this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });

    }
    // Book Now
    handleBookNow(event) {
        event.preventDefault();
        if (!this.booking_validator.allValid()) {
            this.booking_validator.showMessages();
            this.forceUpdate();
        } else {
            this.setState({ loaded: false });
            api_option.url = 'save_booking';
            api_option.data = this.state.form_data;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;

                    if (res_data.status) {
                        this.get_cart_data();
                        this.get_service_is_exist_cart();
                        this.state.comment_data.comment = '';
                        this.setState({ showBookingModal: false });
                        toast.success(res.data.message);


                    } else {

                        toast.error(res.data.message);

                        // this.setState({error:res_data.message});
                    }
                })
                .catch(error => console.log(error));
        }

    }
    // form submit event
    handleSubmit(event) {

        event.preventDefault();
        if (!this.comment_validator.allValid()) {
            this.comment_validator.showMessages();
            this.forceUpdate();
        } else {
            this.setState({ loaded: false });
            api_option.url = 'save_comment_professional';
            api_option.data = this.state.comment_data;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        this.get_comment_count();
                        this.get_comment_professional();

                        this.state.comment_data.comment = '';
                        toast.success(res.data.message);

                    } else {

                        toast.error(res.data.message);

                        // this.setState({error:res_data.message});
                    }
                })
                .catch(error => console.log(error));
        }

    }
    async get_professional_detail() {
        this.setState({ loaded: false });
        api_option.url = 'get_professional_detail';
        api_option.data = { id: this.props.match.params.professional_id };
        api_option.headers.Authorization = localStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                const th = this;
                if (res.data.status) {
                    const th = this;

                    var res_data = res.data.data;
                    console.log("pd ", res.data.data);
                    this.setState(this.state.professional_detail_data = res.data.data);

                    this.setState(this.state.professional_social_media = res.data.data.user_social_media);

                } else {
                    //this.setState({ redirect: '/user/' });
                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
            });
    }
    async get_professional_project() {

        api_option.url = 'get_professional_personal_project';
        api_option.data = { id: this.props.match.params.professional_id };
        api_option.headers.Authorization = localStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                const th = this;
                if (res.data.status) {
                    const th = this;
                    var res_data = res.data.data;
                    this.setState(this.state.professional_project_data = res.data.data);
                    console.log(this.state.professional_project_data);
                } else {
                    //this.setState({ redirect: '/user/' });
                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
            });
    }

    async get_professional_knowhow() {

        api_option.url = 'get_professional_knowhow';
        api_option.data = { id: this.props.match.params.professional_id };
        api_option.headers.Authorization = localStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                const th = this;
                if (res.data.status) {
                    const th = this;
                    var res_data = res.data.data;
                    this.setState(this.state.professional_knowhow_data = res.data.data);
                    // console.log(this.state.professional_knowhow_data)

                } else {
                    //this.setState({ redirect: '/user/' });
                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
            });
    }



    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>
                <Helmet>
                    <link rel="icon" href="assets/assets/images/icon.png" type="image/gif" />

                    {/* <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" /> */}
                    <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
                    <link rel="stylesheet" href="assets/css/custom.css" />
                    <link rel="stylesheet" href="assets/css/mobile.css" />
                    <script src="assets/js/jquery-3.2.1.min.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
                    {/* <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script> */}
                    <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>

                    <script src="assets/js/professional_detai.js"></script>
                    <script src="assets/js/custom.js"></script>
                    <script type="text/javascript"></script>
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

                                            <Select
                                                value={this.state.register_form_data.governance_id}
                                                onChange={this.handleGovernance}
                                                options={this.state.governance_list_new}
                                                id="governance_id" name="governance_id"
                                                placeholder="Select Governance"

                                            />
                                        </div>

                                        <Select
                                            value={this.state.register_form_data.zone_id}
                                            onChange={this.handleZone}
                                            options={this.state.zone_list_new}
                                            id="zone_id" name="zone_id"
                                            placeholder="Select Zone"
                                        />




                                        {/* <input type="text" name="area" id="area" placeholder="Area" data-validation="required" value={this.state.register_form_data.area} onChange={this.handleChangeRegister} /> */}
                                        <input type="text" name="pincode" id="pincode" placeholder="Pincode" data-validation="required" value={this.state.register_form_data.pincode} onChange={this.handleChangeRegister} />

                                    </div>
                                    <button class="btn btn-primary">Sign Up</button>
                                </form>
                                <button onClick={this.showSignInPortion} class="btn btn-primary btn-sign-in " id="signIn">Sign In</button>
                            </div>
                            <div class="form-container sign-up-container" style={{ display: this.state.otp_verification }}>
                                <form className="form w-100" id="kt_login_signin_form" onSubmit={this.handleOTP}>

                                    <span>OTP Verification</span>
                                    <input type="hidden" name="email" value={this.state.otp_form_data.email} />
                                    <div class="access-input-group w-100">
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
                                <button onClick={this.showSignInPortion} class="btn btn-primary btn-sign-in " id="signIn">Sign In</button>
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
                            <li><a href=""><i class="bi-house"></i></a></li>
                            <li><Link to={`/Professional-category`} class="hs-p-name">Professionals</Link></li>
                            {/* <li>Professionals</li> */}
                            <li>{this.state.professional_detail_data.u_name}</li>
                        </ul>
                    </div>
                </div>


                <div class="professional-single">
                    <div class="container">
                        <div class="professional-profile">
                            <div class="profile-sidebar">
                                <div class="profile-sidebar-inner">
                                    <div class="profile-sidebar-avatar"><img src={this.state.professional_detail_data.u_image} /></div>
                                    <h1>{this.state.professional_detail_data.u_name}</h1>
                                    <div class="profile-userdetails">
                                        <span class="text-primary"><b>{this.state.professional_detail_data.u_business_name}</b></span>
                                        <span><i class="bi bi-geo-alt-fill"></i>{this.state.professional_detail_data.u_city}</span>
                                    </div>


                                    <div className='profile-contact w-100 mt-5'>
                                        {is_login() && this.state.form_data.is_follow == 1 && <NavLink exact to class="btn btn-white" onClick={this.handleFollow1.bind(this, this.state.professional_detail_data.u_id, this.state.professional_detail_data.u_id)}>Following</NavLink>}
                                        {is_login() && this.state.form_data.is_follow == 0 && <NavLink exact to class="btn btn-white 1" onClick={this.handleFollow1.bind(this, this.state.professional_detail_data.u_id, this.state.professional_detail_data.u_id)}>Follow</NavLink>}
                                        {!is_login() && <button class="btn btn-white" onClick={this.openLoginModal}>Follow</button>}

                                        {/* <div class="profile-userInteractions"></div> */}
                                        {this.state.is_exist_service == 1 && <>
                                            {localStorage.getItem('type') == 1 && is_login() && <a href="javascript:;" class="btn btn-primary  text-white ">Added to Basket</a>}
                                            {/* {localStorage.getItem('type') != 1 && <p className="text-center">Only users can book this service</p>} */}

                                        </> || <>
                                                {localStorage.getItem('type') == 1 && is_login() && <a href="javascript:;" class="btn btn-primary text-white booking-trigger" onClick={this.handleOpenBook.bind(this)}>Book Now</a>}
                                                {/* {localStorage.getItem('type') != 1 && <p className="text-center">Only users can book this service</p>} */}

                                            </>}
                                    </div>


                                    <div class="userInfo-column">
                                        <dl>
                                            <dt>Service Areas:</dt>
                                            {Object.entries(this.state.form_data.services_area).map(([o, val]) => (
                                                <dd>{val.a_title}</dd>
                                            ))}

                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div class="profile-profileContents">
                                <div class="line-tab">
                                    <ul class="nav nav-tabs left-align">
                                        <li class="nav-item">
                                            <a class="active show" data-toggle="tab" href="#About">About</a>
                                        </li>
                                        {this.state.professional_project_data.length > 0 && <li class="nav-item">
                                            <a class="" data-toggle="tab" href="#Projects">Projects</a>
                                        </li>}
                                        {this.state.professional_knowhow_data.length > 0 && <li class="nav-item">
                                            <a class="" data-toggle="tab" href="#knowhow">Know How</a>
                                        </li>}
                                    </ul>
                                </div>
                                <div class="tab-content">
                                    <div class="tab-pane active" id="About">
                                        <p>{this.state.professional_detail_data.u_about_us}</p>
                                        <div class="profile-contact">

                                            {this.state.professional_detail_data.u_mobile && <a href="tel:">
                                                <i class="bi bi-telephone-outbound"></i>
                                                <div>
                                                    <span>Call</span>
                                                    <strong>{this.state.professional_detail_data.u_mobile}</strong>
                                                </div>
                                            </a>}
                                            {this.state.professional_detail_data.u_email && <a href="mailto:" target="_blank">
                                                <i class="bi bi-envelope"></i>
                                                <div>
                                                    <span>Email</span>
                                                    <strong>{this.state.professional_detail_data.u_email}</strong>
                                                </div>
                                            </a>
                                            }
                                            {this.state.professional_detail_data.u_website && <a href={this.state.professional_detail_data.u_website} target="_blank">
                                                <i class="bi bi-globe2"></i>
                                                <div>
                                                    <span>Website</span>
                                                    <strong>{this.state.professional_detail_data.u_website}</strong>
                                                </div>
                                            </a>}

                                        </div>
                                        <div class="about-content">
                                            {/* <p>Ward Almuna Alkhonji Interior Design is a comprehensive, one-stop-shop where clients can tailor their own expectations and needs. Established in the summer of 2016, our Studio facilitates making your vision come to life; we provide guidance and support, we listen intently to your stories and put ourselves in your shoes. Engineer Ward Almuna is a pioneer in the field of interior design and pays particular attention to your requirements and needs regardless of the size of the project.</p> */}
                                            <div class="mt-3 mb-3"><h5><b>Services</b></h5></div>
                                            <div class="project-tags">

                                                {Object.entries(this.state.form_data.services).map(([o, serv]) => (

                                                    <a href="javascript:void(0)" className={(localStorage.getItem('subcategory_id') == serv.sc_id ? 'active' : '')} onClick={this.handleServData.bind(this, serv.sc_id)}>{serv.sc_title}</a>

                                                ))}
                                                {/* <a>Interior Design</a>
                                                <a>Furniture</a>
                                                <a>Renovation</a> */}
                                            </div>
                                        </div>

                                        <div class="about-content">

                                            <div class="mt-3 mb-3"><h5><b>Social Media</b></h5></div>
                                            <div class="project-tags">
                                                <ul class="social">
                                                    {Object.entries(this.state.professional_social_media).map(([o, sm]) => (

                                                        <li><a href={sm.us_link}>
                                                            {sm.us_platform == 'facebook' && <img src="/assets/images/facebook.svg" />}
                                                            {sm.us_platform == 'twitter' && <img src="/assets/images/twitter.svg" />}
                                                            {sm.us_platform == 'instagram' && <img src="/assets/images/instagram.svg" />}
                                                            {sm.us_platform == 'youtube' && <img src="/assets/images/youtube.svg" />}
                                                            {sm.us_platform == 'linkedin' && <img src="/assets/images/linkedin.svg" />}
                                                        </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        {/* <div className='profile-contact w-100 mt-5'>
                                            {is_login() && this.state.form_data.is_follow == 1 && <NavLink exact to class="btn btn-white" onClick={this.handleFollow1.bind(this, this.state.professional_detail_data.u_id, this.state.professional_detail_data.u_id)}>Following</NavLink>}
                                            {is_login() && this.state.form_data.is_follow == 0 && <NavLink exact to class="btn btn-white 1" onClick={this.handleFollow1.bind(this, this.state.professional_detail_data.u_id, this.state.professional_detail_data.u_id)}>Follow</NavLink>}
                                            {!is_login() && <button class="btn btn-white" onClick={this.openLoginModal}>Follow</button>}
                                        </div> */}

                                        {localStorage.getItem('type') == 1 && is_login() && <div class="about-content">

                                            <div class="mt-3 mb-3"><h5><b>Report Abuse</b></h5></div>
                                            <div class="project-tags">
                                                <ul class="social">

                                                    <li>
                                                        <button type="button" onClick={this.openReportModal.bind()} class="btn btn-primary">Report</button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>}
                                        <div class="profile-reviews-area">
                                            {/* <div class="commentbox">
                                                <h5 class="md-title"><span class="text-primary">54</span> Reviews</h5>
                                                <form class="post-comment">
                                                    <div class="comment-user-thumb"><img src="assets/images/avatar-1.jpg" /></div>
                                                    <div class="comment-input">
                                                        <input type="text" name="" placeholder="Write here..." />
                                                        <button class="plain text-primary">Post</button>
                                                        <div class="rating-form">
                                                            <b>Rate Professional: </b>
                                                            <div class="form-item">
                                                                <input id="rating-5" name="rating" type="radio" value="5" />
                                                                <label for="rating-5" data-value="5">
                                                                    <span class="rating-star">
                                                                        <i class="bi bi-star"></i>
                                                                        <i class="bi bi-star-fill"></i>
                                                                    </span>
                                                                    <span class="ir">5</span>
                                                                </label>
                                                                <input id="rating-4" name="rating" type="radio" value="4" />
                                                                <label for="rating-4" data-value="4">
                                                                    <span class="rating-star">
                                                                        <i class="bi bi-star"></i>
                                                                        <i class="bi bi-star-fill"></i>
                                                                    </span>
                                                                    <span class="ir">4</span>
                                                                </label>
                                                                <input id="rating-3" name="rating" type="radio" value="3" />
                                                                <label for="rating-3" data-value="3">
                                                                    <span class="rating-star">
                                                                        <i class="bi bi-star"></i>
                                                                        <i class="bi bi-star-fill"></i>
                                                                    </span>
                                                                    <span class="ir">3</span>
                                                                </label>
                                                                <input id="rating-2" name="rating" type="radio" value="2" />
                                                                <label for="rating-2" data-value="2">
                                                                    <span class="rating-star">
                                                                        <i class="bi bi-star"></i>
                                                                        <i class="bi bi-star-fill"></i>
                                                                    </span>
                                                                    <span class="ir">2</span>
                                                                </label>
                                                                <input id="rating-1" name="rating" type="radio" value="1" />
                                                                <label for="rating-1" data-value="1">
                                                                    <span class="rating-star">
                                                                        <i class="bi bi-star"></i>
                                                                        <i class="bi bi-star-fill"></i>
                                                                    </span>
                                                                    <span class="ir">1</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                                <ul class="comment-feed-list">
                                                    <li class="comment-feed-item">
                                                        <article>
                                                            <div class="rating-wapper">
                                                                <span class="star-rating"><span class="stars four"></span></span>
                                                            </div>
                                                            <p class="comment-feed-content">
                                                                <a href=""><img src="assets/images/avatar-2.jpg" />Lisa Snavely</a>
                                                                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
                                                            </p>
                                                            <div class="comment-feed-ft">
                                                                <time>12 hours ago</time>
                                                            </div>
                                                        </article>
                                                    </li>
                                                    <li class="comment-feed-item">
                                                        <article>
                                                            <div class="rating-wapper">
                                                                <span class="star-rating"><span class="stars five"></span></span>
                                                            </div>
                                                            <p class="comment-feed-content">
                                                                <a href=""><img src="assets/images/avatar-4.jpg" />Mark Burks</a>
                                                                <span>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span>
                                                            </p>
                                                            <div class="comment-feed-ft">
                                                                <time>12 hours ago</time>
                                                            </div>
                                                        </article>
                                                    </li>
                                                    <li class="comment-feed-item">
                                                        <article>
                                                            <div class="rating-wapper">
                                                                <span class="star-rating"><span class="stars two"></span></span>
                                                            </div>
                                                            <p class="comment-feed-content">
                                                                <a href=""><img src="assets/images/avatar-5.jpg" />Ramiro Lovett</a>
                                                                <span>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                                                            </p>
                                                            <div class="comment-feed-ft">
                                                                <time>12 hours ago</time>
                                                            </div>
                                                        </article>
                                                    </li>
                                                    <li class="comment-feed-item">
                                                        <article>
                                                            <div class="rating-wapper">
                                                                <span class="star-rating"><span class="stars one"></span></span>
                                                            </div>
                                                            <p class="comment-feed-content">
                                                                <a href=""><img src="assets/images/avatar-6.jpg" />Jill Carrington</a>
                                                                <span>Sed ut perspiciatis unde omnis iste natus error sit voluptatem</span>
                                                            </p>
                                                            <div class="comment-feed-ft">
                                                                <time>12 hours ago</time>
                                                            </div>
                                                        </article>
                                                    </li>
                                                    <li class="comment-feed-item">
                                                        <article>
                                                            <div class="rating-wapper">
                                                                <span class="star-rating"><span class="stars three"></span></span>
                                                            </div>
                                                            <p class="comment-feed-content">
                                                                <a href=""><img src="assets/images/avatar-7.jpg" />Marcella Woods</a>
                                                                <span>accusantium doloremque laudantium</span>
                                                            </p>
                                                            <div class="comment-feed-ft">
                                                                <time>12 hours ago</time>
                                                            </div>
                                                        </article>
                                                    </li>
                                                </ul>
                                            </div> */}

                                            <div class="commentbox">
                                                <h5 class="md-title"><span class="text-primary">{this.state.comment_data.comment_count}</span> Reviews</h5>
                                                <form class="post-comment" onSubmit={this.handleSubmit}>
                                                    <div class="comment-user-thumb"><img src="/assets/images/avatar-1.jpg" /></div>
                                                    <div class="comment-input">
                                                        <input type="text" name="comment" value={this.state.comment_data.comment} onChange={this.handleChange} placeholder="Write here..." />
                                                        <input type="hidden" name="professional_id" value={this.state.comment_data.professional_comment_id} />
                                                        <input type="hidden" name="user_id" value={this.state.comment_data.user_comment_id} />
                                                        {this.comment_validator.message('Comment', this.state.comment_data.comment, 'required')}
                                                        {localStorage.getItem('type') == 1 && is_login() && <button class="plain text-primary">Post</button> || <p style={{ color: 'red' }}>Please signup or login to enter the comments</p>}
                                                        {/* <div class="rating-form">
                                                            <b>Rate Professional: </b>
                                                            <div class="form-item">
                                                                <input id="rating-5" name="rating" type="radio" value="5" />
                                                                <label for="rating-5" data-value="5">
                                                                    <span class="rating-star">
                                                                        <i class="bi bi-star"></i>
                                                                        <i class="bi bi-star-fill"></i>
                                                                    </span>
                                                                    <span class="ir">5</span>
                                                                </label>
                                                                <input id="rating-4" name="rating" type="radio" value="4" />
                                                                <label for="rating-4" data-value="4">
                                                                    <span class="rating-star">
                                                                        <i class="bi bi-star"></i>
                                                                        <i class="bi bi-star-fill"></i>
                                                                    </span>
                                                                    <span class="ir">4</span>
                                                                </label>
                                                                <input id="rating-3" name="rating" type="radio" value="3" />
                                                                <label for="rating-3" data-value="3">
                                                                    <span class="rating-star">
                                                                        <i class="bi bi-star"></i>
                                                                        <i class="bi bi-star-fill"></i>
                                                                    </span>
                                                                    <span class="ir">3</span>
                                                                </label>
                                                                <input id="rating-2" name="rating" type="radio" value="2" />
                                                                <label for="rating-2" data-value="2">
                                                                    <span class="rating-star">
                                                                        <i class="bi bi-star"></i>
                                                                        <i class="bi bi-star-fill"></i>
                                                                    </span>
                                                                    <span class="ir">2</span>
                                                                </label>
                                                                <input id="rating-1" name="rating" type="radio" value="1" />
                                                                <label for="rating-1" data-value="1">
                                                                    <span class="rating-star">
                                                                        <i class="bi bi-star"></i>
                                                                        <i class="bi bi-star-fill"></i>
                                                                    </span>
                                                                    <span class="ir">1</span>
                                                                </label>
                                                            </div>
                                                        </div> */}
                                                    </div>

                                                </form>
                                                <ul class="comment-feed-list">

                                                    {Object.entries(this.state.comment_data.comment_data).map(([o, comment]) => (

                                                        <li class="comment-feed-item">
                                                            <article>
                                                                <p class="comment-feed-content">
                                                                    <a href=""><img src={comment.u_image} /> {comment.u_name}</a>
                                                                    <span> {comment.tcp_comment}</span>
                                                                </p>
                                                                <time>{comment.tcp_created_at}</time>
                                                                {is_login() && comment.tcp_user_id == this.state.form_data.u_id && <button type="button" class="plain text-danger" onClick={this.delete_comment.bind(this, o, comment.tcp_id)}>Delete</button>}
                                                            </article>
                                                        </li>
                                                    ))}

                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="Projects">
                                        <div class="profile-project-grid">



                                            {Object.entries(this.state.professional_project_data).map(([o, p]) => (
                                                <div class="projectList-items">
                                                    <Link to={`/projectdetail/${p.tpro_id}`}>
                                                        {/* <div class="thumbtag"><span class="new">New</span></div> */}

                                                        <div class="projectList-cover"><img src={p.tpro_image} /></div>
                                                        <div class="projectList-title"><h2>{p.tpro_name}</h2></div>
                                                        {/* <div class="projectList-ft">
                                                        <div class="projectList-author">{this.state.professional_detail_data.u_name}</div>

                                                    </div> */}
                                                        <div class="projectList-ft">
                                                            <div class="projectList-author"><img src={this.state.professional_detail_data.u_image} />{this.state.professional_detail_data.u_name}</div>

                                                        </div>
                                                    </Link>
                                                </div>
                                            ))}


                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="knowhow">
                                        <div class="knowhow-grid">
                                            {Object.entries(this.state.professional_knowhow_data).map(([o, p]) => (
                                                <div class="projectList-items">
                                                    {/* <a href="javascript:void(0)"></a> */}
                                                    <Link to={`/know-how-detail/${p.know_how_id}`}>
                                                        {/* <div class="thumbtag"><span class="new">New</span></div> */}

                                                        <div class="projectList-cover"><img src={p.know_how_image} /></div>
                                                        <div class="projectList-title"><h2>{p.know_how_name}</h2></div>
                                                        {/* <div class="projectList-ft">
                                                        <div class="projectList-author">{this.state.professional_detail_data.u_name}</div>

                                                    </div> */}
                                                        <div class="projectList-ft">
                                                            <div class="projectList-author"><img src={this.state.professional_detail_data.u_image} />{this.state.professional_detail_data.u_name}</div>

                                                        </div>
                                                    </Link>

                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal show={this.state.showBookingModal} id="booking-modal" size="md" onHide={this.hideBookingModal}>
                    <div class="container" id="container">
                        {/* <div className='row'>

                        </div> */}
                        <h5 class="title text-center">Booking</h5>
                        <form class="py-3" onSubmit={this.handleBookNow}>

                            <div class="" role="document">
                                <div class="form-group d-inline">
                                    <label class="d-inline mr-3 font-weight-bold">Service Price</label>
                                    RO {this.state.form_data.services_price.sp_price}
                                </div>
                                <div class="form-group">
                                    <label>Title</label>
                                    <input type="text" name="title" id="title" value={this.state.form_data.title} onChange={this.handleBookChange} class="text-control" />
                                    {this.booking_validator.message('Title', this.state.form_data.title, 'required')}
                                </div>
                                <div class="form-group">
                                    <label>Location</label>
                                    <input type="text" name="location" id="location" value={this.state.form_data.location} onChange={this.handleBookChange} class="text-control" />
                                    {this.booking_validator.message('Location', this.state.form_data.location, 'required')}
                                </div>
                                <div class="form-group">
                                    <label>Description</label>
                                    <textarea class="text-control" name="descr" id="descr" value={this.state.form_data.descr} onChange={this.handleBookChange}></textarea>
                                    {this.booking_validator.message('Description', this.state.form_data.descr, 'required')}
                                </div>
                                <input type="hidden" name="price" value={this.state.form_data.services_price.sp_price} />
                                <input type="hidden" name="category" value={localStorage.getItem('category_id')} />
                                <input type="hidden" name="subcategory" value={localStorage.getItem('subcategory_id')} />
                                <button type="button" class="btn btn-secondary mr-3" onClick={this.hideBookingModal}>Cancel</button>
                                <button type="submit" class="btn btn-primary">Book Now</button>

                            </div>
                        </form>
                    </div>
                </Modal>

                <Modal show={this.state.showReportModal} id="report-modal" size="md" onHide={this.hideReportModal}>
                    <div class="container" id="container">
                        {/* <div className='row'>

                        </div> */}
                        <h5 class="title text-center">Report</h5>
                        <form class="py-3" >

                            <div class="" role="document">
                                <div class="form-group">
                                    <label>Message</label>
                                    <textarea class="text-control" name="message" id="message" value={this.state.form_data.message} onChange={this.handleReportChange}></textarea>
                                    {this.validator.message('Message', this.state.form_data.message, 'required')}
                                </div>


                                <button type="button" class="btn btn-secondary mr-3" onClick={this.hideReportModal}>Cancel</button>

                                <button type="button" onClick={this.handleReportAbuse.bind(this, this.state.form_data.u_id, this.props.match.params.professional_id)} class="btn btn-primary">Submit</button>

                            </div>
                        </form>
                    </div>
                </Modal>




            </>
        );
    }
}
export default ProfessionalDetail;