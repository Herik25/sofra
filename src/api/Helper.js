
// for live environment
import { ToastContainer, toast } from 'react-toastify';
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, createUserWithEmailAndPassword, FacebookAuthProvider, signInWithPopup, signInWithRedirect, getRedirectResult, OAuthProvider } from "firebase/auth";
import axios from 'axios';

const api_url = 'https://api.shorfa.com/';
// const api_url = 'http://119.18.52.185:5016/';
// const web_url = 'https://shorfa.com/';
const web_url = 'http://localhost:3000/';
// const web_url = 'http://shorfa.13tech.in/#/';
/* const api_url = 'https://shorfa.xbytedev.co/';
const web_url = 'https://xbytedev.co/shorfa/#/'; */

//for local environment
// const api_url = 'http://192.168.100.246:3300/';
//const web_url = 'http://192.168.100.246:3000/#/';


//for package.json file
//  "homepage":"https://xbytedev.co/shorfa/",
//  "homepage":"https://shorfa.com/",
// "homepage": "http://shorfa.13tech.in/",


const currency = {
    '1': 'RO',
    '2': 'SAR',
    '3': 'OMR',
    '4': 'AED',
    '5': 'USD',
}
// {currency.CURRENCY3}

const api_option = {
    baseURL: api_url,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: ''
    },
    responseType: 'json',
    method: 'post',
}

const getToken = () => {
    return sessionStorage.getItem('token') || null;
}

const getUserDetail = () => {
    return JSON.parse(sessionStorage.getItem('user'));
}

const getUserId = () => {
    return JSON.parse(sessionStorage.getItem('user'))['u_id'];
}

const getModuleAccess = () => {
    if (JSON.parse(sessionStorage.getItem('user'))) {
        return JSON.parse(JSON.parse(sessionStorage.getItem('user'))['u_module_access']);
    } else {
        return false;
    }
}



const removeUserSession = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    localStorage.removeItem('device_type')
}

const setUserSession = (token, user) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('user', JSON.stringify(user));
}

const is_login = () => {
    if (sessionStorage.getItem('token')) {
        return true;
    } else {
        return false;
    }
}

const apple_login = () => {

    // console.log("dsfsdfsd");
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

    // const provider = new GoogleAuthProvider();

    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');

    // signInWithRedirect(auth, provider)
    signInWithPopup(auth, provider)
        .then((result) => {
            // The signed-in user info.
            const user = result.user;

            // This gives you a Facebook Access Token. You can use it to access the Facebook API.

            const credential = OAuthProvider.credentialFromResult(result);
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
            const credential = OAuthProvider.credentialFromError(error);
            /* console.log(errorCode);
            console.log(errorMessage); */
            // ...
        });

    /* Firebase Auth End */
}

