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
import { appendScript } from '../utils/appendScript'
import Loader from "react-loader";
class ProfessionalCategory extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        this.validator = new SimpleReactValidator();

        var user_id = user_data ? user_data.u_id : '';

        this.get_banner_list();
        this.initialState = {
            form_data: {
                banner_data: '',
                service_category: '',
            },
            u_id: user_id,
            loaded: false,

            error: ''
        }

        this.state = this.initialState;

        // this.handleDelete = this.handleDelete.bind(this);
        // this.handleQuantity = this.handleQuantity.bind(this);


        this.get_professional_category();
    }



    componentDidMount() {


        // appendScript("/assets/js/jquery-3.2.1.min.js" + "?ts=" + new Date().getTime());
        // appendScript("https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" + "?ts=" + new Date().getTime());
        // appendScript("https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" + "?ts=" + new Date().getTime());
        // appendScript("https://unpkg.com/swiper/swiper-bundle.min.js" + "?ts=" + new Date().getTime());

        // appendScript("/assets/js/custom.js" + "?ts=" + new Date().getTime());
        // appendScript("/assets/js/professional_cat.js" + "?ts=" + new Date().getTime());

    }

    async get_banner_list() {
        api_option.url = 'get_front_banner_list';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        api_option.data = { type: "find-experts" };
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




    async get_professional_category() {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        this.setState({ loaded: false });
        api_option.url = 'get_professional_service_category';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {
                    var seller_project = res.data.data;
                    this.setState(this.initialState.form_data.service_category = seller_project);
                    // console.log(this.initialState.form_data.service_category)
                    appendScript("/assets/js/professional_cat.js" + "?ts=" + new Date().getTime());
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }


    handleCatServe(subcatid, catid, event) {
        localStorage.setItem('category_id', catid);
        localStorage.setItem('subcategory_id', subcatid);
        // this.props.history.push('/professional-listing / ' + subcatid);
        this.setState({ redirect: '/professional-listing/' + subcatid });
        // localStorage.removeItem('usr_id');
    }




    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>
                <Helmet>
                    <link rel="icon" href="/assets/assets/images/icon.png" type="image/gif" />
                    {/*
                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" />
                    <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" /> */}
                    <link rel="stylesheet" href="/assets/css/custom.css" />
                    <link rel="stylesheet" href="/assets/css/mobile.css" />

                    <script src="/assets/js/slider.js"></script>
                    <script src="/assets/js/custom.js"></script>

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

                <div class="livingexperience-page">
                    <div class="le-banner">
                        <div class="swiper-container1">
                            <div class="swiper-wrapper">

                                {Object.entries(this.initialState.form_data.banner_data).map(([i, v]) => (
                                    <>
                                        <div class="swiper-slide">
                                            {/* <div class="le-cover" style={{ backgroundImage: `url(${v.b_image})` }} ></div> */}
                                            <div class="le-cover" style={{ backgroundImage: `url(${v.b_image})` }} ></div>
                                            <div class="container heroSearch-container">
                                                <div class="row d-flex justify-content-center">
                                                    <div class="col-md-8">
                                                        <h2>{v.b_title}</h2>
                                                        <p>{v.b_short_description}</p>
                                                        {v.b_button_text != "" && v.b_link != "" && <a href={v.b_link} target="_blank">{v.b_button_text}</a>}
                                                    </div>
                                                </div>
                                                {/* <div class="le-banner-content"> */}
                                                {/* <div class="projectList-title"><h2>{v.b_title}</h2></div>
                                                    <p>{v.b_short_description}</p> */}
                                                {/* <div class="projectList-ft">
                                                        <div class="projectList-author">BM Architects</div>
                                                        <span class="projectViews">246 Views</span>
                                                    </div> */}
                                                {/* </div> */}
                                            </div>
                                        </div>
                                    </>
                                ))}
                            </div>
                            <div class="swiper-pagination"></div>
                        </div>
                    </div>
                </div>


                <div class="professional-page">



                    {/* <div class="hero-search">

                        <div class="heroSearch-container" style={{ "background": "url(assets/images/background-2.jpg)" }}  >
                            <div class="container">
                                <div class="row d-flex justify-content-center">
                                    <div class="col-md-8">
                                        <h2>Find Excellent Professionals</h2>
                                        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="heroSearch-input"> */}
                    {/* <div class="heroSearch-inner">
                                <i class="bi bi-search"></i>
                                <input type="text" name="" placeholder="Search..." />
                                <div class="search-filterDropdowns">
                                    <div class="dropdown">
                                        <button class="dropdown-toggle plain" type="button" data-toggle="dropdown">All Type</button>
                                        <div class="dropdown-menu">
                                            <a class="dropdown-item" href="">Type A</a>
                                            <a class="dropdown-item" href="">Type B</a>
                                            <a class="dropdown-item" href="">Type C</a>
                                            <a class="dropdown-item" href="">Type D</a>
                                            <a class="dropdown-item" href="">Type E</a>
                                            <a class="dropdown-item" href="">Type F</a>
                                        </div>
                                    </div>
                                    <div class="dropdown">
                                        <button class="dropdown-toggle plain" type="button" data-toggle="dropdown">Location</button>
                                        <div class="dropdown-menu">
                                            <a class="dropdown-item" href="">Location A</a>
                                            <a class="dropdown-item" href="">Location B</a>
                                            <a class="dropdown-item" href="">Location C</a>
                                            <a class="dropdown-item" href="">Location D</a>
                                            <a class="dropdown-item" href="">Location E</a>
                                            <a class="dropdown-item" href="">Location F</a>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                    {/* </div>
                    </div> */}

                    <div class="professionalcategories-wrapper">
                        {Object.entries(this.initialState.form_data.service_category).map(([i, sc]) => (

                            <div class="profCategory-row">
                                <div class="container-right row">
                                    <div class="col-md-2">
                                        <div class="profCategory-content">
                                            <h2>{sc.pc_title}</h2>
                                        </div>
                                    </div>
                                    <div className='col-md-10'>
                                        <div class="">
                                            <div class="swiper-container">
                                                <div class="swiper-wrapper">
                                                    {Object.entries(this.initialState.form_data.service_category[i].subcategory_data).map(([j, ssc]) => (
                                                        <div class="swiper-slide">
                                                            <a href="javascript:void(0)">
                                                                <div class="profCategory-card" onClick={this.handleCatServe.bind(this, ssc.sc_id, ssc.sc_cat_id)}>
                                                                    <figure ><img src={ssc.sc_image} /></figure>
                                                                    <span>{ssc.sc_title}</span>

                                                                </div>
                                                            </a>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div class="swiper-pagination"></div>
                                                <div class="swiper-button-next"></div>
                                                <div class="swiper-button-prev"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </div>
                </div >




            </>
        );
    }
}
export default ProfessionalCategory;