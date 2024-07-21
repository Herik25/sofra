import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail, getUserId } from '../api/Helper';
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

class MobileForgot extends Component {
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
            forgot_form_data: { email: '' },
            redirect: '',
            error: '',
        }
        this.state = this.initialState;
        this.handleForgot = this.handleForgot.bind(this);
        this.handleChangeforgot = this.handleChangeforgot.bind(this);

    }



    componentDidMount() {

    }



    handleChangeforgot(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.forgot_form_data[name] = value;
        this.setState({ data });
    }

    handleForgot(event) {
        event.preventDefault();
        api_option.url = 'forgot_password';
        api_option.data = this.state.forgot_form_data;
        axios(api_option)
            .then(res => {
                const res_data = res.data;
                if (res_data.status) {
                    toast.success(res_data.message);
                    this.state.forgot_form_data.email = '';
                } else {
                    toast.error(res_data.message);
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
                        <form onSubmit={this.handleForgot}>
                            <h5 class="title">Forgot Password</h5>
                            <div class="access-input-group">

                                <input type="text" class="text-control" placeholder="Email" name="email" id="email" data-validation="required email" value={this.state.forgot_form_data.email} onChange={this.handleChangeforgot} />

                            </div>

                            <button class="btn btn-primary btn-block">Forgot Password</button>
                            <div className="text-center">
                                <NavLink exact to={'/Login/'} style={{ marginTop: "10px", cursor: "pointer" }} class="btn btn-primary">Back to login</NavLink>
                            </div>
                        </form>
                    </div>
                </div>



            </>
        );
    }
}
export default MobileForgot;
