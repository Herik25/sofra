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

class ProfessionalCategory extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        this.validator = new SimpleReactValidator();

        var user_id = user_data ? user_data.u_id : '';


        this.initialState = {
            form_data: {
                service_category: '',
            },
            u_id: user_id,


            error: ''
        }

        this.state = this.initialState;

        // this.handleDelete = this.handleDelete.bind(this);
        // this.handleQuantity = this.handleQuantity.bind(this);


        this.get_professional_category();
    }



    componentDidMount() {

    }


    async get_professional_category() {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)

        api_option.url = 'get_professional_service_category';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var seller_project = res.data.data;
                    this.setState(this.initialState.form_data.service_category = seller_project);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }




    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>
                <Helmet>
                    <link rel="icon" href="/assets/images/icon.png" type="image/gif" />

                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" />
                    <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
                    <link rel="stylesheet" href="/assets/css/custom.css" />
                    <link rel="stylesheet" href="/assets/css/mobile.css" />
                    <script src="/assets/js/jquery-3.2.1.min.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
                    <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>

                    <script src="/assets/js/professional_cat.js"></script>
                    <script src="/assets/js/custom.js"></script>
                    <script type="text/javascript">

                    </script>
                </Helmet>
                <div class="professional-page">
                    <div class="hero-search">
                        <div class="heroSearch-container" style={{ "background": "url(assets/images/background-2.jpg);" }} >
                            <div class="container">
                                <div class="row d-flex justify-content-center">
                                    <div class="col-md-8">
                                        <h2>Find Excellent Professionals</h2>
                                        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="heroSearch-input">
                            <div class="heroSearch-inner">
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
                            </div>
                        </div>
                    </div>
                    <div class="professionalcategories-wrapper">

                        {Object.entries(this.initialState.form_data.service_category).map(([i, sc]) => (
                            <div class="profCategory-row">

                                <div class="container-right">
                                    <div class="profCategory-content">
                                        <h2>{sc.pc_title}</h2>
                                    </div>

                                    <div class="profCategory-slider">
                                        <div class="swiper-container">
                                            <div class="swiper-button-next"></div>
                                            <div class="swiper-button-prev"></div>

                                            <div class="swiper-wrapper">
                                                {Object.entries(this.initialState.form_data.service_category[i].subcategory_data).map(([j, ssc]) => (
                                                    <div class="swiper-slide">
                                                        <a href="">
                                                            <div class="profCategory-card">
                                                                <Link to={`/Professional-listing/` + ssc.sc_id} ><figure><img src={ssc.sc_image} /></figure></Link>

                                                                <Link to={`/Professional-listing/` + ssc.sc_id} ><span>{ssc.sc_title}</span></Link>

                                                            </div>
                                                        </a>
                                                    </div>
                                                ))}
                                            </div>

                                        </div>
                                    </div>

                                </div>

                            </div>
                        ))}


                        {/* <div class="profCategory-row">
                            <div class="container-right">
                                <div class="profCategory-content">
                                    <h2>Home Services</h2>
                                </div>
                                <div class="profCategory-slider">
                                    <div class="swiper-container">
                                        <div class="swiper-button-next"></div>
                                        <div class="swiper-button-prev"></div>
                                        <div class="swiper-wrapper">
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-5.jpg" /></figure>
                                                        <span>Architects & Building Designers</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-6.jpg" /></figure>
                                                        <span>Interior Designers & Decorators</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-7.jpg" /></figure>
                                                        <span>General Contractors</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-8.jpg" /></figure>
                                                        <span>Home Builders</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-9.jpg" /></figure>
                                                        <span>Kitchen & Bathroom Designers</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-1.jpg" /></figure>
                                                        <span>Kitchen & Bathroom Remodelers</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-2.jpg" /></figure>
                                                        <span>Design-Build Firms</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-3.jpg" /></figure>
                                                        <span>Tile, Stone & Countertops</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-4.jpg" /></figure>
                                                        <span>Closet Designers & Organizers</span>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="profCategory-row">
                            <div class="container-right">
                                <div class="profCategory-content">
                                    <h2>Cleaning Services</h2>
                                </div>
                                <div class="profCategory-slider">
                                    <div class="swiper-container">
                                        <div class="swiper-button-next"></div>
                                        <div class="swiper-button-prev"></div>
                                        <div class="swiper-wrapper">
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-1.jpg" /></figure>
                                                        <span>Architects & Building Designers</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-2.jpg" /></figure>
                                                        <span>Interior Designers & Decorators</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-3.jpg" /></figure>
                                                        <span>General Contractors</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-4.jpg" /></figure>
                                                        <span>Home Builders</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-5.jpg" /></figure>
                                                        <span>Kitchen & Bathroom Designers</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-6.jpg" /></figure>
                                                        <span>Kitchen & Bathroom Remodelers</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-7.jpg" /></figure>
                                                        <span>Design-Build Firms</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-8.jpg" /></figure>
                                                        <span>Tile, Stone & Countertops</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-9.jpg" /></figure>
                                                        <span>Closet Designers & Organizers</span>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="profCategory-row">
                            <div class="container-right">
                                <div class="profCategory-content">
                                    <h2>Popular Services</h2>
                                </div>
                                <div class="profCategory-slider">
                                    <div class="swiper-container">
                                        <div class="swiper-button-next"></div>
                                        <div class="swiper-button-prev"></div>
                                        <div class="swiper-wrapper">
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-5.jpg" /></figure>
                                                        <span>Architects & Building Designers</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-6.jpg" /></figure>
                                                        <span>Interior Designers & Decorators</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-7.jpg" /></figure>
                                                        <span>General Contractors</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-8.jpg" /></figure>
                                                        <span>Home Builders</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-9.jpg" /></figure>
                                                        <span>Kitchen & Bathroom Designers</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-1.jpg" /></figure>
                                                        <span>Kitchen & Bathroom Remodelers</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-2.jpg" /></figure>
                                                        <span>Design-Build Firms</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-3.jpg" /></figure>
                                                        <span>Tile, Stone & Countertops</span>
                                                    </div>
                                                </a>
                                            </div>
                                            <div class="swiper-slide">
                                                <a href="">
                                                    <div class="profCategory-card">
                                                        <figure><img src="/assets/images/profCategory/cat-4.jpg" /></figure>
                                                        <span>Closet Designers & Organizers</span>
                                                    </div>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                    </div>
                </div >




            </>
        );
    }
}
export default ProfessionalCategory;