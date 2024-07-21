import React from 'react';
import ReactDOM from "react-dom";
import PaypalExpressBtn from 'react-paypal-express-checkout';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail, getUserId, web_url } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import $ from 'jquery';
import Select from 'react-select';
import { Helmet } from "react-helmet";
import Loader from "react-loader";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { PayPalButton } from "react-paypal-button-v2";

// import { paypal } from "https://www.paypal.com/sdk/js?client-id=AdCbdHUjG1FP44SLO2ZqzpKp1CSmke-8RU32qSkGljyaMF27GVqBH6CG33vJQ8aabazgPTqO_yIkwm_D";

import PaypalBtn from 'react-paypal-checkout';

// const PayPalButton = paypal.Buttons.driver("react", { React, ReactDOM });

export default class MyApp extends React.Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        this.validator = new SimpleReactValidator();

        var user_id = user_data ? user_data.u_id : '';
        var shipping_first_name = user_data ? user_data.u_name : '';
        var shipping_email = user_data ? user_data.u_email : '';
        var shipping_mobile = user_data ? user_data.u_mobile : '';
        var country_id = user_data ? user_data.u_country_id : '';
        var governance_id = user_data ? user_data.u_governance_id : '';
        const grand_total = this.props.match.params.grand_total;

        this.initialState = {

            total: grand_total,
            form_data: {
                f_name: '',
                u_id: user_id,

                house_no: '',
                apartment: '',
                city: '',
                postcode: '',
                mobile: '',
                email: '',
                country_id: '',
                governance_id: '',
                zone_id: '',
                billing_country_id: '',
                billing_governance_id: '',
                billing_zone_id: '',
            },
            final_amount: 0,
            u_id: user_id,
            country_id: 18,
            country_name: 'Oman',
            shipping_first_name: shipping_first_name,
            shipping_email: shipping_email,
            shipping_mobile: shipping_mobile,
            shipping_last_name: '',
            shipping_house_no: '',
            shipping_apartment: '',
            shipping_city: '',
            shipping_postcode: '',

            billing_first_name: '',
            billing_last_name: '',
            billing_house_no: '',
            billing_apartment: '',
            billing_city: '',
            billing_postcode: '',
            billing_mobile: '',
            billing_email: '',
            copybilling: '',
            note: '',
            u_zoneee: '',
            u_zone_price: '',
            shipping_charge: '',
            p_kg: '',
            payment_method: '',
            country_list: [],
            governance_list: [],
            zone_list: [],
            governance_list_new: [],
            zone_list_new: [],
            error: '',
            check_is_product_in_cart: 0,
            loaded: true,
            order_data: [],
            product_data: [],
            paypal_price: 0,
        }

        this.state = this.initialState;

        this.get_cart_data();

    }


    async convert_to_usd(props) {
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';
        const id = this.props.match.params.grand_total;
        var th = this;
        if (!isNaN(this.state.order_data.o_shipping_amount)) {
            var amount = parseInt(this.state.order_data.o_total) + parseInt(this.state.order_data.o_shipping_amount);
        } else {
            var amount = parseInt(this.state.order_data.o_total);
        }

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

    async get_cart_data(props) {
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';
        const id = this.props.match.params.grand_total;
        var th = this;
        api_option.url = 'get_order_detail';
        api_option.data = { id: id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    // var order_data = res.data.data;
                    //console.log(cart_data)
                    /* var service_data = res.data.product_data;
                    var cart_array = []; */

                    th.setState(this.state.order_data = res.data.data);
                    th.setState(this.state.product_data = res.data.product_data);
                    console.log(this.state.order_data);
                    console.log(this.state.product_data);



                    if (!isNaN(this.state.order_data.o_shipping_amount)) {
                        var data = this.state.final_amount = parseInt(this.state.order_data.o_total) + parseInt(this.state.order_data.o_shipping_amount);
                        this.setState({ data });
                    }
                    if (isNaN(this.state.order_data.o_shipping_amount)) {
                        var data = this.state.final_amount = parseInt(this.state.order_data.o_total);
                        this.setState({ data });
                    }

                    this.convert_to_usd();

                    /* if (cart_data.length > 0) {
                        this.setState({ check_is_product_in_cart: 1 });
                    } else {
                        this.setState({ check_is_product_in_cart: 0 });
                    }

                    var p_kg = 0;
                    for (var i = 0; i < cart_data.length; i++) {
                        cart_array.push({
                            cart_id: cart_data[i]['cart_id'],
                            user_id: cart_data[i]['user_id'],
                            product_id: cart_data[i]['product_id'],
                            quantity: cart_data[i]['quantity'],
                            tp_price: cart_data[i]['price'],
                            size: cart_data[i]['size'],
                            color: cart_data[i]['color'],
                            seller_id: cart_data[i]['seller_id'],
                            tp_id: cart_data[i]['tp_id'],
                            tp_title: cart_data[i]['tp_title'],
                            tc_color: cart_data[i]['tc_color'],
                            s_title: cart_data[i]['s_title'],
                            type: 'Product',
                        })
                        p_kg = p_kg + parseInt(cart_data[i]['product_kg']);
                    }
                    for (var i = 0; i < service_data.length; i++) {
                        cart_array.push({
                            cart_id: service_data[i]['cart_id'],
                            user_id: service_data[i]['user_id'],
                            product_id: service_data[i]['subcategory_id'],
                            quantity: service_data[i]['quantity'],
                            tp_price: service_data[i]['price'],
                            size: service_data[i]['size'],
                            color: service_data[i]['color'],
                            seller_id: service_data[i]['professional_id'],
                            tp_id: service_data[i]['tp_id'],
                            tp_title: service_data[i]['sc_title'],
                            type: 'Service',
                        })
                    } */


                    // this.setState(this.state.form_data = res.data.cart_list);
                    // this.setState(this.state.service_data = res.data.service_list);
                    /* this.setState({ gtotal: parseInt(res.data.grand_total) });
                    this.setState({ p_kg: p_kg });

                    this.setState({ is_data: true }); */
                } else {
                    // this.setState({ is_data: false });
                    // this.setState({ redirect: '/logout' });
                    // this.setState({ redirect: '/ProductList/' });
                }
            })
            .catch(error => {
                //  this.setState({ redirect: '/logout' });
            });


    }

    createOrder(data) {
        // Order is created on the server and the order id is returned
        return fetch("/my-server/create-paypal-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            // use the "body" param to optionally pass additional order information
            // like product skus and quantities
            body: JSON.stringify({
                cart: [
                    {
                        sku: "YOUR_PRODUCT_STOCK_KEEPING_UNIT",
                        quantity: "YOUR_PRODUCT_QUANTITY",
                    },
                ],
            }),
        })
            .then((response) => response.json())
            .then((order) => order.id);
    }

    onApprove(data) {
        // Order is captured on the server
        return fetch("/my-server/capture-paypal-order", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                orderID: data.orderID
            })
        })
            .then((response) => response.json());
    }

    render() {

        /* Paypal Response Start */
        /* {
            "id": "9S825108157242250",
            "intent": "CAPTURE",
            "status": "COMPLETED",
            "purchase_units": [
                {
                    "reference_id": "default",
                    "amount": {
                        "currency_code": "USD",
                        "value": "0.01"
                    },
                    "payee": {
                        "email_address": "barco.03-facilitator@gmail.com",
                        "merchant_id": "YQZCHTGHUK5P8"
                    },
                    "soft_descriptor": "PAYPAL *PYPLTEST",
                    "shipping": {
                        "name": {
                            "full_name": "John Doe"
                        },
                        "address": {
                            "address_line_1": "Flat no. 507 Wing A Raheja Residency",
                            "address_line_2": "Film City Road",
                            "admin_area_2": "Mumbai",
                            "admin_area_1": "Maharashtra",
                            "postal_code": "400097",
                            "country_code": "IN"
                        }
                    },
                    "payments": {
                        "captures": [
                            {
                                "id": "58P19767MJ206345Y",
                                "status": "COMPLETED",
                                "amount": {
                                    "currency_code": "USD",
                                    "value": "0.01"
                                },
                                "final_capture": true,
                                "seller_protection": {
                                    "status": "ELIGIBLE",
                                    "dispute_categories": [
                                        "ITEM_NOT_RECEIVED",
                                        "UNAUTHORIZED_TRANSACTION"
                                    ]
                                },
                                "create_time": "2023-04-17T09:45:40Z",
                                "update_time": "2023-04-17T09:45:40Z"
                            }
                        ]
                    }
                }
            ],
            "payer": {
                "name": {
                    "given_name": "John",
                    "surname": "Doe"
                },
                "email_address": "sb-udur473532199@personal.example.com",
                "payer_id": "Q2MV2HMCYKCGJ",
                "phone": {
                    "phone_number": {
                        "national_number": "2052227636"
                    }
                },
                "address": {
                    "address_line_1": "Flat no. 507 Wing A Raheja Residency",
                    "address_line_2": "Film City Road",
                    "admin_area_2": "Mumbai",
                    "admin_area_1": "Maharashtra",
                    "postal_code": "400097",
                    "country_code": "IN"
                }
            },
            "create_time": "2023-04-17T09:45:12Z",
            "update_time": "2023-04-17T09:45:40Z",
            "links": [
                {
                    "href": "https://api.sandbox.paypal.com/v2/checkout/orders/9S825108157242250",
                    "rel": "self",
                    "method": "GET"
                }
            ]
        }

        {
            "accelerated": false,
            "orderID": "9S825108157242250",
            "payerID": "Q2MV2HMCYKCGJ",
            "paymentID": null,
            "billingToken": null,
            "facilitatorAccessToken": "A21AAIJV9fxjLqR4mYCL7u7R8GZqA-xs10ocuwKGXTIekGNGCQZBGC8UVYcm_q54WaMxWE7TF3neEMBmL-zcjJXn9P9IIvWgg",
            "paymentSource": "paypal"
        } */
        /* Paypal Response End */

        const onSuccess = (details, data) => {

            console.log(details);
            console.log(data);
            console.log("Transaction completed by " + details.payer.name.given_name);

            /*  */
            var user_data = getUserDetail();
            var user_id = user_data ? user_data.u_id : '';
            const id = this.props.match.params.grand_total;
            var th = this;
            api_option.url = 'save_paypal_detail';

            api_option.data = { paypal_id: details.id, paypal_status: details.status, paypal_data: JSON.stringify(details), order_id: id, user_id: this.state.u_id };
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
        /* const onSuccess = (payment) => {
            // Congratulation, it came here means everything's fine!
            console.log("The payment was succeeded!", payment);
            // const payment = Object.assign({}, this.props.payment);
            // payment.paid = true;
            // payment.cancelled = false;
            // payment.payerID = data.payerID;
            // payment.paymentID = data.paymentID;
            // payment.paymentToken = data.paymentToken;
            // payment.returnUrl = data.returnUrl;
            // this.props.onSuccess(payment);
            // You can bind the "payment" object's value to your state or props or whatever here, please see below for sample returned data
        } */

        const onCancel = (data) => {
            // User pressed "cancel" or close Paypal's popup!
            console.log('The payment was cancelled!', data);
            // You can bind the "data" object's value to your state or props or whatever here, please see below for sample returned data
        }

        const onError = (err) => {
            // The main Paypal's script cannot be loaded or somethings block the loading of that script!
            console.log("Error!", err);
            // Because the Paypal's main script is loaded asynchronously from "https://www.paypalobjects.com/api/checkout.js"
            // => sometimes it may take about 0.5 second for everything to get set, or for the button to appear
        }

        //let env = 'sandbox'; // you can set here to 'production' for production
        let env = 'production'; // you can set here to 'production' for production
        let currency = 'USD'; // or you can set this value from your props or state
        let total = this.state.total; // same as above, this is the total amount (based on currency) to be paid by using Paypal express checkout
        // Document on Paypal's currency code: https://developer.paypal.com/docs/classic/api/currency_codes/

        //Mine - AdCbdHUjG1FP44SLO2ZqzpKp1CSmke-8RU32qSkGljyaMF27GVqBH6CG33vJQ8aabazgPTqO_yIkwm_D
        //Client - ED1L3FH2jIsV6cuwmfsN6a7JSpfc5gqIHdSrq6j_ywScPMDvObqQEQojcWFOJinnYyJZ5_vF5ix_BhSv
        //Client's Secret - ED1L3FH2jIsV6cuwmfsN6a7JSpfc5gqIHdSrq6j_ywScPMDvObqQEQojcWFOJinnYyJZ5_vF5ix_BhSv
        //Client's Client ID - AfOrXqypEgNAG1wPteugVqeZErHYTMvJEXP27f16ign_hDcwHG_i6x9kWSCFTSY0yzxCK0M_GDFsTOxw
        //Client's Client ID - AeqvzhHBd0vFN-Y722CI0E5hsmibBrEsvFsh9u-K3_Elt9xlpkWVHfBHvtOTzI1cRAdCXKCzEt4lWPki
        //Client's Secret - EEN3zDIoAzrCK4LSQlKlYYfntcSAgEun5tDGIydqsylzYJ4BkclJHvmSwR_ht28HP1YvMPm1DPlnwvw5

        const client = {
            sandbox: 'AfFOp9RYgAphELzpAxBSUdB3uVBpauMERddr4gP87e8loz0R9HR9k46F0m3QqCTQj_BhZEBJzRlHJczi',
            production: 'ECerFUYVkPcp-Q3P2vOdyVfsc0F_wNJKXFtvFAXrRwo3ijOaye20O2UWgcM_A7HvFXoB7ciPABXNmeO3',
        }
        // In order to get production's app-ID, you will have to send your app to Paypal for approval first
        // For sandbox app-ID (after logging into your developer account, please locate the "REST API apps" section, click "Create App"):
        //   => https://developer.paypal.com/docs/classic/lifecycle/sb_credentials/
        // For production app-ID:
        //   => https://developer.paypal.com/docs/classic/lifecycle/goingLive/

        // NB. You can also have many Paypal express checkout buttons on page, just pass in the correct amount and they will work!
        return (
            <>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-6'>
                            <div style={{ 'display': 'flex', 'right': '0', 'left': '0' }}>
                                <div style={{ 'margin': 'auto' }}>

                                    <div>
                                        <h3>Thank You!</h3>
                                        <p>Your Order <b>#{this.state.order_data.o_id}</b> was placed successfully, You will receive an order confirmation email shortly at <b>{this.state.order_data.u_email}</b></p>
                                        <hr />
                                        <p><b>Ordered at : </b> {this.state.order_data.o_created_at}</p>
                                    </div>
                                    <br />

                                    <div className='text-center' style={{ padding: '30px', background: "#f2f2f2" }}>
                                        <h5>CUSTOMER SATISFACTION SERVEY</h5>
                                        <p>Thank you for participating in our survey. We hope you enjoy shopping with us!</p>
                                        <NavLink className="btn btn-primary" exact to={'/sale-product'}>CONTINUE SHOPPING
                                        </NavLink>
                                    </div>
                                    <br />
                                    <div className='row'>
                                        <div className='col-md-12'>
                                            <h5>DELIVERY DETAILS</h5>
                                            <hr />
                                        </div>
                                        <div className='col-md-6'>
                                            <h5>Shipping Info</h5>
                                            <p>{this.state.order_data.o_shipping_house_no}, {this.state.order_data.o_shipping_apartment},<br /> {this.state.order_data.o_shipping_city}</p>
                                        </div>
                                        <div className='col-md-6'>
                                            <h5>Billing Info</h5>
                                            <p>{this.state.order_data.o_billing_house_no}, {this.state.order_data.o_billing_apartment},<br /> {this.state.order_data.o_billing_city}<br /> {this.state.order_data.o_billing_postcode}</p>
                                        </div>
                                        <div className='col-md-6'>
                                            <h5>Payment Method</h5>
                                            <p>Paypal</p>
                                        </div>
                                        <div className='col-md-6'>
                                            <h5>Delivery Method</h5>
                                            <p>Standard Delivery</p>
                                        </div>
                                    </div>

                                    <hr />
                                    <h3 className='pb-3'>Pay with Paypal</h3>
                                    {/* <PaypalBtn env={env} client={client} currency={currency} total={parseInt(this.state.order_data.o_total) + parseInt(this.state.order_data.o_shipping_amount)} onError={onError} onSuccess={onSuccess} onCancel={onCancel} /> */}

                                    <PayPalButton
                                        client={client}
                                        currency={currency}
                                        env={env}
                                        amount={this.state.paypal_price}
                                        // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
                                        onSuccess={onSuccess}
                                    />
                                    {/* <PayPalButton
                                        createOrder={(data, actions) => this.createOrder(data)}
                                        onApprove={(data, actions) => this.onApprove(data)}
                                    /> */}
                                    {/* <PaypalExpressBtn env={env} client={client} currency={currency} total={parseInt(this.state.order_data.o_total) + parseInt(this.state.order_data.o_shipping_amount)} onError={onError} onSuccess={onSuccess} onCancel={onCancel} /> */}
                                </div>
                            </div>
                        </div>
                        <div className='col-md-6'>
                            <div class="cart-summary">
                                <div class="cart-sticky">
                                    <h6>Summary</h6>
                                    <div class="cart-pricebreakup">
                                        <dl>
                                            <dd>Total product amount</dd>
                                            <dt>RO {parseInt(this.state.order_data.o_total)}</dt>
                                        </dl>
                                        {this.state.product_data &&
                                            <>
                                                <dl>
                                                    <dd>Shipping Cost</dd>
                                                    <dt class="text-danger">+ RO {!isNaN(this.state.order_data.o_shipping_amount) && parseInt(this.state.order_data.o_shipping_amount)}
                                                        {isNaN(this.state.order_data.o_shipping_amount) && 0} </dt>
                                                </dl>
                                                <dl>
                                                    <dd>Discount</dd>
                                                    <dt class="text-success">- RO 0</dt>
                                                </dl>
                                            </>
                                        }
                                        <dl>
                                            <dd>Amount to Pay</dd>
                                            <dt>
                                                RO {!isNaN(this.state.order_data.o_shipping_amount) && parseInt(this.state.order_data.o_total) + parseInt(this.state.order_data.o_shipping_amount)}
                                                {isNaN(this.state.order_data.o_shipping_amount) && parseInt(this.state.order_data.o_total)}
                                            </dt>
                                        </dl>
                                    </div>
                                    {/* <a href="" class="btn btn-primary btn-block">Proceed to Pay</a> */}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>




            </>
        );
    }
}