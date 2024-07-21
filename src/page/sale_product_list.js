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

/* const navigate = useNavigate();

const refreshPage = () => {
    navigate(0);
} */

class SaleProductList extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        this.validator = new SimpleReactValidator();

        var user_id = user_data ? user_data.u_id : '';

        this.get_banner_list();
        this.get_banner_list_bottom();
        this.initialState = {
            form_data: {
                banner_data: '',
                banner_data_bottom: '',
                dimension_data: '',
                u_id: user_id,
                tp_title: '',
                seller_project: '',

            },
            subcategory_data: {},
            product_color_data: {},
            error: ''
        }

        this.state = this.initialState;

        // this.handleDelete = this.handleDelete.bind(this);
        // this.handleQuantity = this.handleQuantity.bind(this);

        this.get_sale_product();
        this.get_sub_category_list();
        this.get_product_color();
        this.get_dimension_list();
        // this.get_seller_project();

    }

    async get_dimension_list() {
        api_option.url = 'get_product_dimension';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        api_option.data = {};
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    var dimension_data = res.data.data;
                    // console.log(dimension_data);
                    this.setState(this.initialState.form_data.dimension_data = dimension_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    async get_banner_list() {
        api_option.url = 'get_front_banner_list';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        api_option.data = { type: "shop-by-product" };
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

    async get_banner_list_bottom() {
        api_option.url = 'get_front_banner_list';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        api_option.data = { type: "product-list" };
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    var banner_data_bottom = res.data.data;
                    this.setState(this.initialState.form_data.banner_data_bottom = banner_data_bottom);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }



    componentDidMount() {

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
                    th.get_living_room();
                    // th.setState({ redirect: '/productdetail/' + product_id });


                } else {
                    toast.error(res.data.message);
                    th.get_living_room();

                    // this.setState({ redirect: '/logout' });

                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }




    async get_sale_product(props, sub_cat_id = "", is_price = "") {
        // console.log("1", sub_cat_id);
        var price_filter = 0;
        // var value = $("[name='fprice']").val();
        if ($("[name='fprice']:checked").length > 0) {
            var price_filter = $("[name='fprice']:checked").val();
        }
        /* if (is_price != "") {
            var price_filter = sub_cat_id;
        } */
        var sub_cat_list = [];
        // if (sub_cat_id != "" && is_price == "") {
        $('.fcategory_list').each(function (i, obj) {
            if ($(this).prop("checked")) {
                sub_cat_list.push(parseInt($(this).val()));
            }
        });
        // }

        var color_list = [];
        $('.color_list').each(function (i, obj) {
            if ($(this).prop("checked")) {
                color_list.push(parseInt($(this).val()));
            }
        });

        var dimension_list = [];
        $('.dimension_list').each(function (i, obj) {
            if ($(this).prop("checked")) {
                dimension_list.push("'" + $(this).val().toString() + "'");
            }
        });

        var sort_by = $("#sort-list").val();

        // console.log(sub_cat_list);
        // $class


        var user_data = getUserDetail();

        console.log("user_data", sessionStorage.getItem('user'));
        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_sale_product';
        api_option.data = { login_id: user_id, sort_by: sort_by };
        const search = this.props.match.params.search;
        if (search) {
            api_option.data['search'] = search.split('-').join(' ');
            // api_option.data.push({ search: search.split('-').join(' ') });
            // api_option.data = { search: search.split('-').join(' '), login_id: user_id };
        } if (sub_cat_list.length > 0) {
            api_option.data['sub_cat_list'] = sub_cat_list.join(",");
            // api_option.data.push({ sub_cat_list: sub_cat_list.join(",") });
            // api_option.data = { login_id: user_id, sub_cat_list: sub_cat_list.join(",") };
        } if (price_filter != 0) {
            api_option.data['price_filter'] = price_filter;
            // api_option.data.push({ login_id: user_id, price_filter: price_filter });
            // api_option.data = { login_id: user_id, price_filter: price_filter };
        } if (color_list.length > 0) {
            api_option.data['color_list'] = color_list.join(",");
            // api_option.data.push({ sub_cat_list: sub_cat_list.join(",") });
            // api_option.data = { login_id: user_id, sub_cat_list: sub_cat_list.join(",") };
        } if (dimension_list.length > 0) {
            api_option.data['dimension_list'] = dimension_list.join(",");
            // api_option.data.push({ sub_cat_list: sub_cat_list.join(",") });
            // api_option.data = { login_id: user_id, sub_cat_list: sub_cat_list.join(",") };
        } /* else {
            api_option.data = { login_id: user_id };
        } */

        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    this.setState(this.state.form_data = res.data.data);
                } else {
                    this.setState({ redirect: '/logout' });
                    // this.setState({ redirect: '/ProductList/' });
                }
            })
            .catch(error => {
                //  this.setState({ redirect: '/logout' });
            });
    }

    async get_product_color() {
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_product_color';
        // const search = this.props.match.params.search;
        api_option.data = {};
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    this.setState(this.state.product_color_data = res.data.data);
                    console.log(this.state.product_color_data);
                } else {
                    //this.setState({ redirect: '/logout' });
                    // this.setState({ redirect: '/ProductList/' });
                }
            })
            .catch(error => {
                //  this.setState({ redirect: '/logout' });
            });
    }

    async get_sub_category_list() {
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_subcategory_list_filter';
        // const search = this.props.match.params.search;
        api_option.data = {};
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    console.log(res.data.data);
                    var cat_data = [];
                    var category_wise_data = [];
                    for (var i = 0; i < res.data.data.length > 0; i++) {

                        var check_index = cat_data.includes(res.data.data[i].pc_id);
                        if (check_index) {
                            var index = cat_data.indexOf(res.data.data[i].pc_id);
                            category_wise_data[index]['data'].push(res.data.data[i]);
                        } else {
                            cat_data.push(res.data.data[i].pc_id);
                            category_wise_data.push({ "pc_id": res.data.data[i].pc_id, "pc_title": res.data.data[i].pc_title, "data": [] });
                            var index = cat_data.indexOf(res.data.data[i].pc_id);
                            category_wise_data[index]['data'].push(res.data.data[i]);


                        }
                    }
                    console.log("fi", category_wise_data);

                    this.setState(this.state.subcategory_data = category_wise_data);
                } else {
                    //this.setState({ redirect: '/logout' });
                    // this.setState({ redirect: '/ProductList/' });
                }
            })
            .catch(error => {
                //  this.setState({ redirect: '/logout' });
            });
    }

    // async get_seller_project() {
    //     var user_data = getUserDetail();
    //     // console.log(user_data.u_id)
    //     var login_id = user_data ? user_data.u_id : '';
    //     api_option.url = 'get_fav_project';
    //     api_option.data = { login_id: login_id };
    //     api_option.headers.Authorization = sessionStorage.getItem('token');
    //     await axios(api_option)
    //         .then(res => {
    //             if (res.data.status) {
    //                 var seller_project = res.data.data;
    //                 this.setState(this.initialState.form_data.seller_project = seller_project);


    //             } else {
    //                 this.setState({ redirect: '/logout' });
    //             }
    //         })
    //         .catch(error => {
    //             this.setState({ redirect: '/logout' });
    //         });
    // }

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>
                <Helmet>
                    <script src="/assets/js/front_product.js"></script>

                    {/* <script src="/assets/js/slider.js"></script> */}
                    <script src="/assets/js/custom.js"></script>
                </Helmet>

                <div class="page-breadcrumb">
                    <div class="container">
                        <ul>
                            <li><i class="bi-house"></i></li>
                            <li>Store</li>
                            <li>Sale Products</li>
                        </ul>
                    </div>
                </div>

                <div class="container">
                    <div class="ad-section">
                        <div class="swiper-container">
                            <div class="swiper-wrapper">
                                {this.initialState.form_data.banner_data && Object.entries(this.initialState.form_data.banner_data).map(([i, v]) => (
                                    <>
                                        <div class="swiper-slide"><img src={v.b_image} /></div>
                                    </>
                                ))}
                                {/* <div class="swiper-slide"><img src="/assets/images/promobanner-1.jpg" /></div>
                                <div class="swiper-slide"><img src="/assets/images/promobanner-2.jpg" /></div>
                                <div class="swiper-slide"><img src="/assets/images/promobanner-3.jpg" /></div> */}
                            </div>
                            <div class="swiper-pagination"></div>
                        </div>
                    </div>
                </div>

                <div class="products-page">
                    <div class="container">
                        <div class="products-listing-wrapper">
                            <div class="filter-sidebar scrollbar">
                                <div class="filterbar-top">
                                    <h4>Filters</h4>
                                    <button class="hide-filter"><i class="bi bi-x"></i></button>
                                </div>
                                <div class="accordion-container">
                                    <div class="filter-block">
                                        <div class="accordion-title js-accordion-title">Category</div>
                                        <div class="accordion-content scrollbar">

                                            {Object.entries(this.state.subcategory_data).map(([i, v]) => (
                                                <>

                                                    <hr /><div class="js-accordion-title">{v.pc_title}</div><hr />
                                                    {Object.entries(v.data).map(([i1, v1]) => (
                                                        <>
                                                            <div class="filt-list"><label className="foption checkbox"><input type="checkbox" name={"fcategory" + v1.sc_id} className="fcategory_list" id={"fcategory" + v1.sc_id} value={v1.sc_id} onClick={this.get_sale_product.bind(this, i, v1.sc_id)} /><span>{v1.sc_title}</span></label></div>
                                                        </>
                                                    ))}
                                                </>
                                            ))}

                                            {/* <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fcategory" /><span>Sofa</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fcategory" /><span>Chair</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fcategory" /><span>Table</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fcategory" /><span>Stools</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fcategory" /><span>Lamp</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fcategory" /><span>Storage</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fcategory" /><span>Curtain</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fcategory" /><span>Beds</span></label></div> */}
                                        </div>
                                    </div>
                                    {/* <div class="filter-block">
                                        <div class="accordion-title js-accordion-title">Brand</div>
                                        <div class="accordion-content scrollbar">
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>AAK</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>Baba Tre</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>Coordonné</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>Costa Brazi</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>Ezcara</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>Fram</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>Golden Edition</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>Haeckel</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>Jupe By Jacki</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>Kob</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>Makau</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>Nanimarquina</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>Skagerak</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>Steamer</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>Tal</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>Teixidors</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>Tekla</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>The Skateroom</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>Txt.ur</span></label></div>
                                            <div class="filt-list"><label class="foption checkbox"><input type="checkbox" name="fbrand " /><span>VISO</span></label></div>
                                        </div>
                                    </div> */}
                                    <div class="filter-block">
                                        <div class="accordion-title js-accordion-title">Price</div>
                                        <div class="accordion-content scrollbar">
                                            <div class="filt-list"><label class="foption"><input type="radio" name="fprice" value="1" onClick={this.get_sale_product.bind(this, 0, 1, 'price')} /><span>Under RO 50.00</span></label></div>
                                            <div class="filt-list"><label class="foption"><input type="radio" name="fprice" value="2" onClick={this.get_sale_product.bind(this, 1, 2, 'price')} /><span>RO 50.00 - RO 100.00</span></label></div>
                                            <div class="filt-list"><label class="foption"><input type="radio" name="fprice" value="3" onClick={this.get_sale_product.bind(this, 2, 3, 'price')} /><span>RO 100.00 - RO 250.00</span></label></div>
                                            <div class="filt-list"><label class="foption"><input type="radio" name="fprice" value="4" onClick={this.get_sale_product.bind(this, 3, 4, 'price')} /><span>Above RO 250.00</span></label></div>
                                            <div class="filt-list"><label class="foption"><input type="radio" name="fprice" value="0" onClick={this.get_sale_product.bind(this, 4, 0, 'price')} /><span>All</span></label></div>
                                        </div>
                                    </div>
                                    <div class="filter-block">
                                        <div class="accordion-title js-accordion-title">Dimensions</div>
                                        <div class="accordion-content scrollbar">
                                            {/* <div class="color-grid"> */}

                                            {this.initialState.form_data.dimension_data &&
                                                <>
                                                    {Object.entries(this.initialState.form_data.dimension_data).map(([i, v]) => (
                                                        <>
                                                            <div class="filt-list"><label className="foption checkbox"><input type="checkbox" name={"dimension" + v.dimensions} className="dimension_list" id={"dimension" + v.dimensions} value={v.dimensions} onClick={this.get_sale_product.bind(this, i, v.dimensions)} /><span>{v.dimensions}</span></label></div>

                                                            {/* <label class="coloroption"><input type="checkbox" name="fcolor" /><span style={{ background: "#36454f" }} ></span> </label>
                                                        {v.tc_color} */}
                                                        </>
                                                    ))}
                                                </>
                                            }


                                            {/* </div> */}
                                        </div>
                                    </div>
                                    <div class="filter-block">
                                        <div class="accordion-title js-accordion-title">Color</div>
                                        <div class="accordion-content scrollbar">
                                            {/* <div class="color-grid"> */}
                                            {Object.entries(this.state.product_color_data).map(([i, v]) => (
                                                <>
                                                    <div class="filt-list"><label className="foption checkbox"><input type="checkbox" name={"color" + v.tc_id} className="color_list" id={"color" + v.tc_id} value={v.tc_id} onClick={this.get_sale_product.bind(this, i, v.tc_id)} /><span>{v.tc_color}</span></label></div>

                                                    {/* <label class="coloroption"><input type="checkbox" name="fcolor" /><span style={{ background: "#36454f" }} ></span> </label>
                                                        {v.tc_color} */}
                                                </>
                                            ))}
                                            {/* </div> */}
                                        </div>
                                    </div>
                                    {/* <div class="filter-block">
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
                                                <label class="coloroption"><input type="checkbox" name="fcolor" /><span style={{ background: "#efefef" }} ></span></label>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            <div class="filter_offcanvas">
                                <div class="bwp-top-bar">
                                    <div class="bwp-bar">
                                        <button class="filter-toggle btn btn-secondary wIcon"><i class="bi bi-filter"></i> Filter</button>
                                        <h1 class="pg-title">Sale Product</h1>
                                    </div>
                                    <div>
                                        <select class="sort-list" id="sort-list" onChange={this.get_sale_product.bind(this)}>
                                            <option value="0">Sort</option>
                                            <option value="1">Low to High</option>
                                            <option value="2">High to High</option>
                                            <option value="3">Oldest</option>
                                            <option value="4">Newest</option>
                                            <option value="5">Top Rated</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="products-grid">
                                    {Object.entries(this.state.form_data).map(([i, sp]) => (
                                        <div class="product-item">
                                            <div class="product-thumb">
                                                <div class="thumbtag">
                                                    <span class="sale">Sale</span>
                                                </div>
                                                <div class="thumbsave">
                                                    {is_login() && sp.favourites == 0 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, i, sp.tp_id)}><i class="bi-heart"></i></button>}
                                                    {is_login() && sp.favourites == 1 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, i, sp.tp_id)}><i class="bi-heart-fill"></i></button>}
                                                    {!is_login() && <button class="save-trigger" onClick={this.openLoginModal}><i class="bi bi-heart"></i> </button>
                                                    }
                                                </div>
                                                <Link to={`/productdetail/${sp.tp_id}`}>
                                                    <img src={sp.image} />
                                                </Link>
                                            </div>
                                            <div class="product-info">
                                                <h4 class="product-name"><Link to={`/productdetail/${sp.tp_id}`}>{sp.tp_title}</Link></h4>
                                                <div class="just-in">


                                                    <div class="product-price">{sp.tp_price > 0 && <del>RO {sp.tp_price}</del>}<span>RO {sp.tp_sale_price}</span></div>
                                                    <div class="rating-wapper">
                                                        {sp.tp_star == 0 && <span className="star-rating"><span className="stars"></span></span>}
                                                        {sp.tp_star == 1 && <span className="star-rating"><span className="stars one"></span></span>}
                                                        {sp.tp_star == 2 && <span className="star-rating"><span className="stars two" ></span></span>}
                                                        {sp.tp_star == 3 && <span className="star-rating"><span className="stars three" ></span></span>}
                                                        {sp.tp_star == 4 && <span className="star-rating"><span className="stars four" ></span></span>}
                                                        {sp.tp_star == 5 && <span className="star-rating"><span className="stars five" ></span></span>}

                                                    </div>
                                                </div>
                                                <div class="product-brand"><Link to={`/Seller-detail/${sp.u_id}`}>{sp.u_name}</Link></div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbtag">
                                                <span class="new">New</span>
                                            </div>
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-2.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Ergonomic Desk Sofa</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars five"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbtag">
                                                <span class="new">New</span>
                                            </div>
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-3.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Swivel Sofa</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars three"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbtag">
                                                <span class="featured">Featured</span>
                                            </div>
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-4.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Wood Patio Chair</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars two"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbtag">
                                                <span class="featured">Featured</span>
                                            </div>
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-5.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Brown Vinyl Padded</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars one"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbtag">
                                                <span class="featured">Featured</span>
                                            </div>
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-6.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Antique Walnut</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars four"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-7.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Office Desk Sofa</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars four"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-8.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Ergonomic Desk Sofa</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars five"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-9.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Swivel Sofa</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars three"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-10.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Wood Patio Chair</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars two"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-1.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Office Desk Sofa</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars four"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-2.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Ergonomic Desk Sofa</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars five"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-3.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Swivel Sofa</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars three"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-4.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Wood Patio Chair</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars two"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-5.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Brown Vinyl Padded</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars one"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-6.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Antique Walnut</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars four"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-7.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Office Desk Sofa</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars four"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-8.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Ergonomic Desk Sofa</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars five"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-9.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Swivel Sofa</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars three"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
                                        </div>
                                    </div>
                                    <div class="product-item">
                                        <div class="product-thumb">
                                            <div class="thumbsave">
                                                <button class="save-trigger"><i class="bi-heart"></i></button>
                                            </div>
                                            <a href="">
                                                <img src="/assets/images/product-10.jpg" />
                                            </a>
                                        </div>
                                        <div class="product-info">
                                            <h4 class="product-name"><a href="">Wood Patio Chair</a></h4>
                                            <div class="just-in">
                                                <div class="product-price"><span>$100.00</span></div>
                                                <div class="rating-wapper">
                                                    <span class="star-rating"><span class="stars two"></span></span>
                                                </div>
                                            </div>
                                            <div class="product-brand"><a href="">Styled Habitat</a></div>
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
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>


                <div class="bg-wrapper">
                    {Object.entries(this.initialState.form_data.banner_data_bottom).map(([i, v]) => (
                        <>
                            <div class="bg-parelex" style={{ background: "url(" + v.b_image + ")" }} ></div>
                            <div class="banner-wrapper-infor">
                                <h2>{v.b_title}</h2>
                                <p>{v.b_short_description}</p>
                                {v.b_button_text != "" && v.b_link != "" && <a href={v.b_link} target="_blank">{v.b_button_text}</a>}
                            </div>
                        </>
                    ))}
                    {/* <div class="bg-parelex" style={{ background: "url(assets/images/parallax_land2.jpg)" }} ></div>
                    <div class="banner-wrapper-infor">
                        <h2>Lorem ipsum dolor sit amet consectetur adipiscing elit</h2>
                        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore</p>
                        <a href="" class="btn btn-white">Learn More</a>
                    </div> */}
                </div>




            </>
        );
    }
}
export default SaleProductList;