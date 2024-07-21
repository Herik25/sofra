import React, { Component } from 'react';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail, getUserId } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import $ from 'jquery';
import Select from 'react-select';
import { Helmet } from "react-helmet";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
class SellerDetail extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        this.validator = new SimpleReactValidator();
        this.comment_validator = new SimpleReactValidator();
        var user_id = user_data ? user_data.u_id : '';
        var professional_id = this.props.match.params.seller_id;
        this.get_seller_product();
        this.get_seller_project();
        this.get_seller_knowhow();
        this.get_seller_detail();
        this.get_comment_professional();
        this.get_professional_cat_service();
        this.get_comment_count();
        this.get_service_area();

        this.initialState = {
            form_data: {
                seller_product: '',
                services: '',
                services_price: '',
                seller_project: '',
                seller_knowhow: '',
                seller_detail: '',
                service_area: '',
                u_id: user_id
            },

            comment_data: {
                comment: '',
                comment_count: '',
                user_comment_id: user_id,
                professional_comment_id: professional_id,
                comment_data: [],
            },
            category_list: [],
            subcategory_list: [],
            subcategory_list_new: [],

            error: ''
        }

        this.category_list_dropdown();
        this.state = this.initialState;
        this.handleSaveData = this.handleSaveData.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeSubcategory = this.handleChangeSubcategory.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        //this.handleFavourite = this.handleFavourite.bind(this);
        this.get_form_data();
        this.openLoginModal = this.openLoginModal.bind(this);
        this.handleReportChange = this.handleReportChange.bind(this);

    }

    componentDidMount() {
        $('#OpenImgUpload').click(function () { $('#imgupload').trigger('click'); });
    }
    handleServData(subcat_id, event) {
        localStorage.setItem('subcategory_id', subcat_id);
        this.get_service_is_exist_cart(localStorage.getItem('subcategory_id'));
        this.get_professional_cat_service();
    }
    openLoginModal(e) {
        e.preventDefault();
        window.$("#access-modal").modal("show")
    }
    handleRemoveClick(i) {
        var data = this.state.form_data['previewImages'].splice(i, 1);
        this.setState({ data });

        var data1 = this.state.form_data['Images'].splice(i, 1);
        this.setState({ data1 });
    }

    // form submit event
    handleSubmit(event) {

        event.preventDefault();
        if (!this.comment_validator.allValid()) {
            this.comment_validator.showMessages();
            this.forceUpdate();
        } else {
            this.setState({ loaded: false });
            api_option.url = 'save_comment_professional';
            api_option.data = this.state.comment_data;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        this.get_comment_count();
                        this.get_comment_professional();

                        this.state.comment_data.comment = '';
                        toast.success(res.data.message);

                    } else {

                        toast.error(res.data.message);

                        // this.setState({error:res_data.message});
                    }
                })
                .catch(error => console.log(error));
        }

    }

    handleFavourite(event, pid, sellerid) {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'add_to_favourite_project';
        api_option.data = { project_id: pid, user_id: user_id, sellerid: sellerid };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        axios(api_option)
            .then(res => {
                if (res.data.status) {

                    toast.success(res.data.message);
                    th.get_seller_project();
                    // th.setState({ redirect: '/productdetail/' + product_id });


                } else {
                    toast.error(res.data.message);
                    th.get_seller_project();

                    // this.setState({ redirect: '/logout' });

                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_comment_professional(props) {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const professional_id = this.props.match.params.seller_id;
        this.setState({ loaded: false });
        api_option.url = 'get_comment_professional';
        api_option.data = { professional_id: professional_id, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {

                    var comment_data = res.data.comment_list;
                    this.setState(this.state.comment_data.comment_data = comment_data);


                } else {

                    //this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });

    }
    async get_service_area() {

        const user_id = this.props.match.params.seller_id;
        // alert(user_id)
        api_option.url = 'get_seller_service_area';
        api_option.data = { user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {

                    var services_data = res.data.comment_list;
                    this.setState(this.state.form_data.service_area = services_data);



                } else {

                    //this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });

    }
    async get_professional_cat_service(props) {

        // console.log(user_data.u_id)
        var category_id = localStorage.getItem('category_id');
        var subcategory_id = localStorage.getItem('subcategory_id');

        api_option.url = 'get_professional_cat_service';
        api_option.data = { category_id: category_id, subcategory_id: subcategory_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {

                    var services_data = res.data.service_list;
                    this.setState(this.state.form_data.services = services_data);
                    //console.log(this.state.form_data.services)

                } else {

                    //this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });

    }

    async get_comment_count(props) {

        var user_data = getUserDetail();
        const professional_id = this.props.match.params.seller_id;
        api_option.url = 'get_comment_professional_count';
        api_option.data = { professional_id: professional_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var comment_count = res.data.comment_count;
                    this.setState(this.state.comment_data.comment_count = comment_count);
                } else {
                    var comment_count = res.data.comment_count;
                    this.setState(this.state.comment_data.comment_count = comment_count);
                    // this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });

    }
    async get_seller_product() {
        const seller_id = this.props.match.params.seller_id;
        api_option.url = 'get_seller_product';
        api_option.data = { user_id: seller_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var seller_product = res.data.data;
                    this.setState(this.initialState.form_data.seller_product = seller_product);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_seller_detail() {
        const seller_id = this.props.match.params.seller_id;

        api_option.url = 'get_seller_detail';
        api_option.data = { user_id: seller_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    var seller_detail = res.data.data;

                    this.setState(this.initialState.form_data.seller_detail = seller_detail);


                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_seller_project() {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var login_id = user_data ? user_data.u_id : '';
        const seller_id = this.props.match.params.seller_id;
        api_option.url = 'get_seller_project';
        api_option.data = { user_id: seller_id, login_id: login_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var seller_project = res.data.data;

                    this.setState(this.initialState.form_data.seller_project = seller_project);


                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_seller_knowhow() {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var login_id = user_data ? user_data.u_id : '';
        const seller_id = this.props.match.params.seller_id;
        api_option.url = 'get_professional_knowhow';
        api_option.data = { id: seller_id, login_id: login_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var seller_knowhow = res.data.data;
                    this.setState(this.initialState.form_data.seller_knowhow = seller_knowhow);


                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    //get edit form data
    async get_form_data(props) {
        const edit_id = this.props.match.params.id;
        if (edit_id) {
            api_option.url = 'get_seller_product_detail';
            api_option.data = { id: edit_id };
            api_option.headers.Authorization = sessionStorage.getItem('token');
            await axios(api_option)
                .then(res => {
                    if (res.data.status) {
                        this.setState(this.state.form_data = res.data.data);
                    } else {
                        this.setState({ redirect: '/ProductList/' });
                    }
                })
                .catch(error => {
                    this.setState({ redirect: '/logout' });
                });

        }
    }
    //handle Change File
    handleChangeFile(event) {

        if (event.target.files) {

            //     var data = this.state.form_data['package_detail'].push({ no_of_pkgs: "", type_of_packaging: "",amount:'' });
            // this.setState({ data });
            // let assets/images = [];
            // var reader = new FileReader();
            // reader.onload = function (e) {
            //     //$('#user_image').attr('src', e.target.result);
            //     assets/images.push(e.target.result)
            // }
            // reader.readAsDataURL(event.target.files[0]);
            // this.setState({
            //     previewImages: assets/images
            // });
            // let assets/images = [];
            var th = this;
            for (let i = 0; i < event.target.files.length; i++) {
                var reader = new FileReader();
                reader.onload = function (e) {

                    var data = th.state.form_data['previewImages'].push(e.target.result);
                    th.setState({ data });
                }
                reader.readAsDataURL(event.target.files[i]);

                var data1 = th.state.form_data['Images'].push(event.target.files[i]);
                th.setState({ data1 });
            }

            // var data = this.state.form_data['previewImages'].push(URL.createObjectURL(event.target.files[0]));
            // this.setState({ data });
        }


        // const file_name = event.target.name;
        // const file_value = event.target.files[0];
        // const data = this.state.form_data[file_name] = file_value;
        // this.setState({ data });
    }


    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.comment_data[name] = value;
        this.setState({ data });
    }




    category_list_dropdown() {

        api_option.url = 'category_list_dropdown';
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

    async handleChangeSubcategory(event) {
        const name = event.lable;
        const value = event.value;
        var data = this.state.form_data['subcat_id'] = { label: event.label, value: value };
        this.setState({ data });
    }

    handleReportChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
    }

    handleOpenReport(event) {
        window.$('#report').modal('show');
    }



    handleReportAbuse(user_id, seller_id, event) {
        alert(user_id)
        alert(seller_id)
        event.preventDefault();
        // if (!this.validator.allValid()) {
        //     this.validator.showMessages();
        //     this.forceUpdate();
        // } else {
        this.setState({ loaded: false });
        var message = $('#message').val();
        if (message == '') {
            toast.info('Please enter message');
            this.setState({ loaded: true });
            return false
        }
        api_option.url = 'save_report_abuse';
        api_option.data = { user_id: user_id, seller_id: seller_id, message: message };

        axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                const res_data = res.data;

                if (res_data.status) {
                    $('#message').val('');
                    window.$('#report').modal('hide');
                    toast.success(res.data.message);


                } else {
                    $('#message').val('');
                    window.$('#report').modal('hide');
                    toast.error(res.data.message);

                    // this.setState({error:res_data.message});
                }
            })
            .catch(error => console.log(error));
        // }
    }


    async handleChangeCategory(event) {


        const name = event.lable;
        const value = event.value;
        var data = this.state.form_data['category_id'] = { label: event.label, value: value };
        this.setState({ data });
        var data = this.state.form_data['subcat_id'] = null;
        this.setState({ data });
        this.setState({ subcategory_list: {} });
        if (value != "") {
            api_option.url = 'subcategory_list_dropdown';
            ;
            api_option.data = { category_id: value };
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        var fnldata = [];
                        $.each(res.data.subcategory_list, function (i, item) {
                            fnldata.push({ 'value': res.data.subcategory_list[i].id, "label": res.data.subcategory_list[i].text });
                        });
                        this.setState({ subcategory_list_new: fnldata });
                        this.setState({ subcat_list: fnldata });
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


    // form submit event
    handleSaveData(event) {
        event.preventDefault();
        if (!this.validator.allValid()) {
            this.validator.showMessages();
            this.forceUpdate();
        } else {
            api_option.url = 'add_seller_product';
            api_option.data = this.state.form_data;

            // api_option.url = 'add_seller_product';
            // const formData = new FormData();
            // formData.append('category_id', this.state.form_data.category_id);
            // formData.append('u_id', this.state.form_data.u_id);
            // formData.append('subcat_id', this.state.form_data.subcat_id);
            // formData.append('productTitle', this.state.form_data.productTitle);
            // formData.append('regularPrice', this.state.form_data.regularPrice);
            // formData.append('salePrice', this.state.form_data.salePrice);
            // formData.append('sku', this.state.form_data.sku);
            // formData.append('stockStatus', this.state.form_data.stockStatus);
            // formData.append('stockQuantity', this.state.form_data.stockQuantity);
            // formData.append('weight', this.state.form_data.weight);
            // formData.append('shippingClass', this.state.form_data.shippingClass);
            // formData.append('purchaseNote', this.state.form_data.purchaseNote);
            // formData.append('Images', this.state.form_data.Images);
            axios(api_option)
                .then(res => {
                    const res_data = res.data;
                    if (res_data.status) {
                        this.setState({ redirect: '/ProductList' });
                        toast.success(res.data.message);

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

                </Helmet>
                <div class="page-breadcrumb">
                    <div class="container">
                        <ul>
                            <li><i class="bi-house"></i></li>
                            <li>Seller</li>
                            <li>{this.initialState.form_data.seller_detail.u_name}</li>
                        </ul>
                    </div>
                </div>


                <div class="professional-single">
                    <div class="container">
                        <div class="professional-profile">
                            <div class="profile-sidebar">
                                <div class="profile-sidebar-inner">
                                    <div class="profile-sidebar-avatar"><img src={this.initialState.form_data.seller_detail.u_image} /></div>
                                    <h1>{this.initialState.form_data.seller_detail.u_name}</h1>
                                    <div class="profile-userdetails">
                                        <span><i class="bi bi-geo-alt-fill"></i>{this.initialState.form_data.seller_detail.u_city},{this.initialState.form_data.seller_detail.u_country}</span>
                                    </div>
                                    <div class="userInfo-column">

                                        {/* <dl>
                                            <dt>Service Areas:</dt>
                                            <span className='d-flex'>
                                                {Object.entries(this.state.form_data.service_area).map(([o, serv]) => (

                                                    <dd className='pr-1'>{serv.a_title}</dd>

                                                ))}
                                            </span>
                                        </dl> */}
                                        {/* <dl>
                                            <dt>Specialties:</dt>
                                            <dd>Interior Design</dd>
                                        </dl> */}
                                    </div>
                                </div>
                            </div>
                            <div class="profile-profileContents">
                                <div class="line-tab">
                                    <ul class="nav nav-tabs left-align">
                                        {this.initialState.form_data.seller_product.length > 0 && <li class="nav-item">
                                            <a class="active show" data-toggle="tab" href="#products">Products</a>
                                        </li>}
                                        {this.initialState.form_data.seller_project.length > 0 && <li class="nav-item">
                                            <a class="" data-toggle="tab" href="#Projects">Projects</a>
                                        </li>}
                                        {/* <li class="nav-item">
                                            <a class="" data-toggle="tab" href="#knowhow">Know How</a>
                                        </li> */}
                                        <li class="nav-item">
                                            <a class="" data-toggle="tab" href="#About">About</a>
                                        </li>
                                    </ul>
                                </div>
                                <div class="tab-content">
                                    <div class="tab-pane active" id="products">
                                        <div class="products-grid">
                                            {Object.entries(this.initialState.form_data.seller_product).map(([o, p]) => (

                                                <div class="product-item">
                                                    <div class="product-thumb">
                                                        <Link to={`/productdetail/${p.tp_id}`}>
                                                            <img src={p.image} />
                                                        </Link>
                                                    </div>
                                                    <div class="product-info">
                                                        <h4 class="product-name"> <Link to={`/productdetail/${p.tp_id}`}>{p.tp_title}</Link></h4>
                                                        <div class="just-in">
                                                            <div class="product-price">${p.tp_price}</div>
                                                            <div class="rating-wapper">
                                                                <span class="star-rating"><span class="stars four"></span></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            ))}
                                        </div>

                                    </div>
                                    <div class="tab-pane fade" id="Projects">
                                        <div class="profile-project-grid">
                                            {Object.entries(this.initialState.form_data.seller_project).map(([o, p]) => (
                                                <div class="projectList-items">
                                                    <a href=""></a>

                                                    <div class="thumbtag"><span class="new">New</span></div>
                                                    <div class="thumbsave">
                                                        {/* {localStorage.getItem('type') == 1 && is_login() && <button class="save-trigger" onClick={this.handleFavourite}><i class="bi-heart-fill"></i> </button>} */}
                                                        {(localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && is_login() && p.favourites == 0 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.tpro_id, p.tpro_seller_id)}><i class="bi-heart"></i></button>}
                                                        {(localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && is_login() && p.favourites == 1 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.tpro_id, p.tpro_seller_id)}><i class="bi-heart-fill"></i></button>}

                                                        {!is_login() && <button class="save-trigger" onClick={this.openLoginModal}><i class="bi-heart"></i></button>
                                                        }

                                                    </div>
                                                    <div class="projectList-cover"><img src={p.tpro_image} /></div>
                                                    <div class="projectList-title"><h2>{p.tpro_name}</h2></div>
                                                    <div class="projectList-ft">
                                                        <div class="projectList-author"><img src={this.initialState.form_data.seller_detail.u_image} />{this.initialState.form_data.seller_detail.u_name}</div>

                                                    </div>
                                                </div>
                                            ))}


                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="knowhow">
                                        <div class="knowhow-grid">
                                            {Object.entries(this.initialState.form_data.seller_knowhow).map(([o, k]) => (
                                                <div class="projectList-items">
                                                    <a href=""></a>

                                                    <div class="thumbtag"><span class="new">New</span></div>
                                                    <div class="thumbsave">
                                                        {/* {localStorage.getItem('type') == 1 && is_login() && <button class="save-trigger" onClick={this.handleFavourite}><i class="bi-heart-fill"></i> </button>} */}
                                                        {(localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && is_login() && k.favourites == 0 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, k.tpro_id, k.tpro_seller_id)}><i class="bi-heart"></i></button>}
                                                        {(localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && is_login() && k.favourites == 1 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, k.tpro_id, k.tpro_seller_id)}><i class="bi-heart-fill"></i></button>}

                                                        {!is_login() && <button class="save-trigger" onClick={this.openLoginModal}><i class="bi-heart"></i></button>
                                                        }

                                                    </div>
                                                    <div class="projectList-cover"><img src={k.know_how_image} /></div>
                                                    <div class="projectList-title"><h2>{k.know_how_title}</h2></div>
                                                    <div class="projectList-ft">
                                                        <div class="projectList-author"><img src={this.initialState.form_data.seller_detail.u_image} />{this.initialState.form_data.seller_detail.u_name}</div>

                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="About">

                                        <div class="project-tags">
                                            <p>{this.state.form_data.seller_detail.u_about_us}</p>
                                            <div class="profile-contact w-100">

                                                {this.state.form_data.seller_detail.u_business_mobile && < a href="tel:">
                                                    <i class="bi bi-telephone-outbound"></i>
                                                    <div>
                                                        <span>Call</span>
                                                        <strong>{this.state.form_data.seller_detail.u_business_mobile}</strong>
                                                    </div>
                                                </a>}
                                                {this.state.form_data.seller_detail.u_email && < a href="mailto:" target="_blank">
                                                    <i class="bi bi-envelope"></i>
                                                    <div>
                                                        <span>Email</span>
                                                        <strong>{this.state.form_data.seller_detail.u_email}</strong>
                                                    </div>
                                                </a>}
                                                {this.state.form_data.seller_detail.u_website && <a href={this.state.form_data.seller_detail.u_website} target="_blank">
                                                    <i class="bi bi-globe2"></i>
                                                    <div>
                                                        <span>Website</span>
                                                        <strong>{this.state.form_data.seller_detail.u_website}</strong>
                                                    </div>
                                                </a>}

                                            </div>

                                            {/* <div class="about-content">
                                                <div class="mt-3 mb-3"><h5><b>Services</b></h5></div>
                                                {Object.entries(this.state.form_data.services).map(([o, serv]) => (

                                                    <a href="javascript:void(0)" className={(localStorage.getItem('subcategory_id') == serv.sc_id ? 'active' : '')} >{serv.sc_title}</a>

                                                ))}
                                            </div> */}

                                            <div class="about-content">
                                                <div class="mt-3 mb-3"><h5><b>Services</b></h5></div>
                                                {Object.entries(this.state.form_data.service_area).map(([o, serv]) => (

                                                    <a href="javascript:void(0)">{serv.a_title}</a>

                                                ))}
                                            </div>

                                        </div>
                                        {localStorage.getItem('type') == 1 && is_login() && <div class="about-content">

                                            <div class="mt-3 mb-3"><h5><b>Report Abuse</b></h5></div>
                                            <div class="project-tags">
                                                <ul class="social">

                                                    <li>
                                                        <button type="button" onClick={this.handleOpenReport.bind()} class="btn btn-primary">Report</button>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>}
                                        <div class="profile-reviews-area">
                                            <div class="commentbox">
                                                <h5 class="md-title"><span class="text-primary">{this.state.comment_data.comment_count}</span> Reviews</h5>
                                                <form class="post-comment" onSubmit={this.handleSubmit}>
                                                    <div class="comment-user-thumb"><img src="/assets/images/avatar-1.jpg" /></div>
                                                    <div class="comment-input">
                                                        <input type="text" name="comment" value={this.state.comment_data.comment} onChange={this.handleChange} placeholder="Write here..." />
                                                        <input type="hidden" name="professional_id" value={this.state.comment_data.professional_comment_id} />
                                                        <input type="hidden" name="user_id" value={this.state.comment_data.user_comment_id} />
                                                        {this.comment_validator.message('Comment', this.state.comment_data.comment, 'required')}
                                                        {localStorage.getItem('type') == 1 && is_login() && <button class="plain text-primary">Post</button> || <p style={{ color: 'red' }}>Only login user can post the comment</p>}

                                                    </div>

                                                </form>
                                                <ul class="comment-feed-list">

                                                    {Object.entries(this.state.comment_data.comment_data).map(([o, comment]) => (

                                                        <li class="comment-feed-item">
                                                            <article>
                                                                <p class="comment-feed-content">
                                                                    <a href=""><img src={comment.u_image} />{comment.u_name}</a>
                                                                    <span>{comment.tcp_comment}</span>
                                                                </p>
                                                                <time>{comment.tcp_created_at}</time>
                                                            </article>
                                                        </li>
                                                    ))}

                                                </ul>
                                            </div>
                                        </div>
                                        {/* <div class="profile-reviews-area">
                                            <div class="commentbox">
                                                <h5 class="md-title"><span class="text-primary">54</span> Reviews</h5>
                                                <form class="post-comment">
                                                    <div class="comment-user-thumb"><img src="/assets/images/avatar-1.jpg" /></div>
                                                    <div class="comment-input">
                                                        <input type="text" name="" placeholder="Write here..." />
                                                        <button class="plain text-primary">Post</button>
                                                        <div class="rating-form">
                                                            <b>Rate Seller:</b>
                                                            <div class="form-item">
                                                                <input id="rating-5" name="rating" type="radio" value="5" />
                                                                <label for="rating-5" data-value="5">
                                                                    <span class="rating-star">
                                                                        <i class="bi bi-star"></i>
                                                                        <i class="bi bi-star-fill"></i>
                                                                    </span>
                                                                    <span class="ir">5</span>
                                                                </label>
                                                                <input id="rating-4" name="rating" type="radio" value="4" />
                                                                <label for="rating-4" data-value="4">
                                                                    <span class="rating-star">
                                                                        <i class="bi bi-star"></i>
                                                                        <i class="bi bi-star-fill"></i>
                                                                    </span>
                                                                    <span class="ir">4</span>
                                                                </label>
                                                                <input id="rating-3" name="rating" type="radio" value="3" />
                                                                <label for="rating-3" data-value="3">
                                                                    <span class="rating-star">
                                                                        <i class="bi bi-star"></i>
                                                                        <i class="bi bi-star-fill"></i>
                                                                    </span>
                                                                    <span class="ir">3</span>
                                                                </label>
                                                                <input id="rating-2" name="rating" type="radio" value="2" />
                                                                <label for="rating-2" data-value="2">
                                                                    <span class="rating-star">
                                                                        <i class="bi bi-star"></i>
                                                                        <i class="bi bi-star-fill"></i>
                                                                    </span>
                                                                    <span class="ir">2</span>
                                                                </label>
                                                                <input id="rating-1" name="rating" type="radio" value="1" />
                                                                <label for="rating-1" data-value="1">
                                                                    <span class="rating-star">
                                                                        <i class="bi bi-star"></i>
                                                                        <i class="bi bi-star-fill"></i>
                                                                    </span>
                                                                    <span class="ir">1</span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                                <ul class="comment-feed-list">
                                                    <li class="comment-feed-item">
                                                        <article>
                                                            <div class="rating-wapper">
                                                                <span class="star-rating"><span class="stars four"></span></span>
                                                            </div>
                                                            <p class="comment-feed-content">
                                                                <a href=""><img src="/assets/images/avatar-2.jpg" />Lisa Snavely</a>
                                                                <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</span>
                                                            </p>
                                                            <div class="comment-feed-ft">
                                                                <time>12 hours ago</time>
                                                            </div>
                                                        </article>
                                                    </li>
                                                    <li class="comment-feed-item">
                                                        <article>
                                                            <div class="rating-wapper">
                                                                <span class="star-rating"><span class="stars five"></span></span>
                                                            </div>
                                                            <p class="comment-feed-content">
                                                                <a href=""><img src="/assets/images/avatar-4.jpg" />Mark Burks</a>
                                                                <span>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span>
                                                            </p>
                                                            <div class="comment-feed-ft">
                                                                <time>12 hours ago</time>
                                                            </div>
                                                        </article>
                                                    </li>
                                                    <li class="comment-feed-item">
                                                        <article>
                                                            <div class="rating-wapper">
                                                                <span class="star-rating"><span class="stars two"></span></span>
                                                            </div>
                                                            <p class="comment-feed-content">
                                                                <a href=""><img src="/assets/images/avatar-5.jpg" />Ramiro Lovett</a>
                                                                <span>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                                                            </p>
                                                            <div class="comment-feed-ft">
                                                                <time>12 hours ago</time>
                                                            </div>
                                                        </article>
                                                    </li>
                                                    <li class="comment-feed-item">
                                                        <article>
                                                            <div class="rating-wapper">
                                                                <span class="star-rating"><span class="stars one"></span></span>
                                                            </div>
                                                            <p class="comment-feed-content">
                                                                <a href=""><img src="/assets/images/avatar-6.jpg" />Jill Carrington</a>
                                                                <span>Sed ut perspiciatis unde omnis iste natus error sit voluptatem</span>
                                                            </p>
                                                            <div class="comment-feed-ft">
                                                                <time>12 hours ago</time>
                                                            </div>
                                                        </article>
                                                    </li>
                                                    <li class="comment-feed-item">
                                                        <article>
                                                            <div class="rating-wapper">
                                                                <span class="star-rating"><span class="stars three"></span></span>
                                                            </div>
                                                            <p class="comment-feed-content">
                                                                <a href=""><img src="/assets/images/avatar-7.jpg" />Marcella Woods</a>
                                                                <span>accusantium doloremque laudantium</span>
                                                            </p>
                                                            <div class="comment-feed-ft">
                                                                <time>12 hours ago</time>
                                                            </div>
                                                        </article>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >

                <form class="post-comment" >
                    <div class="modal fade" id="report" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h6 class="modal-title" id="exampleModalLabel">Report</h6>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body p-4">

                                    <div class="form-group">
                                        <label>Message</label>
                                        <textarea class="text-control" name="message" id="message" value={this.state.form_data.message} onChange={this.handleReportChange}></textarea>
                                        {this.validator.message('Message', this.state.form_data.message, 'required')}
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>

                                    <button type="button" onClick={this.handleReportAbuse.bind(this, this.state.form_data.u_id, this.props.match.params.seller_id)} class="btn btn-primary">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

            </>
        );
    }
}
export default SellerDetail;