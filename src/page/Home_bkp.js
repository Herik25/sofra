import React, { Component } from 'react';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery';
import { Helmet } from "react-helmet";
import Loader from "react-loader";
import { appendScript } from '../utils/appendScript'
import InstagramEmbed from 'react-instagram-embed';
//import { googleTranslate } from "./utils/googleTranslate";
class Home extends Component {
    constructor(props) {
        super(props);
        //console.log(this.props)
        // const device_type = this.props.match.params.device_type;
        // if (this.props.match.params.device_type) {
        //     localStorage.setItem('device_type', device_type);
        // } else {

        //     localStorage.setItem('device_type', 'web');
        // }




        this.get_latest_product();
        this.get_form_data();
        this.get_cms_data();

        this.get_project();
        this.get_featured_product_data();
        this.get_bestseller_product_data();
        this.get_homepage_data();
        //this.get_category();
        this.get_home_category();
        this.get_home_banner();
        this.get_client_logo();
        this.get_instagram_data();



        this.initialState = {
            form_data: {
                banner_data: '',
                latest_product_data: '',
                bestseller_product_data: '',
                featured_product_data: '',
                category_data: '',
                front_banner_data: '',
                clientlogo_data: '',
                instagram_data: '',
                project_data: '',
                home_data: '',
            },
            error: '',
            loaded: true
        }
    }


