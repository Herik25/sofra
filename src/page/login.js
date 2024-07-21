import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail, getUserId, web_url, google_data, google_login, facebook_data, facebook_login } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import { Helmet } from "react-helmet";
import Select from 'react-select';
import { Multiselect } from 'multiselect-react-dropdown';
import $ from 'jquery';

// import $ from 'jquery';
// import { Helmet } from "react-helmet";

class Login extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        var user_email = (user_data) ? user_data.u_email : '';
        var user_name = (user_data) ? user_data.u_name : '';
        var user_mobile = (user_data) ? user_data.u_mobile : '';
        // login form data

        const seller_id = this.props.match.params.seller_id;

        this.initialState = {
            form_data: { email: '', password: '' },
            redirect: '',
            error: '',
        }
        this.state = this.initialState;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        facebook_data();
        google_data();
    }

    componentDidMount() {
        if (localStorage.email !== "") {
            var data = this.state.form_data['email'] = localStorage.email;
            this.setState({ data });
            var data = this.state.form_data['password'] = localStorage.password;
            this.setState({ data });
        }
    }



    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
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

        api_option.url = 'user_login';
        api_option.data = this.state.form_data;

        axios(api_option)
            .then(res => {
                const res_data = res.data;
                if (res_data.status) {
                    toast.success("Login Successfully");
                    localStorage.email = this.state.form_data.email;
                    localStorage.password = this.state.form_data.password;
                    localStorage.setItem('type', 1);
                    localStorage.removeItem('usr_id');
                    this.state.form_data.email = '';
                    this.state.form_data.password = '';
                    setUserSession(res_data.users.token, res_data.users);
                    //this.setState({ redirect: '/My-profile' });
                    //window.location.href = '/shorfa/#/My-profile';
                    if (localStorage.getItem('device_type') == 'web') {
                        // /shorfa
                        window.location.href = web_url;
                    } else {
                        window.location.href = web_url;
                        // this.setState({ redirect: '/My-profile' });
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




    // view load header page
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>
                <Helmet>
                    <script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/jquery.validate/1.13.1/jquery.validate.js"></script>

                </Helmet>
                <ToastContainer />
                <div class="ls-page">
                    <div class="ls-top">
                        <NavLink exact to={'/Home/'} class="navbar-brand"><img src="/assets/images/logo.png" /></NavLink>
                        <NavLink exact to={'/Register/'} class="ls-button">Sign Up</NavLink>
                    </div>
                    <div class="ls-wrapper">
                        <form onSubmit={this.handleSubmit}>
                            <h5 class="title">Sign in</h5>
                            <div class="access-input-group">

                                <input type="text" class="text-control" placeholder="Email" name="email" id="email" data-validation="required email" value={this.state.form_data.email} onChange={this.handleChange} />
                                {this.validator.message('email', this.state.form_data.email, 'required')}
                                <input type="password" class="text-control" placeholder="Password" name="password" id="password" value={this.state.form_data.password} onChange={this.handleChange} data-validation="required" />
                                {this.validator.message('password', this.state.form_data.password, 'required')}
                            </div>
                            <NavLink exact to={'/mobile-forgot/'} class="pw-recover">Forgot your password?</NavLink>
                            <button class="btn btn-primary btn-block">Sign In</button>
                            <span class="or">or use your account</span>
                            <div class="social-container">
                                <a href="javascript:void(0)" class="social" onClick={google_login}><i class="bi bi-google"></i></a>
                                <a href="javascript:void(0)" class="social" onClick={facebook_login}><i class="bi bi-facebook"></i></a>
                                {/* <a href="javascript:void(0)" class="social"><i class="bi bi-twitter"></i></a> */}
                            </div>

                            {/* <div class="social-container">
                                <a href="javascript:void(0)" class="social"><i class="bi bi-google"></i>Google</a>
                                <a href="javascript:void(0)" class="social"><i class="bi bi-facebook"></i>Facebook</a>
                                <a href="javascript:void(0)" class="social"><i class="bi bi-twitter"></i>Twitter</a>
                            </div> */}


                        </form>
                    </div>
                </div>



            </>
        );
    }
}
export default Login;
