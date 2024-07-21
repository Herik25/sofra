import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail, getUserId } from '../api/Helper';
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
class Checkout extends Component {
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


        this.initialState = {
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
            total_sale_price: 0,
            total_discount: 0,
            loaded: true
        }



        this.state = this.initialState;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCountry = this.handleCountry.bind(this);
        this.handleBillingCountry = this.handleBillingCountry.bind(this);
        this.handleGovernance = this.handleGovernance.bind(this);
        this.handleBillingGovernance = this.handleBillingGovernance.bind(this);
        this.handleZone = this.handleZone.bind(this);
        this.handleBillingZone = this.handleBillingZone.bind(this);
        // this.handleDelete = this.handleDelete.bind(this);
        // this.handleQuantity = this.handleQuantity.bind(this);
        this.get_cart_data();
        this.get_country();
        this.get_zone();
        // this.get_zone_price();



    }

    async handleBillingCountry(event) {


        const name = event.lable;
        const value = event.value;
        var data = this.state.form_data['billing_country_id'] = { label: event.label, value: value };
        this.setState({ data });
        var data = this.state.form_data['billing_governance_id'] = null;
        this.setState({ data });
        this.setState({ governance_list: {} });
        if (value != "") {
            api_option.url = 'governance_list_dropdown';

            api_option.data = { country_id: value };
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        var fnldata = [];
                        $.each(res.data.governance_list, function (i, item) {
                            fnldata.push({ 'value': res.data.governance_list[i].id, "label": res.data.governance_list[i].text });
                        });
                        this.setState({ governance_list_new: fnldata });
                        this.setState({ governance_list: fnldata });
                    } else {
                        this.setState({ redirect: '/home/' });
                    }
                })
                .catch(error => {
                    //this.setState({ redirect: '/logout' });
                });
        } else {
            this.setState({ governance_list: {} });
        }
    }
    async handleCountry(event) {


        const name = event.lable;
        const value = event.value;
        var data = this.state.form_data['country_id'] = { label: event.label, value: value };
        this.setState({ data });
        var data = this.state.form_data['governance_id'] = null;
        this.setState({ data });
        this.setState({ governance_list: {} });
        var data = this.state.form_data['zone_id'] = null;
        this.setState({ data });
        this.setState({ zone_list: {} });
        this.setState({ zone_list_new: {} });

        var total_ship = 0;
        this.setState({ shipping_charge: total_ship });


        if (value != "") {
            api_option.url = 'governance_list_dropdown';

            api_option.data = { country_id: value };
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        var fnldata = [];
                        $.each(res.data.governance_list, function (i, item) {
                            fnldata.push({ 'value': res.data.governance_list[i].id, "label": res.data.governance_list[i].text });
                        });
                        this.setState({ governance_list_new: fnldata });
                        this.setState({ governance_list: fnldata });
                    } else {
                        this.setState({ redirect: '/home/' });
                    }
                })
                .catch(error => {
                    //this.setState({ redirect: '/logout' });
                });
        } else {
            this.setState({ governance_list: {} });
        }
    }

    async handleBillingGovernance(event) {

        const name = event.lable;
        const value = event.value;
        var data = this.state.form_data['billing_governance_id'] = { label: event.label, value: value };
        this.setState({ data });

        var data = this.state.form_data['billing_zone_id'] = null;
        this.setState({ data });
        this.setState({ zone_list: {} });

        if (value != "") {
            api_option.url = 'zone_list_dropdown';

            api_option.data = { governance_id: value };
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        var fnldata = [];
                        $.each(res.data.zone_list, function (i, item) {
                            fnldata.push({ 'value': res.data.zone_list[i].id, "label": res.data.zone_list[i].text });
                        });
                        this.setState({ zone_list_new: fnldata });
                        this.setState({ zone_list: fnldata });
                    } else {
                        this.setState({ redirect: '/home/' });
                    }
                })
                .catch(error => {
                    //this.setState({ redirect: '/logout' });
                });
        } else {
            this.setState({ zone_list: {} });
        }
    }
    async handleGovernance(event) {

        const name = event.lable;
        const value = event.value;
        var data = this.state.form_data['governance_id'] = { label: event.label, value: value };
        this.setState({ data });

        var data = this.state.form_data['zone_id'] = null;
        this.setState({ data });
        this.setState({ zone_list: {} });
        this.setState({ zone_list_new: {} });

        var total_ship = 0;
        this.setState({ shipping_charge: total_ship });

        if (value != "") {
            api_option.url = 'zone_list_dropdown';

            api_option.data = { governance_id: value };
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        var fnldata = [];
                        $.each(res.data.zone_list, function (i, item) {
                            fnldata.push({ 'value': res.data.zone_list[i].id, "label": res.data.zone_list[i].text });
                        });
                        this.setState({ zone_list_new: fnldata });
                        this.setState({ zone_list: fnldata });
                    } else {
                        this.setState({ redirect: '/home/' });
                    }
                })
                .catch(error => {
                    //this.setState({ redirect: '/logout' });
                });
        } else {
            this.setState({ zone_list: {} });
        }
    }


    async handleZone(event) {

        const name = event.lable;
        const value = event.value;
        var data = this.state.form_data['zone_id'] = { label: event.label, value: value };
        this.setState({ data });

        if (value != "") {
            this.get_zone_price(value)
        } else {
            this.setState({ zone_list: {} });
        }

    }
    async handleBillingZone(event) {

        const name = event.lable;
        const value = event.value;
        var data = this.state.form_data['billing_zone_id'] = { label: event.label, value: value };
        this.setState({ data });

    }


    get_country() {

        api_option.url = 'shipping_country_list_dropdown';
        api_option.data = {};
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var fnldata = [];
                    $.each(res.data.country_list, function (i, item) {
                        var temparr = new Object;
                        temparr['value'] = res.data.country_list[i].id;
                        temparr['label'] = res.data.country_list[i].text;
                        fnldata.push(temparr);
                    });
                    this.setState({ country_list: fnldata });
                } else {

                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }



    get_zone() {

        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_user_zone';
        api_option.data = { user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                const res_data = res.data.data;
                var zone = res_data.u_zone_id;
                //this.setState({ u_zoneee: zone });
                this.get_zone_price(zone)
                //console.log(this.state.u_zoneee)
            })


    }


    get_zone_price(zone) {

        var user_zone = zone;
        api_option.url = 'get_user_zone_price';
        api_option.data = { user_zone: user_zone };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                var product_kg = this.state.p_kg;
                const res_data = res.data.data;

                if (product_kg <= 5) {
                    var total_ship = parseFloat(res_data.zp_weight_range) + parseFloat(res_data.zp_code_shipment) + parseFloat(res_data.zp_packing_charge);
                } else {
                    var additional_product_kg = product_kg - 5;
                    var final_add_kg_charge = res_data.zp_additional_kg * additional_product_kg;
                    total_amount = 0
                    if (final_add_kg_charge) {
                        var total_amount = total_amount + final_add_kg_charge
                    }

                    var total_ship = parseFloat(res_data.zp_weight_range) + parseFloat(res_data.zp_code_shipment) + parseFloat(res_data.zp_packing_charge) + final_add_kg_charge;

                }

                this.setState({ shipping_charge: total_ship });

            })


    }


    // get_zone_price() {
    //     // alert(this.state.u_zone)

    //     var u_zone = 'south';
    //     api_option.url = 'get_user_zone_price';
    //     api_option.data = { u_zone: u_zone };
    //     api_option.headers.Authorization = sessionStorage.getItem('token');

    //     axios(api_option)
    //         .then(res => {
    //             //this.setState({ loaded: true });
    //             const res_data = res.data.data;
    //             // console.log(res_data.u_zone)
    //             //this.setState({ u_zone_price: res_data.u_zone_price });
    //         })
    //         .catch(error => console.log(error));


    // }


    handleSubmit(event) {

        event.preventDefault();
        if (!this.validator.allValid()) {
            this.validator.showMessages();
            this.forceUpdate();
        } else {
            this.setState({ loaded: false });
            api_option.url = 'PlaceOrder';
            const formData = new FormData();
            formData.append('u_id', this.state.u_id);
            formData.append('grand_total', this.state.gtotal);
            formData.append('shipping_charge', this.state.shipping_charge);
            formData.append('shipping_first_name', this.state.shipping_first_name);
            formData.append('shipping_last_name', this.state.shipping_last_name);
            formData.append('shipping_house_no', this.state.shipping_house_no);
            formData.append('shipping_apartment', this.state.shipping_apartment);
            formData.append('shipping_city', this.state.shipping_city);
            formData.append('shipping_postcode', this.state.shipping_postcode);
            formData.append('shipping_mobile', this.state.shipping_mobile);
            formData.append('shipping_email', this.state.shipping_email);
            formData.append('billing_first_name', this.state.billing_first_name);
            formData.append('billing_last_name', this.state.billing_last_name);
            formData.append('billing_house_no', this.state.billing_house_no);
            formData.append('billing_apartment', this.state.billing_apartment);
            formData.append('billing_city', this.state.billing_city);
            formData.append('billing_postcode', this.state.billing_postcode);
            formData.append('billing_mobile', this.state.billing_mobile);
            formData.append('billing_email', this.state.billing_email);
            formData.append('note', this.state.note);
            if (this.state.form_data.country_id) {
                formData.append('country_id', this.state.form_data.country_id.value);
            } else {
                formData.append('country_id', "");
            }
            if (this.state.form_data.governance_id) {
                formData.append('governance_id', this.state.form_data.governance_id.value);
            } else {
                formData.append('governance_id', "");
            }
            if (this.state.form_data.zone_id) {
                formData.append('zone_id', this.state.form_data.zone_id.value);
            } else {
                formData.append('zone_id', "");
            }
            if (this.state.form_data.billing_country_id) {
                formData.append('billing_country_id', this.state.form_data.billing_country_id.value);
            } else {
                formData.append('billing_country_id', "");
            }
            if (this.state.form_data.billing_governance_id) {
                formData.append('billing_governance_id', this.state.form_data.billing_governance_id.value);
            } else {
                formData.append('billing_governance_id', "");
            }
            if (this.state.form_data.billing_zone_id) {
                formData.append('billing_zone_id', this.state.form_data.billing_zone_id.value);
            } else {
                formData.append('billing_zone_id', "");
            }

            api_option.data = formData;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        //toast.success(res.data.message);
                        this.get_cart_data();
                        var cnt = $('#bag_count').text();

                        if (cnt == 0) {
                            $('#bag_count').text("");
                        } else {
                            $('#bag_count').text(parseInt(cnt) - 1);
                        }

                        this.setState({ redirect: '/Paypal/' + res_data.order_id });
                    } else {
                        toast.error(res.data.message);
                    }
                })
                .catch(error => console.log(error));
        }

    }
    componentDidMount() {

    }

    onPaymentChanged = e => {
        this.setState({
            payment_method: e.target.value,
        });
    }

    changeDetails = e => {
        const { name, value, checked, maxLength } = e.target;
        const { Details, formErrors } = this.state;
        let formObj = {};
        if (name === "copybilling") {
            // handle the change event of language field
            if (checked) {
                // push selected value in list
                this.setState({
                    [name]: true,
                    billing_first_name: this.state.shipping_first_name,
                    billing_last_name: this.state.shipping_last_name,
                    billing_house_no: this.state.shipping_house_no,
                    billing_apartment: this.state.shipping_apartment,
                    billing_city: this.state.shipping_city,
                    billing_postcode: this.state.shipping_postcode,
                    billing_mobile: this.state.shipping_mobile,
                    billing_email: this.state.shipping_email,
                });
            } else {
                // remove unchecked value from the list
                this.setState({
                    [name]: false,
                    billing_first_name: '',
                    billing_last_name: '',
                    billing_house_no: '',
                    billing_apartment: '',
                    billing_city: '',
                    billing_postcode: '',
                    billing_mobile: '',
                    billing_email: '',
                });
            }
        } else {
            // handle change event except language field
            this.setState({
                [name]: value
            });
        }
    };

    async get_cart_data(props) {
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';

        api_option.url = 'get_cart_detail';
        api_option.data = { user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    var cart_data = res.data.cart_list;
                    //console.log(cart_data)
                    var service_data = res.data.service_list;
                    var cart_array = [];

                    if (cart_data.length > 0) {
                        this.setState({ check_is_product_in_cart: 1 });
                    } else {
                        this.setState({ check_is_product_in_cart: 0 });
                    }

                    var p_kg = 0;
                    var total_sale_price_save = 0;
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
                        p_kg = p_kg + parseFloat(cart_data[i]['product_kg']);
                        total_sale_price_save = total_sale_price_save + (parseFloat(cart_data[i]['tp_price']) * parseFloat(cart_data[i]['quantity']));
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

                        total_sale_price_save = total_sale_price_save + parseFloat(service_data[i]['price']);
                    }
                    this.setState(this.state.cart_array = cart_array);

                    // this.setState(this.state.form_data = res.data.cart_list);
                    // this.setState(this.state.service_data = res.data.service_list);
                    var total_discount_display = parseFloat(total_sale_price_save) - parseFloat(res.data.grand_total);
                    if (total_discount_display <= 0) {
                        total_discount_display = 0;
                    }
                    this.setState({ gtotal: parseFloat(res.data.grand_total) });
                    this.setState({ total_sale_price: total_sale_price_save });
                    this.setState({ total_discount: total_discount_display });
                    this.setState({ p_kg: p_kg });

                    this.setState({ is_data: true });
                } else {
                    this.setState({ is_data: false });
                    // this.setState({ redirect: '/logout' });
                    // this.setState({ redirect: '/ProductList/' });
                }
            })
            .catch(error => {
                //  this.setState({ redirect: '/logout' });
            });


    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (

            <>
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

                {/* <PayPalScriptProvider options={{ "client-id": "AdCbdHUjG1FP44SLO2ZqzpKp1CSmke-8RU32qSkGljyaMF27GVqBH6CG33vJQ8aabazgPTqO_yIkwm_D" }}>
                    <PayPalButtons
                        createOrder={(data, actions) => {
                            return actions.order.create({
                                purchase_units: [
                                    {
                                        amount: {
                                            value: "1.99",
                                        },
                                    },
                                ],
                            });
                        }}
                        onApprove={(data, actions) => {
                            return actions.order.capture().then((details) => {
                                const name = details.payer.name.given_name;
                                alert(`Transaction completed by ${name}`);
                            });
                        }}
                    />
                </PayPalScriptProvider> */}

                <div class="cartpage-wrapper">
                    <div class="container">
                        <div class="cart-section">
                            <div class="cart-details">
                                <h6 class="md-title">Shipping Details</h6>
                                <form onSubmit={this.handleSubmit}>
                                    <div class="row">
                                        <div class="col-lg-6 col-md-6">
                                            <div class="form-group">
                                                <label>First name <span class="required" title="required">*</span></label>
                                                <input type="text" name="shipping_first_name" id="shipping_first_name" value={this.state.shipping_first_name} onChange={this.changeDetails} class="text-control" />
                                                {this.validator.message('first name', this.state.shipping_first_name, 'required')}
                                                <input type="hidden" className="text-control" name="u_id" id="u_id" value={this.state.form_data.u_id} />
                                                <input type="hidden" className="text-control" name="grand_total" id="grand_total" value={this.state.gtotal} />
                                                <input type="hidden" className="text-control" name="shipping_charge" id="shipping_charge" value={this.state.shipping_charge} />
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-md-6">
                                            <div class="form-group">
                                                <label>Last name <span class="required" title="required">*</span></label>
                                                <input type="text" name="shipping_last_name" id="shipping_last_name" value={this.state.shipping_last_name} onChange={this.changeDetails} class="text-control" />
                                                {this.validator.message('last name', this.state.shipping_last_name, 'required')}
                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <div class="form-group">
                                                <label>Country <span class="required" title="required">*</span></label>
                                                <Select
                                                    // defaultValue={{ label: "Oman", value: 18 }}
                                                    onChange={this.handleCountry}
                                                    isSearchable={true}
                                                    options={this.state.country_list}
                                                    id="country_id" name="country_id"
                                                    placeholder="Select Country"
                                                />
                                            </div>
                                        </div>

                                        <div class="col-lg-12">
                                            <div class="form-group">
                                                <label>Governance <span class="required" title="required">*</span></label>
                                                <Select
                                                    value={this.state.form_data.governance_id}
                                                    onChange={this.handleGovernance}
                                                    options={this.state.governance_list_new}
                                                    id="governance_id" name="governance_id"
                                                    placeholder="Select Governance"
                                                />
                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <div class="form-group">
                                                <label>Zone <span class="required" title="required">*</span></label>
                                                <Select
                                                    value={this.state.form_data.zone_id}
                                                    onChange={this.handleZone}
                                                    options={this.state.zone_list_new}
                                                    id="zone_id" name="zone_id"
                                                    placeholder="Select Zone"
                                                />
                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <div class="form-group">
                                                <label>Street address <span class="required" title="required">*</span></label>
                                                <input class="text-control" placeholder="House number and street name" type="text" name="shipping_house_no" id="shipping_house_no" value={this.state.shipping_house_no} onChange={this.changeDetails} />
                                                {this.validator.message('House number', this.state.shipping_house_no, 'required')}
                                                <input class="text-control" placeholder="Apartment, suite, unit etc. (optional)" type="text" name="shipping_apartment" id="shipping_apartment" value={this.state.shipping_apartment} onChange={this.changeDetails} />

                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="form-group">
                                                <label>Town / City <span class="required" title="required">*</span></label>
                                                <input type="text" class="text-control" name="shipping_city" id="shipping_city" value={this.state.shipping_city} onChange={this.changeDetails} />
                                                {this.validator.message('City', this.state.shipping_city, 'required')}
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="form-group">
                                                <label>Postcode / ZIP (optional) <span class="required" title="required">*</span></label>
                                                <input type="text" class="text-control" name="shipping_postcode" id="shipping_postcode" value={this.state.shipping_postcode} onChange={this.changeDetails} />
                                                {this.validator.message('Postcode', this.state.shipping_postcode, 'required')}
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="form-group">
                                                <label>Phone <span class="required" title="required">*</span></label>
                                                <input type="text" class="text-control" name="shipping_mobile" id="shipping_mobile" value={this.state.shipping_mobile} onChange={this.changeDetails} />
                                                {this.validator.message('Mobile', this.state.shipping_mobile, 'required|phone')}
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="form-group">
                                                <label>Email Address <span class="required" title="required">*</span></label>
                                                <input type="email" class="text-control" name="shipping_email" id="shipping_email" value={this.state.shipping_email} onChange={this.changeDetails} />
                                                {this.validator.message('Email', this.state.shipping_email, 'required|email')}
                                            </div>
                                        </div>
                                    </div>
                                    {/* </form> */}
                                    <hr />
                                    <div class="d-flex justify-content-between align-items-center my-4">
                                        <h6 class="md-title m-0">Billing Details</h6>
                                        <label class="foption checkbox">
                                            <input type="checkbox" name="copybilling"
                                                checked={this.state.copybilling}
                                                onChange={this.changeDetails} />
                                            <span>Same as Shipping</span>
                                        </label>
                                    </div>
                                    {/* <form> */}
                                    <div class="row">
                                        <div class="col-lg-6 col-md-6">
                                            <div class="form-group">
                                                <label>First name <span class="required" title="required">*</span></label>
                                                <input type="text" name="billing_first_name" id="billing_first_name" value={this.state.billing_first_name} onChange={this.changeDetails} class="text-control" />
                                                {this.validator.message('first name', this.state.billing_first_name, 'required')}
                                                {/* <input type="hidden" className="text-control" name="u_id" id="u_id" value={this.state.form_data.u_id} /> */}
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-md-6">
                                            <div class="form-group">
                                                <label>Last name <span class="required" title="required">*</span></label>
                                                {this.validator.message('last name', this.state.billing_last_name, 'required')}
                                                <input type="text" name="billing_last_name" id="billing_last_name" value={this.state.billing_last_name} onChange={this.changeDetails} class="text-control" />

                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <div class="form-group">
                                                <label>Country <span class="required" title="required">*</span></label>
                                                <Select
                                                    value={this.state.form_data.billing_country_id}
                                                    onChange={this.handleBillingCountry}
                                                    isSearchable={true}
                                                    options={this.state.country_list}
                                                    id="billing_country_id" name="billing_country_id"
                                                    placeholder="Select Country"
                                                />
                                            </div>
                                        </div>

                                        <div class="col-lg-12">
                                            <div class="form-group">
                                                <label>Governance <span class="required" title="required">*</span></label>
                                                <Select
                                                    value={this.state.form_data.billing_governance_id}
                                                    onChange={this.handleBillingGovernance}
                                                    options={this.state.governance_list_new}
                                                    id="billing_governance_id" name="billing_governance_id"
                                                    placeholder="Select Governance"
                                                />
                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <div class="form-group">
                                                <label>Zone <span class="required" title="required">*</span></label>
                                                <Select
                                                    value={this.state.form_data.billing_zone_id}
                                                    onChange={this.handleBillingZone}
                                                    options={this.state.zone_list_new}
                                                    id="billing_zone_id" name="billing_zone_id"
                                                    placeholder="Select Zone"
                                                />
                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <div class="form-group">
                                                <label>Street address <span class="required" title="required">*</span></label>
                                                <input class="text-control" placeholder="House number and street name" type="text" name="billing_house_no" id="billing_house_no" value={this.state.billing_house_no} onChange={this.changeDetails} />
                                                {this.validator.message('House number', this.state.billing_house_no, 'required')}
                                                <input class="text-control" placeholder="Apartment, suite, unit etc. (optional)" type="text" name="billing_apartment" id="billing_apartment" value={this.state.billing_apartment} onChange={this.changeDetails} />

                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="form-group">
                                                <label>Town / City <span class="required" title="required">*</span></label>
                                                <input type="text" class="text-control" name="billing_city" id="billing_city" value={this.state.billing_city} onChange={this.changeDetails} />
                                                {this.validator.message('City', this.state.billing_city, 'required')}
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="form-group">
                                                <label>Postcode / ZIP (optional) <span class="required" title="required">*</span></label>
                                                <input type="text" class="text-control" name="billing_postcode" id="billing_postcode" value={this.state.billing_postcode} onChange={this.changeDetails} />
                                                {this.validator.message('Postcode', this.state.billing_postcode, 'required')}
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="form-group">
                                                <label>Phone <span class="required" title="required">*</span></label>
                                                <input type="text" class="text-control" name="billing_mobile" id="billing_mobile" value={this.state.billing_mobile} onChange={this.changeDetails} />
                                                {this.validator.message('Mobile', this.state.billing_mobile, 'required|phone')}
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="form-group">
                                                <label>Email Address <span class="required" title="required">*</span></label>
                                                <input type="email" class="text-control" name="billing_email" id="billing_email" value={this.state.billing_email} onChange={this.changeDetails} />
                                                {this.validator.message('Email', this.state.billing_email, 'required|email')}
                                            </div>
                                        </div>
                                    </div>
                                    {/* </form> */}
                                    <hr />
                                    <h6 class="md-title">Additional Comment</h6>
                                    {/* <form> */}
                                    <div class="row">
                                        <div class="col-lg-12">
                                            <div class="form-group">
                                                <label>Notes</label>
                                                <textarea class="text-control" name="note" id="note" value={this.state.note} onChange={this.changeDetails}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div class="row">
                                        <div class="form-group">
                                            <input id="payment-method-4" class="input-radio" type="radio" value="paypal" name="payment_method" onChange={this.onPaymentChanged} />  Paypal
                                            <input id="payment-method-4" class="input-radio" type="radio" value="cod" name="payment_method" onChange={this.onPaymentChanged} />  COD
                                            {this.validator.message('payment_method', this.state.payment_method, 'required')}
                                        </div>
                                    </div> */}
                                    <button type="submit" class="btn btn-primary btn-block">Proceed to Pay</button>

                                </form>
                            </div>
                            <div class="cart-summary">
                                <div class="cart-sticky">
                                    <h6>Summary</h6>
                                    <div class="cart-pricebreakup">
                                        <dl>
                                            <dd>Total product amount</dd>
                                            <dt>RO {this.state.total_sale_price}</dt>
                                        </dl>
                                        {this.state.check_is_product_in_cart == 1 &&
                                            <>
                                                <dl>
                                                    <dd>Shipping Cost</dd>
                                                    <dt class="text-danger">+ RO {this.state.shipping_charge ? this.state.shipping_charge : 0}</dt>
                                                </dl>
                                                <dl>
                                                    <dd>Discount</dd>
                                                    <dt class="text-success">- RO {this.state.total_discount}</dt>
                                                </dl>
                                            </>
                                        }

                                        <dl>
                                            <dd>Amount to Pay</dd>
                                            <dt>RO {parseFloat(this.state.gtotal) + (this.state.shipping_charge ? this.state.shipping_charge : 0)}</dt>
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
export default Checkout;