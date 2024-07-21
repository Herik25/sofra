import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { api_option, setUserSession, is_login } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import queryString from 'query-string';
import swal from 'sweetalert';
// import Select from 'react-select';
// import $ from 'jquery';
// import { Helmet } from "react-helmet";
class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        let url = this.props.location.search;
        let params = queryString.parse(url);

        // login form data

        this.initialState = {
            form_data: { code: '', password: '', confirmpassword: '' },
            error: ''
        }

        this.state = this.initialState;
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.check_code(params.code);
    }

    componentDidMount() {

    }

    check_code(code) {
        if (code) {
            api_option.url = 'forgot_password_code_check';
            api_option.data = { code: code };

            axios(api_option)
                .then(res => {
                    const res_data = res.data;
                    if (res_data.status) {
                        var data = this.state.form_data.code = code;
                        this.setState({ data });
                    } else {
                        this.props.history.push('/home');
                    }
                })
                .catch(error => console.log(error));
        } else {
            this.props.history.push('/login');
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
        event.preventDefault();
        // validation.validate().then(function(status) {
        if (!this.validator.allValid()) {
            this.validator.showMessages();
            this.forceUpdate();
        } else {

            api_option.url = 'reset_password';
            api_option.data = this.state.form_data;

            axios(api_option)
                .then(res => {
                    const res_data = res.data;
                    if (res_data.status) {
                        toast.success(res.data.message);
                        this.props.history.push('/');

                    } else {

                        toast.error(res.data.message);

                        //this.setState({error:res_data.message});
                    }
                })
                .catch(error => console.log(error));
        }
        // })

    }
    // view load header page
    render() {

        return (
            <>

                <ToastContainer />

                <div class="access-container resetpwd">
                    <div class="container" id="container">
                        <div class="form-container reset-password-container">
                            <form className="form" id="kt_reset_password_form" onSubmit={this.handleSubmit}>
                                <h5 class="title">Reset Password</h5>
                                <div class="access-input-group">
                                    <input type="password" name="password" id="password" placeholder="Password" data-validation="required" value={this.state.form_data.password} onChange={this.handleChange} />

                                    <input type="password" name="confirmpassword" id="confirmpassword" placeholder="Confirm Password" data-validation="required" value={this.state.form_data.confirmpassword} onChange={this.handleChange} />

                                </div>
                                <button class="btn btn-primary">Reset Password</button>
                            </form>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default ResetPassword;
