import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, api_url, setUserSession, is_login, removeUserSession, getUserDetail, getUserId } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import $ from 'jquery';
import { Helmet } from "react-helmet";
import Loader from "react-loader";
import Select2 from 'react-select2-wrapper';
class MyAccount extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        var u_id = user_data ? user_data.u_id : '';

        var user_email = (user_data) ? user_data.u_email : '';
        var user_name = (user_data) ? user_data.u_name : '';
        var user_mobile = (user_data) ? user_data.u_mobile : '';
        this.validator = new SimpleReactValidator();
        this.initialState = {
            status_data: [],
            form_data: {
                u_business_name: '',
                u_seller_name: '',
                u_business_email: '',
                u_business_mobile: '',
                u_id: u_id,
                u_vat_number: '',
                u_business_address: '',
                u_country: '',
                u_state: '',
                u_website: '',
                u_city: '',
                u_pincode: '',
                u_account_number: '',
                u_bank_name: '',
                u_ifsc_code: '',
                u_swift_code: '',
                u_about_us: '',
                u_is_image_delete: 'no',
                u_image: {},
                u_document: '',
                u_document_with_path: '',
                u_document_type: '',
                tp_area: '',

            },
            document_data: {
                document_image: {},
                u_document: '',
                u_document_with_path: '',
                u_document_type: '',
                tp_area: '',

            },
            error: '',
            area_list: [],
            loaded: true
        }

        this.state = this.initialState;
        this.handleSaveData = this.handleSaveData.bind(this);
        this.handleUpdateDocument = this.handleUpdateDocument.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.handleChangeFile1 = this.handleChangeFile1.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
        this.get_form_data();
        this.get_my_document();
        this.area_list_dropdown();
        this.get_professional_service();
    }
    deleteImage() {
        $('#user_image').attr('src', '/assets/images/profile.svg');
        var data = this.state.form_data['u_is_image_delete'] = 'yes';
        this.setState({ data });


    }
    componentDidMount() {
        $('#OpenImgUpload').click(function () { $('#imgupload').trigger('click'); });
        $('#OpenImgUpload1').click(function () { $('#imgupload1').trigger('click'); });
    }


    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
    }


    async get_professional_service(props) {
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';

        this.setState({ loaded: false });
        api_option.url = 'get_professional_service';
        api_option.data = { id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {
                    if (res.data.data.length > 0) {
                        var data = this.state.document_data.tp_area = res.data.data[0].tps_area_id;
                        this.setState({ data });
                    }
                } else {
                    //this.setState({ redirect: '/Product/' });
                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
            });
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

        var data1 = this.state.form_data['u_is_image_delete'] = 'no';
        this.setState({ data1 });
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
        var data = this.state.document_data[name] = value;
        this.setState({ data });
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
                    // this.setState({ redirect: '/product/' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }

    //handle Change File
    handleChangeFile1(event) {

        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#user_image1').attr('src', e.target.result);
            }
            reader.readAsDataURL(event.target.files[0]);
        }
        const file_name = event.target.name;
        const file_value = event.target.files[0];
        const data = this.state.document_data[file_name] = file_value;
        this.setState({ data });

    }

    //get edit form data
    async get_form_data() {

        api_option.url = 'get_profile_data';
        api_option.data = { id: this.state.form_data.u_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    const th = this;
                    var res_data = res.data.data;
                    this.setState(this.state.form_data = res.data.data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });

    }

    // get documents
    async get_my_document() {

        api_option.url = 'get_my_document';
        api_option.data = { id: this.state.form_data.u_id };
        // api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {

                if (res.data.status) {
                    const th = this;
                    var res_data = res.data.data;

                    const data = th.state.document_data['u_document'] = res_data.tud_file;
                    th.setState({ data });

                    const data2 = th.state.document_data['u_document_with_path'] = api_url + 'document/' + res_data.tud_file;
                    th.setState({ data2 });

                    const data1 = th.state.document_data['u_document_type'] = res_data.tud_type;
                    th.setState({ data1 });
                } else {
                    //this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                console.log(error)
                //   this.setState({ redirect: '/logout' });
            });

    }



    // form submit event


    handleSaveData(event) {

        event.preventDefault();
        if (!this.validator.allValid()) {
            this.validator.showMessages();
            this.forceUpdate();
        } else {

            this.setState({ loaded: false });
            api_option.url = 'seller_profile_data';
            const formData = new FormData();
            formData.append('u_id', this.state.form_data.u_id);
            formData.append('u_business_name', this.state.form_data.u_business_name);
            formData.append('u_seller_name', this.state.form_data.u_seller_name);
            formData.append('u_business_email', this.state.form_data.u_business_email);
            formData.append('u_business_mobile', this.state.form_data.u_business_mobile);
            formData.append('u_vat_number', this.state.form_data.u_vat_number);
            formData.append('u_business_address', this.state.form_data.u_business_address);
            formData.append('u_country', this.state.form_data.u_country);
            formData.append('u_state', this.state.form_data.u_state);
            formData.append('u_city', this.state.form_data.u_city);
            formData.append('u_pincode', this.state.form_data.u_pincode);
            formData.append('u_website', this.state.form_data.u_website);
            formData.append('u_account_number', this.state.form_data.u_account_number);
            formData.append('u_bank_name', this.state.form_data.u_bank_name);
            formData.append('u_ifsc_code', this.state.form_data.u_ifsc_code);
            formData.append('u_swift_code', this.state.form_data.u_swift_code);
            formData.append('profile_pic', this.state.form_data.u_image);
            formData.append('u_is_image_delete', this.state.form_data.u_is_image_delete);
            formData.append('u_about_us', this.state.form_data.u_about_us);
            formData.append('tp_area', this.state.document_data.tp_area);
            api_option.data = formData;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        toast.success(res.data.message);
                        var uimg = $('#user_image').attr('src');
                        $('#seller_image_id').attr('src', uimg)
                        //  this.setState({ redirect: '/My-Account/' });
                        //this.get_form_seller_data();
                        this.props.history.push('/My-Account');
                    } else {
                        toast.error(res.data.message);
                    }
                })
                .catch(error => console.log(error));
        }

    }


    handleUpdateDocument(event) {

        event.preventDefault();
        if (!this.validator.allValid()) {
            this.validator.showMessages();
            this.forceUpdate();
        } else {

            api_option.url = 'update_document_data';
            const formData = new FormData();
            formData.append('u_id', this.state.form_data.u_id);
            formData.append('u_document_with_path', this.state.document_data.u_document_with_path);
            api_option.data = formData;

            axios(api_option)
                .then(res => {
                    const res_data = res.data;
                    if (res_data.status) {
                        toast.success(res.data.message);
                        // this.setState({ redirect: '/My-Account/' });
                        this.get_my_document();
                        this.props.history.push('/My-Account');
                        //window.location.href = '/shorfa/#/My-Account';
                    } else {
                        toast.error(res.data.message);
                    }
                })
                .catch(error => console.log(error));
        }

    }


    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>
                <Helmet>
                    <link rel="shortcut icon" href="/assets/seller/images/icon.png" />
                    <link href="/assets/seller/plugins/switchery/switchery.min.css" rel="stylesheet" />
                    <link href="/assets/seller/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
                    <link href="/assets/seller/css/icons.css" rel="stylesheet" type="text/css" />
                    <link href="/assets/seller/css/flag-icon.min.css" rel="stylesheet" type="text/css" />
                    <link href="/assets/seller/css/style.css" rel="stylesheet" type="text/css" />

                    <script src="/assets/seller/js/jquery.min.js"></script>
                    <script src="/assets/seller/js/popper.min.js"></script>
                    <script src="/assets/seller/js/bootstrap.min.js"></script>
                    <script src="/assets/seller/js/modernizr.min.js"></script>
                    <script src="/assets/seller/js/detect.js"></script>
                    <script src="/assets/seller/js/jquery.slimscroll.js"></script>
                    <script src="/assets/seller/js/vertical-menu.js"></script>
                    <script src="/assets/seller/plugins/switchery/switchery.min.js"></script>
                    <script src="/assets/seller/js/custom/custom-ecommerce-myaccount.js"></script>
                    <script src="/assets/seller/js/core.js"></script>
                </Helmet>
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
                <div class="breadcrumbbar">
                    <div class="row align-items-center">
                        <div class="col-md-8 col-lg-8">
                            <h4 class="page-title">My Profile</h4>
                            <div class="breadcrumb-list">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><NavLink exact to={'/Dashborad/'}>Home</NavLink></li>
                                    <li class="breadcrumb-item active" aria-current="page">My Profile</li>
                                </ol>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-4">
                            {/* <div class="widgetbar">
                                <button class="btn btn-primary-rgba"><i class="feather icon-plus mr-2"></i>Actions</button>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div class="contentbar">
                    <div class="row">
                        <div class="col-lg-5 col-xl-3">
                            <div class="card m-b-30">
                                <div class="card-header">
                                    <h5 class="card-title mb-0">My Account</h5>
                                </div>
                                <div class="card-body">
                                    <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                                        <a class="nav-link mb-2 active" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-business" role="tab" aria-controls="v-pills-business" aria-selected="false">
                                            <i class="feather icon-user mr-2"></i>Business Details
                                        </a>
                                        <a class="nav-link mb-2" id="v-pills-order-tab" data-toggle="pill" href="#v-pills-bank" role="tab" aria-controls="v-pills-bank" aria-selected="false">
                                            <i class="feather icon-package mr-2"></i>Bank Details
                                        </a>

                                        <a class="nav-link mb-2" id="v-pills-document-tab" data-toggle="pill" href="#v-pills-document" role="tab" aria-controls="v-pills-bank" aria-selected="false">
                                            <i class="feather icon-file-text mr-2"></i>Documents
                                        </a>

                                        {/* <a class="nav-link" id="v-pills-logout-tab" data-toggle="pill" href="#v-pills-logout" role="tab" aria-controls="v-pills-logout" aria-selected="true">
                                            <i class="feather icon-log-out mr-2"></i>Logout
                                        </a> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-7 col-xl-9">
                            <div class="tab-content" id="v-pills-tabContent">
                                <div class="tab-pane fade show active" id="v-pills-business" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                                    <div class="card m-b-30">
                                        <div class="card-body">
                                            <div class="profilebox pt-4 text-center">
                                                <ul class="list-inline">
                                                    <li class="list-inline-item">
                                                        <a class="btn btn-success-rgba font-18" id="OpenImgUpload"><i class="feather icon-edit"></i></a>
                                                    </li>
                                                    <li class="list-inline-item">
                                                        <img src={this.state.form_data.u_image} class="img-fluid" id="user_image" alt="profile" style={{ height: "100px" }} />
                                                        <input type="file" id="imgupload" name="u_image" onChange={this.handleChangeFile} style={{ display: 'none' }} />
                                                    </li>
                                                    <li class="list-inline-item">
                                                        <a onClick={this.deleteImage} class="btn btn-danger-rgba font-18"><i class="feather icon-trash"></i></a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card m-b-30">
                                        <div class="card-header">
                                            <h5 class="card-title mb-0">Business Details</h5>
                                        </div>
                                        <div class="card-body">
                                            <form onSubmit={this.handleSaveData}>
                                                <div class="form-row">
                                                    <div class="form-group col-md-6">
                                                        <label>Business Name</label>
                                                        <input type="text" className="text-control" name="u_business_name" id="u_business_name" value={this.state.form_data.u_business_name} onChange={this.handleChange} />
                                                        {this.validator.message('Business name', this.state.form_data.u_business_name, 'required')}
                                                        <input type="hidden" className="text-control" name="u_id" id="u_id" value={this.state.form_data.u_id} />
                                                    </div>
                                                    <div class="form-group col-md-6">
                                                        <label>Seller Name</label>
                                                        <input type="text" className="text-control" required name="u_seller_name" id="u_seller_name" data-validation="required" value={this.state.form_data.u_seller_name} onChange={this.handleChange} />
                                                        {this.validator.message('Seller name', this.state.form_data.u_seller_name, 'required')}
                                                    </div>
                                                </div>

                                                <div class="form-row">
                                                    <div class="form-group col-md-12">
                                                        <label>About</label>
                                                        <textarea className="text-control" required name="u_about_us" id="u_about_us" data-validation="required" value={this.state.form_data.u_about_us} onChange={this.handleChange} >{this.state.form_data.u_about_us}</textarea>
                                                    </div>
                                                </div>

                                                <div class="form-row">
                                                    <div class="form-group col-md-6">
                                                        <label>Business Email</label>
                                                        <input type="email" className="text-control" required name="u_business_email" id="u_business_email" data-validation="required email" value={this.state.form_data.u_business_email} onChange={this.handleChange} />
                                                        {this.validator.message('Email', this.state.form_data.u_business_email, 'required|email')}
                                                    </div>
                                                    <div class="form-group col-md-6">
                                                        <label>Business Phone Number</label>
                                                        <input type="text" className="text-control" name="u_business_mobile" id="u_business_mobile" data-validation="required" value={this.state.form_data.u_business_mobile} onChange={this.handleChange} />
                                                        {this.validator.message('Phone', this.state.form_data.u_business_mobile, 'required|numeric')}
                                                    </div>
                                                </div>
                                                <div class="form-row">
                                                    <div class="form-group col-md-12">
                                                        <label>Business Address</label>
                                                        <input type="text" className="text-control" name="u_business_address" id="u_business_address" data-validation="required" value={this.state.form_data.u_business_address} onChange={this.handleChange} />
                                                        {this.validator.message('Address', this.state.form_data.u_business_address, 'required')}
                                                    </div>

                                                </div>
                                                <div class="form-row">
                                                    <div class="form-group col-md-4">
                                                        <label>Country</label>
                                                        <input type="text" className="text-control" name="u_country" id="u_country" data-validation="required" value={this.state.form_data.u_country} onChange={this.handleChange} />
                                                        {this.validator.message('Country', this.state.form_data.u_country, 'required')}
                                                    </div>
                                                    {/* <div class="form-group col-md-4">
                                                        <label>State</label>
                                                        <input type="text" className="text-control" name="u_state" id="u_state" data-validation="required" value={this.state.form_data.u_state} onChange={this.handleChange} />
                                                        {this.validator.message('State', this.state.form_data.u_state, 'required')}
                                                    </div> */}
                                                    <div class="form-group col-md-4">
                                                        <label>City</label>
                                                        <input type="text" className="text-control" name="u_city" id="u_city" data-validation="required" value={this.state.form_data.u_city} onChange={this.handleChange} />
                                                        {this.validator.message('City', this.state.form_data.u_city, 'required')}
                                                    </div>
                                                </div>
                                                <div class="form-row">

                                                    <div class="form-group col-md-4">
                                                        <label>Website</label>
                                                        <input type="text" class="text-control" name="u_website" id="u_website" value={this.state.form_data.u_website} onChange={this.handleChange} />
                                                        {this.validator.message('Website', this.state.form_data.u_website, 'url')}
                                                    </div>
                                                    <div class="form-group col-md-4">
                                                        <label>Pincode</label>
                                                        <input type="text" className="text-control" name="u_pincode" id="u_pincode" value={this.state.form_data.u_pincode} onChange={this.handleChange} />
                                                        {this.validator.message('Zipcode', this.state.form_data.u_pincode, 'required|numeric')}
                                                    </div>

                                                    <div class="form-group col-md-4">
                                                        <label>Services Areas</label>

                                                        <Select2
                                                            multiple
                                                            name="tp_area"
                                                            data={this.state.area_list}
                                                            isSearchable={true}
                                                            onChange={this.handleChangeArea.bind(this)}
                                                            defaultValue={this.state.document_data.tp_area}
                                                            options={{ placeholder: 'Select Area', closeOnSelect: true }} />

                                                    </div>

                                                </div>
                                                <button type="submit" class="btn btn-primary-rgba font-16"><i class="feather icon-save mr-2"></i>Update</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="v-pills-bank" role="tabpanel" aria-labelledby="v-pills-profile-tab">
                                    <div class="card m-b-30">
                                        <div class="card-header">
                                            <h5 class="card-title mb-0">Bank Details</h5>
                                        </div>
                                        <div class="card-body">
                                            <form onSubmit={this.handleSaveData}>
                                                <div class="form-row">
                                                    <div class="form-group col-md-12">
                                                        <label>Account Number</label>
                                                        <input type="text" className="text-control" name="u_account_number" id="u_account_number" data-validation="required" value={this.state.form_data.u_account_number} onChange={this.handleChange} />
                                                    </div>
                                                </div>
                                                <div class="form-row">
                                                    <div class="form-group col-md-6">
                                                        <label>Bank Name</label>
                                                        <input type="text" className="text-control" name="u_bank_name" id="u_bank_name" data-validation="required" value={this.state.form_data.u_bank_name} onChange={this.handleChange} />
                                                    </div>
                                                    <div class="form-group col-md-6">
                                                        <label>IFSC</label>
                                                        <input type="text" className="text-control" name="u_ifsc_code" id="u_ifsc_code" data-validation="required" value={this.state.form_data.u_ifsc_code} onChange={this.handleChange} />
                                                    </div>
                                                </div>
                                                <div class="form-row">
                                                    <div class="form-group col-md-12">
                                                        <label>Swift Code</label>
                                                        <input type="text" className="text-control" name="u_swift_code" id="u_swift_code" data-validation="required" value={this.state.form_data.u_swift_code} onChange={this.handleChange} />
                                                    </div>
                                                </div>
                                                <button type="submit" class="btn btn-primary-rgba font-16"><i class="feather icon-save mr-2"></i>Update</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="v-pills-document" role="tabpanel" aria-labelledby="v-pills-document-tab">
                                    <div class="card m-b-30">
                                        <div class="card-header">
                                            <h5 class="card-title mb-0">Documents</h5>
                                        </div>
                                        <div class="card-body">
                                            <form onSubmit={this.handleUpdateDocument}>
                                                <div class="doc-images">
                                                    <li class="list-inline-item">
                                                        <a class="btn btn-success-rgba font-18" id="OpenImgUpload1"><i class="feather icon-edit"></i></a>
                                                    </li>
                                                    {this.state.document_data.u_document_type == 'image' && <span><img src={this.state.document_data.u_document_with_path} alt="Thumbnail Image" class="img-thumbnail" id="user_image1" /></span>
                                                    }
                                                    <input type="file" id="imgupload1" name="u_document_with_path" onChange={this.handleChangeFile1} style={{ display: 'none' }} />

                                                    {this.state.document_data.u_document_type == 'pdf' && <span><a target="_blank" href={this.state.document_data.u_document_with_path}><img style={{ height: "50%", width: "50%" }} src='/assets/images/pdf.png' alt="Thumbnail Image" class="img-thumbnail" /></a></span>
                                                    }


                                                    {/* <span><img src="/assets/seller/images/ui-images/image-thumbnail.jpg" alt="Thumbnail Image" class="img-thumbnail" /></span>
                                                        <span><img src="/assets/seller/images/ui-images/image-thumbnail.jpg" alt="Thumbnail Image" class="img-thumbnail" /></span>
                                                        <span><img src="/assets/seller/images/ui-images/image-thumbnail.jpg" alt="Thumbnail Image" class="img-thumbnail" /></span> */}

                                                </div>
                                                <button type="submit" class="btn btn-primary-rgba font-16"><i class="feather icon-save mr-2"></i>Update</button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade" id="v-pills-logout" role="tabpanel" aria-labelledby="v-pills-logout-tab">
                                    <div class="card m-b-30">
                                        <div class="card-header">
                                            <h5 class="card-title mb-0">Logout</h5>
                                        </div>
                                        <div class="card-body">
                                            <div class="row justify-content-center">
                                                <div class="col-lg-6 col-xl-6">
                                                    <div class="logout-content text-center my-5">
                                                        <img src="/assets/seller/images/ecommerce/logout.svg" class="img-fluid mb-5" alt="logout" />
                                                        <h2 class="text-success">Logout ?</h2>
                                                        <p class="my-4">Are you sure to want to Log out? You will miss your instant checkout deal.</p>
                                                        <div class="button-list">
                                                            <NavLink exact to={'/Logout/'}><button type="button" class="btn btn-danger font-16"><i class="feather icon-check mr-2"></i>Yes, I'm sure</button></NavLink>
                                                            <button type="button" class="btn btn-success-rgba font-16"><i class="feather icon-x mr-2"></i>Cancel</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </>
        );
    }
}
export default MyAccount;