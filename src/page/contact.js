import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import Loader from "react-loader";
import { Helmet } from "react-helmet";
// import Select from 'react-select';
import $ from 'jquery';
// import { Helmet } from "react-helmet";
class Contact extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();


        // login form data

        this.initialState = {
            form_data: { uname: '', email: '', mobile: '', message: '' },

            error: '',
            loaded: true
        }

        this.state = this.initialState;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);


    }

    componentDidMount() {

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
        if (!this.validator.allValid()) {
            this.validator.showMessages();
            this.forceUpdate();
        } else {
            this.setState({ loaded: false });
            api_option.url = 'save_inquiry';
            api_option.data = this.state.form_data;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        $('#uname').val('');
                        $('#email').val('');
                        $('#mobile').val('');
                        $('#message').val('');
                        toast.success('Thank you for submitting your Inquiry, Our team will contact you soon.');
                        // this.setState({ redirect: '/contact' });
                    } else {

                        toast.error(res.data.message);

                        //this.setState({error:res_data.message});
                    }
                })
                .catch(error => console.log(error));
        }
    }




    // view load header page
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>
                <Helmet>
                    <script src="/assets/js/accordion.js"></script>
                </Helmet>
                <ToastContainer />
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
                <div class="bg-blue">
                    <div class="container">
                        <div class="projects-cat">
                            <div class="pCat-title w-100">
                                <span>Contact Us</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="contact-main mt-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7 m-auto">
                                <form id="kt_login_signin_form" onSubmit={this.handleSubmit}>
                                    <div className="form-group">
                                        <label>Name</label>
                                        <input type="text" className="text-control" name="uname" id="uname" placeholder="Name" data-validation="required" value={this.state.form_data.uname} onChange={this.handleChange} />
                                        {this.validator.message('Name', this.state.form_data.uname, 'required')}
                                    </div>

                                    <div className="form-group">
                                        <label>Email ID</label>
                                        <input type="email" className="text-control" name="email" id="email" placeholder="Email" data-validation="required email" value={this.state.form_data.email} onChange={this.handleChange} />
                                        {this.validator.message('Email', this.state.form_data.email, 'required')}
                                    </div>

                                    <div className="form-group">
                                        <label>Mobile Number</label>
                                        <input type="text" className="text-control" name="mobile" id="mobile" placeholder="Mobile" data-validation="required number" value={this.state.form_data.mobile} onChange={this.handleChange} />
                                        {this.validator.message('Mobile', this.state.form_data.mobile, 'required')}
                                    </div>

                                    <div className="form-group">
                                        <label>Message</label>
                                        <textarea type="text" name="message" className="text-control" id="message" onChange={this.handleChange}>{this.state.form_data.message}</textarea>


                                        {this.validator.message('Message', this.state.form_data.message, 'required')}
                                    </div>

                                    <button className="btn btn-primary btn-block">Submit</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>






            </>
        );
    }
}
export default Contact;
