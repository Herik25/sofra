import React, { Component } from 'react';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail, web_url, google_data, google_login, facebook_data, facebook_login } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import renderHTML from 'react-render-html';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import { Helmet } from "react-helmet";
import Loader from "react-loader";
import { appendScript } from '../utils/appendScript';
import Select from 'react-select';
import Modal from 'react-bootstrap/Modal';
class ProductDetail extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        this.validator = new SimpleReactValidator();
        this.review_validator = new SimpleReactValidator();

        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        var user_email = (user_data) ? user_data.u_email : '';
        var user_name = (user_data) ? user_data.u_name : '';
        var user_mobile = (user_data) ? user_data.u_mobile : '';
        const product_comment_id = this.props.match.params.product_id;
        this.state = {
            forgot_form_data: { email: '' },
            login_form_data: { email: '', password: '' },
            register_form_data: { name: '', email: '', mobile: '', password: '', country_id: '', governance_id: '', zone_id: '' },
            otp_form_data: { otp: '', email: '' },
            form_data: {
                email: '',
                password: '',
                product_detail_data: '',
                similar_product_detail: '',
                seller_product_detail: '',
                product_image: '',
                u_id: user_id,
                is_favourite: 0,
                is_exist_cart: '',
                detail_list: [],
                size_data: '',
                color_data: '',
                psize: '',
            },
            forgot_password: 'none',
            sign_in_form: 'flex',
            sign_up_form: 'flex',
            otp_verification: 'none',
            one_star_percentage: 0,
            two_star_percentage: 0,
            three_star_percentage: 0,
            four_star_percentage: 0,
            five_star_percentage: 0,
            comment_data: {
                comment: '',
                comment_count: 0,
                user_comment_id: user_id,
                product_comment_id: product_comment_id,
                comment_data: [],
            },
            size: 0,
            color: 0,
            descrp: '',
            descrptt_long: '',
            product_image_top: '',


            error: '',
            loaded: false
        }
        this.get_product_detail();
        this.get_product_image();
        this.get_seller_product_category();
        // this.get_cart_count();
        this.get_product_is_exist_cart();
        this.get_similar_product();
        this.get_product_favourite();
        this.get_product_size();
        this.get_product_color();
        this.get_comment_product();
        this.get_comment_count();

        this.handleAddtoCart = this.handleAddtoCart.bind(this);
        this.handleFavourite = this.handleFavourite.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
        this.openLoginModal = this.openLoginModal.bind(this);
        this.hideLoginModal = this.hideLoginModal.bind(this);
        this.handleChange = this.handleChange.bind(this);

        //this.handleSubmit = this.handleSubmit.bind(this);
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

        this.get_country();

        facebook_data();
        google_data();
    }

    componentDidMount() {


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

    showSignUpPortion(e) {
        $("#container2").addClass("right-panel-active");
    }
    showSignInPortion(e) {
        $("#container2").removeClass("right-panel-active");
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
                        console.log(res_data.users);
                        if (window.callback != undefined) {
                            window.callback.login_success('{"user_id":"' + res_data.users.u_id + '","is_login":"1"}');
                        }

                        // window.location.href = web_url + 'My-profile';
                        window.location.href = web_url + 'productdetail/' + this.props.match.params.product_id;

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
                        window.location.href = web_url + 'productdetail/' + this.props.match.params.product_id;
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

    delete_comment(event, comment_id, comment_id1) {
        if (window.confirm("Are you sure to delete this Review?")) {
            var user_data = getUserDetail();
            var user_id = user_data ? user_data.u_id : '';
            api_option.url = 'delete_comment_product';
            api_option.data = { user_id: user_id, id: comment_id };
            api_option.headers.Authorization = sessionStorage.getItem('token');
            const th = this;
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        /*  */
                        this.get_comment_product();
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

    componentDidUpdate(prevProps) {
        if (this.props.match.url !== prevProps.match.url) {
            this.get_product_detail()
            this.get_product_image();
            this.get_seller_product_category();
            //  this.get_cart_count();
            // this.get_product_is_exist_cart();
            this.get_similar_product();
            this.get_product_favourite();
            this.get_product_size();
            this.get_product_color();
            this.get_comment_product();
            this.get_comment_count();
        }

    }

    handleFavourite() {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const product_id = this.props.match.params.product_id;
        this.setState({ loaded: false });
        api_option.url = 'add_to_favourite';
        api_option.data = { product_id: product_id, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {

                    toast.success(res.data.message);
                    th.get_product_favourite();
                    // th.setState({ redirect: '/productdetail/' + product_id });


                } else {
                    toast.error(res.data.message);
                    th.get_product_favourite();
                    // this.setState({ redirect: '/logout' });

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
    handleFormChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.login_form_data[name] = value;
        this.setState({ data });
    }
    handleStar(star) {

        if (is_login()) {
            var user_data = getUserDetail();
            // console.log(user_data.u_id)
            var user_id = user_data ? user_data.u_id : '';
            const product_id = this.props.match.params.product_id;
            this.setState({ loaded: false });
            api_option.url = 'add_product_rating';
            api_option.data = { product_id: product_id, user_id: user_id, star: star };
            api_option.headers.Authorization = sessionStorage.getItem('token');
            const th = this;
            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    if (res.data.status) {

                        toast.success(res.data.message);
                        this.get_product_detail();
                        // th.get_latest_product();
                        // th.get_bestseller_product_data();
                        // th.featured_product_data();
                        // th.setState({ redirect: '/productdetail/' + product_id });


                    } else {
                        toast.error(res.data.message);
                        // th.get_latest_product();
                        // th.get_bestseller_product_data();
                        // th.featured_product_data();

                        // this.setState({ redirect: '/logout' });

                    }
                })
                .catch(error => {
                    this.setState({ redirect: '/logout' });
                });
        }
    }
    // async get_cart_count(props) {

    //     var user_data = getUserDetail();
    //     var user_id = user_data ? user_data.u_id : '';
    //     api_option.url = 'get_cart_count';
    //     api_option.data = { user_id: user_id };
    //     api_option.headers.Authorization = sessionStorage.getItem('token');
    //     await axios(api_option)
    //         .then(res => {
    //             if (res.data.status) {
    //                 this.setState({ cart_bag_number: res.data.total });

    //             } else {
    //                 this.setState({ is_data: false });
    //                 // this.setState({ redirect: '/ProductList/' });
    //             }
    //         })
    //         .catch(error => {
    //             //  this.setState({ redirect: '/logout' });
    //         });


    // }

    async get_comment_product(props) {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const product_id = this.props.match.params.product_id;
        api_option.url = 'get_comment_product';
        api_option.data = { product_id: product_id, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var comment_data = res.data.comment_list;
                    this.setState(this.state.comment_data.comment_data = comment_data);
                } else {
                    //this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });

    }
    async get_comment_count(props) {
        var user_data = getUserDetail();
        const product_id = this.props.match.params.product_id;
        api_option.url = 'get_comment_product_count';
        api_option.data = { product_id: product_id };
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
    // form submit event
    handleSubmit(event) {
        console.log("adasjkfhjkasd");
        event.preventDefault();
        if (!this.review_validator.allValid()) {
            this.review_validator.showMessages();
            this.forceUpdate();
        } else {
            this.setState({ loaded: false });
            api_option.url = 'save_product_comment';
            api_option.data = this.state.comment_data;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        this.state.comment_data.comment = '';
                        toast.success(res.data.message);
                        this.get_comment_product();
                        this.get_comment_count();
                    } else {

                        toast.error(res.data.message);

                        // this.setState({error:res_data.message});
                    }
                })
                .catch(error => console.log(error));
        }

    }
    async get_product_size() {
        const product_id = this.props.match.params.product_id;
        api_option.url = 'get_product_size';
        api_option.data = { product_id: product_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var size_data = res.data.data;
                    this.setState(this.state.form_data.size_data = size_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_product_color() {
        const product_id = this.props.match.params.product_id;
        this.setState({ loaded: false });
        api_option.url = 'get_product_color_detail';
        api_option.data = { product_id: product_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {
                    var color_data = res.data.data;
                    this.setState(this.state.form_data.color_data = color_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_product_favourite(props) {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const product_id = this.props.match.params.product_id;

        api_option.url = 'get_favourite_product';
        api_option.data = { product_id: product_id, user_id: user_id };
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


    async get_product_is_exist_cart(size, color) {


        var user_data = getUserDetail();

        if (size == undefined) {
            var size = '';
        } else {
            var size = size;
        }
        if (color == undefined) {
            var color = '';
        } else {
            var color = color;
        }

        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const product_id = this.props.match.params.product_id;
        api_option.url = 'get_product_is_exist_cart';
        api_option.data = { product_id: product_id, user_id: user_id, size: size, color: color };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {

                if (res.data.status) {

                    var is_exist_cart = res.data.is_exist_cart;

                    this.setState(this.state.form_data.is_exist_cart = is_exist_cart);


                } else {

                    var is_exist_cart = res.data.is_exist_cart;

                    this.setState(this.state.form_data.is_exist_cart = is_exist_cart);
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });

    }

    handleAddtoCart() {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const product_id = this.props.match.params.product_id;
        var size = this.state.size;
        var color = this.state.color;
        if (color == 0) {
            toast.error('Please select color');
            return false
        }
        if (size == 0) {
            toast.error('Please select size');
            return false
        }



        this.setState({ loaded: false });
        api_option.url = 'add_to_cart';
        api_option.data = { product_id: product_id, user_id: user_id, size: size, color: color };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        axios(api_option)
            .then(res => {
                //this.setState({ loaded: true });
                if (res.data.status) {
                    //  th.get_cart_count();
                    var cnt = $('#bag_count').text();
                    if (cnt == '') {
                        var cnt = 0;
                    } else {
                        var cnt = cnt;
                    }

                    $('#bag_count').text(parseInt(cnt) + 1);
                    this.get_product_is_exist_cart();
                    toast.success(res.data.message);
                    //this.setState({ redirect: '/cart' });
                    window.location.reload();

                } else {
                    toast.error(res.data.message);
                    this.get_product_is_exist_cart();
                    this.setState({ redirect: '/logout' });

                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    handleSize(size) {
        setTimeout(() => {
            this.setState({ size: size })
            console.log(size)
            this.get_product_is_exist_cart(size, this.state.color);
        }, 1000);
    }
    handleColor(color) {

        setTimeout(() => {
            this.setState({ color: color })
            console.log(color)
            this.get_product_is_exist_cart(this.state.size, color);
        }, 1000);

    }

    /* openLoginModal(e) {
        e.preventDefault();
        window.$("#access-modal").modal("show")
    } */
    show_sign_in() {
        this.setState({ 'forgot_password': 'none' })
        this.setState({ 'sign_in_form': 'flex' })
    }
    show_forgot_password() {
        this.setState({ 'forgot_password': 'flex' })
        this.setState({ 'sign_in_form': 'none' })
    }
    openLoginModal(e) {
        this.setState({ show: true });
        // e.preventDefault();

        // $("#access-modal").modal("show")
    }
    hideLoginModal(e) {
        this.setState({ show: false });
    }

    async get_similar_product() {
        const product_id = this.props.match.params.product_id;

        api_option.url = 'get_similar_product';
        api_option.data = { product_id: product_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {

                if (res.data.status) {
                    var similar_data = res.data.data;
                    this.setState(this.state.form_data.similar_product_detail = similar_data);
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    async get_seller_product_category() {
        const product_id = this.props.match.params.product_id;
        var user_data = getUserDetail();
        // console.log(user_data.u_id)

        api_option.url = 'get_seller_product_category';
        api_option.data = { product_id: product_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var seller_product_data = res.data.data;
                    this.setState(this.state.form_data.seller_product_detail = seller_product_data);
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    async get_product_detail() {

        const product_id = this.props.match.params.product_id;
        //  this.setState({ loaded: false });
        api_option.url = 'get_front_product_detail';
        api_option.data = { product_id: product_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                // this.setState({ loaded: true });
                if (res.data.status) {
                    var detail_data = res.data.data;
                    this.setState(this.state.form_data.product_detail_data = detail_data);

                    var str = this.state.form_data.product_detail_data.tp_descr;
                    var descrptt = str.replace(/[^a-zA-Z ]/g, "");
                    this.setState({ descrp: str });

                    var str_long = this.state.form_data.product_detail_data.tp_long_descr;
                    // var descrpt_long = str_long.replace(/[^a-zA-Z ]/g, "");
                    this.setState({ descrptt_long: str_long });

                    this.setState(this.state.form_data.detail_list = this.state.form_data.product_detail_data.tp_overview);
                    var one_star_percentage = 0;
                    var two_star_percentage = 0;
                    var three_star_percentage = 0;
                    var four_star_percentage = 0;
                    var five_star_percentage = 0;
                    if (parseInt(this.state.form_data.product_detail_data.one_star) > 0) {
                        one_star_percentage = ((parseInt(this.state.form_data.product_detail_data.one_star) * 100) / ((parseInt(this.state.form_data.product_detail_data.one_star) +
                            parseInt(this.state.form_data.product_detail_data.two_star) +
                            parseInt(this.state.form_data.product_detail_data.three_star) +
                            parseInt(this.state.form_data.product_detail_data.four_star) +
                            parseInt(this.state.form_data.product_detail_data.five_star))));
                    }
                    if (parseInt(this.state.form_data.product_detail_data.two_star) > 0) {
                        two_star_percentage = ((parseInt(this.state.form_data.product_detail_data.two_star) * 100) / ((parseInt(this.state.form_data.product_detail_data.one_star) +
                            parseInt(this.state.form_data.product_detail_data.two_star) +
                            parseInt(this.state.form_data.product_detail_data.three_star) +
                            parseInt(this.state.form_data.product_detail_data.four_star) +
                            parseInt(this.state.form_data.product_detail_data.five_star))));
                    }
                    if (parseInt(this.state.form_data.product_detail_data.three_star) > 0) {
                        three_star_percentage = ((parseInt(this.state.form_data.product_detail_data.three_star) * 100) / ((parseInt(this.state.form_data.product_detail_data.one_star) +
                            parseInt(this.state.form_data.product_detail_data.two_star) +
                            parseInt(this.state.form_data.product_detail_data.three_star) +
                            parseInt(this.state.form_data.product_detail_data.four_star) +
                            parseInt(this.state.form_data.product_detail_data.five_star))));
                    }
                    if (parseInt(this.state.form_data.product_detail_data.four_star) > 0) {
                        four_star_percentage = ((parseInt(this.state.form_data.product_detail_data.four_star) * 100) / ((parseInt(this.state.form_data.product_detail_data.one_star) +
                            parseInt(this.state.form_data.product_detail_data.two_star) +
                            parseInt(this.state.form_data.product_detail_data.three_star) +
                            parseInt(this.state.form_data.product_detail_data.four_star) +
                            parseInt(this.state.form_data.product_detail_data.five_star))));
                    }
                    if (parseInt(this.state.form_data.product_detail_data.five_star) > 0) {
                        five_star_percentage = ((parseInt(this.state.form_data.product_detail_data.five_star) * 100) / ((parseInt(this.state.form_data.product_detail_data.one_star) +
                            parseInt(this.state.form_data.product_detail_data.two_star) +
                            parseInt(this.state.form_data.product_detail_data.three_star) +
                            parseInt(this.state.form_data.product_detail_data.four_star) +
                            parseInt(this.state.form_data.product_detail_data.five_star))));
                    }

                    this.setState({ one_star_percentage: one_star_percentage });
                    this.setState({ two_star_percentage: two_star_percentage });
                    this.setState({ three_star_percentage: three_star_percentage });
                    this.setState({ four_star_percentage: four_star_percentage });
                    this.setState({ five_star_percentage: five_star_percentage });


                    setTimeout(function () {
                        $('.loader').hide();
                        $('.modal-backdrop').remove();
                    }, 1000)
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }


    async get_product_image() {
        const product_id = this.props.match.params.product_id;
        api_option.url = 'get_front_product_image';
        api_option.data = { product_id: product_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var detail_data = res.data.data;
                    this.setState(this.state.form_data.product_image = detail_data);

                    setTimeout(() => {
                        appendScript("https://unpkg.com/swiper/swiper-bundle.min.js" + "?ts=" + new Date().getTime());
                        appendScript("/assets/js/product_detail.js" + "?ts=" + new Date().getTime());
                    }, 2000);
                } else {
                    this.setState({ redirect: '/logout' });
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



                <div class="page-breadcrumb">
                    <div class="container">
                        <ul>
                            <li><a href=""><i class="bi-house"></i></a></li>
                            <li><Link to={`/sale-product`} class="hs-p-name">Products</Link></li>
                            {/* <li>{this.state.form_data.product_detail_data.c_title}</li> */}
                            <li>{this.state.form_data.product_detail_data.sc_title}</li>
                            <li>{this.state.form_data.product_detail_data.tp_title}</li>
                        </ul>
                    </div>
                </div>

                <div class="productFull-page">
                    <div class="container">
                        <div class="product-details-main">
                            <div class="product-info-left">
                                <div class="thumb-slider">
                                    <div class="swiper-container gallery-thumbs">
                                        <div class="swiper-wrapper">
                                            {Object.entries(this.state.form_data.product_image).map(([o, pi]) => (
                                                <div class="swiper-slide"><img src={pi.tpi_image} /></div>
                                            ))}
                                            {/* <div class="swiper-slide"><img src="/assets/images/Image-21.jpg" /></div>
                                            <div class="swiper-slide"><img src="/assets/images/Image-22.jpg" /></div>
                                            <div class="swiper-slide"><img src="/assets/images/Image-23.jpg" /></div>
                                            <div class="swiper-slide"><img src="/assets/images/Image-24.jpg" /></div>
                                            <div class="swiper-slide"><img src="/assets/images/Image-25.jpg" /></div>
                                            <div class="swiper-slide"><img src="/assets/images/Image-21.jpg" /></div>
                                            <div class="swiper-slide"><img src="/assets/images/Image-22.jpg" /></div> */}
                                        </div>
                                    </div>
                                    <div class="swiper-container gallery-top">
                                        <div class="swiper-wrapper">

                                            {Object.entries(this.state.form_data.product_image).map(([o, pi]) => (
                                                <div class="swiper-slide"><img src={pi.tpi_image} /></div>
                                            ))}
                                            {/* <div class="swiper-slide"><img src="/assets/images/Image-22.jpg" /></div>
                                            <div class="swiper-slide"><img src="/assets/images/Image-23.jpg" /></div>
                                            <div class="swiper-slide"><img src="/assets/images/Image-24.jpg" /></div>
                                            <div class="swiper-slide"><img src="/assets/images/Image-25.jpg" /></div>
                                            <div class="swiper-slide"><img src="/assets/images/Image-21.jpg" /></div>
                                            <div class="swiper-slide"><img src="/assets/images/Image-22.jpg" /></div> */}
                                        </div>
                                        {/* <div class="swiper-button-next swiper-button-white"></div>
                                        <div class="swiper-button-prev swiper-button-white"></div> */}
                                    </div>
                                </div>
                                <div class="product-overview mobile-view">
                                    <div class="sticky-overview">
                                        <div class="product-basic">
                                            <h5 class="product-seller"><Link to={`/Seller-detail/${this.state.form_data.product_detail_data.u_id}`}>{this.state.form_data.product_detail_data.u_name}</Link></h5>
                                            <div class="rating-wapper">
                                                {this.state.form_data.product_detail_data.tp_star == 0 && <span class="star-rating"><span class="stars"></span></span>}
                                                {this.state.form_data.product_detail_data.tp_star == 1 && <span class="star-rating"><span class="stars one"></span></span>}
                                                {this.state.form_data.product_detail_data.tp_star == 2 && <span class="star-rating"><span class="stars two"></span></span>}
                                                {this.state.form_data.product_detail_data.tp_star == 3 && <span class="star-rating"><span class="stars three"></span></span>}
                                                {this.state.form_data.product_detail_data.tp_star == 4 && <span class="star-rating"><span class="stars four"></span></span>}
                                                {this.state.form_data.product_detail_data.tp_star == 5 && <span class="star-rating"><span class="stars five"></span></span>}
                                                <a href="">({this.state.comment_data.comment_count} Reviews)</a>
                                            </div>
                                        </div>
                                        <h1 class="product-name-main 11">{this.state.form_data.product_detail_data.tp_title}</h1>



                                        {this.state.form_data.product_detail_data.tp_sale_pricesddsds != 0 && <div class="price">{this.state.form_data.product_detail_data.tp_sale_price > 0 && <del>RO {this.state.form_data.product_detail_data.tp_sale_price}</del>}<span>RO {this.state.form_data.product_detail_data.tp_price}</span></div> || <div class="price"><span>RO {this.state.form_data.product_detail_data.tp_price}</span></div>}
                                        <p class="description">{renderHTML(this.state.descrp)}</p>
                                        <div class="product-option-wrapper">
                                            {/* <div class="product-options">
                                                <strong>Material:</strong>
                                                <span>Recycled PET</span>
                                            </div> */}
                                            <div class="product-options">
                                                <strong>Dimensions:</strong>
                                                <span>{this.state.form_data.product_detail_data.tp_dimension}</span>
                                            </div>
                                            <div class="product-options">
                                                <strong>Color:</strong>
                                                <div class="box-selection">
                                                    {Object.entries(this.state.form_data.color_data).map(([o, p]) => (
                                                        <div><label><input type="radio" name="color" value={this.state.color} onChange={this.handleColor.bind(this, p.tc_id)} /><span>{p.tc_color}</span></label></div>

                                                    ))}
                                                    {/* <div><label><input type="radio" name="pColor" /><span>Blue</span></label></div>
                                                    <div><label><input type="radio" name="pColor" /><span>Black</span></label></div>
                                                    <div><label><input type="radio" name="pColor" /><span>Ivory</span></label></div>
                                                    <div><label><input type="radio" name="pColor" /><span>Gray</span></label></div> */}
                                                </div>
                                            </div>
                                            <div class="product-options">
                                                <strong>Size:</strong>
                                                <div class="box-selection">
                                                    {Object.entries(this.state.form_data.size_data).map(([o, p]) => (
                                                        <div><label><input type="radio" name="size" value={this.state.size} onChange={this.handleSize.bind(this, p.s_id)} /><span>{p.s_title}</span></label></div>
                                                    ))}
                                                    <div className='clear'></div>
                                                    <br></br>




                                                    {/* <div><label><input type="radio" name="pSize" /><span>M</span></label></div>
                                                    <div><label><input type="radio" name="pSize" /><span>L</span></label></div>
                                                    <div><label><input type="radio" name="pSize" /><span>XL</span></label></div>
                                                    <div><label><input type="radio" name="pSize" /><span>XXL</span></label></div> */}
                                                </div>

                                            </div>
                                            {this.state.form_data.product_detail_data.tp_product_link != "" &&
                                                <span style={{ color: 'red' }}>This product will be purchased from external website click below button to proceed </span>
                                            }
                                            {/* <div class="product-options">
                                                <strong>Qty:</strong>
                                                <div class="box-selection">
                                                    <select class="cart-qty">
                                                        <option value="1">1</option>
                                                        <option value="2">2</option>
                                                        <option value="3">3</option>
                                                        <option value="4">4</option>
                                                        <option value="5">5</option>
                                                        <option value="6">6</option>
                                                        <option value="7">7</option>
                                                        <option value="8">8</option>
                                                        <option value="9">9</option>
                                                        <option value="10">10+</option>
                                                    </select>
                                                </div>
                                            </div> */}
                                        </div>

                                        <div class="c-btn-wrapper">


                                            {this.state.form_data.product_detail_data.tp_product_show == 0 &&
                                                this.state.form_data.product_detail_data.tp_product_link == 0 &&
                                                <>
                                                    {this.state.form_data.product_detail_data.tp_stock_status != "outofstock" &&
                                                        <>
                                                            {localStorage.getItem('type') == 1 && is_login() && this.state.form_data.is_exist_cart == 1 && <button class="btn btn-primary" >Already added</button>}
                                                            {localStorage.getItem('type') == 1 && is_login() && this.state.form_data.is_exist_cart == 0 && <button class="btn btn-primary" onClick={this.handleAddtoCart} >Add to Bag</button>}

                                                            {!is_login() && <button class="btn btn-primary" onClick={this.openLoginModal} >Add to Bag</button>
                                                            }
                                                        </>
                                                    }
                                                </>
                                            }


                                            {this.state.form_data.product_detail_data.tp_product_show == 0 && this.state.form_data.product_detail_data.tp_product_link != 0 &&
                                                <>
                                                    {this.state.form_data.product_detail_data.tp_stock_status != "outofstock" &&
                                                        <>
                                                            {localStorage.getItem('type') == 1 && is_login() && this.state.form_data.is_exist_cart == 1 && <a href={this.state.form_data.product_detail_data.tp_product_link} target="_blank"><button class="btn btn-primary" >Go to website</button></a>}
                                                            {localStorage.getItem('type') == 1 && is_login() && this.state.form_data.is_exist_cart == 0 && <a href={this.state.form_data.product_detail_data.tp_product_link} target="_blank"><button class="btn btn-primary" >Go to website</button></a>}
                                                            {!is_login() && <a href={this.state.form_data.product_detail_data.tp_product_link} target="_blank"><button class="btn btn-primary" >Go to website</button></a>
                                                            }

                                                            {/* {this.state.form_data.product_detail_data.tp_product_link != "" && <a href={this.state.form_data.product_detail_data.tp_product_link} target="_blank"><button class="btn btn-primary" >Go to website</button></a>} */}
                                                        </>
                                                    }
                                                </>
                                            }



                                            {this.state.form_data.product_detail_data.tp_stock_status == "outofstock" &&
                                                <span className='btn-outofstock'>This product is out of stock</span>
                                            }


                                            {localStorage.getItem('type') == 1 && is_login() && this.state.form_data.is_favourite == 1 && <button class="plain btn-w-icon" onClick={this.handleFavourite}><i class="bi bi-heart-fill"></i> Add to Favourites</button>}
                                            {localStorage.getItem('type') == 1 && is_login() && this.state.form_data.is_favourite == 0 && <button class="plain btn-w-icon" onClick={this.handleFavourite}><i class="bi bi-heart"></i> Add to Favourites</button>}

                                            {!is_login() && <button class="plain btn-w-icon" onClick={this.openLoginModal}><i class="bi bi-heart"></i> Add to Favourites</button>
                                            }
                                            {/* <button class="plain btn-w-icon" onClick={this.handleFavourite}><i class="bi bi-heart"></i> Add to Favourites</button> */}
                                        </div>
                                    </div>
                                </div>
                                <div class="detailed-decs">
                                    <div class="lineTab">
                                        <ul class="nav nav-tabs">
                                            <li class="nav-item">
                                                <a class="nav-link active show" data-toggle="tab" href="#overview">Overview</a>
                                            </li>
                                            <li class="nav-item">
                                                <a class="nav-link" data-toggle="tab" href="#reviews">Reviews</a>
                                            </li>
                                            {/* <li class="nav-item">
                                                <a class="nav-link" data-toggle="tab" href="#shiprefund">Shipping/Refund</a>
                                            </li> */}
                                        </ul>
                                    </div>
                                    <div class="tab-content">
                                        <div class="tab-pane active" id="overview">
                                            <h5 class="md-title">Details</h5>
                                            <div class="info-table">
                                                {renderHTML(this.state.descrptt_long)}

                                                {/* {Object.entries(this.state.form_data.detail_list).map(([i, v]) => (
                                                    <dl><dt>{v.title}</dt><dd>{v.value}</dd></dl>

                                                ))} */}
                                            </div>
                                        </div>
                                        <div class="tab-pane" id="reviews">
                                            <h5 class="md-title">Ratings</h5>
                                            <div class="product-rating-content">
                                                <div class="average-rating">
                                                    <p class="rating-title secondary-color">Average Rating</p>
                                                    <div class="rating-box">
                                                        <div class="average-value primary-color">
                                                            {this.state.form_data.product_detail_data.tp_star}

                                                        </div>
                                                        <div class="rating-wapper">
                                                            {this.state.form_data.product_detail_data.tp_star == 0 && <span class="star-rating"><span class="stars"></span></span>}
                                                            {this.state.form_data.product_detail_data.tp_star == 1 && <span class="star-rating"><span class="stars one"></span></span>}
                                                            {this.state.form_data.product_detail_data.tp_star == 2 && <span class="star-rating"><span class="stars two"></span></span>}
                                                            {this.state.form_data.product_detail_data.tp_star == 3 && <span class="star-rating"><span class="stars three"></span></span>}
                                                            {this.state.form_data.product_detail_data.tp_star == 4 && <span class="star-rating"><span class="stars four"></span></span>}
                                                            {this.state.form_data.product_detail_data.tp_star == 5 && <span class="star-rating"><span class="stars five"></span></span>}
                                                        </div>
                                                        <div class="review-amount">
                                                            ({this.state.comment_data.comment_count} Reviews)
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="detailed-rating">
                                                    <p class="rating-title secondary-color">Detailed Rating</p>
                                                    <div class="rating-box">
                                                        <div class="rating-rated-item">
                                                            <div class="rating-point">
                                                                <div class="tm-star-rating">
                                                                    <div class="rating-wapper">
                                                                        <span class="star-rating"><span class="stars five"></span></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="rating-progress">
                                                                <div class="single-progress-bar">
                                                                    <div class="progress">
                                                                        <div class="progress-bar" role="progressbar" style={{ width: this.state.five_star_percentage + "%" }} aria-valuenow={this.state.five_star_percentage} aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="rating-count">{this.state.form_data.product_detail_data.five_star}</div>
                                                        </div>
                                                        <div class="rating-rated-item">
                                                            <div class="rating-point">
                                                                <div class="tm-star-rating">
                                                                    <div class="rating-wapper">
                                                                        <span class="star-rating"><span class="stars four"></span></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="rating-progress">
                                                                <div class="single-progress-bar">
                                                                    <div class="progress">
                                                                        <div class="progress-bar" role="progressbar" style={{ width: this.state.four_star_percentage + "%" }} aria-valuenow={this.state.four_star_percentage} aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="rating-count">{this.state.form_data.product_detail_data.four_star}</div>
                                                        </div>
                                                        <div class="rating-rated-item">
                                                            <div class="rating-point">
                                                                <div class="tm-star-rating">
                                                                    <div class="rating-wapper">
                                                                        <span class="star-rating"><span class="stars three"></span></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="rating-progress">
                                                                <div class="single-progress-bar">
                                                                    <div class="progress">
                                                                        <div class="progress-bar" role="progressbar" style={{ width: this.state.three_star_percentage + "%" }} aria-valuenow={this.state.three_star_percentage} aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="rating-count">{this.state.form_data.product_detail_data.three_star}</div>
                                                        </div>
                                                        <div class="rating-rated-item">
                                                            <div class="rating-point">
                                                                <div class="tm-star-rating">
                                                                    <div class="rating-wapper">
                                                                        <span class="star-rating"><span class="stars two"></span></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="rating-progress">
                                                                <div class="single-progress-bar">
                                                                    <div class="progress">
                                                                        <div class="progress-bar" role="progressbar" style={{ width: this.state.two_star_percentage + "%" }} aria-valuenow={this.state.two_star_percentage} aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="rating-count">{this.state.form_data.product_detail_data.two_star}</div>
                                                        </div>
                                                        <div class="rating-rated-item">
                                                            <div class="rating-point">
                                                                <div class="tm-star-rating">
                                                                    <div class="rating-wapper">
                                                                        <span class="star-rating"><span class="stars one"></span></span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="rating-progress">
                                                                <div class="single-progress-bar">
                                                                    <div class="progress">
                                                                        <div class="progress-bar" role="progressbar" style={{ width: this.state.one_star_percentage + "%" }} aria-valuenow={this.state.one_star_percentage} aria-valuemin="0" aria-valuemax="100"></div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="rating-count">{this.state.form_data.product_detail_data.one_star}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="product-reviews-area">
                                                <div class="commentbox">
                                                    <h5 class="md-title"><span class="text-primary">{this.state.comment_data.comment_count}</span> Reviews</h5>
                                                    <form class="post-comment" onSubmit={this.handleSubmit}>
                                                        <div class="comment-user-thumb"><img src="/assets/images/avatar-1.jpg" /></div>
                                                        <div class="comment-input">
                                                            <input type="text" name="comment" value={this.state.comment_data.comment} onChange={this.handleChange} placeholder="Write here..." />
                                                            <input type="hidden" name="project_id" value={this.state.comment_data.project_comment_id} />
                                                            <input type="hidden" name="user_id" value={this.state.comment_data.user_comment_id} />
                                                            {this.review_validator.message('Comment', this.state.comment_data.comment, 'required')}
                                                            {(localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && is_login() && <button class="plain text-primary">Post</button> || <span style={{ color: 'red' }}>After login you can write a review for this product and rate this product</span>}


                                                            <div class="rating-form">
                                                                <b>Rate this product:</b>
                                                                <div class="form-item">
                                                                    <input id="rating-5" name="rating" type="radio" value="5" onClick={this.handleStar.bind(this, 5)} />
                                                                    <label for="rating-5" data-value="5">
                                                                        <span class="rating-star">
                                                                            {<i class="bi bi-star"></i>}
                                                                            <i class="bi bi-star-fill"></i>
                                                                        </span>
                                                                        <span class="ir">5</span>
                                                                    </label>
                                                                    <input id="rating-4" name="rating" type="radio" value="4" onClick={this.handleStar.bind(this, 4)} />
                                                                    <label for="rating-4" data-value="4">
                                                                        <span class="rating-star">
                                                                            {<i class="bi bi-star"></i>}
                                                                            <i class="bi bi-star-fill"></i>
                                                                        </span>
                                                                        <span class="ir">4</span>
                                                                    </label>
                                                                    <input id="rating-3" name="rating" type="radio" value="3" onClick={this.handleStar.bind(this, 3)} />
                                                                    <label for="rating-3" data-value="3">
                                                                        <span class="rating-star">
                                                                            {<i class="bi bi-star"></i>}
                                                                            <i class="bi bi-star-fill"></i>
                                                                        </span>
                                                                        <span class="ir">3</span>
                                                                    </label>
                                                                    <input id="rating-2" name="rating" type="radio" value="2" onClick={this.handleStar.bind(this, 2)} />
                                                                    <label for="rating-2" data-value="2">
                                                                        <span class="rating-star">
                                                                            {<i class="bi bi-star"></i>}
                                                                            <i class="bi bi-star-fill"></i>
                                                                        </span>
                                                                        <span class="ir">2</span>
                                                                    </label>
                                                                    <input id="rating-1" name="rating" type="radio" value="1" onClick={this.handleStar.bind(this, 1)} />
                                                                    <label for="rating-1" data-value="1">
                                                                        <span class="rating-star">
                                                                            {<i class="bi bi-star"></i>}
                                                                            <i class="bi bi-star-fill"></i>
                                                                        </span>
                                                                        <span class="ir">1</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                    <ul class="comment-feed-list">
                                                        {Object.entries(this.state.comment_data.comment_data).map(([o, comment]) => (

                                                            <li class="comment-feed-item 11">
                                                                <article>
                                                                    <p class="comment-feed-content 11">
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
                                                        </li> */}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        {/* <div class="tab-pane" id="shiprefund">
                                            <h5 class="md-title">Delivery</h5>
                                            <div class="info-table">
                                                <dl><dt>delivery</dt><dd>Direct delivery to companies | Ships within 15 days</dd></dl>
                                                <dl><dt>shipping fee</dt><dd>60,000 won COD</dd></dl>
                                                <dl><dt>Undeliverable area</dt><dd>Island and mountainous area / Jeju Island</dd></dl>
                                                <dl><dt>Proportional shipping cost</dt><dd>Shipping charges are charged in proportion to the number of products ordered</dd></dl>
                                            </div>
                                            <h5 class="md-title">Exchange Refund</h5>
                                            <div class="info-table">
                                                <dl><dt>Return shipping fee</dt><dd>60,000 KRW ( 120,000 KRW charged if the initial shipping fee is free )</dd></dl>
                                                <dl><dt>Exchange shipping cost</dt><dd>120,000 won</dd></dl>
                                                <dl><dt>Where to send</dt><dd>(11516) Na-dong, 566-4 Gaup-ri, Baekseok-eup, Yangju-si, Gyeonggi-do</dd></dl>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                            <div class="product-overview web-view">
                                <div class="sticky-overview">
                                    <div class="product-basic">
                                        <h5 class="product-seller"><Link to={`/Seller-detail/${this.state.form_data.product_detail_data.u_id}`}>{this.state.form_data.product_detail_data.u_name}</Link></h5>
                                        <div class="rating-wapper">
                                            {this.state.form_data.product_detail_data.tp_star == 0 && <span class="star-rating"><span class="stars"></span></span>}
                                            {this.state.form_data.product_detail_data.tp_star == 1 && <span class="star-rating"><span class="stars one"></span></span>}
                                            {this.state.form_data.product_detail_data.tp_star == 2 && <span class="star-rating"><span class="stars two"></span></span>}
                                            {this.state.form_data.product_detail_data.tp_star == 3 && <span class="star-rating"><span class="stars three"></span></span>}
                                            {this.state.form_data.product_detail_data.tp_star == 4 && <span class="star-rating"><span class="stars four"></span></span>}
                                            {this.state.form_data.product_detail_data.tp_star == 5 && <span class="star-rating"><span class="stars five"></span></span>}
                                            <a href="">({this.state.comment_data.comment_count} Reviews)</a>
                                        </div>
                                    </div>
                                    <h1 class="product-name-main">{this.state.form_data.product_detail_data.tp_title}</h1>
                                    {/* {this.state.form_data.product_detail_data.tp_sale_price != 0 && <div class="price"><del>${this.state.form_data.product_detail_data.tp_price}</del><span>${this.state.form_data.product_detail_data.tp_sale_price}</span></div> || <div class="price"><span>${this.state.form_data.product_detail_data.tp_price}</span></div>} */}
                                    {this.state.form_data.product_detail_data.tp_sale_price != 0 && <div class="price">RO {this.state.form_data.product_detail_data.tp_sale_price}</div> || <div class="price"><span>RO {this.state.form_data.product_detail_data.tp_price}</span></div>}

                                    <div class="description">{renderHTML(this.state.descrp)}</div>
                                    <div class="product-option-wrapper">
                                        {/* <div class="product-options">
                                            <strong>Material:</strong>
                                            <span>Recycled PET</span>
                                        </div> */}
                                        <div class="product-options">
                                            <strong>Dimensions:</strong>
                                            <span>{this.state.form_data.product_detail_data.tp_dimension}</span>
                                        </div>
                                        <div class="product-options">
                                            <strong>Color:</strong>
                                            <div class="box-selection">
                                                {Object.entries(this.state.form_data.color_data).map(([o, p]) => (
                                                    <div><label><input type="radio" name="color" value={this.state.color} onChange={this.handleColor.bind(this, p.tc_id)} /><span>{p.tc_color}</span></label></div>

                                                ))}

                                                {/* <div><label><input type="radio" name="pColor" /><span>Black</span></label></div>
                                                <div><label><input type="radio" name="pColor" /><span>Ivory</span></label></div>
                                                <div><label><input type="radio" name="pColor" /><span>Gray</span></label></div> */}
                                            </div>
                                        </div>
                                        <div class="product-options">
                                            <strong>Size:</strong>
                                            <div class="box-selection">
                                                {Object.entries(this.state.form_data.size_data).map(([o, p]) => (
                                                    <div><label><input type="radio" name="size" value={this.state.size} onChange={this.handleSize.bind(this, p.s_id)} /><span>{p.s_title}</span></label></div>
                                                ))}
                                            </div>
                                        </div>
                                        {/* <div class="product-options">
                                            <strong>Qty:</strong>
                                            <div class="box-selection">
                                                <select class="cart-qty">
                                                    <option>1</option>
                                                    <option>2</option>
                                                    <option>3</option>
                                                    <option>4</option>
                                                    <option>5</option>
                                                    <option>6</option>
                                                    <option>7</option>
                                                    <option>8</option>
                                                    <option>9</option>
                                                    <option>10+</option>
                                                </select>
                                            </div>
                                        </div> */}
                                    </div>
                                    {this.state.form_data.product_detail_data.tp_product_show == 0 &&
                                        this.state.form_data.product_detail_data.tp_product_link == 0 && <div class="c-btn-wrapper">



                                            {this.state.form_data.product_detail_data.tp_stock_status != "outofstock" &&
                                                <>
                                                    {localStorage.getItem('type') == 1 && is_login() && this.state.form_data.is_exist_cart == 1 && <button class="btn btn-primary" >Already added</button>}
                                                    {localStorage.getItem('type') == 1 && is_login() && this.state.form_data.is_exist_cart == 0 && <button class="btn btn-primary" onClick={this.handleAddtoCart} >Add to Bag</button>}

                                                    {!is_login() && <button class="btn btn-primary" onClick={this.openLoginModal} >Add to Bag</button>
                                                    }
                                                </>
                                            }
                                            {this.state.form_data.product_detail_data.tp_stock_status == "outofstock" &&
                                                <span style={{ color: 'red' }}>This product is out of stock</span>
                                            }


                                            {localStorage.getItem('type') == 1 && is_login() && this.state.form_data.is_favourite == 1 && <button class="plain btn-w-icon" onClick={this.handleFavourite}><i class="bi bi-heart-fill"></i> Add to Favourites</button>}
                                            {localStorage.getItem('type') == 1 && is_login() && this.state.form_data.is_favourite == 0 && <button class="plain btn-w-icon" onClick={this.handleFavourite}><i class="bi bi-heart"></i> Add to Favourites</button>}


                                            {!is_login() && <button class="plain btn-w-icon" onClick={this.openLoginModal}><i class="bi bi-heart"></i> Add to Favourites</button>
                                            }
                                            {/* <button class="btn btn-primary" >Add to Bag</button>
                                        <button class="plain btn-w-icon" onClick={this.handleFavourite}><i class="bi bi-heart"></i> Add to Favourites</button> */}
                                        </div>
                                    }
                                    {this.state.form_data.product_detail_data.tp_product_show == 0 &&
                                        this.state.form_data.product_detail_data.tp_product_link != 0 &&
                                        <div class="c-btn-wrapper">
                                            {this.state.form_data.product_detail_data.tp_product_link != "" &&
                                                <span style={{ color: 'red' }}>This product will be purchased from external website click below button to proceed </span>
                                            }
                                            <div className='clear'></div>
                                            {this.state.form_data.product_detail_data.tp_product_link != "" && <a href={this.state.form_data.product_detail_data.tp_product_link} target="_blank"><button class="btn btn-primary" >Go to website</button></a>}

                                            {this.state.form_data.product_detail_data.tp_stock_status != "outofstock" &&
                                                <>
                                                    {this.state.form_data.product_detail_data.tp_product_link == "" && !is_login() && <button class="btn btn-primary" onClick={this.openLoginModal} >Add to Bag</button>
                                                    }
                                                </>
                                            }
                                            {this.state.form_data.product_detail_data.tp_stock_status == "outofstock" &&
                                                <span style={{ color: 'red' }}>This product is out of stock</span>
                                            }


                                            {/* <button class="btn btn-primary" >Add to Bag</button>
                                        <button class="plain btn-w-icon" onClick={this.handleFavourite}><i class="bi bi-heart"></i> Add to Favourites</button> */}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="productOfsseller">
                    <div class="container">
                        <div class="title-split">
                            <h5 class="md-title">More by <span class="text-primary">{this.state.form_data.product_detail_data.u_name}</span></h5>
                            <div>
                                {/* <a href="">View All</a> */}
                            </div>
                        </div>
                        <div class="products-grid">

                            {Object.entries(this.state.form_data.seller_product_detail).map(([o, spd]) => (
                                <div class="product-item">
                                    <div class="product-thumb">
                                        <Link to={`/productdetail/${spd.tp_id}`}>
                                            <img src={spd.image} />
                                        </Link>
                                    </div>
                                    <div class="product-info">
                                        <h4 class="product-name"><Link to={`/productdetail/${spd.tp_id}`}>{spd.tp_title}</Link></h4>
                                        <div class="just-in">
                                            <div class="product-price">{spd.tp_price > 0 && <del>RO {spd.tp_price}</del>}<span>RO {spd.tp_sale_price}</span></div>
                                            {/* <div class="product-price">RO {spd.tp_price}</div> */}
                                            <div class="rating-wapper">
                                                <span class="star-rating"><span class="stars five"></span></span>
                                            </div>
                                        </div>
                                        <div class="product-brand"><Link to={`/Seller-detail/${spd.u_id}`}>{spd.u_name}</Link></div>
                                    </div>
                                </div>
                            ))}
                            {/* <div class="product-item">
                                <div class="product-thumb">
                                    <a href="">
                                        <img src="/assets/images/product-9.jpg" />
                                    </a>
                                </div>
                                <div class="product-info">
                                    <h4 class="product-name"><a href="">Swivel Sofa</a></h4>
                                    <div class="just-in">
                                        <div class="product-price">$100.00</div>
                                        <div class="rating-wapper">
                                            <span class="star-rating"><span class="stars three"></span></span>
                                        </div>
                                    </div>
                                    <div class="product-brand"><a href="">Styled Habitat</a></div>
                                </div>
                            </div>
                            <div class="product-item">
                                <div class="product-thumb">
                                    <a href="">
                                        <img src="/assets/images/product-10.jpg" />
                                    </a>
                                </div>
                                <div class="product-info">
                                    <h4 class="product-name"><a href="">Wood Patio Chair</a></h4>
                                    <div class="just-in">
                                        <div class="product-price">$100.00</div>
                                        <div class="rating-wapper">
                                            <span class="star-rating"><span class="stars two"></span></span>
                                        </div>
                                    </div>
                                    <div class="product-brand"><a href="">Styled Habitat</a></div>
                                </div>
                            </div>
                            <div class="product-item">
                                <div class="product-thumb">
                                    <a href="">
                                        <img src="/assets/images/product-1.jpg" />
                                    </a>
                                </div>
                                <div class="product-info">
                                    <h4 class="product-name"><a href="">Office Desk Sofa</a></h4>
                                    <div class="just-in">
                                        <div class="product-price">$100.00</div>
                                        <div class="rating-wapper">
                                            <span class="star-rating"><span class="stars four"></span></span>
                                        </div>
                                    </div>
                                    <div class="product-brand"><a href="">Styled Habitat</a></div>
                                </div>
                            </div>
                            <div class="product-item">
                                <div class="product-thumb">
                                    <a href="">
                                        <img src="/assets/images/product-2.jpg" />
                                    </a>
                                </div>
                                <div class="product-info">
                                    <h4 class="product-name"><a href="">Ergonomic Desk Sofa</a></h4>
                                    <div class="just-in">
                                        <div class="product-price">$100.00</div>
                                        <div class="rating-wapper">
                                            <span class="star-rating"><span class="stars five"></span></span>
                                        </div>
                                    </div>
                                    <div class="product-brand"><a href="">Styled Habitat</a></div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div class="similarproduct">
                    <div class="container">
                        <div class="title-split">
                            <h5 class="md-title">Similar Products</h5>
                            <div>
                                {/* <a href="">View All</a> */}
                            </div>
                        </div>
                        <div class="products-grid">
                            {Object.entries(this.state.form_data.similar_product_detail).map(([o, sp]) => (
                                <div className="product-item">
                                    <div className="product-thumb">
                                        <Link to={`/productdetail/${sp.tp_id}`}>
                                            <img src={sp.image} />
                                        </Link>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><Link to={`/productdetail/${sp.tp_id}`}>{sp.tp_title}</Link></h4>
                                        <div className="just-in">
                                            <div class="product-price">{sp.tp_price > 0 && <del>RO {sp.tp_price}</del>}<span>RO {sp.tp_sale_price}</span></div>
                                            {/* <div className="product-price">RO {sp.tp_price}</div> */}
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars four"></span></span>
                                            </div>
                                        </div>
                                        <div class="product-brand"><Link to={`/Seller-detail/${sp.u_id}`}>{sp.u_name}</Link></div>
                                    </div>
                                </div>
                            ))}
                            {/* <div class="product-item">
                                <div class="product-thumb">
                                    <a href="">
                                        <img src="/assets/images/product-1.jpg" />
                                    </a>
                                </div>
                                <div class="product-info">
                                    <h4 class="product-name"><a href="">Office Desk Sofa</a></h4>
                                    <div class="just-in">
                                        <div class="product-price">$100.00</div>
                                        <div class="rating-wapper">
                                            <span class="star-rating"><span class="stars four"></span></span>
                                        </div>
                                    </div>
                                    <div class="product-brand"><a href="">Styled Habitat</a></div>
                                </div>
                            </div>
                            <div class="product-item">
                                <div class="product-thumb">
                                    <a href="">
                                        <img src="/assets/images/product-2.jpg" />
                                    </a>
                                </div>
                                <div class="product-info">
                                    <h4 class="product-name"><a href="">Ergonomic Desk Sofa</a></h4>
                                    <div class="just-in">
                                        <div class="product-price">$100.00</div>
                                        <div class="rating-wapper">
                                            <span class="star-rating"><span class="stars five"></span></span>
                                        </div>
                                    </div>
                                    <div class="product-brand"><a href="">Styled Habitat</a></div>
                                </div>
                            </div>
                            <div class="product-item">
                                <div class="product-thumb">
                                    <a href="">
                                        <img src="/assets/images/product-3.jpg" />
                                    </a>
                                </div>
                                <div class="product-info">
                                    <h4 class="product-name"><a href="">Swivel Sofa</a></h4>
                                    <div class="just-in">
                                        <div class="product-price">$100.00</div>
                                        <div class="rating-wapper">
                                            <span class="star-rating"><span class="stars three"></span></span>
                                        </div>
                                    </div>
                                    <div class="product-brand"><a href="">Styled Habitat</a></div>
                                </div>
                            </div>
                            <div class="product-item">
                                <div class="product-thumb">
                                    <a href="">
                                        <img src="/assets/images/product-4.jpg" />
                                    </a>
                                </div>
                                <div class="product-info">
                                    <h4 class="product-name"><a href="">Wood Patio Chair</a></h4>
                                    <div class="just-in">
                                        <div class="product-price">$100.00</div>
                                        <div class="rating-wapper">
                                            <span class="star-rating"><span class="stars two"></span></span>
                                        </div>
                                    </div>
                                    <div class="product-brand"><a href="">Styled Habitat</a></div>
                                </div>
                            </div>
                            <div class="product-item">
                                <div class="product-thumb">
                                    <a href="">
                                        <img src="/assets/images/product-5.jpg" />
                                    </a>
                                </div>
                                <div class="product-info">
                                    <h4 class="product-name"><a href="">Brown Vinyl Padded</a></h4>
                                    <div class="just-in">
                                        <div class="product-price">$100.00</div>
                                        <div class="rating-wapper">
                                            <span class="star-rating"><span class="stars one"></span></span>
                                        </div>
                                    </div>
                                    <div class="product-brand"><a href="">Styled Habitat</a></div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>

                <div class="stories-section" style={{ "display": "none" }}>
                    <div class="uncol">
                        <h5 class="md-title">How about a story like this?</h5>
                        <div class="swiper-container">
                            <div class="swiper-wrapper">
                                <div class="swiper-slide">
                                    <div class="sl-story-item" style={{ width: 'max-content', margin: 'auto' }}>
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
                                    <div class="sl-story-item" style={{ width: 'max-content' }}>
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
                                    <div class="sl-story-item" style={{ width: 'max-content' }}>
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
                                    <div class="sl-story-item" style={{ width: 'max-content' }}>
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
                                    <div class="sl-story-item" style={{ width: 'max-content' }}>
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
                                    <div class="sl-story-item" style={{ width: 'max-content' }}>
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
                                </div>
                            </div>
                            <div class="swiper-pagination"></div>
                        </div>
                    </div>
                </div>

                <Modal show={this.state.show} id="access-modal" size="lg" onHide={this.hideLoginModal}>

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
                                        <input type="text" placeholder="Email" name="email" id="email" data-validation="required email" value={this.state.login_form_data.email} onChange={this.handleFormChange} />
                                        {this.validator.message('email', this.state.login_form_data.email, 'required')}
                                        <input type="password" placeholder="Password" name="password" id="password" value={this.state.login_form_data.password} onChange={this.handleFormChange} data-validation="required" />
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

            </>
        );
    }
}


export default ProductDetail;
