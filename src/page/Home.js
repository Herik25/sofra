import React, { Component } from 'react';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { api_option, currency, setUserSession, is_login, removeUserSession, getUserDetail, web_url, google_data, google_login, facebook_data, facebook_login } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery';
import { Helmet } from "react-helmet";
import Loader from "react-loader";
import { appendScript } from '../utils/appendScript'
import InstagramEmbed from 'react-instagram-embed';
//import { googleTranslate } from "./utils/googleTranslate";
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
/* Firebase Auth */
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, createUserWithEmailAndPassword, FacebookAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult } from "firebase/auth";
/* Firebase Auth End */

class Home extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        //console.log(this.props)
        const device_type = this.props.match.params.device_type;
        if (this.props.match.params.device_type) {
            localStorage.setItem('device_type', device_type);
        } else {

            //localStorage.setItem('device_type', 'web');
        }




        this.get_latest_product();
        this.get_form_data();
        this.get_cms_data();

        this.get_project();
        this.get_featured_product_data();
        this.get_bestseller_product_data();
        this.get_homepage_data();
        //this.get_category();
        this.get_home_category();
        this.get_home_banner();
        this.get_client_logo();
        this.get_instagram_data();



        this.initialState = {
            country: '',
            login_form_data: { email: '', password: '' },
            forgot_form_data: { email: '' },
            register_form_data: { name: '', email: '', mobile: '', password: '', country_id: '', governance_id: '', zone_id: '' },
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
            country: '',
            governance_list: [],
            governance_list_new: [],
            zone_list: [],
            zone_list_new: [],
            form_data: {
                banner_data: '',
                latest_product_data: '',
                bestseller_product_data: '',
                featured_product_data: '',
                category_data: '',
                front_banner_data: '',
                clientlogo_data: '',
                instagram_data: '',
                project_data: '',
                home_data: '',
            },
            error: '',
            loaded: true,
            currency_popup_show: false,
        }

        this.state = this.initialState;

        this.openLoginModal = this.openLoginModal.bind(this);
        this.hideLoginModal = this.hideLoginModal.bind(this);
        this.showSignInPortion = this.showSignInPortion.bind(this);
        this.showSignUpPortion = this.showSignUpPortion.bind(this);
        this.handleLoginWeb = this.handleLoginWeb.bind(this);

        this.handleSubmitLogin = this.handleSubmitLogin.bind(this);
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

        this.openCurrencyModal = this.openCurrencyModal.bind(this);
        this.hideCurrencyModal = this.hideCurrencyModal.bind(this);

        /* this.facebook_data();
        this.google_data(); */

        /*  facebook_data();
         google_data(); */

        facebook_data();
        google_data();

    }

    google_data() {
        const firebaseConfig = {
            apiKey: "AIzaSyAzlldGSD78UvvFxegvm4-GmgdKNljC2-I",
            authDomain: "shorfa-app.firebaseapp.com",
            projectId: "shorfa-app",
            storageBucket: "shorfa-app.appspot.com",
            messagingSenderId: "433272863687",
            appId: "1:433272863687:web:b60a38715288d5d02d77e2",
            measurementId: "G-BMZ55R2XKS"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        console.log("Sdfsdfsd 1");

        getRedirectResult(auth)
            .then((result) => {
                console.log("Sdfsdfsd 12", result);
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;

                const user = result.user;

                var email = "";
                var displayname = "";
                var facebook_uid = "";
                var phonenumber = "";
                if (user.providerData[0].email != undefined && user.providerData[0].email && user.providerData[0].email != "") {
                    email = user.providerData[0].email;
                }
                if (user.providerData[0].displayName != undefined && user.providerData[0].displayName && user.providerData[0].displayName != "") {
                    displayname = user.providerData[0].displayName;
                }
                if (user.providerData[0].uid != undefined && user.providerData[0].uid && user.providerData[0].uid != "") {
                    facebook_uid = user.providerData[0].uid;
                }
                if (user.providerData[0].phoneNumber != undefined && user.providerData[0].phoneNumber && user.providerData[0].phoneNumber != "") {
                    phonenumber = user.providerData[0].phoneNumber;
                }

                console.log(email);
                console.log(displayname);
                console.log(facebook_uid);
                console.log(phonenumber);

                /*  */
                var user_data = getUserDetail();
                var login_id = user_data ? user_data.u_id : '';
                api_option.url = 'social_signin';
                api_option.data = { displayname: displayname, phonenumber: phonenumber, email: email, facebook_uid: facebook_uid };
                api_option.headers.Authorization = sessionStorage.getItem('token');
                const th = this;
                axios(api_option)
                    .then(res => {
                        this.setState({ loaded: true });
                        const res_data = res.data;
                        if (res_data.status) {
                            // alert("123", res_data.status);
                            console.log("sdfsdfsjdlkj ", res_data.users);
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

                                //window.location.href = web_url;
                                //window.location.href = web_url + 'productdetail/' + this.props.match.params.product_id;

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
                                //window.location.href = web_url;
                                // window.location.href = web_url + 'productdetail/' + this.props.match.params.product_id;
                            }

                        } else {
                            toast.error(res_data.message);
                            this.setState({ error: res_data.message });
                        }
                        this.setState({ button_disabled: false });
                    })
                    .catch(error => {
                        // this.setState({ redirect: '/logout' });
                    });
                /*  */

                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;

                console.log(errorCode);
                console.log(errorMessage);
                // The email of the user's account used.
                //const email = error.customData.email;
                // AuthCredential type that was used.
                //const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
            });

    }

    google_login() {
        console.log("dsfsdfsd");
        /* Firebase Auth */
        const firebaseConfig = {
            apiKey: "AIzaSyAzlldGSD78UvvFxegvm4-GmgdKNljC2-I",
            authDomain: "shorfa-app.firebaseapp.com",
            projectId: "shorfa-app",
            storageBucket: "shorfa-app.appspot.com",
            messagingSenderId: "433272863687",
            appId: "1:433272863687:web:b60a38715288d5d02d77e2",
            measurementId: "G-BMZ55R2XKS"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);

        const auth = getAuth(app);
        /* createUserWithEmailAndPassword(auth, 'vishal@gteches.net', '3x64mzmk3v5v76d')
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log("uu ", user);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            }); */

        const provider = new GoogleAuthProvider();

        signInWithRedirect(auth, provider)
            .then((result) => {
                // The signed-in user info.
                const user = result.user;
                console.log(user);
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.

                const credential = GoogleAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;

                // IdP data available using getAdditionalUserInfo(result)
                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log(errorCode);
                console.log(errorMessage);
                // ...
            });

        /* Firebase Auth End */
    }

    facebook_data() {
        const firebaseConfig = {
            apiKey: "AIzaSyAzlldGSD78UvvFxegvm4-GmgdKNljC2-I",
            authDomain: "shorfa-app.firebaseapp.com",
            projectId: "shorfa-app",
            storageBucket: "shorfa-app.appspot.com",
            messagingSenderId: "433272863687",
            appId: "1:433272863687:web:b60a38715288d5d02d77e2",
            measurementId: "G-BMZ55R2XKS"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        getRedirectResult(auth)
            .then((result) => {
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;

                const user = result.user;
                console.log(user);

                var email = "";
                var displayname = "";
                var facebook_uid = "";
                var phonenumber = "";
                if (user.providerData[0].email != undefined && user.providerData[0].email && user.providerData[0].email != "") {
                    email = user.providerData[0].email;
                }
                if (user.providerData[0].displayName != undefined && user.providerData[0].displayName && user.providerData[0].displayName != "") {
                    displayname = user.providerData[0].displayName;
                }
                if (user.providerData[0].uid != undefined && user.providerData[0].uid && user.providerData[0].uid != "") {
                    facebook_uid = user.providerData[0].uid;
                }
                if (user.providerData[0].phoneNumber != undefined && user.providerData[0].phoneNumber && user.providerData[0].phoneNumber != "") {
                    phonenumber = user.providerData[0].phoneNumber;
                }

                console.log(email);
                console.log(displayname);
                console.log(facebook_uid);
                console.log(phonenumber);

                /*  */
                var user_data = getUserDetail();
                var login_id = user_data ? user_data.u_id : '';
                api_option.url = 'social_signin';
                api_option.data = { displayname: displayname, phonenumber: phonenumber, email: email, facebook_uid: facebook_uid };
                api_option.headers.Authorization = sessionStorage.getItem('token');
                const th = this;
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

                                window.location.href = web_url;
                                //window.location.href = web_url + 'productdetail/' + this.props.match.params.product_id;

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
                                window.location.href = web_url;
                                // window.location.href = web_url + 'productdetail/' + this.props.match.params.product_id;
                            }

                        } else {
                            toast.error(res_data.message);
                            this.setState({ error: res_data.message });
                        }
                        this.setState({ button_disabled: false });
                    })
                    .catch(error => {
                        // this.setState({ redirect: '/logout' });
                    });
                /*  */

                /*  {
                     "uid": "d0qp2eTUZhWzIM5Jh9yqkZr5GLE3",
                     "email": "pradip.ahuja@gmail.com",
                     "emailVerified": false,
                     "displayName": "Pradip Ahujaa",
                     "isAnonymous": false,
                     "photoURL": "https://graph.facebook.com/3494500214155520/picture",
                     "providerData": [
                         {
                             "providerId": "facebook.com",
                             "uid": "3494500214155520",
                             "displayName": "Pradip Ahujaa",
                             "email": "pradip.ahuja@gmail.com",
                             "phoneNumber": null,
                             "photoURL": "https://graph.facebook.com/3494500214155520/picture"
                         }
                     ],
                     "stsTokenManager": {
                         "refreshToken": "APJWN8fMmneMt2djMskD_F-zMlkFbfdVWiK4AJjI201QoC6w9fAl0GogWou0x9fxC8llcAvCG0Sy9sK8zy3ifxsoZfLTLwZNsPPl4QN5w51W4_Kl3py8lXDSYT8WIwFLShUfoDRDuVjI0_-40Ur-wCqOw56U960NTQoeZXsTswUgphHUtid4BvyQiYKJG3sIC4GEiGZJ9M9z8vMW2lvUnNEjHlVzAllKarqHe3ZGHP4jT9RK2rh0P5CwwMFaPfq4-_HkMrURuq2KN7kWEwh_wI40Rkwc58CviS2F5QAuqfEDhw-8tAUmuzBf2RfwyuzvM9NXJN18deDKe81W0JmPBoCfIi12_XfOwrwoB1EV59EMBVyn0hrTM-A",
                         "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImM4MjNkMWE0MTg5ZjI3NThjYWI4NDQ4ZmQ0MTIwN2ViZGZhMjVlMzkiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiUHJhZGlwIEFodWphYSIsInBpY3R1cmUiOiJodHRwczovL2dyYXBoLmZhY2Vib29rLmNvbS8zNDk0NTAwMjE0MTU1NTIwL3BpY3R1cmUiLCJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vc2hvcmZhLWUzNDJlIiwiYXVkIjoic2hvcmZhLWUzNDJlIiwiYXV0aF90aW1lIjoxNjgxMTI3NjA3LCJ1c2VyX2lkIjoiZDBxcDJlVFVaaFd6SU01Smg5eXFrWnI1R0xFMyIsInN1YiI6ImQwcXAyZVRVWmhXeklNNUpoOXlxa1pyNUdMRTMiLCJpYXQiOjE2ODExMjc2MDcsImV4cCI6MTY4MTEzMTIwNywiZW1haWwiOiJwcmFkaXAuYWh1amFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImZhY2Vib29rLmNvbSI6WyIzNDk0NTAwMjE0MTU1NTIwIl0sImVtYWlsIjpbInByYWRpcC5haHVqYUBnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJmYWNlYm9vay5jb20ifX0.GajMQaH0s1pLlLz8p-5IZm7Z52paMXFOOSuwg5xyQWGSYRhLfUL_VyavKWGsAAGxntDo3YW1Ej9B4C0taEfSu2gzKD7z5xQ_etMuNjRIB6gP7B8Sy2XW1DkYutor4H-5qY29rSHXwz5fdTeosB88hzSAsKYvKvb16S1WyYXanqFjGXjFnhTrupaAzdolXS4_CH0hcjVVsgK4sy7FZfkeGiIm1yocN1fM70iOvGaoxzJQaJ6V0_4t9d3EGUm91W1x5hPHzWiGC4PvmS9Oxw1DJMXPDSmo01NXZLh6dK1ARXis34Q4IWbdQgsEnGTG34ZRI9Uot58CYBV8n8f_2_HJ5A",
                         "expirationTime": 1681131208582
                     },
                     "createdAt": "1681125521704",
                     "lastLoginAt": "1681127607685",
                     "apiKey": "AIzaSyCFGalumvkQncR_vsKo3ZiV1XDRaX7x2ns",
                     "appName": "[DEFAULT]"
                 } */

                // IdP data available using getAdditionalUserInfo(result)
                // ...
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(error);
                console.log(errorCode);
                console.log(errorMessage);
                // The email of the user's account used.
                //const email = error.customData.email;
                // AuthCredential type that was used.
                //const credential = FacebookAuthProvider.credentialFromError(error);
                // ...
            });

    }
    facebook_login() {
        console.log("dsfsdfsd");
        /* Firebase Auth */
        const firebaseConfig = {
            apiKey: "AIzaSyAzlldGSD78UvvFxegvm4-GmgdKNljC2-I",
            authDomain: "shorfa-app.firebaseapp.com",
            projectId: "shorfa-app",
            storageBucket: "shorfa-app.appspot.com",
            messagingSenderId: "433272863687",
            appId: "1:433272863687:web:b60a38715288d5d02d77e2",
            measurementId: "G-BMZ55R2XKS"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);

        const auth = getAuth(app);
        /* createUserWithEmailAndPassword(auth, 'vishal@gteches.net', '3x64mzmk3v5v76d')
            .then((userCredential) => {
                // Signed in
                const user = userCredential.user;
                console.log("uu ", user);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                // ..
            }); */

        const provider = new FacebookAuthProvider();

        signInWithRedirect(auth, provider)
            .then((result) => {
                // The signed-in user info.
                const user = result.user;
                console.log(user);
                // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;

                // IdP data available using getAdditionalUserInfo(result)
                // ...
            })
            .catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.customData.email;
                // The AuthCredential type that was used.
                const credential = FacebookAuthProvider.credentialFromError(error);
                console.log(errorCode);
                console.log(errorMessage);
                // ...
            });

        /* Firebase Auth End */
    }


    openCurrencyModal(e) {
        e.preventDefault();
        console.log("m", 1);
        this.setState({ currency_popup_show: true });
    }
    hideCurrencyModal(e) {
        this.setState({ currency_popup_show: false });
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

                        window.location.href = web_url;
                        //window.location.href = web_url + 'productdetail/' + this.props.match.params.product_id;

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
                        window.location.href = web_url;
                        // window.location.href = web_url + 'productdetail/' + this.props.match.params.product_id;
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

    componentDidMount() {
        //appendScript("/assets/js/jquery-3.2.1.min.js" + "?ts=" + new Date().getTime());
        //appendScript("https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" + "?ts=" + new Date().getTime());
        //appendScript("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" + "?ts=" + new Date().getTime());
        appendScript("https://unpkg.com/swiper/swiper-bundle.min.js" + "?ts=" + new Date().getTime());
        appendScript("/assets/js/dropdown_toggle.js" + "?ts=" + new Date().getTime());
        appendScript("/assets/js/developer_signup_popup.js" + "?ts=" + new Date().getTime());
        appendScript("/assets/js/home_init.js" + "?ts=" + new Date().getTime());
        appendScript("/assets/js/custom.js" + "?ts=" + new Date().getTime());
        // $('script').each(function () {
        //     if (this.src === 'http://192.168.100.210:3000/assets/js/jquery-3.2.1.min.js') {
        //         $(this).remove();
        //     }
        //     // if (this.src === 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js') {
        //     //     $(this).remove();
        //     // }
        //     if (this.src === 'http://192.168.100.210:3000/assets/js/bootstrap.min.js') {
        //         $(this).remove();
        //     }
        // });
        // var referenceNode = document.querySelector('#root');

        // const script2 = document.createElement("script");

        // script2.src = "/assets/js/bootstrap.min.js";


        // //document.body.appendChild(script2);
        // referenceNode.after(script2);



        // const script = document.createElement("script");

        // script.src = "/assets/js/jquery-3.2.1.min.js";


        // referenceNode.after(script);
        // //document.body.appendChild(script);



    }
    /* openLoginModal(e) {

        e.preventDefault();
        window.$("#access-modal").modal("show")
    } */
    handleFavourite(event, pid, sellerid) {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'add_to_favourite';
        api_option.data = { product_id: pid, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        axios(api_option)
            .then(res => {
                if (res.data.status) {

                    toast.success(res.data.message);
                    th.get_latest_product();
                    th.get_bestseller_product_data();
                    th.featured_product_data();
                    // th.setState({ redirect: '/productdetail/' + product_id });


                } else {
                    toast.error(res.data.message);
                    th.get_latest_product();
                    th.get_bestseller_product_data();
                    th.featured_product_data();

                    // this.setState({ redirect: '/logout' });

                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }



    async get_project() {
        this.setState({ loaded: false });
        api_option.url = 'get_project';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {
                    var project_data = res.data.data;
                    this.setState(this.initialState.form_data.project_data = project_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_latest_product() {

        var user_data = getUserDetail();
        var login_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_latest_product';
        api_option.data = { login_id: login_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var latest_product_data = res.data.data;
                    this.setState(this.initialState.form_data.latest_product_data = latest_product_data);
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_bestseller_product_data() {
        api_option.url = 'get_bestseller_product_data';

        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var bestseller_product_data = res.data.data;
                    this.setState(this.initialState.form_data.bestseller_product_data = bestseller_product_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    // async get_category() {
    //     api_option.url = 'get_category';
    //     api_option.headers.Authorization = sessionStorage.getItem('token');
    //     const th = this;
    //     await axios(api_option)
    //         .then(res => {
    //             if (res.data.status) {
    //                 var category_data = res.data.data;
    //                 this.setState(this.initialState.form_data.category_data = category_data);

    //             } else {
    //                 this.setState({ redirect: '/logout' });
    //             }
    //         })
    //         .catch(error => {
    //             this.setState({ redirect: '/logout' });
    //         });
    // }
    async get_home_category() {
        api_option.url = 'get_home_category';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var category_data = res.data.data;
                    this.setState(this.initialState.form_data.category_data = category_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    /* async get_instagram_feed() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://i.instagram.com/api/v1/api/v1/feed/timeline",
            "method": "GET",
            "headers": {},
            "data": ""
          }

          $.ajax(settings).done(function (response) {
            console.log(response);
          });

        api_option.url = 'get_instagram_data';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    } */
    async get_homepage_data() {

        api_option.url = 'get_front_homepage_list';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {

                if (res.data.status) {
                    var category_data = res.data.data;

                    this.setState(this.initialState.form_data.home_data = category_data[0]);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_featured_product_data() {
        api_option.url = 'get_featured_product_data';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var featured_product_data = res.data.data;

                    this.setState(this.initialState.form_data.featured_product_data = featured_product_data);


                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_form_data() {
        api_option.url = 'get_front_banner_list';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    var banner_data = res.data.data;
                    this.setState(this.initialState.form_data.banner_data = banner_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }


    async get_home_banner() {
        api_option.url = 'get_front_bannerads_list';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var banner_data = res.data.data;

                    this.setState(this.initialState.form_data.front_banner_data = banner_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }


    async get_client_logo() {
        api_option.url = 'get_front_clientlogo_list';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var banner_data = res.data.data;
                    this.setState(this.initialState.form_data.clientlogo_data = banner_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    async get_instagram_data() {

        api_option.url = 'get_front_instagram_list';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var banner_data = res.data.data;
                    this.setState(this.initialState.form_data.instagram_data = banner_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }





    async get_cms_data() {
        api_option.url = 'get_front_cms_list';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    var cms_data = res.data.data;
                    this.setState(this.initialState.form_data.cms_data = cms_data);

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
                <Helmet>
                    {/* <script src="/assets/js/dropdown_toggle.js"></script>
                    <script src="/assets/js/developer_signup_popup.js?12"></script> */}
                    {/* <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
                    <script src="/assets/js/home_init.js"></script>
                    <link rel="stylesheet" href="/assets/css/rtl.css" /> */}
                </Helmet>

                {/* <button type='button' className='btn btn-primary' onClick={facebook_login}>Login with Facebook</button>
                <button type='button' className='btn btn-primary' onClick={google_login}>Login with Google</button> */}

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
                                    <span>or use your email for registration </span>
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
                                        {/* <Select
                                            value={this.state.register_form_data.zone_id}
                                            onChange={this.handleZone}
                                            options={this.state.zone_list_new}
                                            id="zone_id" name="zone_id"
                                            placeholder="Select Zone"
                                        /> */}




                                        {/* <input type="text" name="area" id="area" placeholder="Area" data-validation="required" value={this.state.register_form_data.area} onChange={this.handleChangeRegister} /> */}
                                        <input type='hidden' id="pincode" name="pincode" value={this.state.register_form_data.pincode} />
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
                <div className="App">
                    <InstagramEmbed
                        url='https://instagr.am/p/Zw9o4/'
                        maxWidth={500}
                        hideCaption={true}
                        containerTagName='div'
                        protocol=''
                        injectScript
                        onLoading={() => { }}
                        onSuccess={() => { }}
                        onAfterRender={() => { }}
                        onFailure={() => { }}
                    />
                </div>
                <Loader
                    loaded={this.initialState.loaded}
                    lines={15}
                    length={20}
                    width={10}
                    radius={30}
                    corners={1}
                    rotate={0}
                    direction={1}
                    color="#000"
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
                <div className="hero-slider">
                    <div className="container">
                        <div className="slider-area">
                            <div id="hero-carousel" className="carousel slide carousel-fade" data-ride="carousel">
                                <ul className="carousel-indicators">
                                    {Object.entries(this.initialState.form_data.banner_data).map(([i, v]) => (
                                        <>
                                            <li data-target="#hero-carousel" data-slide-to={i} className="active"></li>
                                        </>
                                    ))}
                                    {/* <li data-target="#hero-carousel" data-slide-to="1"></li>
                                    <li data-target="#hero-carousel" data-slide-to="2"></li> */}
                                </ul>
                                <div className="carousel-inner">
                                    {Object.entries(this.initialState.form_data.banner_data).map(([i, v]) => (

                                        <div className={"carousel-item " + (i <= 0 ? 'active' : '')}>

                                            <div className="slider-part">
                                                <div className="slide-content">
                                                    <h5>{v.b_company_title}</h5>
                                                    <h2>{v.b_title}</h2>
                                                    <p>{v.b_short_description}.</p>
                                                    {/* <NavLink className="btn btn-primary" exact to={v.b_link}>{v.b_button_text}</NavLink> */}

                                                    {v.b_button_text != "" && v.b_link != "" && <a href={v.b_link} target="_blank" className="btn btn-primary">{v.b_button_text}</a>}


                                                    {/* <a href="javascript:void(0)" className="btn btn-primary">{v.b_button_text}</a> */}
                                                </div>

                                                <div className="slide-image">
                                                    {/* <NavLink className="footer-link" exact to={v.b_link} target="_blank"> */}
                                                    <div className="lg-container">

                                                        <img src={v.b_image} className="lg-image hero-banner" />


                                                    </div>
                                                    {/* </NavLink> */}

                                                </div>

                                            </div>


                                        </div>
                                    ))}


                                    {/* <div className="carousel-item active">
                                        <div className="slider-part">
                                            <div className="slide-content">
                                                <h5>KH Elite Architectural</h5>
                                                <h2>Explore Todays project Story</h2>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                                <a href="javascript:void(0)" className="btn btn-primary">Explore Projects</a>
                                            </div>
                                            <div className="slide-image">
                                                <div className="lg-container">
                                                    <img src="/assets/images/herobanner-1.jpg" className="lg-image hero-banner" />
                                                    <div style={{ "top": "66%", "left": "24%" }} className="lg-hotspot lg-hotspot--top-left">
                                                        <div className="lg-hotspot__button"></div>
                                                        <div className="lg-hotspot__label">
                                                            <div className="hotspot-product">
                                                                <img src="/assets/images/product-1.jpg" />
                                                                <div>
                                                                    <a href="javascript:void(0)" className="hs-p-name">Office Desk Sofa</a>
                                                                    <span className="hs-p-price">$100</span>
                                                                    <a href="javascript:void(0)" className="hs-p-link">View Product</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ "top": "73%", "left": "50%;" }} className="lg-hotspot lg-hotspot--top-left">
                                                        <div className="lg-hotspot__button"></div>
                                                        <div className="lg-hotspot__label">
                                                            <div className="hotspot-product">
                                                                <img src="/assets/images/product-2.jpg" />
                                                                <div>
                                                                    <a href="javascript:void(0)" className="hs-p-name">Office Desk Sofa</a>
                                                                    <span className="hs-p-price">$100</span>
                                                                    <a href="javascript:void(0)" className="hs-p-link">View Product</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ "top": "36%", "left": "84%" }} className="lg-hotspot lg-hotspot--top-right">
                                                        <div className="lg-hotspot__button"></div>
                                                        <div className="lg-hotspot__label">
                                                            <div className="hotspot-product">
                                                                <img src="/assets/images/product-3.jpg" />
                                                                <div>
                                                                    <a href="javascript:void(0)" className="hs-p-name">Office Desk Sofa</a>
                                                                    <span className="hs-p-price">$100</span>
                                                                    <a href="javascript:void(0)" className="hs-p-link">View Product</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ "top": "86%", "left": "86%" }} className="lg-hotspot lg-hotspot--bottom-right">
                                                        <div className="lg-hotspot__button"></div>
                                                        <div className="lg-hotspot__label">
                                                            <div className="hotspot-product">
                                                                <img src="/assets/images/product-4.jpg" />
                                                                <div>
                                                                    <a href="javascript:void(0)" className="hs-p-name">Office Desk Sofa</a>
                                                                    <span className="hs-p-price">$100</span>
                                                                    <a href="javascript:void(0)" className="hs-p-link">View Product</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="carousel-item">
                                        <div className="slider-part">
                                            <div className="slide-content">
                                                <h5>KH Elite Architectural</h5>
                                                <h2>Explore Todays project Story</h2>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                                <a href="javascript:void(0)" className="btn btn-primary">Explore Projects</a>
                                            </div>
                                            <div className="slide-image"><img src="/assets/images/herobanner-2.jpg" className="hero-banner" /></div>
                                        </div>
                                    </div>
                                    <div className="carousel-item">
                                        <div className="slider-part">
                                            <div className="slide-content">
                                                <h5>KH Elite Architectural</h5>
                                                <h2>Explore Todays project Story</h2>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                                <a href="javascript:void(0)" className="btn btn-primary">Explore Projects</a>
                                            </div>
                                            <div className="slide-image"><img src="/assets/images/herobanner-3.jpg" className="hero-banner" /></div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="featured-wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-lg-4">
                            <div className="furgan-iconbox style-01">
                                <div className="iconbox-inner">
                                    <div className="icon">
                                        <i className="bi bi-truck"></i>
                                    </div>
                                    <div className="content">
                                        <h4>Fast Shipping.</h4>
                                        <div className="desc">With sites in 5 languages, we ship to over 200 countries</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-4">
                            <div className="furgan-iconbox style-01">
                                <div className="iconbox-inner">
                                    <div className="icon">
                                        <i className="bi bi-shield-check"></i>
                                    </div>
                                    <div className="content">
                                        <h4>Safe delivery</h4>
                                        <div className="desc">Pay with the world’s most popular, secure payment methods.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-4">
                            <div className="furgan-iconbox style-01">
                                <div className="iconbox-inner">
                                    <div className="icon">
                                        <i className="bi bi-arrow-repeat"></i>
                                    </div>
                                    <div className="content">
                                        <h4>365 Days Return</h4>
                                        <div className="desc">Round-the-clock assistance for a shopping experience.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

                <div className="categories-wrapper">
                    <div className="container">
                        <div className="row d-flex">
                            <div className="col-md-12">
                                <div className="categories-grid">
                                    {Object.entries(this.initialState.form_data.category_data).map(([i, v]) => (
                                        <a href={v.hc_link}>
                                            <div className="cat-square">
                                                <div className="cat-iconimage"><img src={v.hc_image} /></div>
                                                <span>{v.hc_title}</span>
                                            </div>
                                        </a>
                                    ))}
                                    {/* <a href="javascript:void(0)">
                                        <div className="cat-square">
                                            <div className="cat-iconimage"><img src="/assets/images/categories/category-1.svg" /></div>
                                            <span>Rooms</span>
                                        </div>
                                    </a>
                                    <a href="javascript:void(0)">
                                        <div className="cat-square">
                                            <div className="cat-iconimage"><img src="/assets/images/categories/category-2.svg" /></div>
                                            <span>Projects</span>
                                        </div>
                                    </a>
                                    <a href="javascript:void(0)">
                                        <div className="cat-square">
                                            <div className="cat-iconimage"><img src="/assets/images/categories/category-3.svg" /></div>
                                            <span>Products</span>
                                        </div>
                                    </a>
                                    <a href="javascript:void(0)">
                                        <div className="cat-square">
                                            <div className="cat-iconimage"><img src="/assets/images/categories/category-4.svg" /></div>
                                            <span>Know How</span>
                                        </div>
                                    </a>
                                    <a href="javascript:void(0)">
                                        <div className="cat-square">
                                            <div className="cat-iconimage"><img src="/assets/images/categories/category-5.svg" /></div>
                                            <span>Living Experience</span>
                                        </div>
                                    </a>
                                    <a href="javascript:void(0)">
                                        <div className="cat-square">
                                            <div className="cat-iconimage"><img src="/assets/images/categories/category-6.svg" /></div>
                                            <span>Find Professionals</span>
                                        </div>
                                    </a> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="clients-wrapper">

                    <div className="container">
                        <div className="row d-flex justify-content-between align-items-center">
                            <div className="col-md-12">
                                <div className="client-grid">
                                    {Object.entries(this.initialState.form_data.clientlogo_data).map(([i, cl]) => (
                                        <div><a href={cl.cl_link} target="_blank"><img src={cl.cl_image} /></a></div>
                                    ))}

                                    {/* <div><img src="/assets/images/brand-1.png" /></div>
                                    <div><img src="/assets/images/brand-2.png" /></div>
                                    <div><img src="/assets/images/brand-3.png" /></div>
                                    <div><img src="/assets/images/brand-4.png" /></div>
                                    <div><img src="/assets/images/brand-5.png" /></div>
                                    <div><img src="/assets/images/brand-6.png" /></div>
                                    <div><img src="/assets/images/brand-7.png" /></div>
                                    <div><img src="/assets/images/brand-1.png" /></div>
                                    <div><img src="/assets/images/brand-2.png" /></div>
                                    <div><img src="/assets/images/brand-3.png" /></div>
                                    <div><img src="/assets/images/brand-4.png" /></div>
                                    <div><img src="/assets/images/brand-5.png" /></div>
                                    <div><img src="/assets/images/brand-6.png" /></div>
                                    <div><img src="/assets/images/brand-7.png" /></div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="projects-wrapper">
                    <div className="container">
                        <div className="title-section text-center">
                            <h5 className="sub">More ideas and inspiration</h5>
                            <h2 className="title">Explore Amazing Projects</h2>
                        </div>
                    </div>
                    <div className="container">
                        <div className="projects-grid">

                            {Object.entries(this.initialState.form_data.project_data).map(([o, pr]) => (
                                <Link to={`/projectdetail/${pr.tpro_id}`}>
                                    <figure><img src={pr.tpro_image} /></figure>
                                    <div className="projects-grid-details">
                                        <h4>{pr.tpro_name}</h4>
                                        <h6>{pr.tpro_category}</h6>
                                        <span>View More</span>
                                    </div>
                                </Link>
                            ))}
                            {/* <a href="javascript:void(0)">
                                <figure><img src="/assets/images/projects-2.jpg" /></figure>
                                <div className="projects-grid-details">
                                    <h6>Styled Habitat</h6>
                                    <h4>Decorate your home with furns.</h4>
                                    <span>View More</span>
                                </div>
                            </a>
                            <a href="javascript:void(0)">
                                <figure><img src="/assets/images/projects-3.jpg" /></figure>
                                <div className="projects-grid-details">
                                    <h6>Blush International</h6>
                                    <h4>Decorate your home with furns.</h4>
                                    <span>View More</span>
                                </div>
                            </a>
                            <a href="javascript:void(0)">
                                <figure><img src="/assets/images/projects-4.jpg" /></figure>
                                <div className="projects-grid-details">
                                    <h6>Widad Aboujeb</h6>
                                    <h4>Decorate your home with furns.</h4>
                                    <span>View More</span>
                                </div>
                            </a>
                            <a href="javascript:void(0)">
                                <figure><img src="/assets/images/projects-5.jpg" /></figure>
                                <div className="projects-grid-details">
                                    <h6>K Design Oman</h6>
                                    <h4>Decorate your home with furns.</h4>
                                    <span>View More</span>
                                </div>
                            </a>
                            <a href="javascript:void(0)">
                                <figure><img src="/assets/images/projects-6.jpg" /></figure>
                                <div className="projects-grid-details">
                                    <h6>K Design Oman</h6>
                                    <h4>Decorate your home with furns.</h4>
                                    <span>View More</span>
                                </div>
                            </a> */}
                        </div>
                    </div>
                </div>


                <div className="products-wrapper">
                    <div className="container">
                        <div className="title-section text-center">
                            <h5 className="sub">More ideas and inspiration</h5>
                            <h2 className="title">Explore Products</h2>
                        </div>
                    </div>
                    <div className="container">

                        <div className="line-tab">
                            <ul className="nav nav-tabs">
                                <li className="nav-item">
                                    <a className="active" data-toggle="tab" href="#latest">New Products</a>
                                </li>
                                <li className="nav-item">
                                    <a className="" data-toggle="tab" href="#bestseller">Sellers</a>
                                </li>
                                <li className="nav-item">
                                    <a className="" data-toggle="tab" href="#featured">Featured Products</a>
                                </li>
                            </ul>
                        </div>
                        <div className="tab-content">

                            <div className="tab-pane active" id="latest">
                                <div className="products-grid">
                                    {Object.entries(this.initialState.form_data.latest_product_data).map(([o, p]) => (

                                        <div className="product-item">

                                            <div className="product-thumb">
                                                <div class="thumbsave">
                                                    {localStorage.getItem('type') == 1 && is_login() && p.favourites == 0 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.tp_id)}><i class="bi-heart"></i></button>}
                                                    {localStorage.getItem('type') == 1 && is_login() && p.favourites == 1 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.tp_id)}><i class="bi-heart-fill"></i></button>}
                                                    {!is_login() && <button class="save-trigger" onClick={this.openLoginModal}><i class="bi bi-heart"></i> </button>
                                                    }
                                                </div>
                                                <Link to={`/productdetail/${p.tp_id}`}>
                                                    <img src={p.image} />
                                                </Link>
                                            </div>

                                            <div className="product-info">


                                                <h4 className="product-name"><Link to={`/productdetail/${p.tp_id}`}>{p.tp_title}</Link></h4>
                                                <div className="just-in">

                                                    <div class="product-price">{p.tp_price > 0 && <del>RO {p.tp_price}</del>}<span>RO {p.tp_sale_price}</span></div>

                                                    {/* {p.tp_sale_price != 0 && <div className="product-price">RO {p.tp_sale_price}</div> || <div className="product-price">RO {p.tp_price}</div>} */}
                                                    {/* <div className="rating-wapper">
                                                        <span className="star-rating"><span className="stars four"></span></span>
                                                    </div> */}
                                                    <div className="rating-wapper">
                                                        {p.tp_star == 0 && <span className="star-rating"><span className="stars"></span></span>}
                                                        {p.tp_star == 1 && <span className="star-rating"><span className="stars one"></span></span>}
                                                        {p.tp_star == 2 && <span className="star-rating"><span className="stars two" ></span></span>}
                                                        {p.tp_star == 3 && <span className="star-rating"><span className="stars three" ></span></span>}
                                                        {p.tp_star == 4 && <span className="star-rating"><span className="stars four" ></span></span>}
                                                        {p.tp_star == 5 && <span className="star-rating"><span className="stars five" ></span></span>}


                                                    </div>
                                                </div>
                                                <div className="product-brand"><Link to={`/Seller-detail/${p.u_id}`}>{p.u_name}</Link></div>
                                            </div>

                                        </div>
                                    ))}
                                     {Object.entries(this.initialState.form_data.latest_product_data).map(([o, p]) => (

                                    <div className="product-item">

                                        <div className="product-thumb">
                                            <div class="thumbsave">
                                                {localStorage.getItem('type') == 1 && is_login() && p.favourites == 0 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.tp_id)}><i class="bi-heart"></i></button>}
                                                {localStorage.getItem('type') == 1 && is_login() && p.favourites == 1 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.tp_id)}><i class="bi-heart-fill"></i></button>}
                                                {!is_login() && <button class="save-trigger" onClick={this.openLoginModal}><i class="bi bi-heart"></i> </button>
                                                }
                                            </div>
                                            <Link to={`/productdetail/${p.tp_id}`}>
                                                <img src={p.image} />
                                            </Link>
                                        </div>

                                        <div className="product-info">


                                            <h4 className="product-name"><Link to={`/productdetail/${p.tp_id}`}>{p.tp_title}</Link></h4>
                                            <div className="just-in">

                                                <div class="product-price">{p.tp_price > 0 && <del>RO {p.tp_price}</del>}<span>RO {p.tp_sale_price}</span></div>

                                                {/* {p.tp_sale_price != 0 && <div className="product-price">RO {p.tp_sale_price}</div> || <div className="product-price">RO {p.tp_price}</div>} */}
                                                {/* <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars four"></span></span>
                                                </div> */}
                                                <div className="rating-wapper">
                                                    {p.tp_star == 0 && <span className="star-rating"><span className="stars"></span></span>}
                                                    {p.tp_star == 1 && <span className="star-rating"><span className="stars one"></span></span>}
                                                    {p.tp_star == 2 && <span className="star-rating"><span className="stars two" ></span></span>}
                                                    {p.tp_star == 3 && <span className="star-rating"><span className="stars three" ></span></span>}
                                                    {p.tp_star == 4 && <span className="star-rating"><span className="stars four" ></span></span>}
                                                    {p.tp_star == 5 && <span className="star-rating"><span className="stars five" ></span></span>}


                                                </div>
                                            </div>
                                            <div className="product-brand"><Link to={`/Seller-detail/${p.u_id}`}>{p.u_name}</Link></div>
                                        </div>

                                    </div>
                                    ))}
                                    {/* <div className="product-item">
                                    <div className="product-thumb">
                                        <a href="javascript:void(0)">
                                            <img src="/assets/images/product-2.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><a href="javascript:void(0)">Ergonomic Desk Sofa</a></h4>
                                        <div className="just-in">
                                            <div className="product-price">$100.00</div>
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars five"></span></span>
                                            </div>
                                        </div>
                                        <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                    </div>
                                </div>
                                <div className="product-item">
                                    <div className="product-thumb">
                                        <a href="javascript:void(0)">
                                            <img src="/assets/images/product-3.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><a href="javascript:void(0)">Swivel Sofa</a></h4>
                                        <div className="just-in">
                                            <div className="product-price">$100.00</div>
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars three"></span></span>
                                            </div>
                                        </div>
                                        <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                    </div>
                                </div>
                                <div className="product-item">
                                    <div className="product-thumb">
                                        <a href="javascript:void(0)">
                                            <img src="/assets/images/product-4.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><a href="javascript:void(0)">Wood Patio Chair</a></h4>
                                        <div className="just-in">
                                            <div className="product-price">$100.00</div>
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars two"></span></span>
                                            </div>
                                        </div>
                                        <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                    </div>
                                </div>
                                <div className="product-item">
                                    <div className="product-thumb">
                                        <a href="javascript:void(0)">
                                            <img src="/assets/images/product-5.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><a href="javascript:void(0)">Brown Vinyl Padded</a></h4>
                                        <div className="just-in">
                                            <div className="product-price">$100.00</div>
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars one"></span></span>
                                            </div>
                                        </div>
                                        <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                    </div>
                                </div>
                                <div className="product-item">
                                    <div className="product-thumb">
                                        <a href="javascript:void(0)">
                                            <img src="/assets/images/product-6.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><a href="javascript:void(0)">Antique Walnut</a></h4>
                                        <div className="just-in">
                                            <div className="product-price">$100.00</div>
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars four"></span></span>
                                            </div>
                                        </div>
                                        <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                    </div>
                                </div> */}
                                {/* <div className="product-item">
                                    <div className="product-thumb">
                                        <a href="javascript:void(0)">
                                            <img src="/assets/images/product-7.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><a href="javascript:void(0)">Office Desk Sofa</a></h4>
                                        <div className="just-in">
                                            <div className="product-price">$100.00</div>
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars four"></span></span>
                                            </div>
                                        </div>
                                        <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                    </div>
                                </div>
                                <div className="product-item">
                                    <div className="product-thumb">
                                        <a href="javascript:void(0)">
                                            <img src="/assets/images/product-8.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><a href="javascript:void(0)">Ergonomic Desk Sofa</a></h4>
                                        <div className="just-in">
                                            <div className="product-price">$100.00</div>
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars five"></span></span>
                                            </div>
                                        </div>
                                        <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                    </div>
                                </div>
                                <div className="product-item">
                                    <div className="product-thumb">
                                        <a href="javascript:void(0)">
                                            <img src="/assets/images/product-9.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><a href="javascript:void(0)">Swivel Sofa</a></h4>
                                        <div className="just-in">
                                            <div className="product-price">$100.00</div>
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars three"></span></span>
                                            </div>
                                        </div>
                                        <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                    </div>
                                </div>
                                <div className="product-item">
                                    <div className="product-thumb">
                                        <a href="javascript:void(0)">
                                            <img src="/assets/images/product-10.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><a href="javascript:void(0)">Wood Patio Chair</a></h4>
                                        <div className="just-in">
                                            <div className="product-price">$100.00</div>
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars two"></span></span>
                                            </div>
                                        </div>
                                        <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                    </div>
                                </div> */}
                                </div>
                            </div>


                            <div className="tab-pane fade" id="bestseller">
                                <div className="products-grid">
                                    {Object.entries(this.initialState.form_data.bestseller_product_data).map(([o, bp]) => (
                                        <div className="product-item">

                                            <div className="product-thumb">
                                                <div class="thumbsave">
                                                    {localStorage.getItem('type') == 1 && is_login() && bp.favourites == 0 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, bp.tp_id)}><i class="bi-heart"></i></button>}
                                                    {localStorage.getItem('type') == 1 && is_login() && bp.favourites == 1 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, bp.tp_id)}><i class="bi-heart-fill"></i></button>}
                                                    {!is_login() && <button class="save-trigger" onClick={this.openLoginModal}><i class="bi bi-heart"></i> </button>
                                                    }
                                                </div>
                                                <Link to={`/productdetail/${bp.tp_id}`}>
                                                    <img src={bp.image} />
                                                </Link>
                                            </div>

                                            <div className="product-info">


                                                <h4 className="product-name"><Link to={`/productdetail/${bp.tp_id}`}>{bp.tp_title}</Link></h4>
                                                <div className="just-in">
                                                    <div class="product-price">{bp.tp_price > 0 && <del>RO {bp.tp_price}</del>}<span>RO {bp.tp_sale_price}</span></div>

                                                    {/* {bp.tp_sale_price != 0 && <div className="product-price">RO {bp.tp_sale_price}</div> || <div className="product-price">RO {bp.tp_price}</div>} */}
                                                    <div className="rating-wapper">
                                                        {bp.tp_star == 0 && <span className="star-rating"><span className="stars"></span></span>}
                                                        {bp.tp_star == 1 && <span className="star-rating"><span className="stars one"></span></span>}
                                                        {bp.tp_star == 2 && <span className="star-rating"><span className="stars two" ></span></span>}
                                                        {bp.tp_star == 3 && <span className="star-rating"><span className="stars three" ></span></span>}
                                                        {bp.tp_star == 4 && <span className="star-rating"><span className="stars four" ></span></span>}
                                                        {bp.tp_star == 5 && <span className="star-rating"><span className="stars five" ></span></span>}
                                                    </div>
                                                </div>
                                                <div className="product-brand"><Link to={`/Seller-detail/${bp.u_id}`}>{bp.u_name}</Link></div>
                                            </div>

                                        </div>
                                    ))}
                                    {/* <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-9.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Swivel Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars three"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-10.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Wood Patio Chair</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars two"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-1.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Office Desk Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars four"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-2.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Ergonomic Desk Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars five"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-3.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Swivel Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars three"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-4.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Wood Patio Chair</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars two"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-5.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Brown Vinyl Padded</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars one"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-6.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Antique Walnut</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars four"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-7.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Office Desk Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars four"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            <div className="tab-pane fade" id="featured">
                                <div className="products-grid">
                                    {Object.entries(this.initialState.form_data.featured_product_data).map(([o, fp]) => (
                                        <div className="product-item">

                                            <div className="product-thumb">
                                                <div class="thumbsave">
                                                    {localStorage.getItem('type') == 1 && is_login() && fp.favourites == 0 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, fp.tp_id)}><i class="bi-heart"></i></button>}
                                                    {localStorage.getItem('type') == 1 && is_login() && fp.favourites == 1 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, fp.tp_id)}><i class="bi-heart-fill"></i></button>}
                                                    {!is_login() && <button class="save-trigger" onClick={this.openLoginModal}><i class="bi bi-heart"></i> </button>
                                                    }
                                                </div>
                                                <Link to={`/productdetail/${fp.tp_id}`}>
                                                    <img src={fp.image} />
                                                </Link>
                                            </div>

                                            <div className="product-info">
                                                <h4 className="product-name"><Link to={`/productdetail/${fp.tp_id}`}>{fp.tp_title}</Link></h4>
                                                <div className="just-in">
                                                    <div class="product-price">{fp.tp_price > 0 && <del>RO {fp.tp_price}</del>}<span>RO {fp.tp_sale_price}</span></div>
                                                    {/* {fp.tp_sale_price != 0 && <div className="product-price">RO {fp.tp_sale_price}</div> || <div className="product-price">RO {fp.tp_price}</div>} */}
                                                    <div className="rating-wapper">
                                                        {fp.tp_star == 0 && <span className="star-rating"><span className="stars"></span></span>}
                                                        {fp.tp_star == 1 && <span className="star-rating"><span className="stars one"></span></span>}
                                                        {fp.tp_star == 2 && <span className="star-rating"><span className="stars two" ></span></span>}
                                                        {fp.tp_star == 3 && <span className="star-rating"><span className="stars three" ></span></span>}
                                                        {fp.tp_star == 4 && <span className="star-rating"><span className="stars four" ></span></span>}
                                                        {fp.tp_star == 5 && <span className="star-rating"><span className="stars five" ></span></span>}
                                                        
                                                    </div>
                                                </div>
                                                <div className="product-brand"><Link to={`/Seller-detail/${fp.u_id}`}>{fp.u_name}</Link></div>
                                            </div>

                                        </div>
                                    ))}
                                    {/* <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-7.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Office Desk Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars four"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-8.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Ergonomic Desk Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars five"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-9.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Swivel Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars three"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-10.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Wood Patio Chair</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars two"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-1.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Office Desk Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars four"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-2.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Ergonomic Desk Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars five"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-3.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Swivel Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars three"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-4.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Wood Patio Chair</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars two"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-5.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Brown Vinyl Padded</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars one"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="quicklink-wrapper">
                    <div className="container">
                    <div className="container banner-div">
                        <div className="ref-content text-center">
                            <h2>{this.initialState.form_data.home_data.hp_home_title}</h2>
                            <h5>{this.initialState.form_data.home_data.hp_description}</h5>
                            </div>
                        </div>
                        <div className="referance-section">
                            <div className="ref-banners">
                                <a href="javascript:void(0)">
                                    <div className="quicklink-wrap" style={{ background: "unset", backgroundImage: "url('" + this.initialState.form_data.home_data.hp_living_image_full + "')", backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                                        <div className="liExp-banner">
                                            <div>
                                                {/* <img src={this.initialState.form_data.home_data.hp_living_image} /> */}
                                            </div>
                                        </div>
                                        <div className="quicklink-content">
                                            {/* Living Experience */}
                                            <h6 className='text-white'>Living Experience</h6>
                                            <h2 className='text-white'>{this.initialState.form_data.home_data.hp_living_title} </h2>
                                            {/* <h6></h6>
                                            <h2></h2> */}
                                            {/* Explore More */}

                                            <NavLink exact to={'/living-experience-list/'}><span className='text-white'>Explore More <i className="bi bi-arrow-right"></i></span></NavLink>
                                        </div>
                                    </div>
                                </a>
                                <a href="javascript:void(0)">
                                    <div className="quicklink-wrap" style={{ background: "unset", backgroundImage: "url('" + this.initialState.form_data.home_data.hp_know_how_image_full + "')", backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                                        <div className="knwHw-banner">
                                            {/* <img src={this.initialState.form_data.home_data.hp_know_how_image} /> */}
                                        </div>
                                        <div className="quicklink-content">
                                            <h6>Know How</h6>
                                            <h2>{this.initialState.form_data.home_data.hp_know_how_title} </h2>
                                            {/* <h6></h6> */}
                                            {/* <h2></h2> */}
                                            {/* Explore More */}
                                            <NavLink exact to={'/write-know-how/'}><span>Explore More <i className="bi bi-arrow-right"></i></span></NavLink>
                                        </div>
                                    </div>
                                </a>
                                <a href="javascript:void(0)">
                                    <div className="quicklink-wrap" style={{ background: "unset", backgroundImage: "url('" + this.initialState.form_data.home_data.hp_know_how_image_full + "')", backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                                        <div className="knwHw-banner">
                                            {/* <img src={this.initialState.form_data.home_data.hp_know_how_image} /> */}
                                        </div>
                                        <div className="quicklink-content">
                                            <h6>Know How</h6>
                                            <h2>{this.initialState.form_data.home_data.hp_know_how_title} </h2>
                                            {/* <h6></h6> */}
                                            {/* <h2></h2> */}
                                            {/* Explore More */}
                                            <NavLink exact to={'/write-know-how/'}><span>Explore More <i className="bi bi-arrow-right"></i></span></NavLink>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            {/* <div className="ref-content">
                                <h2>{this.initialState.form_data.home_data.hp_home_title}</h2>
                                <p>{this.initialState.form_data.home_data.hp_description}</p>
                            </div> */}
                        </div>
                    </div>
                </div>


                {/* <div className="insta-wrapper">
                    <div className="container">
                        <div className="title-section text-center mb-5">
                            <h2 className="title">Follow us on Instagram</h2>
                        </div>

                        <div className="instagrid">
                            {Object.entries(this.initialState.form_data.instagram_data).map(([i, cl]) => (
                                <div><a href={cl.insta_link} target="_blank"><img src={cl.insta_image} /></a></div>
                            ))}


                        </div>
                    </div>
                </div> */}


                <div className="bg-wrapper">
                    {/* backgroundImage: "url('" + this.state.dashboard_form_data.ts_b_image + "')" */}
                    {/* <div className="bg-parelex" style={{ "background": "url(assets/images/parallax_land1.jpg)" }}></div> */}
                    <div className="bg-parelex" style={{ "background": "url('" + this.initialState.form_data.home_data.hp_image + "')" }}></div>
                    <div className="banner-wrapper-infor">
                        <h2>{this.initialState.form_data.home_data.hp_title}</h2>
                        <p>{this.initialState.form_data.home_data.hp_short_description}</p>
                        <a href={this.initialState.form_data.home_data.hp_link} target="_blank" className="btn btn-white">Explore More</a>
                    </div>
                </div>

                <Modal show={this.state.currency_popup_show} id="currency-popup" size="lg" onHide={this.hideCurrencyModal}>

                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Choose Currency</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.hideCurrencyModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            <div className="form-option">
                                <label className="foption">
                                    <input type="radio" name="language" />
                                    <span></span>
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
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.hideCurrencyModal}>Cancel</button>
                            {/* onClick={this.handleLogoutFinal} */}
                            <button data-dismiss="modal" className="btn btn-primary">Save</button>
                        </div>
                    </div>




                </Modal>
            </>
        );
    }
}


export default Home;
