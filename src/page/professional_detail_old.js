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
import Loader from "react-loader";
import { Helmet } from "react-helmet";

class ProfessionalDetail extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        this.validator = new SimpleReactValidator();
        this.comment_validator = new SimpleReactValidator();

        var user_id = user_data ? user_data.u_id : '';

        const professional_id = this.props.match.params.professional_id;

        var cat_id = localStorage.getItem('category_id')
        var subcat_id = localStorage.getItem('subcategory_id')

        this.initialState = {
            form_data: {
                listing: '',
                services: '',
                title: '',
                location: '',
                message: '',
                descr: '',
                category: cat_id,
                subcategory: subcat_id,
                u_id: user_id,
                professional_id: professional_id,
                services_price: '',
            },
            comment_data: {
                comment: '',
                comment_count: '',
                user_comment_id: user_id,
                professional_comment_id: professional_id,
                comment_data: [],
            },
            u_id: user_id,
            is_exist_service: 0,
            loaded: false,

            professional_knowhow_data: '',
            professional_project_data: '',
            professional_detail_data: '',
            professional_social_media: '',
            error: '',
            gtotal: '',
            is_data: '',
            cart_array: []
        }

        this.state = this.initialState;
        this.get_professional_detail();
        this.get_professional_project();
        this.get_professional_knowhow();
        this.get_comment_professional();
        this.get_professional_cat_service();
        this.get_comment_count();
        this.get_service_price();

        this.get_service_is_exist_cart(localStorage.getItem('subcategory_id'));


        // this.handleDelete = this.handleDelete.bind(this);
        // this.handleQuantity = this.handleQuantity.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleBookChange = this.handleBookChange.bind(this);
        this.handleBookNow = this.handleBookNow.bind(this);
        this.handleReportChange = this.handleReportChange.bind(this);

    }



    componentDidMount() {

    }
    handleServData(subcat_id, event) {

        localStorage.setItem('subcategory_id', subcat_id);
        this.get_service_is_exist_cart(subcat_id);
        this.get_professional_cat_service();
    }

    handleOpenBook(event) {
        window.$('#booking').modal('show');
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.comment_data[name] = value;
        this.setState({ data });
    }
    handleBookChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
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



    handleReportAbuse(user_id, professional_id, event) {

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
        api_option.data = { user_id: user_id, professional_id: professional_id, message: message };

        axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                const res_data = res.data;
                console.log(res_data)

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


    async get_comment_professional(props) {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const professional_id = this.props.match.params.professional_id;
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


    async get_service_price(props) {

        api_option.url = 'get_service_price';

        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {

                    var services_data = res.data.service_list;
                    this.setState(this.state.form_data.services_price = services_data);
                    // console.log(this.state.form_data.services_price.sp_price)

                } else {
                }
            })
            .catch(error => {
            });

    }
    async get_service_is_exist_cart(subcat) {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const professional_id = this.props.match.params.professional_id;
        api_option.url = 'get_service_is_exist_cart';
        api_option.data = { user_id: user_id, sub_cat: subcat };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {

                if (res.data.status) {

                    var is_exist_service = res.data.is_exist_service;
                    this.setState({ is_exist_service: res.data.is_exist_service });




                } else {

                    var is_exist_service = res.data.is_exist_service;
                    this.setState({ is_exist_service: res.data.is_exist_service });

                    //  this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
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

                    var service_data = res.data.service_list;
                    var cart_array = [];
                    for (var i = 0; i < cart_data.length; i++) {
                        cart_array.push({
                            image: cart_data[i]['image'],
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
                    }
                    for (var i = 0; i < service_data.length; i++) {
                        cart_array.push({
                            image: service_data[i]['sc_image'],
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
                    }
                    this.setState(this.state.cart_array = cart_array);
                    // this.setState(this.state.form_data = res.data.cart_list);
                    // this.setState(this.state.service_data = res.data.service_list);
                    this.setState({ gtotal: res.data.grand_total });
                    this.setState({ is_data: true });
                } else {
                    this.setState({ is_data: false });
                    // this.setState({ redirect: '/ProductList/' });
                }
            })
            .catch(error => {
                //  this.setState({ redirect: '/logout' });
            });


    }



    async get_comment_count(props) {

        var user_data = getUserDetail();
        const professional_id = this.props.match.params.professional_id;
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
    // Book Now
    handleBookNow(event) {
        event.preventDefault();
        // if (!this.validator.allValid()) {
        //     this.validator.showMessages();
        //     this.forceUpdate();
        // } else {
        this.setState({ loaded: false });
        api_option.url = 'save_booking';
        api_option.data = this.state.form_data;

        axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                const res_data = res.data;

                if (res_data.status) {
                    this.get_cart_data();
                    this.get_service_is_exist_cart();
                    this.state.comment_data.comment = '';
                    window.$('#booking').modal('hide');
                    toast.success(res.data.message);


                } else {

                    toast.error(res.data.message);

                    // this.setState({error:res_data.message});
                }
            })
            .catch(error => console.log(error));
        // }

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
    async get_professional_detail() {
        this.setState({ loaded: false });
        api_option.url = 'get_professional_detail';
        api_option.data = { id: this.props.match.params.professional_id };
        api_option.headers.Authorization = localStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                const th = this;
                if (res.data.status) {
                    const th = this;

                    var res_data = res.data.data;
                    this.setState(this.state.professional_detail_data = res.data.data);

                    this.setState(this.state.professional_social_media = res.data.data.user_social_media);

                } else {
                    //this.setState({ redirect: '/user/' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_professional_project() {

        api_option.url = 'get_professional_personal_project';
        api_option.data = { id: this.props.match.params.professional_id };
        api_option.headers.Authorization = localStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                const th = this;
                if (res.data.status) {
                    const th = this;
                    var res_data = res.data.data;
                    this.setState(this.state.professional_project_data = res.data.data);
                    console.log(this.state.professional_project_data);
                } else {
                    //this.setState({ redirect: '/user/' });
                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
            });
    }

    async get_professional_knowhow() {

        api_option.url = 'get_professional_knowhow';
        api_option.data = { id: this.props.match.params.professional_id };
        api_option.headers.Authorization = localStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                const th = this;
                if (res.data.status) {
                    const th = this;
                    var res_data = res.data.data;
                    this.setState(this.state.professional_knowhow_data = res.data.data);
                    // console.log(this.state.professional_knowhow_data)

                } else {
                    //this.setState({ redirect: '/user/' });
                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
            });
    }



    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>
                <Helmet>
                    <link rel="icon" href="/assets/assets/images/icon.png" type="image/gif" />

                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" />
                    <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
                    <link rel="stylesheet" href="/assets/css/custom.css" />
                    <link rel="stylesheet" href="/assets/css/mobile.css" />
                    <script src="/assets/js/jquery-3.2.1.min.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
                    <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>

                    <script src="/assets/js/professional_detai.js"></script>
                    <script src="/assets/js/custom.js"></script>
                    <script type="text/javascript"></script>
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
                <div class="page-breadcrumb">
                    <div class="container">
                        <ul>
                            <li><a href=""><i class="bi-house"></i></a></li>
                            <li>Professionals</li>
                            <li>{this.state.professional_detail_data.u_name}</li>
                        </ul>
                    </div>
                </div>


                <div class="professional-single">
                    <div class="container">
                        <div class="professional-profile">
                            <div class="profile-sidebar">
                                <div class="profile-sidebar-inner">
                                    <div class="profile-sidebar-avatar"><img src={this.state.professional_detail_data.u_image} /></div>
                                    <h1>{this.state.professional_detail_data.u_name}</h1>
                                    <div class="profile-userdetails">
                                        <span class="text-primary"><b>{this.state.professional_detail_data.u_business_name}</b></span>
                                        <span><i class="bi bi-geo-alt-fill"></i>{this.state.professional_detail_data.u_city}, {this.state.professional_detail_data.u_state}, {this.state.professional_detail_data.u_country}</span>
                                    </div>
                                    {this.state.is_exist_service == 1 && <div class="profile-userInteractions">
                                        {localStorage.getItem('type') == 1 && is_login() && <p class="btn btn-primary btn-block ">Added to Basket</p>}
                                        {localStorage.getItem('type') != 1 && <p className="text-center">Only users can book this service</p>}

                                    </div> || <div class="profile-userInteractions">
                                            {localStorage.getItem('type') == 1 && is_login() && <button class="btn btn-primary btn-block booking-trigger" onClick={this.handleOpenBook.bind(this)}>Book Now</button>}
                                            {localStorage.getItem('type') != 1 && <p className="text-center">Only users can book this service</p>}

                                        </div>}
                                    <div class="userInfo-column">
                                        <dl>
                                            <dt>Service Areas:</dt>
                                            <dd>{this.state.professional_detail_data.u_country}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                            <div class="profile-profileContents">
                                <div class="line-tab">
                                    <ul class="nav nav-tabs left-align">
                                        <li class="nav-item">
                                            <a class="active show" data-toggle="tab" href="#About">About</a>
                                        </li>
                                        {this.state.professional_project_data.length > 0 && <li class="nav-item">
                                            <a class="" data-toggle="tab" href="#Projects">Projects</a>
                                        </li>}
                                        {this.state.professional_knowhow_data.length > 0 && <li class="nav-item">
                                            <a class="" data-toggle="tab" href="#knowhow">Know How</a>
                                        </li>}
                                    </ul>
                                </div>
                                <div class="tab-content">
                                    <div class="tab-pane active" id="About">
                                        <p>{this.state.professional_detail_data.u_about_us}</p>
                                        <div class="profile-contact">

                                            {this.state.professional_detail_data.u_mobile && <a href="tel:">
                                                <i class="bi bi-telephone-outbound"></i>
                                                <div>
                                                    <span>Call</span>
                                                    <strong>{this.state.professional_detail_data.u_mobile}</strong>
                                                </div>
                                            </a>}
                                            {this.state.professional_detail_data.u_email && <a href="mailto:" target="_blank">
                                                <i class="bi bi-envelope"></i>
                                                <div>
                                                    <span>Email</span>
                                                    <strong>{this.state.professional_detail_data.u_email}</strong>
                                                </div>
                                            </a>
                                            }
                                            {this.state.professional_detail_data.u_website && <a href={this.state.professional_detail_data.u_website} target="_blank">
                                                <i class="bi bi-globe2"></i>
                                                <div>
                                                    <span>Website</span>
                                                    <strong>{this.state.professional_detail_data.u_website}</strong>
                                                </div>
                                            </a>}

                                        </div>
                                        <div class="about-content">
                                            {/* <p>Ward Almuna Alkhonji Interior Design is a comprehensive, one-stop-shop where clients can tailor their own expectations and needs. Established in the summer of 2016, our Studio facilitates making your vision come to life; we provide guidance and support, we listen intently to your stories and put ourselves in your shoes. Engineer Ward Almuna is a pioneer in the field of interior design and pays particular attention to your requirements and needs regardless of the size of the project.</p> */}
                                            <div class="mt-3 mb-3"><h5><b>Services</b></h5></div>
                                            <div class="project-tags">

                                                {Object.entries(this.state.form_data.services).map(([o, serv]) => (

                                                    <a href="javascript:void(0)" className={(localStorage.getItem('subcategory_id') == serv.sc_id ? 'active' : '')} onClick={this.handleServData.bind(this, serv.sc_id)}>{serv.sc_title}</a>

                                                ))}
                                                {/* <a>Interior Design</a>
                                                <a>Furniture</a>
                                                <a>Renovation</a> */}
                                            </div>
                                        </div>

                                        <div class="about-content">

                                            <div class="mt-3 mb-3"><h5><b>Social Media</b></h5></div>
                                            <div class="project-tags">
                                                <ul class="social">
                                                    {Object.entries(this.state.professional_social_media).map(([o, sm]) => (

                                                        <li><a href={sm.us_link} target="_blank">
                                                            {sm.us_platform == 'facebook' && <img src="/assets/images/facebook.svg" />}
                                                            {sm.us_platform == 'twitter' && <img src="/assets/images/twitter.svg" />}
                                                            {sm.us_platform == 'instagram' && <img src="/assets/images/instagram.svg" />}
                                                            {sm.us_platform == 'youtube' && <img src="/assets/images/youtube.svg" />}
                                                            {sm.us_platform == 'linkedin' && <img src="/assets/images/linkedin.svg" />}
                                                        </a>
                                                        </li>
                                                    ))}
                                                </ul>
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
                                            {/* <div class="commentbox">
                                                <h5 class="md-title"><span class="text-primary">54</span> Reviews</h5>
                                                <form class="post-comment">
                                                    <div class="comment-user-thumb"><img src="/assets/images/avatar-1.jpg" /></div>
                                                    <div class="comment-input">
                                                        <input type="text" name="" placeholder="Write here..." />
                                                        <button class="plain text-primary">Post</button>
                                                        <div class="rating-form">
                                                            <b>Rate Professional: </b>
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
                                            </div> */}

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
                                                        {/* <div class="rating-form">
                                                            <b>Rate Professional: </b>
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
                                                        </div> */}
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
                                    </div>
                                    <div class="tab-pane fade" id="Projects">
                                        <div class="profile-project-grid">



                                            {Object.entries(this.state.professional_project_data).map(([o, p]) => (
                                                <div class="projectList-items">
                                                    <a href="javascript:void(0)"></a>
                                                    {/* <div class="thumbtag"><span class="new">New</span></div> */}

                                                    <div class="projectList-cover"><img src={p.tpro_image} /></div>
                                                    <div class="projectList-title"><h2>{p.tpro_name}</h2></div>
                                                    {/* <div class="projectList-ft">
                                                        <div class="projectList-author">{this.state.professional_detail_data.u_name}</div>

                                                    </div> */}
                                                    <div class="projectList-ft">
                                                        <div class="projectList-author"><img src={this.state.professional_detail_data.u_image} />{this.state.professional_detail_data.u_name}</div>

                                                    </div>
                                                </div>
                                            ))}


                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="knowhow">
                                        <div class="knowhow-grid">
                                            {Object.entries(this.state.professional_knowhow_data).map(([o, p]) => (
                                                <div class="projectList-items">
                                                    <a href="javascript:void(0)"></a>
                                                    {/* <div class="thumbtag"><span class="new">New</span></div> */}

                                                    <div class="projectList-cover"><img src={p.know_how_image} /></div>
                                                    <div class="projectList-title"><h2>{p.know_how_name}</h2></div>
                                                    {/* <div class="projectList-ft">
                                                        <div class="projectList-author">{this.state.professional_detail_data.u_name}</div>

                                                    </div> */}
                                                    <div class="projectList-ft">
                                                        <div class="projectList-author"><img src={this.state.professional_detail_data.u_image} />{this.state.professional_detail_data.u_name}</div>

                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <form class="post-comment" onSubmit={this.handleBookNow}>
                    <div class="modal fade" id="booking" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h6 class="modal-title" id="exampleModalLabel">Booking</h6>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body p-4">
                                    <div class="form-group d-inline">
                                        <label class="d-inline mr-3 font-weight-bold">Service Price</label>
                                        ${this.state.form_data.services_price.sp_price}
                                    </div>
                                    <div class="form-group">
                                        <label>Title</label>
                                        <input type="text" name="title" id="title" value={this.state.form_data.title} onChange={this.handleBookChange} class="text-control" />
                                        {this.validator.message('Title', this.state.form_data.title, 'required')}
                                    </div>
                                    <div class="form-group">
                                        <label>Location</label>
                                        <input type="text" name="location" id="location" value={this.state.form_data.location} onChange={this.handleBookChange} class="text-control" />
                                        {this.validator.message('Location', this.state.form_data.location, 'required')}
                                    </div>
                                    <div class="form-group">
                                        <label>Description</label>
                                        <textarea class="text-control" name="descr" id="descr" value={this.state.form_data.descr} onChange={this.handleBookChange}></textarea>
                                        {this.validator.message('Description', this.state.form_data.descr, 'required')}
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                                    <input type="hidden" name="price" value={this.state.form_data.services_price.sp_price} />
                                    <input type="hidden" name="category" value={localStorage.getItem('category_id')} />
                                    <input type="hidden" name="subcategory" value={localStorage.getItem('subcategory_id')} />
                                    <button type="submit" class="btn btn-primary">Book Now</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

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

                                    <button type="button" onClick={this.handleReportAbuse.bind(this, this.state.form_data.u_id, this.props.match.params.professional_id)} class="btn btn-primary">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>


            </>
        );
    }
}
export default ProfessionalDetail;