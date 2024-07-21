import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession, web_url, getUserDetail } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import Loader from "react-loader";
import { Helmet } from "react-helmet";
// import Select from 'react-select';
import $ from 'jquery';
import { PayPalButton } from "react-paypal-button-v2";
// import { Helmet } from "react-helmet";
class Payment_form extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();


        // login form data

        this.initialState = {
            subscription_payment_price: 0,
            form_data: { uname: '', company: '', email: '', mobile: '', message: '' },
            payment_btn_show: 0,
            payment_id: 0,
            error: '',
            loaded: true,
            paypal_price: 0,
        }

        this.footerState = {
            footer_form_data: {
                detail_data: ''
            },
            error: ''
        }

        this.state = this.initialState;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.get_cms_detail();
        this.get_settings_data();
    }

    componentDidMount() {

    }

    async convert_to_usd(props) {
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';
        const id = this.props.match.params.grand_total;
        var th = this;
        var amount = parseInt(this.state.subscription_payment_price);

        api_option.url = 'exchangerates_api';
        api_option.data = { amount: amount };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        /* api_option.headers['Content-Type'] = "text/plain";
        api_option.headers['apikey'] = "pMZCcQwEEWkedqpZmpHRFCW2khwt1pVF"; */
        await axios(api_option)
            .then(res => {
                // console.log(res.data.data['result']);
                if (res.data.data['result'] != undefined) {
                    var data = this.state.paypal_price = parseInt(res.data.data['result']);
                    this.setState({ data });
                }
                // res.data.data.result
                /* var data = this.state.paypal_price = parseInt(this.state.order_data.o_total) + parseInt(this.state.order_data.o_shipping_amount);
                this.setState({ data }); */

                console.log(this.state.paypal_price);
                console.log(res);
            })
            .catch(error => {
                //  this.setState({ redirect: '/logout' });
            });


    }

    async get_cms_detail() {
        const cms_id = this.props.match.params.cms_id;

        api_option.url = 'get_front_cms_detail';
        api_option.data = { cms_id: 'subscriptionpayment' };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    var detail_data = res.data.data;
                    this.setState(this.footerState.footer_form_data.detail_data = detail_data);

                } else {
                    this.setState({ redirect: '/logout' });
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
        if (!this.validator.allValid()) {
            this.validator.showMessages();
            this.forceUpdate();
        } else {
            this.setState({ loaded: false });
            api_option.url = 'make_payment_form';
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
                        toast.success('Thank you for submitting Subscription Payment.');

                        var data = this.state['payment_btn_show'] = 1;
                        this.setState({ data });

                        var data = this.state['payment_id'] = res_data.payment_id;
                        this.setState({ data });

                        setTimeout(function () {
                            // window.location.href = "https://sandbox.api.visa.com/acs/v1";
                        }, 1000)

                        // this.setState({ redirect: '/contact' });
                    } else {

                        toast.error(res.data.message);

                        //this.setState({error:res_data.message});
                    }
                })
                .catch(error => console.log(error));
        }
    }

    async get_settings_data() {
        api_option.url = 'settings_data';
        api_option.data = {};
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var data = this.state['subscription_payment_price'] = res.data.settings_data.subscription_payment_price;
                    this.setState({ data });
                    this.convert_to_usd();
                } else {
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }




    // view load header page
    render() {

        const onSuccess = (details, data) => {

            console.log(details);
            console.log(data);
            console.log("Transaction completed by " + details.payer.name.given_name);

            /*  */
            var user_data = getUserDetail();
            var user_id = user_data ? user_data.u_id : '';
            const id = this.state.payment_id;
            var th = this;
            api_option.url = 'save_paypal_detail_for_subscription';
            api_option.data = { paypal_id: details.id, paypal_status: details.status, paypal_data: JSON.stringify(details), order_id: id };
            api_option.headers.Authorization = sessionStorage.getItem('token');
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        /* th.setState(this.state.order_data = res.data.data);
                        th.setState(this.state.product_data = res.data.product_data);
                        console.log(this.state.order_data);
                        console.log(this.state.product_data); */

                        window.location.href = web_url;

                    } else {
                        // this.setState({ is_data: false });
                        // this.setState({ redirect: '/logout' });
                        // this.setState({ redirect: '/ProductList/' });
                    }
                })
                .catch(error => {
                    //  this.setState({ redirect: '/logout' });
                });
            /*  */

            // OPTIONAL: Call your server to save the transaction
            return fetch("/paypal-transaction-complete", {
                method: "post",
                body: JSON.stringify({
                    orderID: data.orderID
                })
            });
        }

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        //let env = 'sandbox'; // you can set here to 'production' for production
        let env = 'production'; // you can set here to 'production' for production
        let currency = 'USD'; // or you can set this value from your props or state
        let total = this.state.total; // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout
        // Document on Paypal's currency code: https://developer.paypal.com/docs/classic/api/currency_codes/

        // AdCbdHUjG1FP44SLO2ZqzpKp1CSmke-8RU32qSkGljyaMF27GVqBH6CG33vJQ8aabazgPTqO_yIkwm_D
        const client = {
            sandbox: 'ED1L3FH2jIsV6cuwmfsN6a7JSpfc5gqIHdSrq6j_ywScPMDvObqQEQojcWFOJinnYyJZ5_vF5ix_BhSv',
            production: 'ECerFUYVkPcp-Q3P2vOdyVfsc0F_wNJKXFtvFAXrRwo3ijOaye20O2UWgcM_A7HvFXoB7ciPABXNmeO3',
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
                        {/* projects-cat */}
                        <div class="p-3">
                            <div class="pCat-title w-100">
                                <span>{this.footerState.footer_form_data.detail_data.cms_title}</span>
                            </div>
                        </div>
                        <div class="p-3">
                            <span className='mb-3' dangerouslySetInnerHTML={{ __html: this.footerState.footer_form_data.detail_data.cms_description }}></span>
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
                                        <label>Company</label>
                                        <input type="text" className="text-control" name="company" id="company" placeholder="Company" data-validation="required" value={this.state.form_data.company} onChange={this.handleChange} />
                                        {this.validator.message('Company', this.state.form_data.company, 'required')}
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

                                    <div className="form-group">
                                        <label>Amount</label>
                                        <input type="text" className="text-control" value={this.state.subscription_payment_price} disabled style={{ "background": "#eaeaea" }} />
                                    </div>


                                    <button className="btn btn-primary btn-block">Make Payment</button>
                                </form>

                                {this.state.payment_btn_show == 1 &&
                                    <PayPalButton
                                        client={client}
                                        currency={currency}
                                        env={env}
                                        amount={this.state.paypal_price}
                                        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                        onSuccess={onSuccess}
                                    />
                                }

                            </div>
                        </div>
                    </div>
                </div>






            </>
        );
    }
}
export default Payment_form;
