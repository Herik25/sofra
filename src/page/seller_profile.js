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
import Select2 from 'react-select2-wrapper';
import { Multiselect } from 'multiselect-react-dropdown';
import $ from 'jquery';
// import $ from 'jquery';
// import { Helmet } from "react-helmet";

class SellerProfile extends Component {
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
            status_data: [],
            options: [{ name: 'Oman', id: 1 }, { name: 'Bahrain', id: 2 }, { name: 'Kuwait', id: 3 }],
            form_data: {
                u_business_name: '',
                u_seller_name: '',
                u_business_email: '',
                u_business_mobile: '',
                u_id: seller_id,
                u_vat_number: '',
                u_business_address: '',
                u_country: '',
                u_state: '',
                u_city: '',
                u_pincode: '',
                u_account_number: '',
                u_bank_name: '',
                u_ifsc_code: '',
                u_swift_code: '',
                u_about_us: '',
                tp_area: '',
                image: {},

            },
            profile_detail: [],
            country_list: [],
            state_list: [],
            city_list: [],
            area_list: [],
            error: ''
        }

        this.state = this.initialState;
        this.handleSaveData = this.handleSaveData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleMultipleChange = this.handleMultipleChange.bind(this);
        this.handleChangeCountry = this.handleChangeCountry.bind(this);
        this.handleChangeCity = this.handleChangeCity.bind(this);
        this.country_list_dropdown();
        this.area_list_dropdown();
        this.get_profile_data();
        //  this.get_form_data();
    }
    async get_profile_data() {
        const edit_id = this.props.match.params.seller_id;
        if (edit_id) {
            api_option.url = 'get_seller_profile_data';
            api_option.data = { id: edit_id };
            api_option.headers.Authorization = localStorage.getItem('token');
            await axios(api_option)
                .then(res => {
                    const th = this;
                    if (res.data.status) {
                        var res_data = res.data.profile_detail;

                        this.setState({ profile_detail: res_data });
                        console.log(res_data)
                        var data = th.state.form_data['u_seller_name'] = res_data.u_name;
                        var data = th.state.form_data['u_business_email'] = res_data.u_email;
                        var data = th.state.form_data['u_country'] = res_data.u_country;
                        var data = th.state.form_data['u_state'] = res_data.u_state;
                        var data = th.state.form_data['u_city'] = res_data.u_city;
                        th.setState({ data });

                    } else {
                        this.setState({ redirect: '/user/' });
                    }
                })
                .catch(error => {
                    this.setState({ redirect: '/logout' });
                });
        }
    }

    area_list_dropdown() {

        api_option.url = 'area_list_dropdown';
        api_option.data = {};
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var fnldata = [];
                    $.each(res.data.area_list, function (i, item) {

                        var temparr = new Object;
                        temparr['id'] = res.data.area_list[i].id;
                        temparr['text'] = res.data.area_list[i].text;
                        fnldata.push(temparr);

                    });

                    this.setState({ area_list: fnldata });

                } else {
                    this.setState({ redirect: '/product/' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }
    componentDidMount() {

    }

    async handleChangeArea(event) {

        const name = event.target.name;
        var options = event.target.selectedOptions;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        var data = this.state.form_data[name] = value;
        this.setState({ data });
    }

    async handleChangeCountry(event) {

        const name = event.lable;
        const value = event.value;
        var data = this.state.form_data.u_country = { label: event.label, value: value };
        this.setState({ data });

        if (value != "") {
            api_option.url = 'city_list_dropdown';
            ;
            api_option.data = { country_id: value };
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        var fnldata = [];
                        $.each(res.data.city_list, function (i, item) {
                            var temparr = new Object;
                            temparr['value'] = res.data.city_list[i].id;
                            temparr['label'] = res.data.city_list[i].text;
                            fnldata.push(temparr);
                        });
                        this.setState({ city_list: fnldata });
                    } else {
                        this.setState({ redirect: '/home/' });
                    }

                })
                .catch(error => {
                    //this.setState({ redirect: '/logout' });
                });
        } else {
            this.setState({ city_list: {} });
        }
    }
    // async handleChangeState(event) {

    //     const name = event.lable;
    //     const value = event.value;
    //     var data = this.state.form_data['state_id'] = { label: event.label, value: value };
    //     this.setState({ data });

    //     if (value != "") {
    //         api_option.url = 'city_list_dropdown';
    //         ;
    //         api_option.data = { state_id: value };
    //         axios(api_option)
    //             .then(res => {
    //                 if (res.data.status) {

    //                     var fnldata = [];
    //                     $.each(res.data.city_list, function (i, item) {
    //                         var temparr = new Object;
    //                         temparr['value'] = res.data.city_list[i].id;
    //                         temparr['label'] = res.data.city_list[i].text;
    //                         fnldata.push(temparr);
    //                     });
    //                     this.setState({ city_list: fnldata });
    //                 } else {
    //                     this.setState({ redirect: '/home/' });
    //                 }

    //             })
    //             .catch(error => {
    //                 //this.setState({ redirect: '/logout' });
    //             });
    //     } else {
    //         this.setState({ city_list: {} });
    //     }
    // }
    async handleChangeCity(event) {

        const name = event.lable;
        const value = event.value;
        var data = this.state.form_data['u_city'] = { label: event.label, value: value };
        this.setState({ data });

    }

    country_list_dropdown() {

        api_option.url = 'country_list_dropdown';
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
                    this.setState({ redirect: '/product/' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }



    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
    }

    handleMultipleChange = (e) => {

        let value = Array.from(e.target.selectedOptions, option => option.value);
        this.setState({ values: value });
    }

    //get edit form data
    // async get_form_data() {
    // 		api_option.url = 'get_profile_data';
    // 		api_option.data = { id:this.state.form_data.u_id};
    // 		api_option.headers.Authorization = sessionStorage.getItem('token');
    // 		await axios(api_option)
    // 			.then(res => {
    // 				if (res.data.status) {

    // 					const th = this;
    // 					var res_data = res.data.data;
    //                     this.setState(this.state.form_data = res.data.data);
    //                     console.log(this.state.form_data)
    // 				} else {
    // 					this.setState({ redirect: '/logout' });
    // 				}
    // 			})
    // 			.catch(error => {
    // 				this.setState({ redirect: '/logout' });
    // 			});

    // }

    // form submit event
    handleSaveData(event) {

        event.preventDefault();
        if (!this.validator.allValid()) {
            this.validator.showMessages();
            this.forceUpdate();
        } else {
            var data = this.state.form_data['image'] = $('#aksfileupload').prop('files')[0];
            this.setState({ data });

            api_option.url = 'seller_profile_data_step';
            const formData = new FormData();
            formData.append('u_id', this.state.form_data.u_id);
            formData.append('u_business_name', this.state.form_data.u_business_name);
            formData.append('u_seller_name', this.state.form_data.u_seller_name);
            formData.append('u_business_email', this.state.form_data.u_business_email);
            formData.append('u_business_mobile', this.state.form_data.u_business_mobile);
            formData.append('u_vat_number', this.state.form_data.u_vat_number);
            formData.append('u_business_address', this.state.form_data.u_business_address);
            formData.append('u_country', this.state.form_data.u_country.label);
            // formData.append('u_country', this.state.form_data.u_country);
            formData.append('u_state', this.state.form_data.u_state);
            // formData.append('u_city', this.state.form_data.u_city);
            if (this.state.form_data.u_city) {
                formData.append('u_city', this.state.form_data.u_city.label);
            } else {
                formData.append('u_city', "");
            }

            formData.append('u_pincode', this.state.form_data.u_pincode);
            formData.append('u_account_number', this.state.form_data.u_account_number);
            formData.append('u_bank_name', this.state.form_data.u_bank_name);
            formData.append('u_ifsc_code', this.state.form_data.u_ifsc_code);
            formData.append('u_swift_code', this.state.form_data.u_swift_code);
            formData.append('u_about_us', this.state.form_data.u_about_us);
            formData.append('profile_pic', this.state.form_data.image);
            api_option.data = formData;
            if ($('#aksfileupload').prop('files')[0]) {
                $('#btnSubmit').attr('hidden', 'true');
            }
            axios(api_option)
                .then(res => {
                    const res_data = res.data;
                    // $('#btnSubmit').attr('hidden', 'true');
                    if (res_data.status) {
                        this.setState({ redirect: '/Dashboard/' });
                        toast.success(res.data.message);

                    } else {
                        toast.error(res.data.message);
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
                    <script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/jquery.validate/1.13.1/jquery.validate.js"></script>
                    <script src="/assets/js/aks.js?12"></script>
                    <link rel='stylesheet' href='https://unpkg.com/aksfileupload@1.0.0/dist/aksFileUpload.min.css' />
                    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1-rc.1/css/select2.min.css' />
                    <script src="/assets/js/developer_signup_popup.js?12"></script>
                    <script src="/assets/js/steps.js"></script>
                    <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js'></script>
                    <script src='https://unpkg.com/aksfileupload@1.0.0/dist/aksFileUpload.min.js'></script>
                    <script src='https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1-rc.1/js/select2.min.js'></script>

                </Helmet>
                <ToastContainer />
                <div class="mobile-view mobile-header">
                    <div class="mobile-header-left">
                        <a class="navbar-brand" href="javascript:void(0)"><img src="/assets/images/logo.png" style={{ "width": "50px" }} /></a>
                    </div>
                    {/* <div class="mobile-header-right">
                    <NavLink  className="icon-list" exact to={'/Logout/'}><i class="bi bi-box-arrow-left"></i>Logout</NavLink>
                    </div> */}
                </div>

                <nav class="navbar navbar-expand-md navbar-default">
                    <div class="container">
                        <a class="navbar-brand" href="javascript:void(0)">
                            <img src="/assets/images/logo.png" />
                        </a>
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        {/* <div class="collapse navbar-collapse" id="collapsibleNavbar">
                            <ul class="navbar-nav ml-auto">
                                <li class="nav-item">
                                <NavLink  className="icon-list" exact to={'/Logout/'}><i class="bi bi-box-arrow-left"></i>Logout</NavLink>
                                </li>
                            </ul>
                        </div> */}
                    </div>
                </nav>

                <form id="msform" onSubmit={this.handleSaveData}>
                    <div class="msform-left">
                        <ul id="progressbar">
                            <li class="active">Business Details</li>
                            <li>Bank Details</li>
                            <li>Verification</li>
                        </ul>
                    </div>
                    <div class="msform-right">
                        <fieldset>
                            <h2 class="md-title">Step 1 - Business Details</h2>
                            <h3 class="fs-subtitle">Let’s get to know you a bit better! Please tell us something about yourself.</h3>
                            <div class="ms-formfield">
                                <div class="text-grid two">
                                    <div class="form-group">
                                        <label>Business Name</label>
                                        <input type="text" className="text-control" required name="u_business_name" id="u_business_name" data-validation="required" value={this.state.form_data.u_business_name} onChange={this.handleChange} />
                                        {this.validator.message('Business name', this.state.form_data.u_business_name, 'required')}
                                        <input type="hidden" className="text-control" name="u_id" id="u_id" value={this.state.form_data.u_id} />
                                    </div>
                                    <div class="form-group">
                                        <label>Seller Name</label>
                                        <input type="text" className="text-control" required name="u_seller_name" id="u_seller_name" data-validation="required" value={this.state.form_data.u_seller_name} onChange={this.handleChange} />
                                        {this.validator.message('Seller name', this.state.form_data.u_seller_name, 'required')}
                                    </div>
                                </div>
                                <div class="text-grid two">
                                    <div class="form-group">
                                        <label>Business Email</label>
                                        <input type="email" readOnly className="text-control" required name="u_business_email" id="u_business_email" data-validation="required email" value={this.state.form_data.u_business_email} onChange={this.handleChange} />
                                        {this.validator.message('Email', this.state.form_data.u_business_email, 'required|email')}
                                    </div>
                                    <div class="form-group">
                                        <label>Business Phone Number</label>
                                        <input type="text" className="text-control" required name="u_business_mobile" id="u_business_mobile" data-validation="required number" value={this.state.form_data.u_business_mobile} onChange={this.handleChange} />
                                        {this.validator.message('Phone', this.state.form_data.u_business_mobile, 'required|numeric')}
                                    </div>
                                </div>
                                <div class="text-grid two">
                                    <div class="form-group">
                                        <label>VAT Number</label>
                                        <input type="text" className="text-control" name="u_vat_number" id="u_vat_number" value={this.state.form_data.u_vat_number} onChange={this.handleChange} />
                                    </div>
                                </div>
                                <hr />
                                <div class="text-grid">
                                    <div class="form-group">
                                        <label>Business Address</label>
                                        <input type="text" className="text-control" required name="u_business_address" id="u_business_address" data-validation="required" value={this.state.form_data.u_business_address} onChange={this.handleChange} />
                                        {this.validator.message('Address', this.state.form_data.u_business_address, 'required')}
                                    </div>
                                </div>
                                <div class="text-grid two">
                                    {/* <div class="form-group">
                                        <label>Country</label>
                                        <input type="text" className="text-control" required name="u_country" id="u_country" data-validation="required" value={this.state.form_data.u_country} onChange={this.handleChange} />
                                        {this.validator.message('Country', this.state.form_data.u_country, 'required')}
                                    </div>
                                    <div class="form-group">
                                        <label>City</label>
                                        <input type="text" className="text-control" required name="u_city" id="u_city" data-validation="required" value={this.state.form_data.u_city} onChange={this.handleChange} />
                                        {this.validator.message('City', this.state.form_data.u_city, 'required')}
                                    </div> */}
                                    <div className="form-group">
                                        <label>Select Country</label>
                                        <Select
                                            value={this.state.form_data.u_country}
                                            onChange={this.handleChangeCountry}
                                            isSearchable={true}
                                            options={this.state.country_list}
                                            id="u_country" name="u_country"
                                        />
                                        {this.validator.message('Country', this.state.form_data.u_country, 'required')}
                                    </div>

                                    <div className="form-group">
                                        <label>Select City</label>
                                        <Select
                                            value={this.state.form_data.u_city}
                                            onChange={this.handleChangeCity}
                                            isSearchable={true}
                                            options={this.state.city_list}
                                            id="u_city" name="u_city"
                                        />
                                        {this.validator.message('City', this.state.form_data.u_city, 'required')}
                                    </div>
                                </div>
                                <div class="text-grid two">
                                    {/* <div class="form-group">
                                        <label>City</label>
                                        <input type="text" className="text-control" required name="u_city" id="u_city" data-validation="required" value={this.state.form_data.u_city} onChange={this.handleChange} />
                                        {this.validator.message('City', this.state.form_data.u_city, 'required')}
                                    </div> */}
                                    <div class="form-group">
                                        <label>Pincode</label>
                                        <input type="text" className="text-control" required name="u_pincode" id="u_pincode" data-validation="required" value={this.state.form_data.u_pincode} onChange={this.handleChange} />
                                        {this.validator.message('Zipcode', this.state.form_data.u_pincode, 'required|numeric')}
                                    </div>
                                </div>
                                <hr />
                                <div class="text-grid">
                                    <div class="form-group">
                                        <label>About</label>
                                        <textarea class="text-control" name="u_about_us" id="u_about_us" value={this.state.form_data.u_about_us} onChange={this.handleChange}>{this.state.form_data.u_about_us}</textarea>
                                    </div>
                                </div>
                                <div class="text-grid">
                                    <div class="form-group services-subcategory">
                                        <label>Services Areas</label>
                                        <Select2
                                            multiple
                                            name="tp_area"
                                            data={this.state.area_list}
                                            isSearchable={true}
                                            onChange={this.handleChangeArea.bind(this)}
                                            defaultValue={this.state.form_data.tp_area}
                                            options={{ placeholder: 'Select Area', closeOnSelect: true }} />


                                    </div>
                                </div>
                            </div>
                            <div class="stepform-action">
                                <input type="button" name="next" id="next" class="next btn btn-primary btn-long" value="Next" />
                            </div>
                        </fieldset>
                        <fieldset>
                            <h2 class="md-title">Step 2 - Bank Details</h2>
                            <h3 class="fs-subtitle">Let’s get to know you a bit better! Please tell us something about yourself.</h3>
                            <div class="ms-formfield">
                                <div class="text-grid">
                                    <div class="form-group">
                                        <label>Account Number</label>
                                        <input type="text" required numeric className="text-control" name="u_account_number" id="u_account_number" data-validation="required" value={this.state.form_data.u_account_number} onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div class="text-grid two">
                                    <div class="form-group">
                                        <label>Bank Name</label>
                                        <input type="text" required className="text-control" name="u_bank_name" id="u_bank_name" data-validation="required" value={this.state.form_data.u_bank_name} onChange={this.handleChange} />
                                    </div>
                                    <div class="form-group">
                                        <label>IFSC</label>
                                        <input type="text" required className="text-control" name="u_ifsc_code" id="u_ifsc_code" data-validation="required" value={this.state.form_data.u_ifsc_code} onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div class="text-grid">
                                    <div class="form-group">
                                        <label>Swift Code</label>
                                        <input type="text" required className="text-control" name="u_swift_code" id="u_swift_code" data-validation="required" value={this.state.form_data.u_swift_code} onChange={this.handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div class="stepform-action">
                                <input type="button" name="previous" class="previous btn btn-secondary btn-long" value="Previous" />
                                <input type="button" name="next" id="next" class="next btn btn-primary btn-long" value="Submit" />
                            </div>
                        </fieldset>
                        <fieldset>
                            <h2 class="md-title">Step 3 - Document Verification</h2>
                            <h3 class="fs-subtitle">Let's get to know you a bit better! Please upload your Company Commercial Registration Document, ID Card of Authorized Signatory and Company Profile in one document.</h3>
                            <div>
                                <div id="aks-file-upload" onChange={this.handleChange}></div>
                            </div>
                            <div class="stepform-action">
                                <input type="button" name="previous" class="previous btn btn-secondary btn-long" value="Previous" />
                                <button type="submit" name="btn" id="btnSubmit" class="btn btn-primary btn-long" value="Submit" >Submit</button>
                            </div>
                        </fieldset>
                    </div>
                </form>



            </>
        );
    }
}
export default SellerProfile;