    componentDidMount() {
        appendScript("/assets/js/jquery-3.2.1.min.js" + "?ts=" + new Date().getTime());
        appendScript("https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" + "?ts=" + new Date().getTime());
        appendScript("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" + "?ts=" + new Date().getTime());
        appendScript("https://unpkg.com/swiper/swiper-bundle.min.js" + "?ts=" + new Date().getTime());
        appendScript("/assets/js/dropdown_toggle.js" + "?ts=" + new Date().getTime());
        appendScript("/assets/js/developer_signup_popup.js" + "?ts=" + new Date().getTime());
        appendScript("/assets/js/home_init.js" + "?ts=" + new Date().getTime());
        appendScript("/assets/js/custom.js" + "?ts=" + new Date().getTime());
        // $('script').each(function () {
        //     if (this.src === 'http://192.168.100.210:3000/assets/js/jquery-3.2.1.min.js') {
        //         $(this).remove();
        //     }
        //     // if (this.src === 'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js') {
        //     //     $(this).remove();
        //     // }
        //     if (this.src === 'http://192.168.100.210:3000/assets/js/bootstrap.min.js') {
        //         $(this).remove();
        //     }
        // });
        // var referenceNode = document.querySelector('#root');

        // const script2 = document.createElement("script");

        // script2.src = "/assets/js/bootstrap.min.js";


        // //document.body.appendChild(script2);
        // referenceNode.after(script2);



        // const script = document.createElement("script");

        // script.src = "/assets/js/jquery-3.2.1.min.js";


        // referenceNode.after(script);
        // //document.body.appendChild(script);



    }
    openLoginModal(e) {

        e.preventDefault();
        window.$("#access-modal").modal("show")
    }
    handleFavourite(event, pid, sellerid) {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'add_to_favourite';
        api_option.data = { product_id: pid, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        axios(api_option)
            .then(res => {
                if (res.data.status) {

                    toast.success(res.data.message);
                    th.get_latest_product();
                    th.get_bestseller_product_data();
                    th.featured_product_data();
                    // th.setState({ redirect: '/productdetail/' + product_id });


                } else {
                    toast.error(res.data.message);
                    th.get_latest_product();
                    th.get_bestseller_product_data();
                    th.featured_product_data();

                    // this.setState({ redirect: '/logout' });

                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }



    async get_project() {
        this.setState({ loaded: false });
        api_option.url = 'get_project';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {
                    var project_data = res.data.data;
                    this.setState(this.initialState.form_data.project_data = project_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_latest_product() {

        var user_data = getUserDetail();
        var login_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_latest_product';
        api_option.data = { login_id: login_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var latest_product_data = res.data.data;
                    this.setState(this.initialState.form_data.latest_product_data = latest_product_data);
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_bestseller_product_data() {
        api_option.url = 'get_bestseller_product_data';

        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var bestseller_product_data = res.data.data;
                    this.setState(this.initialState.form_data.bestseller_product_data = bestseller_product_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    // async get_category() {
    //     api_option.url = 'get_category';
    //     api_option.headers.Authorization = sessionStorage.getItem('token');
    //     const th = this;
    //     await axios(api_option)
    //         .then(res => {
    //             if (res.data.status) {
    //                 var category_data = res.data.data;
    //                 this.setState(this.initialState.form_data.category_data = category_data);

    //             } else {
    //                 this.setState({ redirect: '/logout' });
    //             }
    //         })
    //         .catch(error => {
    //             this.setState({ redirect: '/logout' });
    //         });
    // }
    async get_home_category() {
        api_option.url = 'get_home_category';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var category_data = res.data.data;
                    this.setState(this.initialState.form_data.category_data = category_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    /* async get_instagram_feed() {
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "https://i.instagram.com/api/v1/api/v1/feed/timeline",
            "method": "GET",
            "headers": {},
            "data": ""
          }

          $.ajax(settings).done(function (response) {
            console.log(response);
          });

        api_option.url = 'get_instagram_data';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                console.log(res)
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    } */
    async get_homepage_data() {

        api_option.url = 'get_front_homepage_list';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {

                if (res.data.status) {
                    var category_data = res.data.data;

                    this.setState(this.initialState.form_data.home_data = category_data[0]);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_featured_product_data() {
        api_option.url = 'get_featured_product_data';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var featured_product_data = res.data.data;

                    this.setState(this.initialState.form_data.featured_product_data = featured_product_data);


                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_form_data() {
        api_option.url = 'get_front_banner_list';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    var banner_data = res.data.data;
                    this.setState(this.initialState.form_data.banner_data = banner_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }


    async get_home_banner() {
        api_option.url = 'get_front_bannerads_list';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var banner_data = res.data.data;

                    this.setState(this.initialState.form_data.front_banner_data = banner_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }


    async get_client_logo() {
        api_option.url = 'get_front_clientlogo_list';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var banner_data = res.data.data;
                    this.setState(this.initialState.form_data.clientlogo_data = banner_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    async get_instagram_data() {

        api_option.url = 'get_front_instagram_list';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var banner_data = res.data.data;
                    this.setState(this.initialState.form_data.instagram_data = banner_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }





    async get_cms_data() {
        api_option.url = 'get_front_cms_list';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    var cms_data = res.data.data;
                    this.setState(this.initialState.form_data.cms_data = cms_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }


    //view load home page
    render() {
        return (
            <>
                <Helmet>
                    {/* <script src="/assets/js/dropdown_toggle.js"></script>
                    <script src="/assets/js/developer_signup_popup.js?12"></script> */}
                    {/* <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
                    <script src="/assets/js/home_init.js"></script>
                    <link rel="stylesheet" href="/assets/css/rtl.css" /> */}
                </Helmet>
                <div className="App">
                    <InstagramEmbed
                        url='https://instagr.am/p/Zw9o4/'
                        maxWidth={500}
                        hideCaption={true}
                        containerTagName='div'
                        protocol=''
                        injectScript
                        onLoading={() => { }}
                        onSuccess={() => { }}
                        onAfterRender={() => { }}
                        onFailure={() => { }}
                    />
                </div>
                <Loader
                    loaded={this.initialState.loaded}
                    lines={15}
                    length={20}
                    width={10}
                    radius={30}
                    corners={1}
                    rotate={0}
                    direction={1}
                    color="#000"
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
                <div className="hero-slider">
                    <div className="container">
                        <div className="slider-area">
                            <div id="hero-carousel" className="carousel slide carousel-fade" data-ride="carousel">
                                <ul className="carousel-indicators">
                                    {Object.entries(this.initialState.form_data.banner_data).map(([i, v]) => (
                                        <>
                                            <li data-target="#hero-carousel" data-slide-to={i} className="active"></li>
                                        </>
                                    ))}
                                    {/* <li data-target="#hero-carousel" data-slide-to="1"></li>
                                    <li data-target="#hero-carousel" data-slide-to="2"></li> */}
                                </ul>
                                <div className="carousel-inner">
                                    {Object.entries(this.initialState.form_data.banner_data).map(([i, v]) => (

                                        <div className={"carousel-item " + (i <= 0 ? 'active' : '')}>

                                            <div className="slider-part">
                                                <div className="slide-content">
                                                    <h5>{v.b_company_title}</h5>
                                                    <h2>{v.b_title}</h2>
                                                    <p>{v.b_short_description}.</p>
                                                    {/* <NavLink className="btn btn-primary" exact to={v.b_link}>{v.b_button_text}</NavLink> */}
                                                    <a href={v.b_link} target="_blank" className="btn btn-primary">{v.b_button_text}</a>
                                                    {/* <a href="javascript:void(0)" className="btn btn-primary">{v.b_button_text}</a> */}
                                                </div>

                                                <div className="slide-image">
                                                    {/* <NavLink className="footer-link" exact to={v.b_link} target="_blank"> */}
                                                    <div className="lg-container">

                                                        <img src={v.b_image} className="lg-image hero-banner" />


                                                    </div>
                                                    {/* </NavLink> */}

                                                </div>

                                            </div>


                                        </div>
                                    ))}


                                    {/* <div className="carousel-item active">
                                        <div className="slider-part">
                                            <div className="slide-content">
                                                <h5>KH Elite Architectural</h5>
                                                <h2>Explore Todays project Story</h2>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                                <a href="javascript:void(0)" className="btn btn-primary">Explore Projects</a>
                                            </div>
                                            <div className="slide-image">
                                                <div className="lg-container">
                                                    <img src="/assets/images/herobanner-1.jpg" className="lg-image hero-banner" />
                                                    <div style={{ "top": "66%", "left": "24%" }} className="lg-hotspot lg-hotspot--top-left">
                                                        <div className="lg-hotspot__button"></div>
                                                        <div className="lg-hotspot__label">
                                                            <div className="hotspot-product">
                                                                <img src="/assets/images/product-1.jpg" />
                                                                <div>
                                                                    <a href="javascript:void(0)" className="hs-p-name">Office Desk Sofa</a>
                                                                    <span className="hs-p-price">$100</span>
                                                                    <a href="javascript:void(0)" className="hs-p-link">View Product</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ "top": "73%", "left": "50%;" }} className="lg-hotspot lg-hotspot--top-left">
                                                        <div className="lg-hotspot__button"></div>
                                                        <div className="lg-hotspot__label">
                                                            <div className="hotspot-product">
                                                                <img src="/assets/images/product-2.jpg" />
                                                                <div>
                                                                    <a href="javascript:void(0)" className="hs-p-name">Office Desk Sofa</a>
                                                                    <span className="hs-p-price">$100</span>
                                                                    <a href="javascript:void(0)" className="hs-p-link">View Product</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ "top": "36%", "left": "84%" }} className="lg-hotspot lg-hotspot--top-right">
                                                        <div className="lg-hotspot__button"></div>
                                                        <div className="lg-hotspot__label">
                                                            <div className="hotspot-product">
                                                                <img src="/assets/images/product-3.jpg" />
                                                                <div>
                                                                    <a href="javascript:void(0)" className="hs-p-name">Office Desk Sofa</a>
                                                                    <span className="hs-p-price">$100</span>
                                                                    <a href="javascript:void(0)" className="hs-p-link">View Product</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div style={{ "top": "86%", "left": "86%" }} className="lg-hotspot lg-hotspot--bottom-right">
                                                        <div className="lg-hotspot__button"></div>
                                                        <div className="lg-hotspot__label">
                                                            <div className="hotspot-product">
                                                                <img src="/assets/images/product-4.jpg" />
                                                                <div>
                                                                    <a href="javascript:void(0)" className="hs-p-name">Office Desk Sofa</a>
                                                                    <span className="hs-p-price">$100</span>
                                                                    <a href="javascript:void(0)" className="hs-p-link">View Product</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="carousel-item">
                                        <div className="slider-part">
                                            <div className="slide-content">
                                                <h5>KH Elite Architectural</h5>
                                                <h2>Explore Todays project Story</h2>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                                <a href="javascript:void(0)" className="btn btn-primary">Explore Projects</a>
                                            </div>
                                            <div className="slide-image"><img src="/assets/images/herobanner-2.jpg" className="hero-banner" /></div>
                                        </div>
                                    </div>
                                    <div className="carousel-item">
                                        <div className="slider-part">
                                            <div className="slide-content">
                                                <h5>KH Elite Architectural</h5>
                                                <h2>Explore Todays project Story</h2>
                                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                                                <a href="javascript:void(0)" className="btn btn-primary">Explore Projects</a>
                                            </div>
                                            <div className="slide-image"><img src="/assets/images/herobanner-3.jpg" className="hero-banner" /></div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* <div className="featured-wrapper">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 col-lg-4">
                            <div className="furgan-iconbox style-01">
                                <div className="iconbox-inner">
                                    <div className="icon">
                                        <i className="bi bi-truck"></i>
                                    </div>
                                    <div className="content">
                                        <h4>Fast Shipping.</h4>
                                        <div className="desc">With sites in 5 languages, we ship to over 200 countries</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-4">
                            <div className="furgan-iconbox style-01">
                                <div className="iconbox-inner">
                                    <div className="icon">
                                        <i className="bi bi-shield-check"></i>
                                    </div>
                                    <div className="content">
                                        <h4>Safe delivery</h4>
                                        <div className="desc">Pay with the world’s most popular, secure payment methods.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-12 col-lg-4">
                            <div className="furgan-iconbox style-01">
                                <div className="iconbox-inner">
                                    <div className="icon">
                                        <i className="bi bi-arrow-repeat"></i>
                                    </div>
                                    <div className="content">
                                        <h4>365 Days Return</h4>
                                        <div className="desc">Round-the-clock assistance for a shopping experience.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}

                <div className="categories-wrapper">
                    <div className="container">
                        <div className="row d-flex">
                            <div className="col-md-12">
                                <div className="categories-grid">
                                    {Object.entries(this.initialState.form_data.category_data).map(([i, v]) => (
                                        <a href={v.hc_link} target="_blank">
                                            <div className="cat-square">
                                                <div className="cat-iconimage"><img src={v.hc_image} /></div>
                                                <span>{v.hc_title}</span>
                                            </div>
                                        </a>
                                    ))}
                                    {/* <a href="javascript:void(0)">
                                        <div className="cat-square">
                                            <div className="cat-iconimage"><img src="/assets/images/categories/category-1.svg" /></div>
                                            <span>Rooms</span>
                                        </div>
                                    </a>
                                    <a href="javascript:void(0)">
                                        <div className="cat-square">
                                            <div className="cat-iconimage"><img src="/assets/images/categories/category-2.svg" /></div>
                                            <span>Projects</span>
                                        </div>
                                    </a>
                                    <a href="javascript:void(0)">
                                        <div className="cat-square">
                                            <div className="cat-iconimage"><img src="/assets/images/categories/category-3.svg" /></div>
                                            <span>Products</span>
                                        </div>
                                    </a>
                                    <a href="javascript:void(0)">
                                        <div className="cat-square">
                                            <div className="cat-iconimage"><img src="/assets/images/categories/category-4.svg" /></div>
                                            <span>Know How</span>
                                        </div>
                                    </a>
                                    <a href="javascript:void(0)">
                                        <div className="cat-square">
                                            <div className="cat-iconimage"><img src="/assets/images/categories/category-5.svg" /></div>
                                            <span>Living Experience</span>
                                        </div>
                                    </a>
                                    <a href="javascript:void(0)">
                                        <div className="cat-square">
                                            <div className="cat-iconimage"><img src="/assets/images/categories/category-6.svg" /></div>
                                            <span>Find Professionals</span>
                                        </div>
                                    </a> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="clients-wrapper">

                    <div className="container">
                        <div className="row d-flex justify-content-between align-items-center">
                            <div className="col-md-6">
                                <div className="ad-wrapper">
                                    <div className="swiper-container ad-slider">
                                        <div className="swiper-wrapper">
                                            {Object.entries(this.initialState.form_data.front_banner_data).map(([i, ba]) => (
                                                <div className="swiper-slide"><img src={ba.ba_image} /></div>
                                            ))}
                                            {/* <div className="swiper-slide"><img src="/assets/images/addBanner-2.jpg" /></div>
                                            <div className="swiper-slide"><img src="/assets/images/addBanner-3.jpg" /></div>
                                            <div className="swiper-slide"><img src="/assets/images/addBanner-4.jpg" /></div>
                                            <div className="swiper-slide"><img src="/assets/images/addBanner-5.jpg" /></div> */}
                                        </div>
                                        <div className="swiper-pagination"></div>
                                        <div className="sNav-center">
                                            <div className="swiper-button-prev outline"></div>
                                            <div className="swiper-button-next outline"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="client-grid">
                                    {Object.entries(this.initialState.form_data.clientlogo_data).map(([i, cl]) => (
                                        <div><a href={cl.cl_link} target="_blank"><img src={cl.cl_image} /></a></div>
                                    ))}

                                    {/* <div><img src="/assets/images/brand-1.png" /></div>
                                    <div><img src="/assets/images/brand-2.png" /></div>
                                    <div><img src="/assets/images/brand-3.png" /></div>
                                    <div><img src="/assets/images/brand-4.png" /></div>
                                    <div><img src="/assets/images/brand-5.png" /></div>
                                    <div><img src="/assets/images/brand-6.png" /></div>
                                    <div><img src="/assets/images/brand-7.png" /></div>
                                    <div><img src="/assets/images/brand-1.png" /></div>
                                    <div><img src="/assets/images/brand-2.png" /></div>
                                    <div><img src="/assets/images/brand-3.png" /></div>
                                    <div><img src="/assets/images/brand-4.png" /></div>
                                    <div><img src="/assets/images/brand-5.png" /></div>
                                    <div><img src="/assets/images/brand-6.png" /></div>
                                    <div><img src="/assets/images/brand-7.png" /></div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="projects-wrapper">
                    <div className="container">
                        <div className="title-section text-center">
                            <h5 className="sub">More ideas and inspiration</h5>
                            <h2 className="title">Explore Amazing Projects</h2>
                        </div>
                    </div>
                    <div className="container">
                        <div className="projects-grid">

                            {Object.entries(this.initialState.form_data.project_data).map(([o, pr]) => (
                                <Link to={`/projectdetail/${pr.tpro_id}`}>
                                    <figure><img src={pr.tpro_image} /></figure>
                                    <div className="projects-grid-details">
                                        <h6>{pr.tpro_name}</h6>
                                        <h4>{pr.tpro_category}</h4>
                                        <span>View More</span>
                                    </div>
                                </Link>
                            ))}
                            {/* <a href="javascript:void(0)">
                                <figure><img src="/assets/images/projects-2.jpg" /></figure>
                                <div className="projects-grid-details">
                                    <h6>Styled Habitat</h6>
                                    <h4>Decorate your home with furns.</h4>
                                    <span>View More</span>
                                </div>
                            </a>
                            <a href="javascript:void(0)">
                                <figure><img src="/assets/images/projects-3.jpg" /></figure>
                                <div className="projects-grid-details">
                                    <h6>Blush International</h6>
                                    <h4>Decorate your home with furns.</h4>
                                    <span>View More</span>
                                </div>
                            </a>
                            <a href="javascript:void(0)">
                                <figure><img src="/assets/images/projects-4.jpg" /></figure>
                                <div className="projects-grid-details">
                                    <h6>Widad Aboujeb</h6>
                                    <h4>Decorate your home with furns.</h4>
                                    <span>View More</span>
                                </div>
                            </a>
                            <a href="javascript:void(0)">
                                <figure><img src="/assets/images/projects-5.jpg" /></figure>
                                <div className="projects-grid-details">
                                    <h6>K Design Oman</h6>
                                    <h4>Decorate your home with furns.</h4>
                                    <span>View More</span>
                                </div>
                            </a>
                            <a href="javascript:void(0)">
                                <figure><img src="/assets/images/projects-6.jpg" /></figure>
                                <div className="projects-grid-details">
                                    <h6>K Design Oman</h6>
                                    <h4>Decorate your home with furns.</h4>
                                    <span>View More</span>
                                </div>
                            </a> */}
                        </div>
                    </div>
                </div>


                <div className="products-wrapper">
                    <div className="container">
                        <div className="title-section text-center">
                            <h5 className="sub">More ideas and inspiration</h5>
                            <h2 className="title">Explore Products</h2>
                        </div>
                    </div>
                    <div className="container">

                        <div className="line-tab">
                            <ul className="nav nav-tabs">
                                <li className="nav-item">
                                    <a className="active" data-toggle="tab" href="#latest">New Products</a>
                                </li>
                                <li className="nav-item">
                                    <a className="" data-toggle="tab" href="#bestseller">Sellers</a>
                                </li>
                                <li className="nav-item">
                                    <a className="" data-toggle="tab" href="#featured">Featured Products</a>
                                </li>
                            </ul>
                        </div>
                        <div className="tab-content">

                            <div className="tab-pane active" id="latest">
                                <div className="products-grid">
                                    {Object.entries(this.initialState.form_data.latest_product_data).map(([o, p]) => (

                                        <div className="product-item">

                                            <div className="product-thumb">
                                                <div class="thumbsave">
                                                    {localStorage.getItem('type') == 1 && is_login() && p.favourites == 0 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.tp_id)}><i class="bi-heart"></i></button>}
                                                    {localStorage.getItem('type') == 1 && is_login() && p.favourites == 1 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.tp_id)}><i class="bi-heart-fill"></i></button>}
                                                    {!is_login() && <button class="save-trigger" onClick={this.openLoginModal}><i class="bi bi-heart"></i> </button>
                                                    }
                                                </div>
                                                <Link to={`/productdetail/${p.tp_id}`}>
                                                    <img src={p.image} />
                                                </Link>
                                            </div>

                                            <div className="product-info">


                                                <h4 className="product-name"><Link to={`/productdetail/${p.tp_id}`}>{p.tp_title}</Link></h4>
                                                <div className="just-in">
                                                    {p.tp_sale_price != 0 && <div className="product-price">${p.tp_sale_price}</div> || <div className="product-price">${p.tp_price}</div>}
                                                    {/* <div className="rating-wapper">
                                                        <span className="star-rating"><span className="stars four"></span></span>
                                                    </div> */}
                                                    <div className="rating-wapper">
                                                        {p.tp_star == 0 && <span className="star-rating"><span className="stars"></span></span>}
                                                        {p.tp_star == 1 && <span className="star-rating"><span className="stars one"></span></span>}
                                                        {p.tp_star == 2 && <span className="star-rating"><span className="stars two" ></span></span>}
                                                        {p.tp_star == 3 && <span className="star-rating"><span className="stars three" ></span></span>}
                                                        {p.tp_star == 4 && <span className="star-rating"><span className="stars four" ></span></span>}
                                                        {p.tp_star == 5 && <span className="star-rating"><span className="stars five" ></span></span>}


                                                    </div>
                                                </div>
                                                <div className="product-brand"><Link to={`/Seller-detail/${p.u_id}`}>{p.u_name}</Link></div>
                                            </div>

                                        </div>
                                    ))}
                                    {/* <div className="product-item">
                                    <div className="product-thumb">
                                        <a href="javascript:void(0)">
                                            <img src="/assets/images/product-2.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><a href="javascript:void(0)">Ergonomic Desk Sofa</a></h4>
                                        <div className="just-in">
                                            <div className="product-price">$100.00</div>
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars five"></span></span>
                                            </div>
                                        </div>
                                        <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                    </div>
                                </div>
                                <div className="product-item">
                                    <div className="product-thumb">
                                        <a href="javascript:void(0)">
                                            <img src="/assets/images/product-3.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><a href="javascript:void(0)">Swivel Sofa</a></h4>
                                        <div className="just-in">
                                            <div className="product-price">$100.00</div>
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars three"></span></span>
                                            </div>
                                        </div>
                                        <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                    </div>
                                </div>
                                <div className="product-item">
                                    <div className="product-thumb">
                                        <a href="javascript:void(0)">
                                            <img src="/assets/images/product-4.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><a href="javascript:void(0)">Wood Patio Chair</a></h4>
                                        <div className="just-in">
                                            <div className="product-price">$100.00</div>
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars two"></span></span>
                                            </div>
                                        </div>
                                        <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                    </div>
                                </div>
                                <div className="product-item">
                                    <div className="product-thumb">
                                        <a href="javascript:void(0)">
                                            <img src="/assets/images/product-5.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><a href="javascript:void(0)">Brown Vinyl Padded</a></h4>
                                        <div className="just-in">
                                            <div className="product-price">$100.00</div>
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars one"></span></span>
                                            </div>
                                        </div>
                                        <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                    </div>
                                </div>
                                <div className="product-item">
                                    <div className="product-thumb">
                                        <a href="javascript:void(0)">
                                            <img src="/assets/images/product-6.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><a href="javascript:void(0)">Antique Walnut</a></h4>
                                        <div className="just-in">
                                            <div className="product-price">$100.00</div>
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars four"></span></span>
                                            </div>
                                        </div>
                                        <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                    </div>
                                </div>
                                <div className="product-item">
                                    <div className="product-thumb">
                                        <a href="javascript:void(0)">
                                            <img src="/assets/images/product-7.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><a href="javascript:void(0)">Office Desk Sofa</a></h4>
                                        <div className="just-in">
                                            <div className="product-price">$100.00</div>
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars four"></span></span>
                                            </div>
                                        </div>
                                        <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                    </div>
                                </div>
                                <div className="product-item">
                                    <div className="product-thumb">
                                        <a href="javascript:void(0)">
                                            <img src="/assets/images/product-8.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><a href="javascript:void(0)">Ergonomic Desk Sofa</a></h4>
                                        <div className="just-in">
                                            <div className="product-price">$100.00</div>
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars five"></span></span>
                                            </div>
                                        </div>
                                        <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                    </div>
                                </div>
                                <div className="product-item">
                                    <div className="product-thumb">
                                        <a href="javascript:void(0)">
                                            <img src="/assets/images/product-9.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><a href="javascript:void(0)">Swivel Sofa</a></h4>
                                        <div className="just-in">
                                            <div className="product-price">$100.00</div>
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars three"></span></span>
                                            </div>
                                        </div>
                                        <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                    </div>
                                </div>
                                <div className="product-item">
                                    <div className="product-thumb">
                                        <a href="javascript:void(0)">
                                            <img src="/assets/images/product-10.jpg" />
                                        </a>
                                    </div>
                                    <div className="product-info">
                                        <h4 className="product-name"><a href="javascript:void(0)">Wood Patio Chair</a></h4>
                                        <div className="just-in">
                                            <div className="product-price">$100.00</div>
                                            <div className="rating-wapper">
                                                <span className="star-rating"><span className="stars two"></span></span>
                                            </div>
                                        </div>
                                        <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                    </div>
                                </div> */}
                                </div>
                            </div>


                            <div className="tab-pane fade" id="bestseller">
                                <div className="products-grid">
                                    {Object.entries(this.initialState.form_data.bestseller_product_data).map(([o, bp]) => (
                                        <div className="product-item">

                                            <div className="product-thumb">
                                                <div class="thumbsave">
                                                    {localStorage.getItem('type') == 1 && is_login() && bp.favourites == 0 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, bp.tp_id)}><i class="bi-heart"></i></button>}
                                                    {localStorage.getItem('type') == 1 && is_login() && bp.favourites == 1 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, bp.tp_id)}><i class="bi-heart-fill"></i></button>}
                                                    {!is_login() && <button class="save-trigger" onClick={this.openLoginModal}><i class="bi bi-heart"></i> </button>
                                                    }
                                                </div>
                                                <Link to={`/productdetail/${bp.tp_id}`}>
                                                    <img src={bp.image} />
                                                </Link>
                                            </div>

                                            <div className="product-info">


                                                <h4 className="product-name"><Link to={`/productdetail/${bp.tp_id}`}>{bp.tp_title}</Link></h4>
                                                <div className="just-in">
                                                    {bp.tp_sale_price != 0 && <div className="product-price">${bp.tp_sale_price}</div> || <div className="product-price">${bp.tp_price}</div>}
                                                    <div className="rating-wapper">
                                                        {bp.tp_star == 0 && <span className="star-rating"><span className="stars"></span></span>}
                                                        {bp.tp_star == 1 && <span className="star-rating"><span className="stars one"></span></span>}
                                                        {bp.tp_star == 2 && <span className="star-rating"><span className="stars two" ></span></span>}
                                                        {bp.tp_star == 3 && <span className="star-rating"><span className="stars three" ></span></span>}
                                                        {bp.tp_star == 4 && <span className="star-rating"><span className="stars four" ></span></span>}
                                                        {bp.tp_star == 5 && <span className="star-rating"><span className="stars five" ></span></span>}
                                                    </div>
                                                </div>
                                                <div className="product-brand"><Link to={`/Seller-detail/${bp.u_id}`}>{bp.u_name}</Link></div>
                                            </div>

                                        </div>
                                    ))}
                                    {/* <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-9.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Swivel Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars three"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-10.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Wood Patio Chair</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars two"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-1.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Office Desk Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars four"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-2.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Ergonomic Desk Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars five"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-3.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Swivel Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars three"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-4.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Wood Patio Chair</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars two"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-5.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Brown Vinyl Padded</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars one"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-6.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Antique Walnut</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars four"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-7.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Office Desk Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars four"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            <div className="tab-pane fade" id="featured">
                                <div className="products-grid">
                                    {Object.entries(this.initialState.form_data.featured_product_data).map(([o, fp]) => (
                                        <div className="product-item">

                                            <div className="product-thumb">
                                                <div class="thumbsave">
                                                    {localStorage.getItem('type') == 1 && is_login() && fp.favourites == 0 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, fp.tp_id)}><i class="bi-heart"></i></button>}
                                                    {localStorage.getItem('type') == 1 && is_login() && fp.favourites == 1 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, fp.tp_id)}><i class="bi-heart-fill"></i></button>}
                                                    {!is_login() && <button class="save-trigger" onClick={this.openLoginModal}><i class="bi bi-heart"></i> </button>
                                                    }
                                                </div>
                                                <Link to={`/productdetail/${fp.tp_id}`}>
                                                    <img src={fp.image} />
                                                </Link>
                                            </div>

                                            <div className="product-info">
                                                <h4 className="product-name"><Link to={`/productdetail/${fp.tp_id}`}>{fp.tp_title}</Link></h4>
                                                <div className="just-in">
                                                    {fp.tp_sale_price != 0 && <div className="product-price">${fp.tp_sale_price}</div> || <div className="product-price">${fp.tp_price}</div>}
                                                    <div className="rating-wapper">
                                                        {fp.tp_star == 0 && <span className="star-rating"><span className="stars"></span></span>}
                                                        {fp.tp_star == 1 && <span className="star-rating"><span className="stars one"></span></span>}
                                                        {fp.tp_star == 2 && <span className="star-rating"><span className="stars two" ></span></span>}
                                                        {fp.tp_star == 3 && <span className="star-rating"><span className="stars three" ></span></span>}
                                                        {fp.tp_star == 4 && <span className="star-rating"><span className="stars four" ></span></span>}
                                                        {fp.tp_star == 5 && <span className="star-rating"><span className="stars five" ></span></span>}
                                                    </div>
                                                </div>
                                                <div className="product-brand"><Link to={`/Seller-detail/${fp.u_id}`}>{fp.u_name}</Link></div>
                                            </div>

                                        </div>
                                    ))}
                                    {/* <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-7.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Office Desk Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars four"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-8.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Ergonomic Desk Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars five"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-9.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Swivel Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars three"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-10.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Wood Patio Chair</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars two"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-1.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Office Desk Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars four"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-2.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Ergonomic Desk Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars five"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-3.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Swivel Sofa</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars three"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-4.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Wood Patio Chair</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars two"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div className="product-item">
                                        <div className="product-thumb">
                                            <a href="javascript:void(0)">
                                                <img src="/assets/images/product-5.jpg" />
                                            </a>
                                        </div>
                                        <div className="product-info">
                                            <h4 className="product-name"><a href="javascript:void(0)">Brown Vinyl Padded</a></h4>
                                            <div className="just-in">
                                                <div className="product-price">$100.00</div>
                                                <div className="rating-wapper">
                                                    <span className="star-rating"><span className="stars one"></span></span>
                                                </div>
                                            </div>
                                            <div className="product-brand"><a href="javascript:void(0)">Styled Habitat</a></div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="quicklink-wrapper">
                    <div className="container">
                        <div className="referance-section">
                            <div className="ref-banners">
                                <a href="javascript:void(0)">
                                    <div className="quicklink-wrap">
                                        <div className="liExp-banner">
                                            <div><img src={this.initialState.form_data.home_data.hp_living_image} /></div>
                                        </div>
                                        <div className="quicklink-content">
                                            <h6>Living Experience</h6>
                                            <h2></h2>
                                            <NavLink exact to={'/living-experience-list/'}><span>Explore More <i className="bi bi-arrow-right"></i></span></NavLink>
                                        </div>
                                    </div>
                                </a>
                                <a href="javascript:void(0)">
                                    <div className="quicklink-wrap">
                                        <div className="knwHw-banner">
                                            <img src={this.initialState.form_data.home_data.hp_know_how_image} />
                                        </div>
                                        <div className="quicklink-content">
                                            <h6>Know How</h6>
                                            <h2></h2>
                                            <NavLink exact to={'/knowhow/'}><span>Explore More <i className="bi bi-arrow-right"></i></span></NavLink>
                                        </div>
                                    </div>
                                </a>
                            </div>
                            <div className="ref-content">
                                <h2>{this.initialState.form_data.home_data.hp_home_title}</h2>
                                <p>{this.initialState.form_data.home_data.hp_description}</p>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="insta-wrapper">
                    <div className="container">
                        <div className="title-section text-center mb-5">
                            <h2 className="title">Follow us on Instagram</h2>
                        </div>

                        <div className="instagrid">
                            {Object.entries(this.initialState.form_data.instagram_data).map(([i, cl]) => (
                                <div><a href={cl.insta_link} target="_blank"><img src={cl.insta_image} /></a></div>
                            ))}


                        </div>
                    </div>
                </div>


                <div className="bg-wrapper">
                    <div className="bg-parelex" style={{ "background": "url(assets/images/parallax_land1.jpg)" }}></div>
                    <div className="banner-wrapper-infor">
                        <h2>{this.initialState.form_data.home_data.hp_title}</h2>
                        <p>{this.initialState.form_data.home_data.hp_short_description}</p>
                        <a href="javascript:void(0)" className="btn btn-white">Explore More</a>
                    </div>
                </div>


            </>
        );
    }
}


export default Home;
