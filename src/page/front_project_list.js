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

class FrontProjectList extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        this.validator = new SimpleReactValidator();

        var user_id = user_data ? user_data.u_id : '';


        this.initialState = {
            form_data: {
                seller_project: '',
            },
            u_id: user_id,


            error: '',
            project_category: ''
        }

        this.state = this.initialState;

        // this.handleDelete = this.handleDelete.bind(this);
        // this.handleQuantity = this.handleQuantity.bind(this);

        this.project_category();
        this.get_seller_project();
    }



    componentDidMount() {

    }


    async get_seller_project() {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var login_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_fav_project';
        api_option.data = { login_id: login_id };
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

    handleCategoryFilter(event) {

        api_option.url = 'get_fav_filter_project';
        api_option.data = { type: event.target.value };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var know_how = res.data.data;
                    this.setState(this.initialState.form_data.seller_project = know_how);
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    project_category() {

        api_option.url = 'latest_project_category_list_dropdown';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var project = res.data.category_list;
                    this.setState(this.state.project_category = project);


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
        api_option.url = 'get_fav_project';
        api_option.data = { login_id: login_id, id: id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
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
    // async get_cart_data(props) {
    //     var user_data = getUserDetail();
    //     var user_id = user_data ? user_data.u_id : '';
    //     api_option.url = 'get_cart_detail';
    //     api_option.data = { user_id: user_id };
    //     api_option.headers.Authorization = sessionStorage.getItem('token');
    //     await axios(api_option)
    //         .then(res => {
    //             if (res.data.status) {

    //                 this.setState(this.state.form_data = res.data.cart_list);

    //                 this.setState({ gtotal: res.data.grand_total });
    //                 this.setState({ is_data: true });
    //             } else {
    //                 this.setState({ is_data: false });
    //                 this.setState({ redirect: '/logout' });
    //                 // this.setState({ redirect: '/ProductList/' });
    //             }
    //         })
    //         .catch(error => {
    //             //  this.setState({ redirect: '/logout' });
    //         });


    // }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>
                <Helmet>
                    <script src="assets/js/front_product.js"></script>
                </Helmet>
                <div class="bg-blue">
                    <div class="container">
                        <div class="projects-cat">
                            <div class="pCat-title">
                                <span>Choose Your Project Type</span>
                            </div>
                            {Object.entries(this.state.project_category).map(([h, k]) => (
                                <a href="javascript:void(0);">
                                    <div class="pCat-cover" onClick={this.handleCategory.bind(this, k.text)}> <img src={k.c_image} /></div>
                                    <span>{k.text}</span>
                                </a>
                            ))}
                            {/* <a href="javascript:void(0);">
                                <div class="pCat-cover"><img src="assets/images/projects/projects-cat-0.jpg" /></div>
                                <span>All</span>
                            </a>
                            <a href="" class="active">
                                <div class="pCat-cover"><img src="assets/images/projects/projects-cat-1.jpg" /></div>
                                <span>Apartment</span>
                            </a>
                            <a href="javascript:void(0);">
                                <div class="pCat-cover"><img src="assets/images/projects/projects-cat-2.jpg" /></div>
                                <span>Studio</span>
                            </a>
                            <a href="javascript:void(0);">
                                <div class="pCat-cover"><img src="assets/images/projects/projects-cat-3.jpg" /></div>
                                <span>Villa</span>
                            </a>
                            <a href="javascript:void(0);">
                                <div class="pCat-cover"><img src="assets/images/projects/projects-cat-4.jpg" /></div>
                                <span>House</span>
                            </a>
                            <a href="javascript:void(0);">
                                <div class="pCat-cover"><img src="assets/images/projects/projects-cat-5.jpg" /></div>
                                <span>Office</span>
                            </a>
                            <a href="javascript:void(0);">
                                <div class="pCat-cover"><img src="assets/images/projects/projects-cat-6.jpg" /></div>
                                <span>Commercial</span>
                            </a> */}
                        </div>
                    </div>
                </div>

                <div class="project-page">
                    <div class="container">
                        {/* <div class="filter-sidebar scrollbar">
                            <div class="filterbar-top">
                                <h4>Filters</h4>
                                <button class="hide-filter"><i class="bi bi-x"></i></button>
                            </div>
                            <div class="accordion-container">
                                <div class="filter-block">
                                    <div class="accordion-title js-accordion-title">Category</div>
                                    <div class="accordion-content scrollbar">
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fcategory" /><span>Sofa</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fcategory" /><span>Chair</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fcategory" /><span>Table</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fcategory" /><span>Stools</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fcategory" /><span>Lamp</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fcategory" /><span>Storage</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fcategory" /><span>Curtain</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fcategory" /><span>Beds</span></label></div>
                                    </div>
                                </div>
                                <div class="filter-block">
                                    <div class="accordion-title js-accordion-title">Brand</div>
                                    <div class="accordion-content scrollbar">
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>AAK</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>Baba Tre</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>Coordonné</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>Costa Brazi</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>Ezcara</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>Fram</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>Golden Edition</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>Haeckel</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>Jupe By Jacki</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>Kob</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>Makau</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>Nanimarquina</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>Skagerak</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>Steamer</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>Tal</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>Teixidors</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>Tekla</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>The Skateroom</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>Txt.ur</span></label></div>
                                        <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand" /><span>VISO</span></label></div>
                                    </div>
                                </div>
                                <div class="filter-block">
                                    <div class="accordion-title js-accordion-title">Price</div>
                                    <div class="accordion-content scrollbar">
                                        <div class="filt-list"><label class="foption"><input type="radio" name="fprice" /><span>Under $50.00</span></label></div>
                                        <div class="filt-list"><label class="foption"><input type="radio" name="fprice" /><span>$50.00 - $100.00</span></label></div>
                                        <div class="filt-list"><label class="foption"><input type="radio" name="fprice" /><span>$100.00 - $250.00</span></label></div>
                                        <div class="filt-list"><label class="foption"><input type="radio" name="fprice" /><span>Above $250.00</span></label></div>
                                    </div>
                                </div>
                                <div class="filter-block">
                                    <div class="accordion-title js-accordion-title">Color</div>
                                    <div class="accordion-content scrollbar">
                                        <div class="color-grid">
                                            <label class="coloroption"><input type="checkbox" name="fcolor" /><span style={{ background: "#36454f" }} ></span></label>
                                            <label class="coloroption"><input type="checkbox" name="fcolor" /><span style={{ background: "#3c4477" }} ></span></label>
                                            <label class="coloroption"><input type="checkbox" name="fcolor" /><span style={{ background: "#d34b56" }} ></span></label>
                                            <label class="coloroption"><input type="checkbox" name="fcolor" /><span style={{ background: "#cc9c33" }} ></span></label>
                                            <label class="coloroption"><input type="checkbox" name="fcolor" /><span style={{ background: "#e8e6cf" }} ></span></label>
                                            <label class="coloroption"><input type="checkbox" name="fcolor" /><span style={{ background: "#b7410e" }} ></span></label>
                                            <label class="coloroption"><input type="checkbox" name="fcolor" /><span style={{ background: "#915039" }} ></span></label>
                                            <label class="coloroption"><input type="checkbox" name="fcolor" /><span style={{ background: "#4b302f" }} ></span></label>
                                            <label class="coloroption"><input type="checkbox" name="fcolor" /><span style={{ background: "#d2b48c" }} ></span></label>
                                            <label class="coloroption"><input type="checkbox" name="fcolor" /><span style={{ background: "#5db653" }} ></span></label>
                                            <label class="coloroption"><input type="checkbox" name="fcolor" /><span style={{ background: "#d6d6e5" }}></span></label>
                                            <label class="coloroption"><input type="checkbox" name="fcolor" /><span style={{ background: "#efefef" }} ></span></label>    </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <div class="filter_offcanvas">
                            <div class="bwp-top-bar">
                                <div class="bwp-bar">
                                    {/* <button class="filter-toggle btn btn-secondary wIcon"><i class="bi bi-filter"></i> Filter</button>
                                    <h1 class="pg-title">Apartment</h1> */}
                                </div>
                                <div>
                                    <select class="sort-list" onChange={this.handleCategoryFilter.bind(this)}>
                                        {/* <option>Sort</option> */}
                                        <option value="Most Popular">Most Viewed</option>
                                        <option>Newest</option>
                                        <option>Oldest</option>
                                    </select>
                                </div>
                            </div>
                            <div class="projectpage-grid">
                                {Object.entries(this.initialState.form_data.seller_project).map(([o, p]) => (
                                    <div class="projectList-items">
                                        <Link to={`/projectdetail/${p.tpro_id}`}></Link>
                                        {/* <div class="thumbtag"><span class="new">New</span></div> */}
                                        <div class="thumbsave">
                                            {(localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && is_login() && p.favourites == 0 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.tpro_id, p.tpro_seller_id)}><i class="bi-heart"></i></button>}
                                            {(localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && is_login() && p.favourites == 1 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.tpro_id, p.tpro_seller_id)}><i class="bi-heart-fill"></i></button>}
                                        </div>
                                        <div class="projectList-cover"><img src={p.tpro_image} /></div>
                                        <div class="projectList-title"><h2>{p.tpro_name}</h2></div>
                                        <div class="projectList-ft">
                                            <div class="projectList-author"><img src={p.u_image} />{p.u_name}</div>

                                            {p.tpro_view_count > 0 &&
                                                <>
                                                    {p.tpro_view_count > 1 && <span class="projectViews">{p.tpro_view_count} Views</span>}
                                                    {p.tpro_view_count == 1 && <span class="projectViews">{p.tpro_view_count} View</span>}
                                                </>
                                            }
                                        </div>
                                    </div>

                                ))}
                                {/* <div class="projectList-items">
                                    <a href=""></a>
                                    <div class="thumbtag"><span class="new">New</span></div>
                                    <div class="thumbsave">
                                        <button class="save-trigger"><i class="bi-heart"></i></button>
                                    </div>
                                    <div class="projectList-cover"><img src="assets/images/projects/project-cover-2.jpg" /></div>
                                    <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                                <div class="projectList-items">
                                    <a href=""></a>
                                    <div class="thumbtag"><span class="new">New</span></div>
                                    <div class="thumbsave">
                                        <button class="save-trigger"><i class="bi-heart"></i></button>
                                    </div>
                                    <div class="projectList-cover"><img src="assets/images/projects/project-cover-3.jpg" /></div>
                                    <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                                <div class="projectList-items">
                                    <a href=""></a>
                                    <div class="thumbsave">
                                        <button class="save-trigger"><i class="bi-heart"></i></button>
                                    </div>
                                    <div class="projectList-cover"><img src="assets/images/projects/project-cover-4.jpg" /></div>
                                    <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                                <div class="projectList-items">
                                    <a href=""></a>
                                    <div class="thumbsave">
                                        <button class="save-trigger"><i class="bi-heart"></i></button>
                                    </div>
                                    <div class="projectList-cover"><img src="assets/images/projects/project-cover-5.jpg" /></div>
                                    <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                                <div class="projectList-items">
                                    <a href=""></a>
                                    <div class="thumbsave">
                                        <button class="save-trigger"><i class="bi-heart"></i></button>
                                    </div>
                                    <div class="projectList-cover"><img src="assets/images/projects/project-cover-6.jpg" /></div>
                                    <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                                <div class="projectList-items">
                                    <a href=""></a>
                                    <div class="thumbsave">
                                        <button class="save-trigger"><i class="bi-heart"></i></button>
                                    </div>
                                    <div class="projectList-cover"><img src="assets/images/projects/project-cover-7.jpg" /></div>
                                    <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                                <div class="projectList-items">
                                    <a href=""></a>
                                    <div class="thumbsave">
                                        <button class="save-trigger"><i class="bi-heart"></i></button>
                                    </div>
                                    <div class="projectList-cover"><img src="assets/images/projects/project-cover-8.jpg" /></div>
                                    <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                                <div class="projectList-items">
                                    <a href=""></a>
                                    <div class="thumbsave">
                                        <button class="save-trigger"><i class="bi-heart"></i></button>
                                    </div>
                                    <div class="projectList-cover"><img src="assets/images/projects/project-cover-9.jpg" /></div>
                                    <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                                <div class="projectList-items">
                                    <a href=""></a>
                                    <div class="thumbsave">
                                        <button class="save-trigger"><i class="bi-heart"></i></button>
                                    </div>
                                    <div class="projectList-cover"><img src="assets/images/projects/project-cover-10.jpg" /></div>
                                    <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                                <div class="projectList-items">
                                    <a href=""></a>
                                    <div class="thumbsave">
                                        <button class="save-trigger"><i class="bi-heart"></i></button>
                                    </div>
                                    <div class="projectList-cover"><img src="assets/images/projects/project-cover-11.jpg" /></div>
                                    <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                                <div class="projectList-items">
                                    <a href=""></a>
                                    <div class="thumbsave">
                                        <button class="save-trigger"><i class="bi-heart"></i></button>
                                    </div>
                                    <div class="projectList-cover"><img src="assets/images/projects/project-cover-12.jpg" /></div>
                                    <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                                <div class="projectList-items">
                                    <a href=""></a>
                                    <div class="thumbsave">
                                        <button class="save-trigger"><i class="bi-heart"></i></button>
                                    </div>
                                    <div class="projectList-cover"><img src="assets/images/projects/project-cover-13.jpg" /></div>
                                    <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                                <div class="projectList-items">
                                    <a href=""></a>
                                    <div class="thumbsave">
                                        <button class="save-trigger"><i class="bi-heart"></i></button>
                                    </div>
                                    <div class="projectList-cover"><img src="assets/images/projects/project-cover-14.jpg" /></div>
                                    <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                                <div class="projectList-items">
                                    <a href=""></a>
                                    <div class="thumbsave">
                                        <button class="save-trigger"><i class="bi-heart"></i></button>
                                    </div>
                                    <div class="projectList-cover"><img src="assets/images/projects/project-cover-15.jpg" /></div>
                                    <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div> */}

                            </div>
                            {/* <div class="pagination p1">
                                    <a href="#"><i class="bi bi-chevron-left"></i></a>
                                    <a class="is-active" href="#">1</a>
                                    <a href="#">2</a>
                                    <a href="#">3</a>
                                    <a href="#">4</a>
                                    <a href="#">5</a>
                                    <a href="#">6</a>
                                    <a href="#"><i class="bi bi-chevron-right"></i></a>
                                </div>  */}
                        </div>
                    </div>
                </div>




            </>
        );
    }
}
export default FrontProjectList;