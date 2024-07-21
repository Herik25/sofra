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

class Register extends Component {
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


        this.initialState = {
            register_form_data: { name: '', mobile: '', email: '', password: '' },
            error: ''
        }

        this.state = this.initialState;
        this.handleSaveData = this.handleSaveData.bind(this);
        this.handleChangeRegister = this.handleChangeRegister.bind(this);

        facebook_data();
        google_data();
        //  this.get_form_data();
    }

    componentDidMount() {

    }



    handleChangeRegister(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.register_form_data[name] = value;
        this.setState({ data });
    }

    handleSaveData(event) {
        event.preventDefault();
        //  if(!this.validator.allValid()){
        //      this.validator.showMessage();
        //      this.forceUpdate();
        //  }else{
        api_option.url = 'save_user_data';
        api_option.data = this.state.register_form_data;
        axios(api_option)
            .then(res => {
                const res_data = res.data;
                if (res_data.status) {

                    this.state.register_form_data.email = '';
                    this.state.register_form_data.name = '';
                    this.state.register_form_data.mobile = '';
                    this.state.register_form_data.password = '';
                    toast.success(res_data.message);
                    localStorage.setItem('usr_id', res_data.user_id);
                    this.setState({ redirect: '/mobile-otp' });



                } else {
                    toast.error(res_data.message);
                }
            })
        //}
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
                        <NavLink exact to={'/Login/'} class="ls-button">Sign In</NavLink>
                    </div>
                    <div class="ls-wrapper">
                        <form onSubmit={this.handleSaveData}>
                            <h5 class="title">Create Account</h5>
                            <div class="access-input-group">
                                <input type="text" name="name" class="text-control" id="name" placeholder="Name" data-validation="required" value={this.state.register_form_data.name} onChange={this.handleChangeRegister} />
                                <input type="email" name="email" id="email" class="text-control" placeholder="Email" data-validation="required email" value={this.state.register_form_data.email} onChange={this.handleChangeRegister} />

                                <input type="text" name="mobile" id="mobile" placeholder="Mobile" class="text-control" data-validation="required mobile" value={this.state.register_form_data.mobile} onChange={this.handleChangeRegister} />

                                <input type="password" name="password" id="password" class="text-control" placeholder="Password" data-validation="required" value={this.state.register_form_data.password} onChange={this.handleChangeRegister} />
                            </div>
                            <button class="btn btn-primary btn-block">Create an Account</button>
                            <span class="or">or use your account</span>
                            <div class="social-container">
                                <a href="javascript:void(0)" class="social" onClick={google_login}><i class="bi bi-google"></i></a>
                                <a href="javascript:void(0)" class="social" onClick={facebook_login}><i class="bi bi-facebook"></i></a>
                                {/* <a href="javascript:void(0)" class="social"><i class="bi bi-twitter"></i></a> */}
                            </div>
                        </form>
                    </div>
                </div>



            </>
        );
    }
}
export default Register;
