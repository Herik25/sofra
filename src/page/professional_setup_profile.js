import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import Select2 from 'react-select2-wrapper';
import swal from 'sweetalert';
import { Multiselect } from 'multiselect-react-dropdown';
import Loader from "react-loader";
import Select from 'react-select';
// import Select from 'react-select';
import $ from 'jquery';
// import { Helmet } from "react-helmet";

class ProfessionalSetupProfile extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();

        const professional_id = this.props.match.params.professional_id;
        var user_data = getUserDetail();

        var user_email = (user_data) ? user_data.u_email : '';
        var user_name = (user_data) ? user_data.u_name : '';
        var user_mobile = (user_data) ? user_data.u_mobile : '';
        // login form data



        this.initialState = {
            loaded: true,
            options: [{ name: 'Oman', id: 1 }, { name: 'Bahrain', id: 2 }, { name: 'Kuwait', id: 3 }],
            options1: [{ name: 'options1', id: 1 }, { name: 'options2', id: 2 }, { name: 'options3', id: 3 }],
            options2: [{ name: 'suboptions1', id: 1 }, { name: 'suboptions2', id: 2 }, { name: 'suboptions3', id: 3 }],
            form_data: {
                u_business_name: '',
                u_seller_name: '',
                u_image: '',
                u_business_email: '',
                u_business_mobile: '',
                u_id: professional_id,
                u_vat_number: '',
                u_business_address: '',
                u_country: '',
                u_state: '',
                u_city: '',
                u_website: '',
                u_pincode: '',
                u_account_number: '',
                u_bank_name: '',
                u_ifsc_code: '',
                u_swift_code: '',
                u_about_us: '',
                image: '',
                tp_area: '',
                images: {},
            },
            service_form_data: {

            },
            category_add_more: [{ category: '', subcategory: '0', subcat_list: [] }],
            category_list: [],
            area_list: [],
            country_list: [],
            state_list: [],
            city_list: [],
            error: ''
        }

        this.state = this.initialState;

        this.handleChange = this.handleChange.bind(this);
        this.handleSaveData = this.handleSaveData.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.handleSaveServiceData = this.handleSaveServiceData.bind(this);
        this.handleAddMore = this.handleAddMore.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeSubcategory = this.handleChangeSubcategory.bind(this);
        this.handleChangeCountry = this.handleChangeCountry.bind(this);
        this.handleChangeCity = this.handleChangeCity.bind(this);

        this.country_list_dropdown();
        this.get_profile_data();
        this.category_list_dropdown();
        this.area_list_dropdown();
        this.get_professional_service();
        //window.location.reload();
    }

    handleRemove(e, i) {
        var data = this.state['category_add_more'].splice(i, 1);
        this.setState({ data });
    }
    handleAddMore() {

        var data = this.state['category_add_more'].push({ category: '', subcategory: '', subcat_list: [] });

        this.setState({ data });
    }


    //handle Change File
    handleChangeFile(event) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#user_image').attr('src', e.target.result);
            }
            reader.readAsDataURL(event.target.files[0]);
        }
        const file_name = event.target.name;
        const file_value = event.target.files[0];
        const data = this.state.form_data[file_name] = file_value;
        this.setState({ data });
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

    handleSaveServiceData(event) {

        event.preventDefault();
        // if (!this.validator.allValid()) {
        //     this.validator.showMessages();
        //     this.forceUpdate();
        // } else {

        if (this.state.form_data.tp_area != '') {
            var is_cat = true;
            for (var i = 0; i < this.state.category_add_more.length; i++) {
                if (this.state.category_add_more[i].category != '') {
                } else {
                    toast.error('Please select category');
                    is_cat = false;
                    // this.state.category_add_more.splice(i, 1);
                }
            }
            if (!is_cat) {
                return false
            }
        } else {
            toast.error('Please select service area');
            return false
        }
        // this.setState({ loaded: false });
        api_option.url = 'save_services';
        api_option.data = { id: this.state.form_data.u_id, area: this.state.form_data.tp_area, category_add_more: JSON.stringify(this.state.category_add_more) };


        axios(api_option)
            .then(res => {
                //  this.setState({ loaded: true });
                const res_data = res.data;
                if (res_data.status) {
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(error => console.log(error));
        // }

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

    category_list_dropdown() {

        api_option.url = 'professional_category_list_dropdown';
        api_option.data = {};
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var fnldata = [];
                    $.each(res.data.category_list, function (i, item) {

                        var temparr = new Object;
                        temparr['value'] = res.data.category_list[i].id;
                        temparr['label'] = res.data.category_list[i].text;
                        fnldata.push(temparr);
                    });

                    this.setState({ category_list: fnldata });
                } else {
                    this.setState({ redirect: '/product/' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }

    async handleChangeSubcategory(event, i) {


        const name = event.lable;
        const value = event.target.value;
        var data = this.state.category_add_more[i]['subcategory'] = value;

        this.setState({ data });

    }

    async handleChangeCategory(event, i) {
        const name = event.lable;
        const value = event.target.value;
        var data = this.state.category_add_more[i]['category'] = value;
        this.setState({ data });

        if (value != "") {
            api_option.url = 'professional_subcategory_list_dropdown';
            ;
            api_option.data = { category_id: value };
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        var fnldata = [];
                        $.each(res.data.subcategory_list, function (i, item) {
                            fnldata.push({ 'value': res.data.subcategory_list[i].id, "label": res.data.subcategory_list[i].text });
                        });

                        var data = this.state.category_add_more[i]['subcat_list'] = fnldata;
                        this.setState({ data });
                    } else {
                        this.setState({ redirect: '/home/' });
                    }
                })
                .catch(error => {
                    //this.setState({ redirect: '/logout' });
                });
        } else {
            this.setState({ subcat_list: {} });
        }
    }



    async get_subcategory(cat_id, i) {
        const value = cat_id;


        if (value != "") {
            api_option.url = 'professional_subcategory_list_dropdown';
            ;
            api_option.data = { category_id: value };
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        var fnldata = [];
                        $.each(res.data.subcategory_list, function (i, item) {
                            fnldata.push({ 'value': res.data.subcategory_list[i].id, "label": res.data.subcategory_list[i].text });
                        });
                        var data = this.state.category_add_more[i]['subcat_list'] = fnldata;
                        this.setState({ data });
                    } else {
                        this.setState({ redirect: '/home/' });
                    }
                })
                .catch(error => {
                    //this.setState({ redirect: '/logout' });
                });
        } else {
            this.setState({ subcat_list: {} });
        }
    }

    async get_professional_service(props) {
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';

        // this.setState({ loaded: false });
        api_option.url = 'get_professional_service';
        api_option.data = { id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                //   this.setState({ loaded: true });
                if (res.data.status) {
                    if (res.data.data.length > 0) {

                        var data = this.state.form_data.tp_area = res.data.data[0].tps_area_id;
                        this.setState({ data });

                        this.state['category_add_more'] = [];

                        for (var i = 0; i < res.data.data.length; i++) {
                            // var edit_data = {
                            //     category: res.data.data[i].tps_category_id,
                            //     subcategory: res.data.data[i].tps_subcategory_id,
                            //     subcat_list: [],
                            // }
                            // async function get_subcategory(i) {


                            //     api_option.url = 'professional_subcategory_list_dropdown';
                            //     ;
                            //     api_option.data = { category_id: res.data.data[i]['tps_category_id'] };
                            //     await axios(api_option)
                            //         .then(res => {
                            //             if (res.data.status) {

                            //                 var fnldata = [];
                            //                 $.each(res.data.subcategory_list, function (j, item) {
                            //                     fnldata.push({ 'value': res.data.subcategory_list[j].id, "label": res.data.subcategory_list[j].text });
                            //                 });

                            //                 edit_data['subcat_list'] = fnldata

                            //             } else {

                            //             }
                            //         })
                            //         .catch(error => {
                            //             // var data = this.state.category_add_more.push({ category: res.data.data[i]['tps_category_id'], subcategory: res.data.data[i]['tps_subcategory_id'], subcat_list: [] });
                            //             // this.setState({ data });
                            //             //this.setState({ redirect: '/logout' });
                            //         });
                            // }
                            // get_subcategory(i);
                            // var data = this.state.category_add_more.push(edit_data);

                            // this.setState({ data });


                            var data = this.state['category_add_more'].push({ category: res.data.data[i]['tps_category_id'], subcategory: res.data.data[i]['tps_subcategory_id'], subcat_list: [] });

                            this.setState({ data });
                            this.get_subcategory(res.data.data[i]['tps_category_id'], i);
                        }
                    }
                    // this.setState(this.state.service_form_data = res.data.data);

                    // var category_add_more = [];
                    // for (var i = 0; i < res.data.data.length; i++) {
                    //     category_add_more.push(res);
                    //     var data = this.state.form_data['category_add_more'] = valuedata;
                    //     this.setState({ data });
                    // }




                } else {
                    //this.setState({ redirect: '/Product/' });
                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
            });
    }

    async get_profile_data() {
        const edit_id = this.props.match.params.professional_id;
        if (edit_id) {
            //  this.setState({ loaded: false });
            api_option.url = 'get_professional_profile_data';
            api_option.data = { id: edit_id };
            api_option.headers.Authorization = localStorage.getItem('token');
            await axios(api_option)
                .then(res => {
                    //   this.setState({ loaded: true });
                    const th = this;
                    if (res.data.status) {
                        var res_data = res.data.profile_detail;

                        this.setState({ profile_detail: res_data });
                        var data = th.state.form_data['full_name'] = res_data.u_name;
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

    componentDidMount() {
        // const check = this.props.match.params.check;
        // const professional_id = this.props.match.params.professional_id;
        // if (check == 'test') {
        //     window.location.reload('/Setup-profile/' + professional_id);
        // }
    }

    async handleChangeCountry(event) {

        const name = event.lable;
        const value = event.value;
        /* console.log(event);
        return false; */
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
                    // console.log(res.data.country_list);
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

    // form submit event
    handleSaveData(event) {

        event.preventDefault();
        // if (!this.validator.allValid()) {
        //     this.validator.showMessages();
        //     this.forceUpdate();
        // } else {
        if ($('#aksfileupload').prop('files') != undefined) {
            var data = this.state.form_data['image'] = $('#aksfileupload').prop('files')[0];
        } else {
            var data = this.state.form_data['image'] = "";
        }

        this.setState({ data });

        //this.setState({ loaded: false });

        api_option.url = 'professional_profile_data';
        const formData = new FormData();
        formData.append('id', this.state.form_data.u_id);
        formData.append('u_business_name', this.state.form_data.u_business_name);
        formData.append('u_seller_name', this.state.form_data.u_seller_name);
        formData.append('u_business_email', this.state.form_data.u_business_email);
        formData.append('u_business_mobile', this.state.form_data.u_business_mobile);
        formData.append('u_vat_number', this.state.form_data.u_vat_number);
        formData.append('u_website', this.state.form_data.u_website);
        formData.append('u_business_address', this.state.form_data.u_business_address);
        formData.append('u_about_us', this.state.form_data.u_about_us);
        formData.append('u_country', this.state.form_data.u_country.label);
        // formData.append('u_country', this.state.form_data.u_country);
        formData.append('u_state', this.state.form_data.u_state);
        formData.append('u_city', this.state.form_data.u_city.label);
        // formData.append('u_city', this.state.form_data.u_city);
        /* if (this.state.form_data.u_city) {
        } else {
            formData.append('u_city', 0);
        } */

        formData.append('u_pincode', this.state.form_data.u_pincode);
        formData.append('u_account_number', this.state.form_data.u_account_number);
        formData.append('u_bank_name', this.state.form_data.u_bank_name);
        formData.append('u_ifsc_code', this.state.form_data.u_ifsc_code);
        formData.append('u_swift_code', this.state.form_data.u_swift_code);
        formData.append('profile_pic', this.state.form_data.u_image);
        formData.append('image', this.state.form_data.image);
        formData.append('tp_area', this.state.form_data.tp_area);
        formData.append('area', this.state.form_data.tp_area);
        formData.append('category_add_more', JSON.stringify(this.state.category_add_more));
        api_option.data = formData;

        if ($('#aksfileupload').prop('files')[0]) {
            $('#btnSubmit').attr('disabled', 'disabled');
        }
        axios(api_option)
            .then(res => {
                //  this.setState({ loaded: true });
                const res_data = res.data;
                if (res_data.status) {
                    // this.setState({ redirect: '/Professional-login/' });

                    toast.success(res.data.message);
                    var th = this;
                    setTimeout(function () {
                        th.setState({ redirect: '/Professional-profile/' });
                    }, 1000)

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
                <Helmet>
                    <script type="text/javascript" src="https://ajax.aspnetcdn.com/ajax/jquery.validate/1.13.1/jquery.validate.js"></script>
                    <script src="/assets/js/aks.js?12"></script>
                    <link rel='stylesheet' href='https://unpkg.com/aksfileupload@1.0.0/dist/aksFileUpload.min.css' />
                    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1-rc.1/css/select2.min.css' />
                    <script src="/assets/js/developer_signup_popup.js?123"></script>
                    <script src="/assets/js/steps.js"></script>
                    <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js'></script>
                    <script src='https://unpkg.com/aksfileupload@1.0.0/dist/aksFileUpload.min.js'></script>
                    <script src='https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1-rc.1/js/select2.min.js'></script>

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
                <div class="mobile-view mobile-header">
                    <div class="mobile-header-left">
                        <a class="navbar-brand" href="javascript:void(0)"><img src="/assets/images/logo.png" /></a>
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
                            <li class="active">Professional Details</li>
                            <li>Services</li>
                            <li>Bank Details</li>
                            <li>Verification</li>
                        </ul>
                    </div>
                    <div class="msform-right">
                        <fieldset>
                            <h2 class="md-title">Step 1 - Professional Details</h2>
                            <h3 class="fs-subtitle">Let’s get to know you a bit better! Please tell us something about yourself.</h3>
                            <div class="ms-formfield">
                                <div class="form-group">
                                    {/* <div class="thumb-upload">
                                        <figure><img src="/assets/images/avatar-1.jpg" /></figure>
                                        <div class="custom-upload">
                                            <input type="file" id="file" />
                                            <label for="file">
                                                <span>Uplaod Photo</span>
                                            </label>
                                        </div>
                                    </div> */}
                                    <div class="thumb-upload">
                                        <figure><img src="/assets/images/avatar-1.jpg" id="user_image" /></figure>
                                        <div class="custom-upload">
                                            <input type="file" id="u_image" name="u_image" onChange={this.handleChangeFile} />
                                            <label for="u_image">
                                                <span>Uplaod Photo</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div class="text-grid two">
                                    <div class="form-group">
                                        <label>Name</label>
                                        <input type="text" required className="text-control" name="full_name" id="full_name" value={this.state.form_data.full_name} onChange={this.handleChange} />
                                        <input type="hidden" className="text-control" name="u_id" id="u_id" value={this.state.form_data.u_id} />
                                    </div>
                                    <div class="form-group">
                                        <label>Business Name</label>
                                        <input type="text" required className="text-control" data-validation="required" name="u_business_name" id="u_business_name" value={this.state.form_data.u_business_name} onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div class="text-grid two">
                                    <div class="form-group">
                                        <label>Email</label>
                                        <input type="email" readOnly className="text-control" required email name="u_business_email" id="u_business_email" data-validation="required email" value={this.state.form_data.u_business_email} onChange={this.handleChange} />
                                    </div>
                                    <div class="form-group">
                                        <label>Phone Number</label>
                                        <input type="number" required className="text-control" name="u_business_mobile" id="u_business_mobile" data-validation="required number" value={this.state.form_data.u_business_mobile} onChange={this.handleChange} />
                                        {this.validator.message('Phone', this.state.form_data.u_business_mobile, 'required|numeric')}
                                    </div>
                                </div>
                                <div class="text-grid two">
                                    <div class="form-group">
                                        <label>Website</label>
                                        <input type="url" name="u_website" id="u_website" value={this.state.form_data.u_website} className="text-control" onChange={this.handleChange} />
                                    </div>
                                    <div class="form-group">
                                        <label>VAT number</label>
                                        <input type="text" className="text-control" name="u_vat_number" id="u_vat_number" value={this.state.form_data.u_vat_number} onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div class="text-grid">
                                    <div class="form-group">
                                        <label>About</label>
                                        <textarea className="text-control" required name="u_about_us" id="u_about_us" value={this.state.form_data.u_about_us} onChange={this.handleChange}></textarea>
                                    </div>
                                </div>
                                <div class="text-grid">
                                    <div class="form-group">
                                        <label>Address</label>
                                        <input type="text" required name="u_business_address" id="u_business_address" onChange={this.handleChange} className="text-control" />
                                    </div>
                                </div>
                                <div class="text-grid two">
                                    {/* <div class="form-group">
                                        <label>Country</label>
                                        <input type="text" required className="text-control" name="u_country" id="u_country" data-validation="required" value={this.state.form_data.u_country} onChange={this.handleChange} />
                                    </div>
                                    <div class="form-group">
                                        <label>State</label>
                                        <input type="text" required className="text-control" name="u_state" id="u_state" data-validation="required" value={this.state.form_data.u_state} onChange={this.handleChange} />
                                    </div> */}
                                    {/* <div class="form-group">
                                        <label>Country</label>
                                        <input type="text" className="text-control" name="u_country" id="u_country" value={this.state.form_data.u_country} onChange={this.handleChange} />
                                        {this.validator.message('Country', this.state.form_data.u_country, 'required')}
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

                                    {/* <div class="form-group">
                                        <label>City</label>
                                        <input type="text" className="text-control" name="u_city" id="u_city" value={this.state.form_data.u_city} onChange={this.handleChange} />
                                        {this.validator.message('Country', this.state.form_data.u_city, 'required')}
                                    </div> */}

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
                                        <input type="text" required className="text-control" name="u_city" id="u_city" data-validation="required" value={this.state.form_data.u_city} onChange={this.handleChange} />
                                    </div> */}
                                    <div class="form-group">
                                        <label>Pincode</label>
                                        <input type="text" required className="text-control" name="u_pincode" id="u_pincode" data-validation="required" value={this.state.form_data.u_pincode} onChange={this.handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div class="stepform-action">
                                <input type="button" name="next" id="next" className="next btn btn-primary btn-long" value="Next" />
                            </div>
                        </fieldset>
                        <fieldset>
                            <h2 class="md-title">Step 2 - Services</h2>
                            <h3 class="fs-subtitle">Let’s get to know you a bit better! Please tell us something about yourself.</h3>
                            <div class="ms-formfield">
                                {/* <form onSubmit={this.handleSaveServiceData}> */}
                                <div class="addServices-wrapper">
                                    <div>
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
                                    {Object.entries(this.state.category_add_more).map(([i, v]) => (
                                        <div class="addServices-row">
                                            <div class="form-group services-category">
                                                <label>Select Category</label>
                                                <select className="form-control" value={v.category} onChange={e => this.handleChangeCategory(e, i)}>
                                                    <option value="">Select Category</option>
                                                    {Object.entries(this.state.category_list).map(([o, p]) => (
                                                        <option value={p.value}>{p.label}</option>

                                                    ))}

                                                </select>
                                            </div>
                                            <div class="form-group services-subcategory">
                                                <label>Select Sub-Category</label>
                                                <select className="form-control" value={v.subcategory} onChange={e => this.handleChangeSubcategory(e, i)}>
                                                    <option value="">Select Sub Category</option>
                                                    {Object.entries(v.subcat_list).map(([o, p]) => (


                                                        <option value={p.value}>{p.label}</option>

                                                    ))}

                                                </select>
                                                {i != 0 && <button type="button" class="addServices-trigger" onClick={er => this.handleRemove(er, i)} >Remove Item<i class="bi bi-minus"></i></button>}

                                            </div>
                                        </div>
                                    ))}
                                    <button class="addServices-trigger" type="button" onClick={this.handleAddMore} >Add More <i class="bi bi-plus"></i></button>
                                    {/* <button class="btn btn-primary" >Save</button> */}
                                </div>
                                {/* </form> */}




                            </div>
                            <div class="stepform-action">
                                <input type="button" name="previous" class="previous btn btn-secondary btn-long" value="Previous" />
                                <input type="button" name="next" id="next_2" class="next btn btn-primary btn-long" value="Next" />
                            </div>
                        </fieldset>
                        <fieldset>
                            <h2 class="md-title">Step 3 - Bank Details</h2>
                            <h3 class="fs-subtitle">Let’s get to know you a bit better! Please tell us something about yourself.</h3>
                            <div class="ms-formfield">
                                <div class="text-grid">
                                    <div class="form-group">
                                        <label>Account Number</label>
                                        <input type="number" className="text-control" name="u_account_number" id="u_account_number" value={this.state.form_data.u_account_number} onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div class="text-grid two">
                                    <div class="form-group">
                                        <label>Bank Name</label>
                                        <input type="text" className="text-control" name="u_bank_name" id="u_bank_name" value={this.state.form_data.u_bank_name} onChange={this.handleChange} />
                                    </div>
                                    <div class="form-group">
                                        <label>IFSC</label>
                                        <input type="text" className="text-control" name="u_ifsc_code" id="u_ifsc_code" value={this.state.form_data.u_ifsc_code} onChange={this.handleChange} />
                                    </div>
                                </div>
                                <div class="text-grid">
                                    <div class="form-group">
                                        <label>Swift Code</label>
                                        <input type="text" className="text-control" name="u_swift_code" id="u_swift_code" value={this.state.form_data.u_swift_code} onChange={this.handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div class="stepform-action">
                                <input type="button" name="previous" class="previous btn btn-secondary btn-long" value="Previous" />
                                <input type="button" name="next" id="next" class="next btn btn-primary btn-long" value="Next" />
                            </div>
                        </fieldset>
                        <fieldset>
                            <h2 class="md-title">Step 4 - Document Verification</h2>
                            {/* <h3 class="fs-subtitle">Let’s get to know you a bit better! Please tell us something about yourself.</h3> */}
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
export default ProfessionalSetupProfile;
