import React, { Component } from 'react';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { api_option, setUserSession, is_login, getUserDetail, web_url } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import { Helmet } from "react-helmet";
import $ from 'jquery';
import Loader from "react-loader";

// import Select from 'react-select';
// import $ from 'jquery';

class Light_header extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        var user_data = getUserDetail();
        var user_name = user_data ? user_data.u_name : '';
        // if (localStorage.getItem('type') == 3) {
        //     window.location.href = "http://localhost:3000/#/My-account/";
        // } else if (localStorage.getItem('type') == 2) {
        //     window.location.href = "http://localhost:3000/#/Professional-profile";
        // }
        // window?.WEBSPELLCHECKER?.init({
        //     container: this.$iframe
        //       ? this.$iframe[0]
        //       : this.el,
        //   });

        // const device_type = this.props.match.params.device_type;
        // alert(device_type);
        /*if (device_type == 'android' || device_type == 'ios') {
            localStorage.setItem('device_type', device_type);
          } else {
            if(localStorage.getItem('device_type')){
              device_type=localStorage.getItem('device_type');
            }else{
              device_type='web'
              localStorage.setItem('device_type', 'web');
            }
          } */
        // check user login
        // if (is_login()) {
        //     alert('login');
        // } else {
        //     alert('logout');
        // }

        // login form data
        this.initialState = {
            form_data: { email: '', password: '' },
            forgot_form_data: { email: '' },
            register_form_data: { name: '', email: '', password: '' },
            otp_form_data: { otp: '' },
            forgot_password: 'none',
            sign_in_form: 'flex',
            sign_up_form: 'flex',
            cart_bag_number: '',
            otp_verification: 'none',
            user_name: user_name,
            redirect: '',
            error: '',
            loaded: true,
            lang_eng: false,
            lang_ar: false,
        }
        let current_url = window.location.href;

        setTimeout(() => {
            if (localStorage.getItem('current_language') && localStorage.getItem('current_language') == 'ar') {

                $("#lang_ar").prop('checked', true);
                $("#lang_eng").prop('checked', false);

            } else {
                $("#lang_ar").prop('checked', false);
                $("#lang_eng").prop('checked', true);
            }
        }, 1500);

        // if (localStorage.getItem('device_type')) {
        //     this.initialState.device_type = localStorage.getItem('device_type');
        // } else {
        //     this.initialState.device_type = 'web'
        //     localStorage.setItem('device_type', 'web');
        // }



        this.state = this.initialState;

        this.get_cart_count();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSaveData = this.handleSaveData.bind(this);
        this.handleForgot = this.handleForgot.bind(this);
        this.handleChangeforgot = this.handleChangeforgot.bind(this);
        this.handleOTP = this.handleOTP.bind(this);
        this.handleChangeOTP = this.handleChangeOTP.bind(this);
        this.handleChangeRegister = this.handleChangeRegister.bind(this);
        this.resendOTP = this.resendOTP.bind(this);
        this.openLoginModal = this.openLoginModal.bind(this);
        this.handleLoginWeb = this.handleLoginWeb.bind(this);
        this.handleChangeLanguageEnglish = this.handleChangeLanguageEnglish.bind(this);
        this.handleChangeLanguageArabic = this.handleChangeLanguageArabic.bind(this);

    }
    async File_Save_Option_Changed(event) {
        console.log(event);
    }

    handleLoginWeb(event) {
        var login = { 'action': 'login' };
        window?.sendDataToIos(login)
    }

    handleChangeLanguageEnglish(event) {
        alert('english');
        //check this checkbox is checked
        if (event.target.checked) {
            alert('checked');
        } else {
            alert('not checked');
        }
    }
    handleChangeLanguageArabic(event) {
        alert('english');
    }
    componentDidMount() {

        $('#lang_ar').change(function () {
            if ($(this).is(':checked')) {
                localStorage.setItem('current_language', 'ar')
                $('html').addClass('shorfa-rtl');
            }
        });
        $('#lang_eng').change(function () {
            if ($(this).is(':checked')) {
                localStorage.setItem('current_language', 'en')
                $('html').removeClass('shorfa-rtl');
            }
        });
        if (localStorage.email !== "") {
            var data = this.state.form_data['email'] = localStorage.email;
            this.setState({ data });
            var data = this.state.form_data['password'] = localStorage.password;
            this.setState({ data });
        }
    }


    async get_cart_count(props) {
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_cart_count';
        api_option.data = { user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    this.setState({ cart_bag_number: res.data.total });

                } else {
                    this.setState({ is_data: false });
                    // this.setState({ redirect: '/ProductList/' });
                }
            })
            .catch(error => {
                //  this.setState({ redirect: '/logout' });
            });
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

        e.preventDefault();

        window.$("#access-modal").modal("show")
    }


    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
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

    // handleSearch(event, id) {

    //     api_option.url = 'update_search';
    //     alert(event.target.value)
    //     api_option.data = { search: event.target.value };
    //     axios(api_option)
    //         .then(res => {
    //             this.setState({ loaded: true });
    //             const res_data = res.data;

    //             if (res_data.status) {
    //                 toast.success('Success');
    //             } else {
    //                 toast.error("Failed");
    //             }
    //         })

    // }


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
                    toast.success("Otp verification completed");
                    window.$('#access-modal').modal('hide');
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
                        window.location.href = '/shorfa/#/My-profile';

                    } else {
                        this.setState({ redirect: '/My-profile' });
                    }

                } else {
                    toast.error("Invalid Otp");
                }
            })
        // }
    }



    handleProfileData(event) {
        event.preventDefault();
        if (!this.validator.allValid()) {
            this.validator.showMessage();
            this.forceUpdate();
        } else {
            this.setState({ loaded: false });
            api_option.url = 'update_profile';
            api_option.data = this.state.form_data;
            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;

                    if (res_data.status) {
                        toast.success('Success');
                    } else {
                        toast.error("Failed");
                    }
                })
        }
    }

    // handleChange(event){
    //     event.preventDefault();
    //     api_option.url = 'change_password';
    //     api_option_.data = this.state.form_data;
    //     axios(api_option)
    //     .then(res => {
    //      const res_data = res.data;
    //      if(res_data.status){
    //          toast.success("Change password successfully")
    //      }else{
    //          toast.error("Password not matched")
    //      }
    //     })

    // }

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
                    window.$('#access-modal').modal('hide');
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



    // form submit event
    handleSubmit(event) {
        //var th = this;
        event.preventDefault();
        // validation.validate().then(function(status) {
        // if (!this.validator.allValid()) {
        //     this.validator.showMessages();
        //     this.forceUpdate();
        // } else {

        this.setState({ loaded: false });
        api_option.url = 'user_login';
        api_option.data = this.state.form_data;

        axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                const res_data = res.data;
                if (res_data.status) {
                    toast.success("Login Successfully");
                    localStorage.email = this.state.form_data.email;
                    localStorage.password = this.state.form_data.password;
                    localStorage.setItem('type', 1);
                    localStorage.removeItem('usr_id');
                    // localStorage.type = '1';

                    window.$('#access-modal').modal('hide');
                    this.state.form_data.email = '';
                    this.state.form_data.password = '';
                    setUserSession(res_data.users.token, res_data.users);
                    //this.setState({ redirect: '/My-profile' });
                    // window.location.href = '/shorfa/#/My-profile';
                    if (localStorage.getItem('device_type') == 'web') {
                        // window.location.href = '/shorfa/#/My-profile';
                        window.location.href = web_url + '#/My-profile';
                    } else {
                        this.setState({ redirect: '/My-profile' });
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

    // show_forgot_password
    show_forgot_password() {
        this.setState({ 'forgot_password': 'flex' })
        this.setState({ 'sign_in_form': 'none' })
    }


    // show_sign_in
    show_sign_in() {
        this.setState({ 'forgot_password': 'none' })
        this.setState({ 'sign_in_form': 'flex' })
    }

    // view load header page
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>
                <Helmet>
                    {/* <script src="/assets/js/bootstrap.min.js"></script> */}
                    <script src="/assets/js/jquery-3.2.1.min.js"></script>
                    <script src="/assets/js/custom.js?123"></script>
                    <script src="/assets/js/developer_signup_popup.js?12"></script>
                    <script src="/assets/js/dropdown_toggle.js"></script>
                    <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
                    <script src="/assets/js/home_init.js"></script>
                    <link rel="stylesheet" href="/assets/css/rtl.css" />
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
                <ToastContainer />
                <div className="custom-backdrop"></div>
                <div className="mobile-view mobile-header">
                    <div className="mobile-header-left">
                        <span className="menu-toggle header-link"><i className="bi-list"></i></span>
                        <NavLink className="navbar-brand" exact to="/"><img src="/assets/images/logo.png" /></NavLink>
                    </div>
                    <div className="mobile-header-right">
                        <span className="header-link search-toggle"><i className="bi-search"></i></span>

                        {!is_login() && <NavLink className="nav-link" exact to={'/Login/'}><i className="bi-bag"></i><span className="badge count"></span></NavLink>}
                        {is_login() && <NavLink className="nav-link" exact to={'/Cart/'}><i className="bi-bag"></i><span id="bag_count" className="badge count">{this.state.cart_bag_number}</span></NavLink>}

                        {/* <NavLink className="header-link" exact to={'/Login/'}><span className="header-link "><i className="bi-person"></i></span></NavLink> */}



                        {!is_login() && <a className="header-link" onClick={this.handleLoginWeb}><span className="header-link "><i className="bi-person"></i></span></a>}

                        {/* <span className="nav-link access-trigger" data-toggle="modal" data-target="#access-modal"><i className="bi-person"></i></span>
                        <span className="header-link upload-trigger"><i className="bi-plus"></i></span> */}
                    </div>
                </div>

                <div className="mobile-view mobile-footer">

                    <Link className="navbar-brand" exact to="/" ><i className="bi bi-house"></i><span>Home</span></Link>
                    {localStorage.getItem('type') == 3 && is_login() && <NavLink className="footer-link" exact to={'/My-account/'}><i className="bi bi-shop-window"></i>My Profile

                    </NavLink>}
                    {!is_login() && <NavLink className="footer-link" exact to={'/Seller-login/'}><i className="bi bi-shop-window"></i>Store

                    </NavLink>
                    }

                    {localStorage.getItem('type') == 2 && is_login() && <NavLink className="footer-link" exact to={'/Professional-profile/'}><i className="bi bi-briefcase"></i>My Profile
                    </NavLink>}
                    {!is_login() && <NavLink className="footer-link" exact to={'/Professional-login/'}><i className="bi bi-briefcase"></i>Professional

                    </NavLink>}

                    {/*
                    {localStorage.getItem('type') == 1
                        ? <li className="nav-item" ></li>
                        : [
                            (localStorage.getItem('type') == 3 && localStorage.getItem('type') != 2
                                ? <NavLink className="footer-link" exact to={'/My-account/'}><i className="bi bi-box"></i><b>Seller Profile</b>

                                </NavLink>
                                : <NavLink className="footer-link" exact to={'/Seller-signup/'}><i className="bi bi-box"></i><b>Sell Products</b>

                                </NavLink>
                            ),

                            (localStorage.getItem('type') == 2 && localStorage.getItem('type') != 3
                                ? <NavLink className="footer-link" exact to={'/Professional-profile/'}><i className="bi bi-box"></i><b>Professional Profile</b>

                                </NavLink>
                                : <NavLink className="footer-link" exact to={'/Professional-signup/'}><i className="bi bi-person-plus"></i><b>Become Professional</b>

                                </NavLink>
                            ),

                        ]
                    } */}
                    {!is_login() && <NavLink className="footer-link" exact to={'/Login/'}><i className="bi bi-person"></i><span>Profile</span></NavLink>}
                    {localStorage.getItem('type') == 1 && is_login() && <NavLink className="footer-link" exact to={'/My-profile/'}><i className="bi bi-person"></i><span>Profile</span></NavLink>}
                    {/* <a href="javascript:void(0)" className="footer-link"><i className="bi bi-person"></i><span>Profile</span></a> */}
                    <span className="footer-link upload-trigger"><span className="plus-icon"></span></span>
                </div>

                <div className="mobile-view mobile-menu">
                    <div className="mobile-menu-inner">
                        <div className="drawer-top">
                            <span className="close-drawer"><i className="bi bi-x"></i></span>
                            <img src="/assets/images/drawer-banner.jpg" />
                        </div>
                        <div className="drawer-links">
                            <ul className="accordion">
                                <li>
                                    <a className="ac-title icon-list"><i className="bi bi-view-list"></i>Inspirational ideas</a>
                                    <div className="ac-content">
                                        <div className="drawer-submenu">
                                            {localStorage.getItem('type') == 1 && is_login() && <NavLink exact to="/Living-Room/" href="javascript:void(0)">Rooms</NavLink>}

                                            {!is_login() && <a href="javascript:void(0)" onClick={this.openLoginModal}>Rooms</a>
                                            }

                                            {localStorage.getItem('type') == 1 && is_login() && <NavLink exact to="/Front-project-list/" href="javascript:void(0)">Project</NavLink>}

                                            {!is_login() && <a href="javascript:void(0)" onClick={this.openLoginModal}>Project</a>
                                            }

                                            {localStorage.getItem('type') == 1 && is_login() && <NavLink exact to="/knowhow/" href="javascript:void(0)">Know-How</NavLink>}

                                            {!is_login() && <a href="javascript:void(0)" onClick={this.openLoginModal}>Know-How</a>
                                            }

                                            {localStorage.getItem('type') == 1 && is_login() && <NavLink exact to="/living-experience-list/" href="javascript:void(0)">Living Experience</NavLink>}

                                            {!is_login() && <a href="javascript:void(0)" onClick={this.openLoginModal}>Living Experience</a>
                                            }
                                            {/* <a href="javascript:void(0)">Rooms</a>
                                            <a href="javascript:void(0)">Project</a>
                                            <a href="javascript:void(0)">Know-How</a>
                                            <a href="javascript:void(0)">Living Experience</a> */}
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <a className="ac-title icon-list"><i className="bi bi-shop"></i>Store</a>
                                    <div className="ac-content">
                                        <div className="drawer-submenu">
                                            {localStorage.getItem('type') == 3 && is_login() && <NavLink exact to="/shop-by-room" >Shop by Rooms</NavLink>}

                                            {!is_login() && <NavLink exact to="/Seller-login" >Shop by Room</NavLink>
                                            }

                                            {localStorage.getItem('type') == 3 && is_login() && <NavLink exact to="/shop-by-category" >Shop by Category</NavLink>}

                                            {!is_login() && <NavLink exact to="/Seller-login" >Shop by Category</NavLink>
                                            }

                                            {localStorage.getItem('type') == 3 && is_login() && <a href="javascript:void(0)">Best Seller</a>}

                                            {!is_login() && <a href="javascript:void(0)" onClick={this.openLoginModal}>Best Seller</a>
                                            }

                                            {localStorage.getItem('type') == 3 && is_login() && <a href="javascript:void(0)">Sale</a>}

                                            {!is_login() && <a href="javascript:void(0)" onClick={this.openLoginModal}>Sale</a>
                                            }
                                            {/* <a href="javascript:void(0)">Shop by Room</a>
                                            <a href="javascript:void(0)">Shop by Category</a>
                                            <a href="javascript:void(0)">Best Seller</a>
                                            <a href="javascript:void(0)">Sale</a> */}
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <a className="ac-title icon-list"><i className="bi bi-briefcase"></i>Professional</a>
                                    <div className="ac-content">
                                        <div className="drawer-submenu">
                                            <a href="javascript:void(0)">Design</a>
                                            <a href="javascript:void(0)">Renovation</a>
                                            <NavLink exact to="/Professional-category/" href="javascript:void(0)">Seriveces</NavLink>
                                            <a href="javascript:void(0)">Consultation</a>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                            {/* <a href="javascript:void(0)" className="icon-list"><i className="bi bi-box"></i>Sell Products</a> */}

                            <NavLink className="icon-list" exact to={'/Seller-login/'}><i className="bi bi-box"></i><b>Sell Products</b>

                            </NavLink>

                            <NavLink className="icon-list" exact to={'/Professional-login/'}><i className="bi bi-person-plus"></i><b>Become Professional</b>

                            </NavLink>



                            {/* <a href="javascript:void(0)" className="icon-list"><i className="bi bi-person-plus"></i>Become Professional</a> */}
                        </div>
                        <div className="menu-widget">
                            <div className="language-selector">
                                <div className="icon-list widget-title">Languages</div>
                                <div>
                                    <div className="form-option">
                                        <label className="foption">
                                            <input type="radio" name="language" />
                                            <span>English</span>
                                        </label>
                                    </div>
                                    <div className="form-option">
                                        <label className="foption">
                                            <input type="radio" name="language" />
                                            <span>عربي</span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="menu-widget">
                            <div className="icon-list widget-title">Currency</div>
                            <div className="widget-list currency-selector">
                                <div>
                                    <i className="bi-cash"></i>
                                    <strong>SAR</strong>
                                </div>
                                <i className="bi-chevron-right"></i>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bottom-drawer">
                    <span className="hide-drawer"></span>
                    <div className="bottom-drawer-inner">

                        {/* {localStorage.getItem('type') == 1
                            ? <li className="nav-item" ></li>
                            : [
                                (localStorage.getItem('type') == 3 && localStorage.getItem('type') != 2
                                    ? <NavLink className="icon-item" exact to={'/Upload-project/'}> <img src="/assets/images/upload-1.svg" /> <span>Upload a project</span>

                                    </NavLink>
                                    : <NavLink className="icon-item" exact to={'/Seller-login/'}> <img src="/assets/images/upload-1.svg" /> <span>Upload a project</span>

                                    </NavLink>
                                ),

                            ]
                        } */}

                        {is_login() && <NavLink className="icon-item" exact to={'/Upload-project/'}> <img src="/assets/images/upload-1.svg" /> <span>Upload a project</span>

                        </NavLink>}

                        {/* <a className="icon-item" href="javascript:void(0)">
                            <img src="/assets/images/upload-2.svg" />
                            <span>Share a Living Experience</span>
                        </a> */}
                        {(localStorage.getItem('type') == 1) && is_login() && <NavLink className="icon-item" exact to={'/write-know-how/'}><img src="/assets/images/upload-2.svg" />
                            <span>Share a Living Experience</span>
                        </NavLink>}
                        {(localStorage.getItem('type') == 3 || localStorage.getItem('type') == 2) && is_login() && <NavLink className="icon-item" exact to={'/write-know-how/'}><img src="/assets/images/upload-3.svg" />
                            <span>Write a Know How</span>
                        </NavLink>}
                        {/* <a className="icon-item" href="javascript:void(0)">
                            <img src="/assets/images/upload-3.svg" />
                            <span>Write a Know How</span>
                        </a> */}
                        {localStorage.getItem('type') == 1
                            ? <li className="nav-item" ></li>
                            : [
                                (localStorage.getItem('type') == 3 && localStorage.getItem('type') != 2
                                    ? <NavLink className="icon-item" exact to={'/Product/'}> <img src="/assets/images/upload-4.svg" /> <span>Upload a Product</span>

                                    </NavLink>
                                    : <NavLink className="icon-item" exact to={'/Seller-login/'}> <img src="/assets/images/upload-4.svg" /> <span>Upload a Product</span>

                                    </NavLink>
                                ),

                            ]
                        }
                        <NavLink className="icon-item" exact to={'/question-list/'}>
                            <img src="/assets/images/question.png" />
                            <span>Ask a Question</span>
                        </NavLink>
                    </div>
                </div>

                <div className="searchbar-wrapper">
                    <div className="container">
                        <div className="searchbar-container">
                            <i className="bi-search searchbar-icon"></i>
                            <input type="text" name="auto_search" placeholder="search..." />
                            <button className="search-close"><i className="bi-x"></i></button>
                        </div>
                    </div>
                </div>

                <nav className="navbar navbar-expand-md navbar-default">
                    <div className="container">
                        <NavLink className="navbar-brand" exact to="/">
                            <img src="/assets/images/logo.png" />
                        </NavLink>
                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="collapsibleNavbar">
                            {(localStorage.getItem('type') != 2 || localStorage.getItem('type') != 3) && <ul className="navbar-nav mx-auto">
                                <li className="nav-item dropdown megamenu">
                                    <a className="nav-link dropdown-toggle" href="javascript:void(0)" data-toggle="dropdown">Inspirational ideas</a>
                                    <div className="dropdown-menu">
                                        <div className="mega-container three">
                                            {/* {localStorage.getItem('type') == 1 && is_login() && <NavLink exact to="/Living-Room/" href="javascript:void(0)"><img src="/assets/images/menu-room.jpg" /><span>Rooms</span></NavLink>}
                                            {!is_login() && <a href="javascript:void(0)" onClick={this.openLoginModal}><img src="/assets/images/menu-room.jpg" /><span>Rooms</span></a>
                                            }

                                            {localStorage.getItem('type') == 1 && is_login() && <NavLink exact to="/Front-project-list/" href="javascript:void(0)"><img src="/assets/images/menu-project.jpg" /><span>Projects</span></NavLink>}
                                            {!is_login() && <a href="javascript:void(0)" onClick={this.openLoginModal}><img src="/assets/images/menu-project.jpg" /><span>Projects</span></a>
                                            }

                                            {localStorage.getItem('type') == 1 && is_login() && <NavLink exact to="/know-how-list/" href="javascript:void(0)"><img src="/assets/images/menu-knowhow.jpg" /><span>Know how</span></NavLink>}
                                            {!is_login() && <a href="javascript:void(0)" onClick={this.openLoginModal}><img src="/assets/images/menu-knowhow.jpg" /><span>Know how</span></a>
                                            }

                                            {localStorage.getItem('type') == 1 && is_login() && <NavLink exact to="/living-experience-list/" href="javascript:void(0)"><img src="/assets/images/menu-livingexperience.jpg" /><span>Living Experience</span></NavLink>}
                                            {!is_login() && <a href="javascript:void(0)" onClick={this.openLoginModal}><img src="/assets/images/menu-livingexperience.jpg" /><span>Living Experience</span></a>
                                            } */}
                                            {/* <NavLink exact to="/Living-Room/" href="javascript:void(0)"><img src="/assets/images/menu-room.jpg" /><span>Rooms</span></NavLink> */}


                                            <NavLink exact to="/Front-project-list/" href="javascript:void(0)"><span>Projects</span></NavLink>


                                            <NavLink exact to="/write-know-how/" href="javascript:void(0)"><span>Know how</span></NavLink>


                                            <NavLink exact to="/living-experience-list/" href="javascript:void(0)"><span>Living Experience</span></NavLink>


                                            {/* <a href="javascript:void(0)"><img src="/assets/images/menu-project.jpg" /><span>Projects</span></a>
                                            <a href="javascript:void(0)"><img src="/assets/images/menu-knowhow.jpg" /><span>Know how</span></a>
                                            <a href="javascript:void(0)"><img src="/assets/images/menu-livingexperience.jpg" /><span>Living Experience</span></a> */}
                                        </div>
                                    </div>
                                </li>
                                <li className="nav-item dropdown megamenu">
                                    <a className="nav-link dropdown-toggle" href="javascript:void(0)" data-toggle="dropdown">Shop products</a>
                                    <div className="dropdown-menu">
                                        <div className="mega-container four">

                                            {/* <NavLink exact to="/shop-by-room" ><img src="/assets/images/menu-shopbyroom.jpg" /><span>Shop by Room</span></NavLink>
                                            <a href="javascript:void(0)"><img src="/assets/images/menu-shopbycategory.jpg" /><span>Shop by Category</span></a>
                                            <a href="javascript:void(0)"><img src="/assets/images/menu-bestsellers.jpg" /><span>Best Sellers</span></a>
                                            <a href="javascript:void(0)"><img src="/assets/images/menu-sale.jpg" /><span>Sale</span></a> */}


                                            <NavLink exact to="/shop-by-room" ><span>Shop by Room</span></NavLink>
                                            <NavLink exact to="/shop-by-category" ><span>Shop by Category</span></NavLink>
                                            <NavLink exact to="/best-seller" ><span>Best Sellers</span></NavLink>
                                            <NavLink exact to="/sale-product" ><span>Sale</span></NavLink>
                                        </div>
                                    </div>
                                </li>
                                <li className="nav-item dropdown megamenu">
                                    <a className="nav-link dropdown-toggle" href="#" data-toggle="dropdown">Find experts</a>
                                    <div className="dropdown-menu">
                                        <div className="mega-container four">
                                            {/* {localStorage.getItem('type') == 2 && is_login() && <a href="javascript:void(0)"><img src="/assets/images/menu-design.jpg" /><span>Design</span></a>}
                                            {!is_login() && <NavLink exact to="/professional-login"><img src="/assets/images/menu-design.jpg" /><span>Design</span></NavLink>
                                            }
                                            {localStorage.getItem('type') == 2 && is_login() && <a href="javascript:void(0)"><img src="/assets/images/menu-renovation.jpg" /><span>Renovation</span></a>}
                                            {!is_login() && <NavLink exact to="/professional-login"><img src="/assets/images/menu-renovation.jpg" /><span>Renovation</span></NavLink>
                                            }
                                            {localStorage.getItem('type') == 2 && is_login() && <a href="javascript:void(0)"><img src="/assets/images/menu-services.jpg" /><span>Services</span></a>}
                                            {!is_login() && <NavLink exact to="/professional-login"><img src="/assets/images/menu-services.jpg" /><span>Services</span></NavLink>
                                            }
                                            {localStorage.getItem('type') == 2 && is_login() && <a href="javascript:void(0)"><img src="/assets/images/menu-consultation.jpg" /><span>Consultation</span></a>}
                                            {!is_login() && <NavLink exact to="/professional-login"><img src="/assets/images/menu-consultation.jpg" /><span>Consultation</span></NavLink>
                                            } */}

                                            {/* <a href="javascript:void(0)"><img src="/assets/images/menu-design.jpg" /><span>Design</span></a>
                                            <a href="javascript:void(0)"><img src="/assets/images/menu-renovation.jpg" /><span>Renovation</span></a>
                                            <NavLink exact to="/Professional-category/" href="javascript:void(0)"><img src="/assets/images/menu-services.jpg" /><span>Services</span></NavLink>

                                            <a href="javascript:void(0)"><img src="/assets/images/menu-consultation.jpg" /><span>Consultation</span></a> */}

                                            <a href="javascript:void(0)"><span>Design</span></a>
                                            <a href="javascript:void(0)"><span>Renovation</span></a>
                                            <NavLink exact to="/Professional-category/" href="javascript:void(0)"><span>Services</span></NavLink>

                                            <a href="javascript:void(0)"><span>Consultation</span></a>
                                        </div>
                                    </div>
                                </li>
                            </ul> || <ul className="navbar-nav mx-auto">
                                    <li className="nav-item dropdown megamenu">

                                        <div className="dropdown-menu">
                                            <div className="mega-container four">

                                            </div>
                                        </div>
                                    </li>
                                    <li className="nav-item dropdown megamenu">

                                        <div className="dropdown-menu">
                                            <div className="mega-container four">

                                            </div>
                                        </div>
                                    </li>
                                    <li className="nav-item dropdown megamenu">

                                        <div className="dropdown-menu">
                                            <div className="mega-container four">

                                            </div>
                                        </div>
                                    </li>
                                </ul>}
                            <ul className="navbar-nav right-navbar">
                                <li className="nav-item">
                                    <span className="nav-link search-toggle" data-target="#currency-pop"><i className="bi-search"></i></span>
                                </li>

                                <li className="nav-item">
                                    {localStorage.getItem('type') == 1 && !is_login() && <a className="nav-link" onClick={this.openLoginModal} ><i className="bi-bag"></i><span className="badge count"></span></a>}
                                    {localStorage.getItem('type') == 1 && is_login() && <NavLink className="nav-link" exact to={'/Cart/'} ><i className="bi-bag"></i><span id="bag_count" className="badge count">{this.state.cart_bag_number}</span></NavLink>}
                                </li>

                                {localStorage.getItem('type') == 1 && is_login() && <li className="nav-item">
                                    welcome, {this.state.user_name}
                                </li>}

                                {/* {is_login ? (
                                <li className="nav-item" >
                                <NavLink  className="icon-item" exact to={'/'}>  <span>Logout</span>

                                </NavLink>
                            </li>
                            ):( */}
                                {/* {localStorage.getItem('type') == 1 ? (


                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle no-caret" href="javascript:void(0)" data-toggle="dropdown">
                                            <i className="bi-person"></i>
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-right iconic">
                                            <NavLink className="icon-item" exact to={'/My-profile/'}>
                                                <img src="/assets/images/question.png" />
                                                <span>Profile</span>
                                            </NavLink>
                                        </div>
                                    </li>
                                ) : (

                                    <li className="nav-item" >
                                        <span className="nav-link access-trigger" data-toggle="modal" data-target="#access-modal"><i className="bi-person"></i></span>
                                    </li>

                                )} */}

                                {/*
                                {localStorage.getItem('type') == 1 && is_login() && <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle no-caret" href="javascript:void(0)" data-toggle="dropdown">
                                        <i className="bi-person"></i>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-right iconic">
                                        <NavLink className="icon-item" exact to={'/My-profile/'}>
                                            <img src="/assets/images/question.png" />
                                            <span>Profile</span>
                                        </NavLink>
                                    </div>
                                </li>} */}


                                {localStorage.getItem('type') == 1 && is_login() && <li className="nav-item dropdown">

                                    <NavLink className="icon-item nav-link" exact to={'/My-profile/'}>
                                        <i className="bi-person"></i>
                                    </NavLink>
                                </li>}
                                {!is_login() && <li className="nav-item" >
                                    <span className="nav-link access-trigger" onClick={this.openLoginModal}><i className="bi-person"></i></span>
                                </li>}
                                {/* {localStorage.getItem('type') == 1 && is_login() ? (
                                    <li className="nav-item dropdown">
                                        <a className="nav-link dropdown-toggle no-caret" href="javascript:void(0)" data-toggle="dropdown">
                                            <i className="bi-person"></i>
                                        </a>
                                        <div className="dropdown-menu dropdown-menu-right iconic">
                                            <NavLink className="icon-item" exact to={'/My-profile/'}>
                                                <img src="/assets/images/question.png" />
                                                <span>Profile</span>
                                            </NavLink>
                                        </div>
                                    </li>
                                ) : (
                                    <li className="nav-item" >
                                        <span className="nav-link access-trigger" data-toggle="modal" data-target="#access-modal"><i className="bi-person"></i></span>
                                    </li>
                                )} */}


                                {/* {localStorage.getItem('type') == 3 || localStorage.getItem('type') == 2
                                    ? <li className="nav-item" ></li>
                                    : [
                                        (localStorage.getItem('type') == 1
                                            ? <li className="nav-item dropdown">
                                                <a className="nav-link dropdown-toggle no-caret" href="javascript:void(0)" data-toggle="dropdown">
                                                    <i className="bi-person"></i>
                                                </a>
                                                <div className="dropdown-menu dropdown-menu-right iconic">
                                                    <NavLink className="icon-item" exact to={'/My-profile/'}>
                                                        <img src="/assets/images/question.png" />
                                                        <span>Profile</span>
                                                    </NavLink>
                                                </div>
                                            </li>
                                            : <li className="nav-item" >
                                                <span className="nav-link access-trigger" data-toggle="modal" data-target="#access-modal"><i className="bi-person"></i></span>
                                            </li>
                                        ),

                                    ]
                                } */}




                                {/* )} */}

                                <li className="nav-item dropdown">
                                    <span className="nav-link dropdown-toggle btn btn-primary" href="javascript:void(0)" data-toggle="dropdown">Upload</span>
                                    <div className="dropdown-menu dropdown-menu-right iconic">

                                        {is_login() && <NavLink className="icon-item" exact to={'/Upload-project/'}> <img src="/assets/images/upload-1.svg" /> <span>Upload a project</span>
                                        </NavLink>}

                                        {/* {localStorage.getItem('type') == 1
                                            ? <li className="nav-item" ></li>
                                            : [
                                                (localStorage.getItem('type') == 3 && localStorage.getItem('type') != 2
                                                    ? <NavLink className="icon-item" exact to={'/Upload-project/'}> <img src="/assets/images/upload-1.svg" /> <span>Upload a project</span>

                                                    </NavLink>
                                                    : <NavLink className="icon-item" exact to={'/Seller-login/'}> <img src="/assets/images/upload-1.svg" /> <span>Upload a project</span>

                                                    </NavLink>
                                                ),

                                            ]
                                        } */}

                                        {/* <a className="dropdown-item" href="javascript:void(0)">
                                            <img src="/assets/images/upload-2.svg" />
                                            <span>Share a Living Experience</span>
                                        </a>

                                        <a className="dropdown-item" href="javascript:void(0)">
                                            <img src="/assets/images/upload-3.svg" />
                                            <span>Write a Know How</span>
                                        </a> */}

                                        {localStorage.getItem('type') == 1 && is_login() && <NavLink className="dropdown-item" exact to={'/add-living-experience/'}><img src="/assets/images/upload-2.svg" />
                                            <span>Share a Living Experience</span>
                                        </NavLink>}
                                        {(localStorage.getItem('type') == 3 || localStorage.getItem('type') == 2) && is_login() && <NavLink className="dropdown-item" exact to={'/add-know-how/'}><img src="/assets/images/upload-3.svg" />
                                            <span>Write a Know How</span>
                                        </NavLink>}


                                        {localStorage.getItem('type') == 1
                                            ? <li className="dropdown-item" ></li>
                                            : [
                                                (localStorage.getItem('type') == 3 && localStorage.getItem('type') != 2
                                                    ? <NavLink className="icon-item" exact to={'/Product/'}> <img src="/assets/images/upload-4.svg" /> <span>Upload a Product</span>

                                                    </NavLink>
                                                    : <NavLink className="icon-item" exact to={'/Seller-login/'}> <img src="/assets/images/upload-4.svg" /> <span>Upload a Product</span>

                                                    </NavLink>
                                                ),

                                            ]
                                        }


                                        <NavLink className="dropdown-item" exact to={'/question-list/'}>
                                            <img src="/assets/images/question.png" />
                                            <span>Ask a Question</span>
                                        </NavLink>
                                    </div>
                                </li>
                                <li className="nav-item dropdown">
                                    <a className="nav-link dropdown-toggle no-caret" href="javascript:void(0)" data-toggle="dropdown">
                                        <i className="bi-list"></i>
                                    </a>
                                    <div className="dropdown-menu dropdown-menu-right">
                                        <div className="moreMenu-wrapper">
                                            <div className="menu-widget">
                                                <div className="language-selector">
                                                    <div className="widget-title">Languages</div>
                                                    <div id="google_translate_element"></div>
                                                    {/* <div>
                                                        <div className="form-option">
                                                            <label className="foption sm">
                                                                <input type="radio" id="lang_eng" name="language" />
                                                                <span>English</span>
                                                            </label>

                                                        </div>


                                                        <div className="form-option">
                                                            <label className="foption sm">
                                                                <input type="radio" id="lang_ar" name="language" />
                                                                <span>عربي</span>
                                                            </label>

                                                        </div>
                                                    </div> */}
                                                </div>
                                            </div>
                                            <div className="menu-widget">
                                                <div className="widget-list currency-selector" data-toggle="modal" data-target="#currency-pop">
                                                    <div>
                                                        <i className="bi-cash" ></i>
                                                        <strong>SAR</strong>
                                                    </div>
                                                    <i className="bi-chevron-right"></i>
                                                </div>
                                            </div>
                                            <div className="menu-widget">
                                                <div className="widget-links">
                                                    {/* {localStorage.getItem('type') == 3 && is_login() && <NavLink className="icon-list" exact to={'/My-account/'}><i className="bi bi-box"></i><b>Seller Profile</b>
                                                    </NavLink>}
                                                    {!is_login() && <NavLink className="icon-list" exact to={'/seller-login/'}><i className="bi bi-box"></i><b>Sell Products</b>
                                                    </NavLink>
                                                    }

                                                    {localStorage.getItem('type') == 2 && is_login() && <NavLink className="icon-list" exact to={'/Professional-profile/'}><i className="bi bi-box"></i><b>Professional Profile</b>
                                                    </NavLink>}
                                                    {!is_login() && <NavLink className="icon-list" exact to={'/Professional-login/'}><i className="bi bi-person-plus"></i><b>Become Professional</b>
                                                    </NavLink>} */}
                                                    {/* {localStorage.getItem('type') == 1
                                                        ? <li className="nav-item" ></li>
                                                        : [
                                                            (localStorage.getItem('type') == 3
                                                                ? <NavLink className="icon-list" exact to={'/My-account/'}><i className="bi bi-box"></i><b>Seller Profile</b>

                                                                </NavLink>
                                                                : <NavLink className="icon-list" exact to={'/Seller-signup/'}><i className="bi bi-box"></i><b>Sell Products</b>

                                                                </NavLink>
                                                            ),

                                                            (localStorage.getItem('type') == 2
                                                                ? <NavLink className="icon-list" exact to={'/Professional-profile/'}><i className="bi bi-box"></i><b>Professional Profile</b>

                                                                </NavLink>
                                                                : <NavLink className="icon-list" exact to={'/Professional-signup/'}><i className="bi bi-person-plus"></i><b>Become Professional</b>

                                                                </NavLink>
                                                            ),

                                                        ]
                                                    } */}



                                                    {/* {localStorage.getItem('type') == 1
                                                        ? <li className="nav-item" ></li>
                                                        : [
                                                            localStorage.getItem('type') == 3
                                                                ? <NavLink className="icon-list" exact to={'/My-account/'}><i className="bi bi-box"></i><b>Seller Profile</b>

                                                                </NavLink>

                                                                : [

                                                                    localStorage.getItem('type') == 2
                                                                        ? <NavLink className="icon-list" exact to={'/Professional-profile/'}><i className="bi bi-box"></i><b>Professional Profile</b>

                                                                        </NavLink>
                                                                        :
                                                                        <NavLink className="icon-list" exact to={'/Professional-signup/'}><i className="bi bi-person-plus"></i><b>Become Professional</b>

                                                                        </NavLink>
                                                                ]
                                                        ]
                                                    } */}


                                                    {/* <a href="javascript:void(0)" className="icon-list"><i className="bi bi-box"></i><b>Sell Products</b></a> */}
                                                    {/* <NavLink  className="icon-list" exact to={'/Professional-signup/'}><i className="bi bi-person-plus"></i><b>Become Professional</b>

                                                </NavLink> */}
                                                    {/* <a href="javascript:void(0)" className="icon-list"><i className="bi bi-person-plus"></i><b>Become Professional</b></a> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </nav >

                <div class="modal fade" id="access-modal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog md" role="document">
                        <div class="modal-content">
                            <div class="access-container login-popup">
                                <div class="container" id="container">
                                    <div class="form-container sign-up-container" style={{ display: this.state.sign_up_form }}>
                                        <form className="form" id="kt_login_signin_form" onSubmit={this.handleSaveData}>
                                            <h5 class="title">Create Account</h5>
                                            <div class="social-container">
                                                <a href="javascript:void(0)" class="social"><i class="bi bi-google"></i></a>
                                                <a href="javascript:void(0)" class="social"><i class="bi bi-facebook"></i></a>
                                                <a href="javascript:void(0)" class="social"><i class="bi bi-twitter"></i></a>
                                            </div>
                                            <span>or use your email for registration</span>
                                            <div class="access-input-group">
                                                <input type="text" name="name" id="name" placeholder="Name" data-validation="required" value={this.state.register_form_data.name} onChange={this.handleChangeRegister} />
                                                <input type="email" name="email" id="email" placeholder="Email" data-validation="required email" value={this.state.register_form_data.email} onChange={this.handleChangeRegister} />
                                                <input type="password" name="password" id="password" placeholder="Password" data-validation="required" value={this.state.register_form_data.password} onChange={this.handleChangeRegister} />
                                                <input type="text" name="zone" id="zone" placeholder="Zone" data-validation="required" value={this.state.register_form_data.zone} onChange={this.handleChangeRegister} />
                                                <input type="text" name="area" id="area" placeholder="Area" data-validation="required" value={this.state.register_form_data.area} onChange={this.handleChangeRegister} />
                                                <input type="text" name="pincode" id="pincode" placeholder="Pincode" data-validation="required" value={this.state.register_form_data.pincode} onChange={this.handleChangeRegister} />

                                            </div>
                                            <button class="btn btn-primary">Sign Up</button>
                                        </form>
                                    </div>
                                    <div class="form-container sign-up-container" style={{ display: this.state.otp_verification }}>
                                        <form className="form w-100" id="kt_login_signin_form" onSubmit={this.handleOTP}>

                                            <span>OTP Verification</span>
                                            <div class="access-input-group w-100">
                                                <input type="text" maxLength="4" required name="otp" id="otp" placeholder="OTP" data-validation="required" value={this.state.otp_form_data.otp} onChange={this.handleChangeOTP} />
                                            </div>
                                            <button class="btn btn-primary">Verify OTP</button>
                                            {/* <button class="btn btn-success" style={{ marginLeft: "180px", marginTop: "10px" }} onClick={this.resendOTP}>Resend OTP</button> */}
                                            <a onClick={this.resendOTP} style={{ marginTop: "10px", cursor: "pointer" }}>Don't receive the OTP? Resend OTP</a>
                                        </form>
                                    </div>
                                    <div class="form-container sign-in-container" style={{ display: this.state.sign_in_form }}>
                                        <form className="form" id="kt_login_signin_form" onSubmit={this.handleSubmit}>
                                            <h5 class="title">Sign in</h5>
                                            <div class="social-container">
                                                <a href="javascript:void(0)" class="social"><i class="bi bi-google"></i></a>
                                                <a href="javascript:void(0)" class="social"><i class="bi bi-facebook"></i></a>
                                                <a href="javascript:void(0)" class="social"><i class="bi bi-twitter"></i></a>
                                            </div>
                                            <span>or use your account</span>
                                            <div class="access-input-group">
                                                <input type="text" placeholder="Email" name="email" id="email" data-validation="required email" value={this.state.form_data.email} onChange={this.handleChange} />
                                                {this.validator.message('email', this.state.form_data.email, 'required')}
                                                <input type="password" placeholder="Password" name="password" id="password" value={this.state.form_data.password} onChange={this.handleChange} data-validation="required" />
                                                {this.validator.message('password', this.state.form_data.password, 'required')}
                                            </div>
                                            <a href="javascript:void(0)" onClick={this.show_forgot_password.bind(this)} class="pw-recover">Forgot your password?</a>

                                            <button class="btn btn-primary">Sign In</button>
                                        </form>
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
                                                <button class="btn btn-outline" id="signIn">Sign In</button>
                                            </div>
                                            <div class="overlay-panel overlay-right">
                                                <h5 class="title">Hello, Friend!</h5>
                                                <p>Enter your personal details and start journey with us</p>
                                                <button class="btn btn-outline" id="signUp">Sign Up</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="modal fade" id="language-pop" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-sm" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h6 className="modal-title" id="exampleModalLabel">Choose Language</h6>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body p-0">
                                <div className="modal-scroller">
                                    <div className="modal-search" >
                                        <i className="bi bi-search"></i>
                                        <input type="text" name="" placeholder="search" />
                                    </div>
                                    <div className="modal-options">
                                        <div className="form-option">
                                            <label className="foption">
                                                <input type="radio" name="currency" />
                                                <span>Arabic</span>
                                            </label>
                                        </div>
                                        <div className="form-option">
                                            <label className="foption">
                                                <input type="radio" name="currency" checked />
                                                <span>English</span>
                                            </label>
                                        </div>
                                        <div className="form-option">
                                            <label className="foption">
                                                <input type="radio" name="currency" />
                                                <span>Spanish</span>
                                            </label>
                                        </div>
                                        <div className="form-option">
                                            <label className="foption">
                                                <input type="radio" name="currency" />
                                                <span>French</span>
                                            </label>
                                        </div>
                                        <div className="form-option">
                                            <label className="foption">
                                                <input type="radio" name="currency" />
                                                <span>German</span>
                                            </label>
                                        </div>
                                        <div className="form-option">
                                            <label className="foption">
                                                <input type="radio" name="currency" />
                                                <span>Hindi</span>
                                            </label>
                                        </div>
                                        <div className="form-option">
                                            <label className="foption">
                                                <input type="radio" name="currency" />
                                                <span>Russian</span>
                                            </label>
                                        </div>
                                        <div className="form-option">
                                            <label className="foption">
                                                <input type="radio" name="currency" />
                                                <span>Portuguese</span>
                                            </label>
                                        </div>
                                        <div className="form-option">
                                            <label className="foption">
                                                <input type="radio" name="currency" />
                                                <span>Korean</span>
                                            </label>
                                        </div>
                                        <div className="form-option">
                                            <label className="foption">
                                                <input type="radio" name="currency" />
                                                <span>Italian</span>
                                            </label>
                                        </div>
                                        <div className="form-option">
                                            <label className="foption">
                                                <input type="radio" name="currency" />
                                                <span>Wu Chinese</span>
                                            </label>
                                        </div>
                                        <div className="form-option">
                                            <label className="foption">
                                                <input type="radio" name="currency" />
                                                <span>Turkish</span>
                                            </label>
                                        </div>
                                        <div className="form-option">
                                            <label className="foption">
                                                <input type="radio" name="currency" />
                                                <span>Egyptian Arabic</span>
                                            </label>
                                        </div>
                                    </div>
                                    <button type="button" className="btn btn-primary">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal fade" id="currency-pop" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog modal-sm" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h6 className="modal-title" id="exampleModalLabel">Choose Currency</h6>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body p-0">
                                <div className="modal-scroller">
                                    <div className="modal-search">
                                        <i className="bi bi-search"></i>
                                        <input type="text" name="" placeholder="search" />
                                    </div>
                                    <div className="modal-options">
                                        <div className="form-option">
                                            <label className="foption">
                                                <input type="radio" name="language" />
                                                <span>SAR</span>
                                            </label>
                                        </div>
                                        <div className="form-option">
                                            <label className="foption">
                                                <input type="radio" name="language" checked />
                                                <span>OMR</span>
                                            </label>
                                        </div>
                                        <div className="form-option">
                                            <label className="foption">
                                                <input type="radio" name="language" />
                                                <span>AED</span>
                                            </label>
                                        </div>
                                        <div className="form-option">
                                            <label className="foption">
                                                <input type="radio" name="language" />
                                                <span>USD</span>
                                            </label>
                                        </div>
                                    </div>
                                    <button type="button" className="btn btn-primary">Save</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }
}
export default Light_header;
