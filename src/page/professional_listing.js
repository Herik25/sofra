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
import Loader from "react-loader";
import { appendScript } from '../utils/appendScript'
import Modal from 'react-bootstrap/Modal';
class ProfessionalListing extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        this.validator = new SimpleReactValidator();
        this.booking_validator = new SimpleReactValidator();
        var user_id = user_data ? user_data.u_id : '';
        const professional_id = this.props.match.params.professional_id;
        var cat_id = localStorage.getItem('category_id')
        var subcat_id = localStorage.getItem('subcategory_id')
        this.initialState = {
            form_data: {
                banner_data: '',
                listing: '',
                services: '',
                title: '',
                location: '',
                descr: '',
                category: cat_id,
                subcategory: subcat_id,
                u_id: user_id,
                professional_id: '',

                services_price: '',
            },
            u_id: user_id,
            loaded: false,
            show: false,
            professional_listing_data: '',
            location_listing_data: '',
            error: ''
        }

        this.state = this.initialState;
        this.get_professional_listing();
        this.get_location_listing();

        this.get_professional_cat_service();
        this.get_service_price();
        this.get_service_is_exist_cart(localStorage.getItem('subcategory_id'));

        this.get_banner_list();
        // this.handleDelete = this.handleDelete.bind(this);
        // this.handleQuantity = this.handleQuantity.bind(this);
        this.handleBookChange = this.handleBookChange.bind(this);
        this.handleBookNow = this.handleBookNow.bind(this);
        this.hideBookingModal = this.hideBookingModal.bind(this);


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
                    //this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }



    componentDidMount() {

    }

    /* openLoginModal(e) {
        this.setState({ show: true });
    } */
    hideBookingModal(e) {
        this.setState({ show: false });
    }

    handleOpenBook(professional_id, event) {

        var data = this.state.form_data['professional_id'] = professional_id;
        this.setState({ data });

        this.setState({ show: true });
        // window.$('#booking').modal('show');
    }

    handleServData(subcat_id, event) {
        localStorage.setItem('subcategory_id', subcat_id);
        this.get_professional_cat_service();
    }

    handleBookChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
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
                    console.log(res.data.is_exist_service);
                    this.setState({ is_exist_service: res.data.is_exist_service });

                } else {
                    this.setState({ is_exist_service: res.data.is_exist_service });

                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
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

    // Book Now
    handleBookNow(event) {
        event.preventDefault();
        if (!this.booking_validator.allValid()) {
            this.booking_validator.showMessages();
            this.forceUpdate();
        } else {
            this.setState({ loaded: false });
            api_option.url = 'save_booking';
            api_option.data = this.state.form_data;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        this.get_cart_data();
                        this.hideBookingModal();
                        // window.$('#booking').modal('hide');
                        toast.success(res.data.message);

                    } else {

                        toast.error(res.data.message);

                        // this.setState({error:res_data.message});
                    }
                })
                .catch(error => console.log(error));
        }

    }


    async get_location_listing() {
        var search_val = $("#search_val").val();
        this.setState({ loaded: false });
        api_option.url = 'get_location_listing';
        if (search_val != "") {
            api_option.data = { id: this.props.match.params.professional_id, search: search_val };
        } else {
            api_option.data = { id: this.props.match.params.professional_id };
        }

        api_option.headers.Authorization = localStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                const th = this;
                if (res.data.status) {
                    const th = this;
                    var res_data = res.data.data;
                    this.setState(this.state.location_listing_data = res.data.data);
                    // console.log("pld", this.state.location_listing_data);
                    // if (search_val == "") {
                    appendScript("assets/js/professional_lst.js" + "?ts=" + new Date().getTime());
                    // }
                } else {
                    //this.setState({ redirect: '/user/' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }

    async get_professional_listing() {
        // console.log(city);
        var search_val = $("#search_val").val();
        var city = $("#location_change").val();

        this.setState({ loaded: false });
        api_option.url = 'get_professional_listing';

        if (search_val != "") {
            api_option.data = { id: this.props.match.params.professional_id, search: search_val, city: city };
        } else {
            api_option.data = { id: this.props.match.params.professional_id, city: city };
        }

        api_option.headers.Authorization = localStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                const th = this;
                if (res.data.status) {
                    const th = this;
                    var res_data = res.data.data;
                    this.setState(this.state.professional_listing_data = res.data.data);
                    // console.log("pld", this.state.professional_listing_data);
                    // if (search_val == "") {
                    appendScript("assets/js/professional_lst.js" + "?ts=" + new Date().getTime());
                    // }
                } else {
                    //this.setState({ redirect: '/user/' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }




    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>
                <Helmet>
                    <link rel="icon" href="assets/images/icon.png" type="image/gif" />

                    {/* <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" />
                    <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
                    <link rel="stylesheet" href="assets/css/custom.css" />
                    <link rel="stylesheet" href="assets/css/mobile.css" /> */}
                    {/* <script src="assets/js/jquery-3.2.1.min.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
                    <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>

                    <script src="assets/js/professional_lst.js"></script>
                    <script src="assets/js/custom.js"></script> */}


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
                    <div class="hero-search">
                        {/* <div class="heroSearch-container" style={{ "background": "url(assets/images/background-2.jpg)" }}>
                            <div class="container">
                                <div class="row d-flex justify-content-center">
                                    <div class="col-md-8">
                                        <h2>Find Excellent Professionals</h2>
                                        <p>At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium</p>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <div class="heroSearch-input">
                            <div class="heroSearch-inner">
                                <i class="bi bi-search"></i>
                                <input type="text" name="" id="search_val" placeholder="Search..." onChange={this.get_professional_listing.bind(this)} />
                                <div class="search-filterDropdowns">

                                    <select onChange={this.get_professional_listing.bind(this)} id="location_change" style={{ "border": "0" }}>
                                        <option value="">Location</option>
                                        {Object.entries(this.state.location_listing_data).map(([o, p]) => (
                                            <>
                                                <option value={p.u_city}>{p.u_city}</option>
                                            </>
                                        ))}
                                    </select>
                                    {/* <div class="dropdown">
                                        <button class="dropdown-toggle plain" type="button" data-toggle="dropdown">Location</button>
                                        <div class="dropdown-menu">
                                            {Object.entries(this.state.location_listing_data).map(([o, p]) => (
                                                <>
                                                    <a href='javascript:;' class="dropdown-item" onClick={this.get_professional_listing.bind(this, p.u_city)}>{p.u_city}</a>
                                                </>
                                            ))}

                                        </div>
                                    </div> */}
                                    {/* <div class="dropdown">
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
                                     */}
                                </div>
                            </div>
                            <div class="mobile-view">
                                <div class="mobile-p-filter">
                                    {/* <select>
                                        <option>Location</option>
                                        <option>Location A</option>
                                        <option>Location B</option>
                                        <option>Location C</option>
                                        <option>Location D</option>
                                        <option>Location E</option>
                                        <option>Location F</option>
                                    </select>
                                    <select>
                                        <option>Category</option>
                                        <option>Category A</option>
                                        <option>Category B</option>
                                        <option>Category C</option>
                                        <option>Category D</option>
                                        <option>Category E</option>
                                        <option>Category F</option>
                                    </select> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="professionalListing-wrapper">
                        {this.state.professional_listing_data.length > 0 && <div class="container">
                            {Object.entries(this.state.professional_listing_data).map(([o, p]) => (
                                <div class="professional-listing">
                                    <div class="professional-list-card">
                                        <div class="professional-list-card-top">
                                            <div class="professional-list-header">
                                                <Link to={`/Professional-detail/` + p.u_id} >
                                                    <div class="professional-card">

                                                        <img src={p.u_image} />
                                                        <div class="professional-card-details">

                                                            <h5>{p.u_business_name}</h5>

                                                            <span>{p.sc_title}</span>
                                                            <div class="prof-ex-info">

                                                                <span><i class="bi bi-geo-alt-fill"></i>{p.u_city && p.u_city != "" && p.u_city != "null" && <span>{p.u_city},</span>}
                                                                    {p.u_state && p.u_state != "" && p.u_state != "null" && <span> {p.u_state},</span>}
                                                                    {p.u_country && p.u_country != "" && p.u_country != "null" && <span> {p.u_country}</span>}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                                <div class="professional-card-right">

                                                    {this.state.is_exist_service == 1 && <>
                                                        {localStorage.getItem('type') == 1 && is_login() && <a href="javascript:;" class="btn btn-primary  text-white ">Added to Basket</a>}
                                                        {/* {localStorage.getItem('type') != 1 && <p className="text-center">Only users can book this service</p>} */}

                                                    </> || <>
                                                            {localStorage.getItem('type') == 1 && is_login() && <a href="javascript:;" class="btn btn-primary text-white booking-trigger" onClick={this.handleOpenBook.bind(this, p.u_id)}>Book Now</a>}
                                                            {/* {localStorage.getItem('type') != 1 && <p className="text-center">Only users can book this service</p>} */}

                                                        </>}

                                                    {/* {localStorage.getItem('type') == 1 && is_login() && <button class="btn btn-primary btn-block booking-trigger" onClick={this.handleOpenBook.bind(this)}>Book Now</button>} */}
                                                    {localStorage.getItem('type') != 1 && <p className="text-center">Only users can book this service</p>}
                                                    {/* <button class="btn btn-ghost">Book Now</button>
                                                    <button class="btn btn-ghost icon"><i class="bi bi-bookmark-fill"></i></button> */}
                                                </div>
                                            </div>

                                            <div class=" professional-list-shots">
                                                <div class="swiper-container professional-list-shots-slider">
                                                    <div class="swiper-wrapper">
                                                        {Object.entries(this.state.professional_listing_data[o].user_project_data).map(([or, pr]) => (
                                                            <div class="swiper-slide" style={{ width: 'max-content' }}><NavLink exact to={`/projectdetail/${pr.tpro_id}`}>
                                                                <img src={pr.tpro_image} /></NavLink></div>
                                                        ))}
                                                        <div class="swiper-pagination"></div>
                                                        <div class="swiper-button-next circle-nav"></div>
                                                        <div class="swiper-button-prev circle-nav"></div>
                                                    </div>

                                                </div>
                                            </div>

                                        </div>
                                        {/* <div class="mobile-view pList-contact">
                                            <a href="" class="btn btn-outline"><i class="bi bi-telephone-fill"></i> Call</a>
                                            <a href="" class="btn btn-primary"><i class="bi bi-envelope-fill"></i> Contact</a>
                                        </div> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                        }
                        {this.state.professional_listing_data.length == 0 && < div className="container">
                            <h2 className="text-center">Data not available</h2>
                        </div>
                        }
                    </div>

                </div>



                <Modal show={this.state.show} id="booking" onHide={this.hideBookingModal}>

                    <form onSubmit={this.handleBookNow}>
                        {/* <div class="modal-dialog" role="document">
                            <div class="modal-content"> */}
                        <div class="modal-header">
                            <h6 class="modal-title" id="exampleModalLabel">Booking</h6>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={this.hideBookingModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        {/* size="lg" */}
                        <div class="modal-body p-4">
                            <div class="form-group d-inline">
                                <label class="d-inline mr-3 font-weight-bold">Service Price</label>
                                RO {this.state.form_data.services_price.sp_price}
                            </div>
                            <div class="form-group">
                                <label>Title</label>
                                <input type="text" name="title" id="title" value={this.state.form_data.title} onChange={this.handleBookChange} class="text-control" />
                                {this.booking_validator.message('Title', this.state.form_data.title, 'required')}
                            </div>
                            <div class="form-group">
                                <label>Location</label>
                                <input type="text" name="location" id="location" value={this.state.form_data.location} onChange={this.handleBookChange} class="text-control" />
                                {this.booking_validator.message('Location', this.state.form_data.location, 'required')}
                            </div>
                            <div class="form-group">
                                <label>Description</label>
                                <textarea class="text-control" name="descr" id="descr" value={this.state.form_data.descr} onChange={this.handleBookChange}></textarea>
                                {this.booking_validator.message('Description', this.state.form_data.descr, 'required')}
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={this.hideBookingModal}>Cancel</button>
                            <input type="hidden" name="price" value={this.state.form_data.services_price.sp_price} />
                            <input type="hidden" name="category" value={localStorage.getItem('category_id')} />
                            <input type="hidden" name="subcategory" value={localStorage.getItem('subcategory_id')} />
                            <button type="submit" class="btn btn-primary">Book Now</button>
                        </div>
                        {/* </div>
                        </div> */}
                    </form>

                </Modal>
                {/* <div class="modal fade" id="booking" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">

                    </div> */}



            </>
        );
    }
}
export default ProfessionalListing;