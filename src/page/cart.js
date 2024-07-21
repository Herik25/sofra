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
import { confirm } from "react-confirm-box";

class Cart extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        this.validator = new SimpleReactValidator();
        const Quantityoptions = [
            { value: 1, label: '1' },
            { value: 2, label: '2' },
            { value: 3, label: '3' },
            { value: 4, label: '4' },
            { value: 5, label: '5' },
            { value: 6, label: '6' },
            { value: 7, label: '7' },
            { value: 8, label: '8' },
            { value: 9, label: '9' },
            { value: 10, label: '10' },
        ];
        var user_id = user_data ? user_data.u_id : '';

        this.initialState = {
            form_data: {
                category_id: '',
                u_id: user_id,
                grand_total: '',
                quantitytype: '',
            },
            check_is_product_in_cart: 0,
            service_data: {
                u_id: user_id,
            },
            quantity_list: Quantityoptions,
            gtotal: '',
            total_sale_price: 0,
            total_discount: 0,
            is_data: '',
            error: '',
            cart_array: []
        }


        this.state = this.initialState;

        // this.handleQuantity = this.handleQuantity.bind(this);
        this.get_cart_data();


    }


    async get_cart_count(props) {
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_cart_count';
        api_option.data = { user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    this.setState({ cart_bag_number: res.data.total });

                } else {
                    this.setState({ is_data: false });
                    // this.setState({ redirect: '/ProductList/' });
                }
            })
            .catch(error => {
                //  this.setState({ redirect: '/logout' });
            });
    }

    handleDelete(id) {

        if (window.confirm("Are you sure to delete this item?")) {
            api_option.url = 'delete_cart_data';
            api_option.data = { cart_id: id };
            axios(api_option)
                .then(res => {
                    const res_data = res.data;
                    if (res_data.status) {
                        toast.success(res_data.message);
                        this.get_cart_data();
                        var cnt = $('#bag_count').text();

                        if (cnt == 0) {
                            $('#bag_count').text();
                        } else {
                            $('#bag_count').text(parseInt(cnt) - 1);
                        }
                        window.location.reload();
                    } else {
                        toast.error(res_data.message);
                    }
                })
        }


    }
    handleQuantity(event, index, product_id, product_price, cart_id) {

        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'update_cart';
        api_option.data = { user_id: user_id, quantity: event.target.value, product_id: product_id, price: product_price, cart_id: cart_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    this.get_cart_data();

                    // this.setState(this.state.form_data = res.data.cart_list);

                    // this.setState({ gtotal: res.data.grand_total });
                    // this.setState({ is_data: true });
                } else {
                    // this.setState({ is_data: false });
                    this.get_cart_data();
                }
            })
            .catch(error => {

            });

    }

    componentDidMount() {

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

                    if (cart_data.length > 0) {
                        this.setState({ check_is_product_in_cart: 1 });
                    } else {
                        this.setState({ check_is_product_in_cart: 0 });
                    }
                    var total_sale_price_save = 0;
                    for (var i = 0; i < cart_data.length; i++) {
                        cart_array.push({
                            image: cart_data[i]['image'],
                            cart_id: cart_data[i]['cart_id'],
                            user_id: cart_data[i]['user_id'],
                            product_id: cart_data[i]['product_id'],
                            quantity: cart_data[i]['quantity'],
                            tp_price: cart_data[i]['price'],
                            product_price: cart_data[i]['tp_price'],
                            size: cart_data[i]['size'],
                            color: cart_data[i]['color'],
                            seller_id: cart_data[i]['seller_id'],
                            tp_id: cart_data[i]['tp_id'],
                            tp_title: cart_data[i]['tp_title'],
                            tc_color: cart_data[i]['tc_color'],
                            s_title: cart_data[i]['s_title'],
                            type: 'Product',
                        })

                        total_sale_price_save = total_sale_price_save + (parseFloat(cart_data[i]['tp_price']) * parseFloat(cart_data[i]['quantity']));
                    }
                    for (var i = 0; i < service_data.length; i++) {
                        if (service_data[i]['user_image'] != "") {
                            var image = service_data[i]['user_image'];
                        } else {
                            var image = service_data[i]['sc_image'];
                        }
                        cart_array.push({
                            image: image,
                            cart_id: service_data[i]['cart_id'],
                            user_id: service_data[i]['user_id'],
                            product_id: service_data[i]['subcategory_id'],
                            quantity: service_data[i]['quantity'],
                            tp_price: service_data[i]['price'],
                            product_price: 0,
                            size: service_data[i]['size'],
                            color: service_data[i]['color'],
                            seller_id: service_data[i]['professional_id'],
                            tp_id: service_data[i]['tp_id'],
                            tp_title: service_data[i]['title'] + " (Professional : " + service_data[i]['professionalname'] + ", Category : " + service_data[i]['sc_title'] + ")",
                            type: 'Service',
                        })

                        total_sale_price_save = total_sale_price_save + parseFloat(service_data[i]['price']);
                    }
                    this.setState(this.state.cart_array = cart_array);
                    // this.setState(this.state.form_data = res.data.cart_list);
                    // this.setState(this.state.service_data = res.data.service_list);
                    var total_discount_display = parseFloat(total_sale_price_save) - parseFloat(res.data.grand_total);
                    if (total_discount_display <= 0) {
                        total_discount_display = 0;
                    }
                    this.setState({ gtotal: res.data.grand_total });
                    this.setState({ total_sale_price: total_sale_price_save });
                    this.setState({ total_discount: total_discount_display });
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

    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>

                <div class="cartpage-wrapper">
                    <div class="container">
                        <div class="cart-section">

                            {this.state.is_data == 1 && <div class="cart-details">
                                {/* <h6>3 Items in Bag</h6> */}
                                {Object.entries(this.state.cart_array).map(([i, sp]) => (
                                    <div class="cart-product-item">
                                        <div class="cart-item-image"><img src={sp.image} /></div>
                                        <div class="cart-item-content">
                                            {sp.type == 'Product' && <Link to={`/productdetail/${sp.tp_id}`}>{sp.tp_title}</Link>}
                                            {sp.type == 'Service' && <Link to={`/Professional-detail/${sp.seller_id}`}>{sp.tp_title}</Link>}

                                            <div>
                                                {sp.type == 'Product' && <div class="option-selected">
                                                    <span>Color:<strong>{sp.tc_color}</strong></span>
                                                    <span>Size:<strong>{sp.s_title}</strong></span>
                                                </div>}
                                                {sp.type == 'Product' && <select class="cart-qty" id="quantitytype" name="quantitytype" onChange={e => this.handleQuantity(e, i, sp.tp_id, sp.tp_price, sp.cart_id)}>
                                                    {sp.quantity == 1 && <option value="1" selected>1</option> || <option value="1" >1</option>}
                                                    {sp.quantity == 2 && <option value="2" selected>2</option> || <option value="2" >2</option>}
                                                    {sp.quantity == 3 && <option value="3" selected>3</option> || <option value="3" >3</option>}
                                                    {sp.quantity == 4 && <option value="4" selected>4</option> || <option value="4" >4</option>}
                                                    {sp.quantity == 5 && <option value="5" selected>5</option> || <option value="5" >5</option>}
                                                    {sp.quantity == 6 && <option value="6" selected>6</option> || <option value="6" >6</option>}
                                                    {sp.quantity == 7 && <option value="7" selected>7</option> || <option value="7" >7</option>}
                                                    {sp.quantity == 8 && <option value="8" selected>8</option> || <option value="8" >8</option>}
                                                    {sp.quantity == 9 && <option value="9" selected>9</option> || <option value="9" >9</option>}
                                                    {sp.quantity >= 10 && <option value="10" selected>10</option> || <option value="10" >10</option>}


                                                </select>}
                                                {/* <Select class="cart-qty"
                                                    value={this.state.form_data.quantitytype}
                                                    onChange={e => this.handleQuantity(e, i, sp.tp_id, sp.tp_sale_price, sp.cart_id)}

                                                    isSearchable={true}
                                                    options={this.state.quantity_list}
                                                    id="quantitytype" name="quantitytype"
                                                /> */}
                                            </div>
                                        </div>

                                        <div class="cart-price">{sp.product_price > 0 && sp.product_price != sp.tp_price && <del>RO {sp.product_price}</del>} <span>RO {sp.tp_price}</span></div>

                                        <button class="remove-cart" onClick={this.handleDelete.bind(this, sp.cart_id)}><i class="bi bi-x-square"></i></button>
                                    </div>
                                ))}
                                {/* <div class="cart-product-item">
                                    <div class="cart-item-image"><img src="/assets/images/product-7.jpg" /></div>
                                    <div class="cart-item-content">
                                        <a href="">Eames Cole Lounge Chair Single</a>
                                        <div>
                                            <div class="option-selected">
                                                <span>Color:<strong>Blue</strong></span>
                                                <span>Size:<strong>XL</strong></span>
                                            </div>
                                            <select class="cart-qty">
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                                <option>6</option>
                                                <option>7</option>
                                                <option>8</option>
                                                <option>9</option>
                                                <option>10+</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="cart-price"><del>$130.00</del><span>$100</span></div>
                                    <button class="remove-cart"><i class="bi bi-x-square"></i></button>
                                </div>
                                <div class="cart-product-item">
                                    <div class="cart-item-image"><img src="/assets/images/product-9.jpg" /></div>
                                    <div class="cart-item-content">
                                        <a href="">Eames Cole Lounge Chair Single</a>
                                        <div>
                                            <div class="option-selected">
                                                <span>Color:<strong>Blue</strong></span>
                                                <span>Size:<strong>XL</strong></span>
                                            </div>
                                            <select class="cart-qty">
                                                <option>1</option>
                                                <option>2</option>
                                                <option>3</option>
                                                <option>4</option>
                                                <option>5</option>
                                                <option>6</option>
                                                <option>7</option>
                                                <option>8</option>
                                                <option>9</option>
                                                <option>10+</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="cart-price"><del>$130.00</del><span>$100</span></div>
                                    <button class="remove-cart"><i class="bi bi-x-square"></i></button>
                                </div> */}
                            </div>
                            }
                            {this.state.is_data == 1 && <div class="cart-summary">
                                <div class="cart-sticky">
                                    <h6>Summary</h6>
                                    <div class="cart-pricebreakup">
                                        <dl>
                                            <dd>Total product amount</dd>
                                            <dt>RO {this.state.total_sale_price}</dt>
                                        </dl>

                                        {this.state.check_is_product_in_cart == 1 &&
                                            <dl>
                                                <dd>Discount</dd>
                                                <dt class="text-success">- RO {this.state.total_discount}</dt>
                                            </dl>
                                        }
                                        {/* check_is_product_in_cart */}

                                        <dl>
                                            <dd>Amount to Pay</dd>
                                            <dt>RO {this.state.gtotal}</dt>
                                        </dl>
                                    </div>
                                    {localStorage.getItem('type') == 1 && is_login() && <NavLink class="btn btn-primary btn-block" exact to="/checkout/">Proceed to Checkout</NavLink>}
                                    {!is_login() && <a class="btn btn-primary btn-block" onClick={this.openLoginModal}>Proceed to Checkout</a>
                                    }

                                </div>
                            </div>
                            }
                            {this.state.is_data == 0 && <div class="cart-details">
                                {/* <h6>3 Items in Bag</h6> */}

                                <div class="cart-product-item">
                                    <h3><NavLink exact to="/">Your basket empty, click here to shop more.</NavLink></h3>

                                </div>


                            </div>
                            }
                        </div>

                    </div>
                </div>

                <div className="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Confirm Logout</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure to delete?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">No</button>
                                <button onClick={this.handleLogoutFinal} data-dismiss="modal" className="btn btn-primary">Yes</button>
                            </div>
                        </div>
                    </div>
                </div>



            </>
        );
    }
}
export default Cart;