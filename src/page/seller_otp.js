import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession, is_login } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SweetAlert from 'react-bootstrap-sweetalert';
import swal from 'sweetalert';
// import Select from 'react-select';
// import $ from 'jquery';
// import { Helmet } from "react-helmet";

class SellerOTP extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        const seller_id = this.props.match.params.seller_id;

        // if (is_login()) {
        //     alert('login');
        // }else{
        //     alert('logout');
        // }

        // login form data
        var email = "";
        if (localStorage.getItem('selleremail')) {
            email = localStorage.getItem('selleremail');
        }

        this.initialState = {
            form_data: { otp: '', seller_id: seller_id, email: email },
            dashboard_form_data: {
                ts_id: 1,
                ts_title: '',
                ts_b_image: '',
                image: [],
                ts_desc: '',

                ts_icon1: '',
                icon1: [],
                ts_icon2: '',
                icon2: [],
                ts_icon3: '',
                icon3: [],
                ts_title1: '',
                ts_desc1: '',
                ts_title2: '',
                ts_desc2: '',
                ts_title3: '',
                ts_desc3: '',
            },
            error: ''
        }

        this.state = this.initialState;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.resendOTP = this.resendOTP.bind(this);
        this.get_form_data();

    }

    componentDidMount() {

    }

    resendOTP(event) {
        event.preventDefault();
        api_option.url = 'resend_otp';
        api_option.data = { id: this.state.form_data.seller_id };

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

    async get_form_data(props) {

        api_option.url = 'get_sel_dashboard_detail';
        api_option.data = { id: 1 };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    this.setState(this.state.dashboard_form_data = res.data.data);

                } else {
                    this.setState({ redirect: '/sellerdashboard-manage/' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });

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
        api_option.url = 'otp_verification';
        api_option.data = this.state.form_data;

        axios(api_option)
            .then(res => {
                const res_data = res.data;

                if (res_data.status) {
                    toast.success(res.data.message);
                    localStorage.email = this.state.form_data.email;
                    localStorage.password = this.state.form_data.password;
                    localStorage.type = '3';
                    localStorage.status = res_data.users.u_is_active;
                    toast.success(res.data.message);
                    this.state.form_data.email = '';
                    this.state.form_data.name = '';
                    this.state.form_data.password = '';
                    setUserSession(res_data.users.token, res_data.users);
                    this.setState({ redirect: '/Seller-profile/' + this.state.form_data.seller_id });
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
                <div className="seller-signup-wrapper" style={{ background: "unset", backgroundImage: "url('" + this.state.dashboard_form_data.ts_b_image + "')", backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                    <div className="container">
                        <div className="seller-hero">
                            <div className="seller-hero-content">
                                <h1>{this.state.dashboard_form_data.ts_title}</h1>
                            </div>
                            {/* <img src="/assets/images/seller/19.png" className="seller-hero-object" /> */}
                        </div>
                    </div>
                </div>

                <div className="seller-signup">
                    <div className="container">
                        <div className="row d-flex align-items-center justify-content-center">
                            <div className="col-md-5">
                                <div className="grid-1">
                                    <div className="feature-box">
                                        <div className="featurebox-img"><img src={this.state.dashboard_form_data.ts_icon1} /></div>
                                        <div className="featurebox-content">
                                            <h3>{this.state.dashboard_form_data.ts_title1}</h3>
                                            <p>{this.state.dashboard_form_data.ts_desc1}</p>
                                        </div>
                                    </div>
                                    <div className="feature-box">
                                        <div className="featurebox-img"><img src={this.state.dashboard_form_data.ts_icon2} /></div>
                                        <div className="featurebox-content">
                                            <h3>{this.state.dashboard_form_data.ts_title2}</h3>
                                            <p>{this.state.dashboard_form_data.ts_desc2}</p>
                                        </div>
                                    </div>
                                    <div className="feature-box">
                                        <div className="featurebox-img"><img src={this.state.dashboard_form_data.ts_icon3} /></div>
                                        <div className="featurebox-content">
                                            <h3>{this.state.dashboard_form_data.ts_title3}</h3>
                                            <p>{this.state.dashboard_form_data.ts_desc3}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 offset-md-1">
                                <form id="kt_login_signin_form" onSubmit={this.handleSubmit}>
                                    <input type='hidden' value={this.state.form_data.email} name='email' />
                                    <div className="form-group">
                                        <label>OTP</label>
                                        <input type="text" className="text-control" name="otp" id="otp" maxLength="4" placeholder="OTP" data-validation="required" value={this.state.form_data.otp} onChange={this.handleChange} />
                                    </div>

                                    <button className="btn btn-primary btn-block">Submit</button>
                                    {/* <button class="btn btn-success" style={{ marginLeft: "180px", marginTop: "10px" }} onClick={this.resendOTP}>Resend OTP</button> */}
                                    <a onClick={this.resendOTP} style={{ marginTop: "10px", cursor: "pointer" }}>Don't receive the OTP? Resend OTP</a>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="seller-faqs">
                    <div className="container">
                        <div className="row d-flex justify-content-center">
                            <div className="col-md-8">
                                <div className="title-section text-center">

                                    <h2 className="title">Common Questions</h2>
                                </div>
                                <ul className="accordion">
                                    <li>
                                        <a className="ac-title">Who takes care of packaging? If I take care of packaging, where do I get the packaging material from?</a>
                                        <div className="ac-content">
                                            <p>Packaging depends on your which fulfillment option you use to deliver your products. With FBA, we take care of packaging your product in a delivery box. With Easy Ship and Self Ship, you will have to take care of packaging, and you can purchase Shorfa packaging material.</p>
                                        </div>
                                    </li>
                                    <li>
                                        <a className="ac-title">Who takes care of shipping? </a>
                                        <div className="ac-content">
                                            <p>This depends on which fulfillment option you use to deliver your products. With FBA & Easy Ship, Shorfa will handle the delivery of products to customers (and returns). When you choose Self-ship, you will deliver the products yourself where you can use third party courier services or your own delivery associates (for Local Shops)</p>
                                        </div>
                                    </li>
                                    <li>
                                        <a className="ac-title">What are the different fees applicable when I sell on Shorfa?</a>
                                        <div className="ac-content">
                                            <p>Shorfa charges two common fees: Referral Fees (% fee based on your product category) and Closing Fee (flat fee for every order placed). The remaining fees will be charged based on your fulfillment option & program/service you are availing from Shorfa.</p>
                                        </div>
                                    </li>
                                    <li>
                                        <a className="ac-title">How can I calculate fees  that I have to pay to Shorfa for my products?</a>
                                        <div className="ac-content">
                                            <p>To calculate your fees, you would first need to understand the Shorfa Fulfillment options available to you, and choose which one you would be using for your products. Many sellers choose combinations of fulfillment options.</p>
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
export default SellerOTP;
