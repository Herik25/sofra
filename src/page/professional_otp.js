import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
// import Select from 'react-select';
// import $ from 'jquery';
// import { Helmet } from "react-helmet";
class ProfessionalOTP extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        const professional_id = this.props.match.params.professional_id;

        // login form data

        var email = "";
        if (localStorage.getItem('professionalemail')) {
            email = localStorage.getItem('professionalemail');
        }

        this.initialState = {
            form_data: { otp: '', professional_id: professional_id, email: '', password: '', email: email },
            dashboard_form_data: {
                tp_id: 1,
                tp_title: '',
                tp_b_image: '',
                image: [],
                tp_desc: '',
                tp_happy_customer: '',
                tp_service_category: '',
                tp_service_profession: '',
                tp_city: '',
                tp_image1: '',
                image1: [],
                tp_image2: '',
                image2: [],
                tp_icon1: '',
                icon1: [],
                tp_icon2: '',
                icon2: [],
                tp_icon3: '',
                icon3: [],
                tp_title1: '',
                tp_desc1: '',
                tp_title2: '',
                tp_desc2: '',
                tp_title3: '',
                tp_desc3: '',
            },
            error: ''
        }

        this.state = this.initialState;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.resendOTP = this.resendOTP.bind(this);
        this.get_form_data();
    }

    async get_form_data(props) {

        api_option.url = 'get_prof_dashboard_detail';
        api_option.data = { id: 1 };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    this.setState(this.state.dashboard_form_data = res.data.data);

                } else {
                    this.setState({ redirect: '/professionaldashboard-manage/' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });


    }


    async get_form_data(props) {

        api_option.url = 'get_prof_dashboard_detail';
        api_option.data = { id: 1 };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    this.setState(this.state.dashboard_form_data = res.data.data);

                } else {
                    this.setState({ redirect: '/professionaldashboard-manage/' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });


    }

    componentDidMount() {

    }


    resendOTP(event) {
        // http://localhost:3000/#/Seller-otp/201
        event.preventDefault();
        api_option.url = 'resend_otp';
        api_option.data = { id: this.state.form_data.professional_id };

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



    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
    }

    // form submit event
    // form submit event
    handleSubmit(event) {
        event.preventDefault();
        api_option.url = 'otp_verification';
        api_option.data = this.state.form_data;

        axios(api_option)
            .then(res => {
                const res_data = res.data;
                if (res_data.status) {
                    toast.success(res.data.message);
                    localStorage.email = this.state.form_data.email;
                    localStorage.password = this.state.form_data.password;
                    localStorage.type = '2';
                    toast.success(res.data.message);
                    this.state.form_data.email = '';
                    this.state.form_data.name = '';
                    this.state.form_data.password = '';
                    setUserSession(res_data.users.token, res_data.users);
                    this.setState({ redirect: '/Setup-profile/' + this.state.form_data.professional_id });
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(error => console.log(error));
        //}

    }




    // view load header page
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>
                <ToastContainer />
                <div className="professional-signup-wrapper" style={{ background: "unset", backgroundImage: "url('" + this.state.dashboard_form_data.tp_b_image + "')", backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                    <div className="container">
                        <div className="professional-hero">
                            <div className="professional-hero-content">
                                <h1>{this.state.dashboard_form_data.tp_title}</h1>
                                <p>{this.state.dashboard_form_data.tp_desc}</p>
                                {/* <a href="javascript:void(0)">
                                    <div className="video-button">
                                        <span className="play-icon"></span>
                                        <span>Learn More</span>
                                    </div>
                                </a> */}
                            </div>
                            {/* <img src="/assets/images/professional/8.png" className="professional-hero-object" /> */}

                        </div>
                    </div>
                </div>
                <div className="clearfix"></div>

                <div className="seller-signup">
                    <div className="container">
                        <div className="row d-flex align-items-center justify-content-center">
                            <div className="col-md-5">
                                <div className="grid-1">
                                    <div className="feature-box">
                                        <div className="featurebox-img"><img src={this.state.dashboard_form_data.tp_icon1} /></div>
                                        <div className="featurebox-content">
                                            <h3>{this.state.dashboard_form_data.tp_title1}</h3>
                                            <p>{this.state.dashboard_form_data.tp_desc1}.</p>
                                        </div>
                                    </div>
                                    <div className="feature-box">
                                        <div className="featurebox-img"><img src={this.state.dashboard_form_data.tp_icon2} /></div>
                                        <div className="featurebox-content">
                                            <h3>{this.state.dashboard_form_data.tp_title2}</h3>
                                            <p>{this.state.dashboard_form_data.tp_desc2}.</p>
                                        </div>
                                    </div>
                                    <div className="feature-box">
                                        <div className="featurebox-img"><img src={this.state.dashboard_form_data.tp_icon3} /></div>
                                        <div className="featurebox-content">
                                            <h3>{this.state.dashboard_form_data.tp_title3}</h3>
                                            <p>{this.state.dashboard_form_data.tp_desc3}.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 offset-md-1">
                                <div className="professional-hero-form">
                                    <form id="kt_login_signin_form" onSubmit={this.handleSubmit}>
                                        <input type='hidden' value={this.state.form_data.email} name='email' />
                                        <div className="form-group">
                                            <label>OTP</label>
                                            <input type="text" className="text-control" name="otp" id="otp" maxLength="4" placeholder="OTP" data-validation="required" value={this.state.form_data.otp} onChange={this.handleChange} />
                                        </div>
                                        <button className="btn btn-primary btn-block">Submit</button>
                                        <a onClick={this.resendOTP} style={{ marginTop: "10px", cursor: "pointer" }}>Don't receive the OTP? Resend OTP</a>


                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="grid-4">
                        <div className="stats">
                            <strong>{this.state.dashboard_form_data.tp_happy_customer}</strong>
                            <span>Happy Customer</span>
                        </div>
                        <div className="stats">
                            <strong>{this.state.dashboard_form_data.tp_service_category}</strong>
                            <span>Service Categories</span>
                        </div>
                        <div className="stats">
                            <strong>{this.state.dashboard_form_data.tp_service_profession}</strong>
                            <span>Trusted Service Professionels</span>
                        </div>
                        <div className="stats">
                            <strong>{this.state.dashboard_form_data.tp_city}</strong>
                            <span>Cities</span>
                        </div>
                    </div>
                </div>

                <div className="professional-features">
                    <div className="container">
                        <div className="row d-flex align-items-center justify-content-center">
                            <div className="col-md-12">
                                <img src={this.state.dashboard_form_data.tp_image1} />
                            </div>
                            <div className="col-md-5" style={{ display: 'none' }}>
                                <div className="grid-1">
                                    <div className="feature-box">
                                        <div className="featurebox-img"><img src={this.state.dashboard_form_data.tp_icon1} /></div>
                                        <div className="featurebox-content">
                                            <h3>{this.state.dashboard_form_data.tp_title1}</h3>
                                            <p>{this.state.dashboard_form_data.tp_desc1}.</p>
                                        </div>
                                    </div>
                                    <div className="feature-box">
                                        <div className="featurebox-img"><img src={this.state.dashboard_form_data.tp_icon2} /></div>
                                        <div className="featurebox-content">
                                            <h3>{this.state.dashboard_form_data.tp_title2}</h3>
                                            <p>{this.state.dashboard_form_data.tp_desc2}.</p>
                                        </div>
                                    </div>
                                    <div className="feature-box">
                                        <div className="featurebox-img"><img src={this.state.dashboard_form_data.tp_icon3} /></div>
                                        <div className="featurebox-content">
                                            <h3>{this.state.dashboard_form_data.tp_title3}</h3>
                                            <p>{this.state.dashboard_form_data.tp_desc3}.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="seller-faqs">
                    <div className="container">
                        <div className="row d-flex justify-content-center">
                            <div className="col-md-8">
                                <div className="title-section text-center">
                                    <h5 className="sub">FAQs</h5>
                                    <h2 className="title">Common Questions</h2>
                                </div>
                                <ul className="accordion">
                                    <li>
                                        <a className="ac-title">{this.state.dashboard_form_data.tp_question}</a>
                                        <div className="ac-content">
                                            <p>{this.state.dashboard_form_data.tp_answer}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <a className="ac-title">{this.state.dashboard_form_data.tp_question1}</a>
                                        <div className="ac-content">
                                            <p>{this.state.dashboard_form_data.tp_answer1}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <a className="ac-title">{this.state.dashboard_form_data.tp_question2}</a>
                                        <div className="ac-content">
                                            <p>{this.state.dashboard_form_data.tp_answer2}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <a className="ac-title">{this.state.dashboard_form_data.tp_question3}</a>
                                        <div className="ac-content">
                                            <p>{this.state.dashboard_form_data.tp_answer3}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }
}
export default ProfessionalOTP;
