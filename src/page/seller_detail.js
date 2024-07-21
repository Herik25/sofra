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
import { Helmet } from "react-helmet";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Modal from 'react-bootstrap/Modal';

class SellerDetail extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        this.validator = new SimpleReactValidator();
        this.comment_validator = new SimpleReactValidator();
        var user_id = user_data ? user_data.u_id : '';
        var professional_id = this.props.match.params.seller_id;
        this.get_seller_product();
        this.get_seller_project();
        this.get_seller_knowhow();
        this.get_seller_detail();
        this.get_comment_professional();
        this.get_professional_cat_service();
        this.get_comment_count();
        this.get_service_area();
        this.get_seller_follow();

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
            show: false,
            report_show: false,
            loaded: false,
            form_data: {
                seller_product: '',
                services: '',
                services_price: '',
                seller_project: '',
                seller_knowhow: '',
                seller_detail: '',
                service_area: '',
                u_id: user_id,
                is_follow: 0,
            },

            comment_data: {
                comment: '',
                comment_count: '',
                user_comment_id: user_id,
                professional_comment_id: professional_id,
                comment_data: [],
            },
            category_list: [],
            subcategory_list: [],
            subcategory_list_new: [],

            error: ''
        }

        this.category_list_dropdown();
        this.state = this.initialState;
        this.handleSaveData = this.handleSaveData.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeSubcategory = this.handleChangeSubcategory.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.delete_comment = this.delete_comment.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        //this.handleFavourite = this.handleFavourite.bind(this);
        this.get_form_data();
        this.openLoginModal = this.openLoginModal.bind(this);
        this.handleReportChange = this.handleReportChange.bind(this);
        this.handleOpenReport = this.handleOpenReport.bind(this);
        this.handleHideReport = this.handleHideReport.bind(this);

        this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
        this.openLoginModal = this.openLoginModal.bind(this);
        this.hideLoginModal = this.hideLoginModal.bind(this);
        this.showSignInPortion = this.showSignInPortion.bind(this);
        this.showSignUpPortion = this.showSignUpPortion.bind(this);
        this.handleLoginWeb = this.handleLoginWeb.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.handleSaveData_register = this.handleSaveData_register.bind(this);
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

        this.login_validator = new SimpleReactValidator();

        facebook_data();
        google_data();

    }

    /*  */
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
                        th.hideLoginModal();
                        window.location.href = web_url + 'Seller-detail/' + this.props.match.params.seller_id;

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
                        th.hideLoginModal();
                        window.location.href = web_url + 'Seller-detail/' + this.props.match.params.seller_id;
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
        this.setState({ show: true });
        // e.preventDefault();
        this.get_country();
        // $("#access-modal").modal("show")
    }
    hideLoginModal(e) {
        this.setState({ show: false });
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

    handleSaveData_register(event) {
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
        // if(!this.login_validator.allValid()){
        //     this.login_validator.showMessage();
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
        /*  if (!this.login_validator.allValid()) {
             this.login_validator.showMessage();
             this.forceUpdate();
         } else { */
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
    /*  */

    componentDidMount() {
        $('#OpenImgUpload').click(function () { $('#imgupload').trigger('click'); });
    }
    handleServData(subcat_id, event) {
        localStorage.setItem('subcategory_id', subcat_id);
        this.get_service_is_exist_cart(localStorage.getItem('subcategory_id'));
        this.get_professional_cat_service();
    }
    /* openLoginModal(e) {
        e.preventDefault();
        window.$("#access-modal").modal("show")
    } */
    handleRemoveClick(i) {
        var data = this.state.form_data['previewImages'].splice(i, 1);
        this.setState({ data });

        var data1 = this.state.form_data['Images'].splice(i, 1);
        this.setState({ data1 });
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

    handleFollow1(event, sellerid) {

        var user_data = getUserDetail();
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

    async get_seller_follow(props) {
        var user_data = getUserDetail();
        // console.log("new ", user_data); return false;

        var seller_id = this.props.match.params.seller_id;
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

    handleFavourite(event, pid, sellerid) {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'add_to_favourite_project';
        api_option.data = { project_id: pid, user_id: user_id, sellerid: sellerid };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        axios(api_option)
            .then(res => {
                if (res.data.status) {

                    toast.success(res.data.message);
                    th.get_seller_project();
                    // th.setState({ redirect: '/productdetail/' + product_id });


                } else {
                    toast.error(res.data.message);
                    th.get_seller_project();

                    // this.setState({ redirect: '/logout' });

                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_comment_professional(props) {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const professional_id = this.props.match.params.seller_id;
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
    async get_service_area() {

        const user_id = this.props.match.params.seller_id;
        // alert(user_id)
        api_option.url = 'get_seller_service_area';
        api_option.data = { user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {

                    var services_data = res.data.comment_list;
                    this.setState(this.state.form_data.service_area = services_data);



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

        var professional_id = this.props.match.params.seller_id;

        api_option.url = 'get_professional_cat_service';
        // api_option.data = { category_id: category_id, subcategory_id: subcategory_id };
        api_option.data = { professional_id: professional_id };
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

    async get_comment_count(props) {

        var user_data = getUserDetail();
        const professional_id = this.props.match.params.seller_id;
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
    async get_seller_product() {
        const seller_id = this.props.match.params.seller_id;
        api_option.url = 'get_seller_product';
        api_option.data = { user_id: seller_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var seller_product = res.data.data;
                    this.setState(this.initialState.form_data.seller_product = seller_product);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_seller_detail() {
        const seller_id = this.props.match.params.seller_id;

        api_option.url = 'get_seller_detail';
        api_option.data = { user_id: seller_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    var seller_detail = res.data.data;

                    this.setState(this.initialState.form_data.seller_detail = seller_detail);


                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_seller_project() {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var login_id = user_data ? user_data.u_id : '';
        const seller_id = this.props.match.params.seller_id;
        api_option.url = 'get_seller_project';
        api_option.data = { user_id: seller_id, login_id: login_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var seller_project = res.data.data;

                    this.setState(this.initialState.form_data.seller_project = seller_project);


                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_seller_knowhow() {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var login_id = user_data ? user_data.u_id : '';
        const seller_id = this.props.match.params.seller_id;
        api_option.url = 'get_professional_knowhow';
        api_option.data = { id: seller_id, login_id: login_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var seller_knowhow = res.data.data;
                    this.setState(this.initialState.form_data.seller_knowhow = seller_knowhow);


                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    //get edit form data
    async get_form_data(props) {
        const edit_id = this.props.match.params.id;
        if (edit_id) {
            api_option.url = 'get_seller_product_detail';
            api_option.data = { id: edit_id };
            api_option.headers.Authorization = sessionStorage.getItem('token');
            await axios(api_option)
                .then(res => {
                    if (res.data.status) {
                        this.setState(this.state.form_data = res.data.data);
                    } else {
                        this.setState({ redirect: '/ProductList/' });
                    }
                })
                .catch(error => {
                    this.setState({ redirect: '/logout' });
                });

        }
    }
    //handle Change File
    handleChangeFile(event) {

        if (event.target.files) {

            //     var data = this.state.form_data['package_detail'].push({ no_of_pkgs: "", type_of_packaging: "",amount:'' });
            // this.setState({ data });
            // let assets/images = [];
            // var reader = new FileReader();
            // reader.onload = function (e) {
            //     //$('#user_image').attr('src', e.target.result);
            //     assets/images.push(e.target.result)
            // }
            // reader.readAsDataURL(event.target.files[0]);
            // this.setState({
            //     previewImages: assets/images
            // });
            // let assets/images = [];
            var th = this;
            for (let i = 0; i < event.target.files.length; i++) {
                var reader = new FileReader();
                reader.onload = function (e) {

                    var data = th.state.form_data['previewImages'].push(e.target.result);
                    th.setState({ data });
                }
                reader.readAsDataURL(event.target.files[i]);

                var data1 = th.state.form_data['Images'].push(event.target.files[i]);
                th.setState({ data1 });
            }

            // var data = this.state.form_data['previewImages'].push(URL.createObjectURL(event.target.files[0]));
            // this.setState({ data });
        }


        // const file_name = event.target.name;
        // const file_value = event.target.files[0];
        // const data = this.state.form_data[file_name] = file_value;
        // this.setState({ data });
    }


    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.comment_data[name] = value;
        this.setState({ data });
    }




    category_list_dropdown() {

        api_option.url = 'category_list_dropdown';
        api_option.data = {};
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var fnldata = [];
                    $.each(res.data.category_list, function (i, item) {

                        var temparr = new Object;
                        temparr['value'] = res.data.category_list[i].id;
                        temparr['label'] = res.data.category_list[i].text;
                        fnldata.push(temparr);

                    });

                    this.setState({ category_list: fnldata });
                } else {
                    this.setState({ redirect: '/product/' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }

    async handleChangeSubcategory(event) {
        const name = event.lable;
        const value = event.value;
        var data = this.state.form_data['subcat_id'] = { label: event.label, value: value };
        this.setState({ data });
    }

    handleReportChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
    }

    handleOpenReport(e) {
        this.setState({ report_show: true });
    }
    handleHideReport(e) {
        this.setState({ report_show: false });
    }



    handleReportAbuse(user_id, seller_id, event) {

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
        api_option.data = { user_id: user_id, seller_id: seller_id, message: message };

        axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                const res_data = res.data;

                if (res_data.status) {
                    $('#message').val('');
                    this.setState({ report_show: false });
                    toast.success(res.data.message);


                } else {
                    $('#message').val('');
                    this.setState({ report_show: false });
                    toast.error(res.data.message);

                    // this.setState({error:res_data.message});
                }
                var data = this.state.form_data['message'] = "";
                this.setState({ data });
            })
            .catch(error => console.log(error));
        // }
    }


    async handleChangeCategory(event) {


        const name = event.lable;
        const value = event.value;
        var data = this.state.form_data['category_id'] = { label: event.label, value: value };
        this.setState({ data });
        var data = this.state.form_data['subcat_id'] = null;
        this.setState({ data });
        this.setState({ subcategory_list: {} });
        if (value != "") {
            api_option.url = 'subcategory_list_dropdown';
            ;
            api_option.data = { category_id: value };
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        var fnldata = [];
                        $.each(res.data.subcategory_list, function (i, item) {
                            fnldata.push({ 'value': res.data.subcategory_list[i].id, "label": res.data.subcategory_list[i].text });
                        });
                        this.setState({ subcategory_list_new: fnldata });
                        this.setState({ subcat_list: fnldata });
                    } else {
                        this.setState({ redirect: '/home/' });
                    }
                })
                .catch(error => {
                    //this.setState({ redirect: '/logout' });
                });
        } else {
            this.setState({ subcat_list: {} });
        }
    }


    // form submit event
    handleSaveData(event) {
        event.preventDefault();
        if (!this.validator.allValid()) {
            this.validator.showMessages();
            this.forceUpdate();
        } else {
            api_option.url = 'add_seller_product';
            api_option.data = this.state.form_data;

            // api_option.url = 'add_seller_product';
            // const formData = new FormData();
            // formData.append('category_id', this.state.form_data.category_id);
            // formData.append('u_id', this.state.form_data.u_id);
            // formData.append('subcat_id', this.state.form_data.subcat_id);
            // formData.append('productTitle', this.state.form_data.productTitle);
            // formData.append('regularPrice', this.state.form_data.regularPrice);
            // formData.append('salePrice', this.state.form_data.salePrice);
            // formData.append('sku', this.state.form_data.sku);
            // formData.append('stockStatus', this.state.form_data.stockStatus);
            // formData.append('stockQuantity', this.state.form_data.stockQuantity);
            // formData.append('weight', this.state.form_data.weight);
            // formData.append('shippingClass', this.state.form_data.shippingClass);
            // formData.append('purchaseNote', this.state.form_data.purchaseNote);
            // formData.append('Images', this.state.form_data.Images);
            axios(api_option)
                .then(res => {
                    const res_data = res.data;
                    if (res_data.status) {
                        this.setState({ redirect: '/ProductList' });
                        toast.success(res.data.message);

                    } else {
                        toast.error(res.data.message);
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
                <div class="page-breadcrumb">
                    <div class="container">
                        <ul>
                            <li><a href=""><i class="bi-house"></i></a></li>
                            <li><Link to={`/best-seller`} class="hs-p-name">Seller</Link></li>
                            {/* <li>Seller</li> */}
                            <li>{this.initialState.form_data.seller_detail.u_name}</li>
                        </ul>
                    </div>
                </div>


                <div class="professional-single">
                    <div class="container">
                        <div class="professional-profile">
                            <div class="profile-sidebar">
                                <div class="profile-sidebar-inner">
                                    <div class="profile-sidebar-avatar"><img src={this.initialState.form_data.seller_detail.u_image} /></div>
                                    <h1>{this.initialState.form_data.seller_detail.u_name}</h1>
                                    <div class="profile-userdetails">


                                        <span><i class="bi bi-geo-alt-fill"></i>{this.initialState.form_data.seller_detail.u_city && this.initialState.form_data.seller_detail.u_city != "" && this.initialState.form_data.seller_detail.u_city != "null" && <span>{this.initialState.form_data.seller_detail.u_city},</span>}
                                            {this.initialState.form_data.seller_detail.u_state && this.initialState.form_data.seller_detail.u_state != "" && this.initialState.form_data.seller_detail.u_state != "null" && <span> {this.initialState.form_data.seller_detail.u_state},</span>}
                                            {this.initialState.form_data.seller_detail.u_country && this.initialState.form_data.seller_detail.u_country != "" && this.initialState.form_data.seller_detail.u_country != "null" && <span> {this.initialState.form_data.seller_detail.u_country}</span>}</span>
                                        {/* <span><i class="bi bi-geo-alt-fill"></i>{this.initialState.form_data.seller_detail.u_city},{this.initialState.form_data.seller_detail.u_country}</span> */}
                                    </div>
                                    <div class="userInfo-column">
                                        <dl>
                                            <dt>Service Areas:</dt>
                                            <dd>{this.initialState.form_data.seller_detail.u_country}</dd>
                                        </dl>
                                    </div>
                                    <div className='profile-contact w-100'>
                                        {is_login() && this.state.form_data.is_follow == 1 && <NavLink exact to class="btn btn-white" onClick={this.handleFollow1.bind(this, this.state.form_data.seller_detail.u_id, this.state.form_data.seller_detail.u_id)}>Following</NavLink>}
                                        {is_login() && this.state.form_data.is_follow == 0 && <NavLink exact to class="btn btn-white" onClick={this.handleFollow1.bind(this, this.state.form_data.seller_detail.u_id, this.state.form_data.seller_detail.u_id)}>Follow</NavLink>}
                                        {!is_login() && <button class="btn btn-white" onClick={this.openLoginModal}>Follow</button>}
                                    </div>
                                    <div class="userInfo-column">

                                        {/* <dl>
                                            <dt>Service Areas:</dt>
                                            <span className='d-flex'>
                                                {Object.entries(this.state.form_data.service_area).map(([o, serv]) => (

                                                    <dd className='pr-1'>{serv.a_title}</dd>

                                                ))}
                                            </span>
                                        </dl> */}
                                        {/* <dl>
                                            <dt>Specialties:</dt>
                                            <dd>Interior Design</dd>
                                        </dl> */}
                                    </div>
                                </div>
                            </div>
                            <div class="profile-profileContents">
                                <div class="line-tab">
                                    <ul class="nav nav-tabs left-align">
                                        <li class="nav-item">
                                            <a class="active show" data-toggle="tab" href="#About">About</a>
                                        </li>
                                        {this.initialState.form_data.seller_product.length > 0 && <li class="nav-item">
                                            <a class="show" data-toggle="tab" href="#products">Products</a>
                                        </li>}
                                        {this.initialState.form_data.seller_project.length > 0 && <li class="nav-item">
                                            <a class="" data-toggle="tab" href="#Projects">Projects</a>
                                        </li>}
                                        {/* <li class="nav-item">
                                            <a class="" data-toggle="tab" href="#knowhow">Know How</a>
                                        </li> */}

                                    </ul>
                                </div>
                                <div class="tab-content">
                                    <div class="tab-pane fade" id="products">
                                        <div class="products-grid">
                                            {Object.entries(this.initialState.form_data.seller_product).map(([o, p]) => (

                                                <div class="product-item">
                                                    <div class="product-thumb">
                                                        <Link to={`/productdetail/${p.tp_id}`}>
                                                            <img src={p.image} />
                                                        </Link>
                                                    </div>
                                                    <div class="product-info">
                                                        <h4 class="product-name"> <Link to={`/productdetail/${p.tp_id}`}>{p.tp_title}</Link></h4>
                                                        <div class="just-in">

                                                            <div class="product-price">{p.tp_price > 0 && <del>RO {p.tp_price}</del>}<span>RO {p.tp_sale_price}</span></div>

                                                            {/* <div class="product-price">RO {p.tp_price}</div> */}
                                                            <div class="rating-wapper">
                                                                {/* <span class="star-rating"><span class="stars four"></span></span> */}

                                                                {p.tp_star == 0 && <span className="star-rating"><span className="stars"></span></span>}
                                                                {p.tp_star == 1 && <span className="star-rating"><span className="stars one"></span></span>}
                                                                {p.tp_star == 2 && <span className="star-rating"><span className="stars two" ></span></span>}
                                                                {p.tp_star == 3 && <span className="star-rating"><span className="stars three" ></span></span>}
                                                                {p.tp_star == 4 && <span className="star-rating"><span className="stars four" ></span></span>}
                                                                {p.tp_star == 5 && <span className="star-rating"><span className="stars five" ></span></span>}

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            ))}
                                        </div>

                                    </div>
                                    {/* edited pritesh start */}
                                    <div class="tab-pane fade" id="Projects">
                                        <div class="profile-project-grid">
                                            {Object.entries(this.initialState.form_data.seller_project).map(([o, p]) => (
                                                <div class="projectList-items projectList-items-tital ">
                                                    <a href=""></a>

                                                    <div class="thumbtag"><span class="new">New</span></div>
                                                    <div class="thumbsave">
                                                        {/* {localStorage.getItem('type') == 1 && is_login() && <button class="save-trigger" onClick={this.handleFavourite}><i class="bi-heart-fill"></i> </button>} */}
                                                        {(localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && is_login() && p.favourites == 0 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.tpro_id, p.tpro_seller_id)}><i class="bi-heart"></i></button>}
                                                        {(localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && is_login() && p.favourites == 1 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.tpro_id, p.tpro_seller_id)}><i class="bi-heart-fill"></i></button>}

                                                        {!is_login() && <button class="save-trigger" onClick={this.openLoginModal}><i class="bi-heart"></i></button>
                                                        }

                                                    </div>
                                                    <div class="projectList-cover"><img src={p.tpro_image} /></div>
                                                    <div class="projectList-title"><h2><Link to={`/projectdetail/${p.tpro_id}`}>{p.tpro_name}</Link></h2></div>
                                                    <div class="projectList-ft">
                                                        <div class="projectList-author"><img src={this.initialState.form_data.seller_detail.u_image} />{this.initialState.form_data.seller_detail.u_name}</div>

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {/* edited pritesh end */}
                                    <div class="tab-pane fade" id="knowhow">
                                        <div class="knowhow-grid">
                                            {Object.entries(this.initialState.form_data.seller_knowhow).map(([o, k]) => (
                                                <div class="projectList-items">
                                                    <a href=""></a>

                                                    <div class="thumbtag"><span class="new">New</span></div>
                                                    <div class="thumbsave">
                                                        {/* {localStorage.getItem('type') == 1 && is_login() && <button class="save-trigger" onClick={this.handleFavourite}><i class="bi-heart-fill"></i> </button>} */}
                                                        {(localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && is_login() && k.favourites == 0 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, k.tpro_id, k.tpro_seller_id)}><i class="bi-heart"></i></button>}
                                                        {(localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && is_login() && k.favourites == 1 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, k.tpro_id, k.tpro_seller_id)}><i class="bi-heart-fill"></i></button>}

                                                        {!is_login() && <button class="save-trigger" onClick={this.openLoginModal}><i class="bi-heart"></i></button>
                                                        }

                                                    </div>
                                                    <div class="projectList-cover"><img src={k.know_how_image} /></div>
                                                    <div class="projectList-title"><h2>{k.know_how_title}</h2></div>
                                                    <div class="projectList-ft">
                                                        <div class="projectList-author"><img src={this.initialState.form_data.seller_detail.u_image} />{this.initialState.form_data.seller_detail.u_name}</div>

                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    </div>
                                    <div class="tab-pane active" id="About">

                                        <div class="project-tags">
                                            <p>{this.state.form_data.seller_detail.u_about_us}</p>
                                            

                                            {/* <div className='profile-contact w-100'>
                                                {is_login() && this.state.form_data.is_follow == 1 && <NavLink exact to class="btn btn-white" onClick={this.handleFollow1.bind(this, this.state.form_data.seller_detail.u_id, this.state.form_data.seller_detail.u_id)}>Following</NavLink>}
                                                {is_login() && this.state.form_data.is_follow == 0 && <NavLink exact to class="btn btn-white" onClick={this.handleFollow1.bind(this, this.state.form_data.seller_detail.u_id, this.state.form_data.seller_detail.u_id)}>Follow</NavLink>}
                                                {!is_login() && <button class="btn btn-white" onClick={this.openLoginModal}>Follow</button>}
                                            </div> */}

                                            {/* <div class="about-content">
                                                <div class="mt-3 mb-3"><h5><b>Services</b></h5></div>
                                                {Object.entries(this.state.form_data.services).map(([o, serv]) => (

                                                    <a href="javascript:void(0)" className={(localStorage.getItem('subcategory_id') == serv.sc_id ? 'active' : '')} >{serv.sc_title}</a>

                                                ))}
                                            </div> */}

                                            <div class="about-content">
                                                <div class="mt-3 mb-3"><h5><b>Services</b></h5></div>
                                                {Object.entries(this.state.form_data.service_area).map(([o, serv]) => (

                                                    <a href="javascript:void(0)">{serv.a_title}</a>

                                                ))}
                                            </div>

                                        </div>
                                        {localStorage.getItem('type') == 1 && is_login() && <div class="about-content">

                                            <div class="mt-3 mb-3"><h5><b>Report Abuse</b></h5></div>
                                            <div class="project-tags">
                                                <ul class="social">

                                                    <li>
                                                        <button type="button" onClick={this.handleOpenReport} class="btn btn-primary">Report</button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>}
                                        <div class="profile-reviews-area">
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

                                                    </div>

                                                </form>
                                                <ul class="comment-feed-list">

                                                    {Object.entries(this.state.comment_data.comment_data).map(([o, comment]) => (

                                                        <li class="comment-feed-item">
                                                            <article>
                                                                <p class="comment-feed-content">
                                                                    <a href=""><img src={comment.u_image} />{comment.u_name}</a>
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
                                        {/* <div class="profile-reviews-area">
                                            <div class="commentbox">
                                                <h5 class="md-title"><span class="text-primary">54</span> Reviews</h5>
                                                <form class="post-comment">
                                                    <div class="comment-user-thumb"><img src="/assets/images/avatar-1.jpg" /></div>
                                                    <div class="comment-input">
                                                        <input type="text" name="" placeholder="Write here..." />
                                                        <button class="plain text-primary">Post</button>
                                                        <div class="rating-form">
                                                            <b>Rate Seller:</b>
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
                                                                <a href=""><img src="/assets/images/avatar-2.jpg" />Lisa Snavely</a>
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
                                                                <a href=""><img src="/assets/images/avatar-4.jpg" />Mark Burks</a>
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
                                                                <a href=""><img src="/assets/images/avatar-5.jpg" />Ramiro Lovett</a>
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
                                                                <a href=""><img src="/assets/images/avatar-6.jpg" />Jill Carrington</a>
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
                                                                <a href=""><img src="/assets/images/avatar-7.jpg" />Marcella Woods</a>
                                                                <span>accusantium doloremque laudantium</span>
                                                            </p>
                                                            <div class="comment-feed-ft">
                                                                <time>12 hours ago</time>
                                                            </div>
                                                        </article>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
                <Modal show={this.state.report_show} id="new-forum" onHide={this.handleHideReport}>
                    <div class="container" id="container">
                        <h5 class="title text-center">Report</h5>
                        <form class="py-3" >

                            <div class="form-group">
                                <label>Message</label>
                                <textarea class="text-control" name="message" id="message" value={this.state.form_data.message} onChange={this.handleReportChange}></textarea>
                                {this.validator.message('Message', this.state.form_data.message, 'required')}
                            </div>

                            <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={this.handleHideReport}>Cancel</button>

                            <button type="button" onClick={this.handleReportAbuse.bind(this, this.state.form_data.u_id, this.props.match.params.seller_id)} class="btn btn-primary">Submit</button>

                        </form>
                    </div>

                </Modal>

                <Modal show={this.state.show} id="access-modal" size="lg" onHide={this.hideLoginModal}>

                    <div class="access-container login-popup">
                        <div class="container" id="container2">
                            <div class="form-container sign-up-container" style={{ display: this.state.sign_up_form }}>
                                <form className="form" id="kt_login_signin_form" onSubmit={this.handleSaveData_register}>
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
                                        {this.login_validator.message('email', this.state.login_form_data.email, 'required')}
                                        <input type="password" placeholder="Password" name="password" id="password" value={this.state.login_form_data.password} onChange={this.handleFormChange} data-validation="required" />
                                        {this.login_validator.message('password', this.state.login_form_data.password, 'required')}
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
                                        {this.login_validator.message('email', this.state.forgot_form_data.email, 'required')}
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
        );
    }
}
export default SellerDetail;