const apple_data = () => {
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

    // console.log("Sdfsdfsd 1");

    getRedirectResult(auth)
        .then((result) => {
            // console.log("Sdfsdfsd 12", result);
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            const credential = OAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            const user = result.user;

            var email = "";
            var displayname = "";
            var facebook_uid = "";
            var phonenumber = "";
            // console.log("user", user);
            if (user.providerData[0].email != undefined && user.providerData[0].email && user.providerData[0].email != "") {
                email = user.providerData[0].email;
            }
            if (user.email != undefined && user.email && user.email != "") {
                email = user.email;
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

            /* console.log(email);
            console.log(displayname);
            console.log(facebook_uid);
            console.log(phonenumber); */
            // return false;

            /*  */
            var user_data = getUserDetail();
            var login_id = user_data ? user_data.u_id : '';
            api_option.url = 'social_signin';
            api_option.data = { displayname: displayname, phonenumber: phonenumber, email: email, facebook_uid: facebook_uid };
            api_option.headers.Authorization = sessionStorage.getItem('token');
            const th = this;
            axios(api_option)
                .then(res => {
                    // console.log("11-05", res);
                    //this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        // alert("123", res_data.status);
                        // console.log("sdfsdfsjdlkj ", res_data.users);
                        toast.success("Login Successfully");
                        /* localStorage.email = this.state.login_form_data.email;
                        localStorage.password = this.state.login_form_data.password; */
                        localStorage.setItem('type', 1);
                        localStorage.removeItem('usr_id');
                        // localStorage.type = '1';
                        //this.setState({ show: false });
                        //window.$('#access-modal').modal('hide');
                        /* this.state.login_form_data.email = '';
                        this.state.login_form_data.password = ''; */
                        setUserSession(res_data.users.token, res_data.users);
                        //this.setState({ redirect: '/My-profile' });
                        // window.location.href = '/shorfa/#/My-profile';
                        if (localStorage.getItem('device_type') == 'web') {
                            // window.location.href = '/shorfa/#/My-profile';
                            // alert("sdf1");
                            // console.log(res_data.users);
                            if (window.callback != undefined) {
                                window.callback.login_success('{"user_id":"' + res_data.users.u_id + '","is_login":"1"}');
                            }

                            window.location.href = web_url;
                            //window.location.href = web_url + 'productdetail/' + this.props.match.params.product_id;

                        } else {
                            // console.log(res_data.users.u_id);
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
                        //this.setState({ error: res_data.message });
                    }
                    //this.setState({ button_disabled: false });
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

            /* console.log(errorCode);
            console.log(errorMessage); */
            // The email of the user's account used.
            //const email = error.customData.email;
            // AuthCredential type that was used.
            //const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });

}

const google_data = () => {
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

    // console.log("Sdfsdfsd 1");

    getRedirectResult(auth)
        .then((result) => {
            // console.log("Sdfsdfsd 12", result);
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            const user = result.user;

            var email = "";
            var displayname = "";
            var facebook_uid = "";
            var phonenumber = "";
            // console.log("user", user);
            if (user.providerData[0].email != undefined && user.providerData[0].email && user.providerData[0].email != "") {
                email = user.providerData[0].email;
            }
            if (user.email != undefined && user.email && user.email != "") {
                email = user.email;
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

            /* console.log(email);
            console.log(displayname);
            console.log(facebook_uid);
            console.log(phonenumber); */
            // return false;

            /*  */
            var user_data = getUserDetail();
            var login_id = user_data ? user_data.u_id : '';
            api_option.url = 'social_signin';
            api_option.data = { displayname: displayname, phonenumber: phonenumber, email: email, facebook_uid: facebook_uid };
            api_option.headers.Authorization = sessionStorage.getItem('token');
            const th = this;
            axios(api_option)
                .then(res => {
                    // console.log("11-05", res);
                    //this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        // alert("123", res_data.status);
                        // console.log("sdfsdfsjdlkj ", res_data.users);
                        toast.success("Login Successfully");
                        /* localStorage.email = this.state.login_form_data.email;
                        localStorage.password = this.state.login_form_data.password; */
                        localStorage.setItem('type', 1);
                        localStorage.removeItem('usr_id');
                        // localStorage.type = '1';
                        //this.setState({ show: false });
                        //window.$('#access-modal').modal('hide');
                        /* this.state.login_form_data.email = '';
                        this.state.login_form_data.password = ''; */
                        setUserSession(res_data.users.token, res_data.users);
                        //this.setState({ redirect: '/My-profile' });
                        // window.location.href = '/shorfa/#/My-profile';
                        if (localStorage.getItem('device_type') == 'web') {
                            // window.location.href = '/shorfa/#/My-profile';
                            // alert("sdf1");
                            // console.log(res_data.users);
                            if (window.callback != undefined) {
                                window.callback.login_success('{"user_id":"' + res_data.users.u_id + '","is_login":"1"}');
                            }

                            window.location.href = web_url;
                            //window.location.href = web_url + 'productdetail/' + this.props.match.params.product_id;

                        } else {
                            // console.log(res_data.users.u_id);
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
                        //this.setState({ error: res_data.message });
                    }
                    //this.setState({ button_disabled: false });
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

            /* console.log(errorCode);
            console.log(errorMessage); */
            // The email of the user's account used.
            //const email = error.customData.email;
            // AuthCredential type that was used.
            //const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
        });

}

const google_login = () => {
    // console.log("dsfsdfsd");
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

    // signInWithRedirect(auth, provider)
    signInWithPopup(auth, provider)
        .then((result) => {
            // console.log("Sdfsdfsd 12", result);
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;

            const user = result.user;

            var email = "";
            var displayname = "";
            var facebook_uid = "";
            var phonenumber = "";
            // console.log("user", user);
            if (user.providerData[0].email != undefined && user.providerData[0].email && user.providerData[0].email != "") {
                email = user.providerData[0].email;
            }
            if (user.email != undefined && user.email && user.email != "") {
                email = user.email;
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

            /* console.log(email);
            console.log(displayname);
            console.log(facebook_uid);
            console.log(phonenumber); */
            // return false;

            /*  */
            var user_data = getUserDetail();
            var login_id = user_data ? user_data.u_id : '';
            api_option.url = 'social_signin';
            api_option.data = { displayname: displayname, phonenumber: phonenumber, email: email, facebook_uid: facebook_uid };
            api_option.headers.Authorization = sessionStorage.getItem('token');
            const th = this;
            axios(api_option)
                .then(res => {
                    // console.log("11-05", res);
                    //this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        // alert("123", res_data.status);
                        // console.log("sdfsdfsjdlkj ", res_data.users);
                        toast.success("Login Successfully");
                        /* localStorage.email = this.state.login_form_data.email;
                        localStorage.password = this.state.login_form_data.password; */
                        localStorage.setItem('type', 1);
                        localStorage.removeItem('usr_id');
                        // localStorage.type = '1';
                        //this.setState({ show: false });
                        //window.$('#access-modal').modal('hide');
                        /* this.state.login_form_data.email = '';
                        this.state.login_form_data.password = ''; */
                        setUserSession(res_data.users.token, res_data.users);
                        //this.setState({ redirect: '/My-profile' });
                        // window.location.href = '/shorfa/#/My-profile';
                        if (localStorage.getItem('device_type') == 'web') {
                            // window.location.href = '/shorfa/#/My-profile';
                            // alert("sdf1");
                            // console.log(res_data.users);
                            if (window.callback != undefined) {
                                window.callback.login_success('{"user_id":"' + res_data.users.u_id + '","is_login":"1"}');
                            }

                            window.location.href = web_url;
                            //window.location.href = web_url + 'productdetail/' + this.props.match.params.product_id;

                        } else {
                            // console.log(res_data.users.u_id);
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
                        //this.setState({ error: res_data.message });
                    }
                    //this.setState({ button_disabled: false });
                })
                .catch(error => {
                    // this.setState({ redirect: '/logout' });
                });
            /*  */

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
            /* console.log(errorCode);
            console.log(errorMessage); */
            // ...
        });

    /* Firebase Auth End */
}

const facebook_data = () => {
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
            // console.log(user);

            var email = "";
            var displayname = "";
            var facebook_uid = "";
            var phonenumber = "";
            if (user.providerData[0].email != undefined && user.providerData[0].email && user.providerData[0].email != "") {
                email = user.providerData[0].email;
            }
            if (user.email != undefined && user.email && user.email != "") {
                email = user.email;
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

            /* console.log(email);
            console.log(displayname);
            console.log(facebook_uid);
            console.log(phonenumber); */

            /*  */
            var user_data = getUserDetail();
            var login_id = user_data ? user_data.u_id : '';
            api_option.url = 'social_signin';
            api_option.data = { displayname: displayname, phonenumber: phonenumber, email: email, facebook_uid: facebook_uid };
            api_option.headers.Authorization = sessionStorage.getItem('token');
            const th = this;
            axios(api_option)
                .then(res => {
                    //this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        // alert("123", res_data.status);
                        toast.success("Login Successfully");
                        // localStorage.email = this.state.login_form_data.email;
                        // localStorage.password = this.state.login_form_data.password;
                        localStorage.setItem('type', 1);
                        localStorage.removeItem('usr_id');
                        // localStorage.type = '1';
                        //this.setState({ show: false });
                        //window.$('#access-modal').modal('hide');
                        // this.state.login_form_data.email = '';
                        // this.state.login_form_data.password = '';
                        setUserSession(res_data.users.token, res_data.users);
                        //this.setState({ redirect: '/My-profile' });
                        // window.location.href = '/shorfa/#/My-profile';
                        if (localStorage.getItem('device_type') == 'web') {
                            // window.location.href = '/shorfa/#/My-profile';
                            // alert("sdf1");
                            // console.log(res_data.users);
                            if (window.callback != undefined) {
                                window.callback.login_success('{"user_id":"' + res_data.users.u_id + '","is_login":"1"}');
                            }

                            window.location.href = web_url;
                            //window.location.href = web_url + 'productdetail/' + this.props.match.params.product_id;

                        } else {
                            // console.log(res_data.users.u_id);
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
                        //this.setState({ error: res_data.message });
                    }
                    //this.setState({ button_disabled: false });
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
            /* console.log(error);
            console.log(errorCode);
            console.log(errorMessage); */
            // The email of the user's account used.
            //const email = error.customData.email;
            // AuthCredential type that was used.
            //const credential = FacebookAuthProvider.credentialFromError(error);
            // ...
        });

}
const facebook_login = () => {
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

    // signInWithRedirect(auth, provider)
    signInWithPopup(auth, provider)
        .then((result) => {
            // The signed-in user info.
            const user = result.user;
            // console.log(user);
            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;

            // console.log(user);

            var email = "";
            var displayname = "";
            var facebook_uid = "";
            var phonenumber = "";
            if (user.providerData[0].email != undefined && user.providerData[0].email && user.providerData[0].email != "") {
                email = user.providerData[0].email;
            }
            if (user.email != undefined && user.email && user.email != "") {
                email = user.email;
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

            /* console.log(email);
            console.log(displayname);
            console.log(facebook_uid);
            console.log(phonenumber); */

            /*  */
            var user_data = getUserDetail();
            var login_id = user_data ? user_data.u_id : '';
            api_option.url = 'social_signin';
            api_option.data = { displayname: displayname, phonenumber: phonenumber, email: email, facebook_uid: facebook_uid };
            api_option.headers.Authorization = sessionStorage.getItem('token');
            const th = this;
            axios(api_option)
                .then(res => {
                    //this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        // alert("123", res_data.status);
                        toast.success("Login Successfully");
                        // localStorage.email = this.state.login_form_data.email;
                        // localStorage.password = this.state.login_form_data.password;
                        localStorage.setItem('type', 1);
                        localStorage.removeItem('usr_id');
                        // localStorage.type = '1';
                        //this.setState({ show: false });
                        //window.$('#access-modal').modal('hide');
                        // this.state.login_form_data.email = '';
                        // this.state.login_form_data.password = '';
                        setUserSession(res_data.users.token, res_data.users);
                        //this.setState({ redirect: '/My-profile' });
                        // window.location.href = '/shorfa/#/My-profile';
                        if (localStorage.getItem('device_type') == 'web') {
                            // window.location.href = '/shorfa/#/My-profile';
                            // alert("sdf1");
                            // console.log(res_data.users);
                            if (window.callback != undefined) {
                                window.callback.login_success('{"user_id":"' + res_data.users.u_id + '","is_login":"1"}');
                            }

                            window.location.href = web_url;
                            //window.location.href = web_url + 'productdetail/' + this.props.match.params.product_id;

                        } else {
                            // console.log(res_data.users.u_id);
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
                        //this.setState({ error: res_data.message });
                    }
                    //this.setState({ button_disabled: false });
                })
                .catch(error => {
                    // this.setState({ redirect: '/logout' });
                });

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
            /*  console.log(errorCode);
             console.log(errorMessage); */
            // ...
        });

    /* Firebase Auth End */
}

export { api_option, currency, api_url, web_url, getModuleAccess, getToken, removeUserSession, setUserSession, is_login, getUserDetail, getUserId, google_data, google_login, facebook_data, facebook_login, apple_login, apple_data };