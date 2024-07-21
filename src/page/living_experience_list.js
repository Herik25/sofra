import React, { Component } from 'react';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import $ from 'jquery';
import { Helmet } from "react-helmet";
class LivingExperienceList extends Component {
    constructor(props) {
        super(props);
        //console.log(this.props)
        // const device_type = this.props.match.params.device_type;
        // if (this.props.match.params.device_type) {
        //     localStorage.setItem('device_type', device_type);
        // } else {

        //     localStorage.setItem('device_type', 'web');
        // }
        this.get_banner_list();
        this.get_living_experience();
        this.initialState = {
            form_data: {
                banner_data: '',
                living_experience: '',
            },
            error: '',
            project_category: ''
        }
        this.state = this.initialState;
        this.project_category();
    }
    componentDidMount() {

    }

    async get_banner_list() {
        api_option.url = 'get_front_banner_list';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        api_option.data = { type: "living-experience-list" };
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

    project_category() {

        api_option.url = 'project_category';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var project = res.data.data;
                    this.setState(this.state.project_category = project);


                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    handleFavourite(event, kid) {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'add_to_favourite_living';
        api_option.data = { living_id: kid, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        axios(api_option)
            .then(res => {
                if (res.data.status) {

                    toast.success(res.data.message);
                    th.get_living_experience();
                    // th.setState({ redirect: '/productdetail/' + product_id });


                } else {
                    toast.error(res.data.message);
                    th.get_living_experience();

                    // this.setState({ redirect: '/logout' });

                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    async get_living_experience() {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var login_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_fav_living';
        api_option.data = { login_id: login_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var living_experience = res.data.data;
                    console.log(res.data.data)
                    this.setState(this.initialState.form_data.living_experience = living_experience);
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    handleCategory(id, event) {
        var user_data = getUserDetail();
        var login_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_fav_living';
        api_option.data = { login_id: login_id, id: id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var living_experience = res.data.data;
                    this.setState(this.initialState.form_data.living_experience = living_experience);
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    handleCategoryFilter(event) {

        api_option.url = 'get_fav_filter_living';
        api_option.data = { type: event.target.value };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var living_experience = res.data.data;
                    this.setState(this.initialState.form_data.living_experience = living_experience);
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    render() {
        return (
            <>
                <Helmet>

                    <link rel="stylesheet" href="/assets/css/custom.css" />
                    <link rel="stylesheet" href="/assets/css/mobile.css" />
                    <script src="/assets/js/slider.js"></script>

                    <script src="/assets/js/custom.js"></script>
                </Helmet>
                <div class="livingexperience-page">
                    <div class="le-banner">
                        <div class="swiper-container">
                            <div class="swiper-wrapper">

                                {Object.entries(this.initialState.form_data.banner_data).map(([i, v]) => (
                                    <>




                                        <div class="swiper-slide" style={{ "height": "450px" }}>
                                            {/* <div class="le-cover" style={{ backgroundImage: `url(${v.b_image})` }} ></div> */}
                                            <div class="le-cover" style={{ backgroundImage: `url(${v.b_image})` }} ></div>

                                            {(v.b_title != "" || v.b_short_description != "" || v.b_button_text != "" || v.b_link != "") &&
                                                <div class="container">
                                                    <div class="le-banner-content">
                                                        <div class="projectList-title"><h2>{v.b_title}</h2></div>
                                                        <p>{v.b_short_description}</p>
                                                        {v.b_button_text != "" && v.b_link != "" && <a href={v.b_link} target="_blank">{v.b_button_text}</a>}
                                                        {/* <div class="projectList-ft">
                                                    <div class="projectList-author">BM Architects</div>
                                                    <span class="projectViews">246 Views</span>
                                                </div> */}
                                                    </div>
                                                </div>
                                            }

                                        </div>
                                    </>
                                ))}


                            </div>
                            <div class="swiper-pagination"></div>
                        </div>
                    </div>
                    <div class="container">
                        {/* <div class="projects-cat">
                            <div class="pCat-title">
                                <span>Choose Your Project Type</span>
                            </div>

                            {Object.entries(this.state.project_category).map(([h, k]) => (
                                <a href="javascript:void(0);">
                                    <div class="pCat-cover" onClick={this.handleCategory.bind(this, k.pc_title)}> <img src={k.pc_image} /></div>
                                    <span>{k.pc_title}</span>
                                </a>
                            ))}
                        </div> */}

                        {/* <a href="javascript:void(0);">
                                <div class="pCat-cover"><img src="/assets/images/projects/projects-cat-0.jpg" /></div>
                                <span>All</span>
                            </a>
                            <a href="" class="active">
                                <div class="pCat-cover"><img src="/assets/images/projects/projects-cat-1.jpg" /></div>
                                <span>Apartment</span>
                            </a>
                            <a href="javascript:void(0);">
                                <div class="pCat-cover"><img src="/assets/images/projects/projects-cat-2.jpg" /></div>
                                <span>Studio</span>
                            </a>
                            <a href="javascript:void(0);">
                                <div class="pCat-cover"><img src="/assets/images/projects/projects-cat-3.jpg" /></div>
                                <span>Villa</span>
                            </a>
                            <a href="javascript:void(0);">
                                <div class="pCat-cover"><img src="/assets/images/projects/projects-cat-4.jpg" /></div>
                                <span>House</span>
                            </a>
                            <a href="javascript:void(0);">
                                <div class="pCat-cover"><img src="/assets/images/projects/projects-cat-5.jpg" /></div>
                                <span>Office</span>
                            </a>
                            <a href="javascript:void(0);">
                                <div class="pCat-cover"><img src="/assets/images/projects/projects-cat-6.jpg" /></div>
                                <span>Commercial</span>
                            </a> */}

                        <div class="bwp-top-bar">
                            <div class="bwp-bar">
                                <h1 class="pg-title">Living Experience</h1>
                            </div>
                            <div>
                                <select class="sort-list" onChange={this.handleCategoryFilter.bind(this)}>
                                    {/* <option>Sort</option> */}
                                    <option value="Most Popular">Most Viewed</option>
                                    <option>Newest</option>
                                    <option>Oldest</option>
                                </select>
                                {/* <select class="sort-list" onChange={this.handleCategoryFilter.bind(this)}>

                                    <option>Sort</option>
                                    <option>Most Popular</option>
                                    <option>Newest</option>
                                </select> */}
                            </div>
                        </div>
                        <div class="livingexperience-grid">
                            {Object.entries(this.initialState.form_data.living_experience).map(([o, p]) => (
                                <div class="projectList-items">
                                    <Link to={`/living-experience-detail/${p.living_id}`}></Link>
                                    <div class="thumbtag"><span class="new">New</span></div>
                                    <div class="thumbsave">
                                        {localStorage.getItem('type') == 1 && is_login() && p.favourites == 0 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.living_id)}><i class="bi-heart"></i></button>}
                                        {localStorage.getItem('type') == 1 && is_login() && p.favourites == 1 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.living_id)}><i class="bi-heart-fill"></i></button>}
                                    </div>
                                    <div class="projectList-cover"><img src={p.living_image} /></div>
                                    <div class="projectList-title"><h2>{p.living_name}</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src={p.u_image} />{p.u_name}</div>
                                        {p.living_view_count && p.living_view_count > 0 &&
                                            <>
                                                {p.living_view_count > 1 && <span class="projectViews">{p.living_view_count} Views</span>}
                                                {p.living_view_count == 1 && <span class="projectViews">{p.living_view_count} View</span>}
                                            </>
                                        }
                                        {/* <span class="projectViews">246 Views</span> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default LivingExperienceList;