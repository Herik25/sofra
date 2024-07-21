import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail, getUserId, web_url } from '../api/Helper';
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

class MobileOTP extends Component {
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
            otp_form_data: { otp: '' },
            redirect: '',
            error: '',
        }
        this.state = this.initialState;
        this.handleOTP = this.handleOTP.bind(this);
        this.handleChangeOTP = this.handleChangeOTP.bind(this);
        this.resendOTP = this.resendOTP.bind(this);

    }

    resendOTP(event) {

        event.preventDefault();
        api_option.url = 'resend_otp';
        console.log(localStorage.getItem('usr_id'))
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

    componentDidMount() {

    }



    handleChangeOTP(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.otp_form_data[name] = value;
        this.setState({ data });
    }

    handleOTP(event) {
        event.preventDefault();

        api_option.url = 'otp_verification';
        api_option.data = this.state.otp_form_data;
        axios(api_option)
            .then(res => {
                const res_data = res.data;
                if (res_data.status) {
                    this.state.otp_form_data.otp = '';
                    toast.success("Otp verification completed");

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
                        // window.location.href = web_url + '/shorfa/#/My-profile';
                        window.location.href = web_url;
                    } else {
                        window.location.href = web_url;
                        // this.setState({ redirect: '/My-profile' });
                    }
                } else {
                    toast.error("Invalid Otp");
                }
            })
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

                    </div>
                    <div class="ls-wrapper">
                        <form onSubmit={this.handleOTP}>
                            <h5 class="title">OTP Verification</h5>
                            <div class="access-input-group">

                                <input type="text" class="text-control" placeholder="OTP" name="otp" id="otp" maxLength="4" data-validation="required" value={this.state.otp_form_data.otp} onChange={this.handleChangeOTP} />

                            </div>

                            <button class="btn btn-primary btn-block">Verify OTP</button>
                            <a onClick={this.resendOTP} style={{ marginTop: "10px", cursor: "pointer" }}>Don't receive the OTP? Resend OTP</a>
                        </form>
                    </div>
                </div>



            </>
        );
    }
}
export default MobileOTP;
