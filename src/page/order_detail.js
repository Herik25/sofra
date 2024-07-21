import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_url, api_option, setUserSession, is_login, removeUserSession, getUserDetail, getUserId } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';

import Select from 'react-select';
import { Helmet } from "react-helmet";
import $ from 'jquery';
import "datatables.net-dt/js/dataTables.dataTables";
import Modal from 'react-bootstrap/Modal';
import { pdfFromReact } from "generate-pdf-from-react-html";

class OrderDetail extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';

        this.initialState = {
            product_data: {},
            form_data: {
                category_id: '',
                u_id: user_id,
                subcat_id: '',
                productTitle: '',
                regularPrice: '',
                salePrice: '',
                sku: '',
                stockStatus: '',
                stockQuantity: '',
                weight: '',
                shippingClass: '',
                purchaseNote: '',
            },
            order_detail_data: '',
            id: 0,
            category_list: [],
            subcategory_list: [],

            error: ''
        }


        this.state = this.initialState;
        this.handleDelete = this.delete_row.bind(this);
        // this.handleSaveData = this.handleSaveData.bind(this);
        // this.handleChangeCategory = this.handleChangeCategory.bind(this);
        // this.handleChangeSubcategory = this.handleChangeSubcategory.bind(this);
        // this.handleChange = this.handleChange.bind(this);

    }

    componentDidMount() {
        this.get_order_detail();
    }


    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
    }

    async get_order_detail() {

        api_option.url = 'get_order_detail';
        api_option.data = { id: this.props.match.params.oid };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                const res_data = res.data;

                if (res_data.status) {
                    this.setState(this.state.order_detail_data = res_data.data);

                    const th = this;
                    th.state.product_data = res.data.product_data;
                    $.each(res_data, function (key, value) {
                        var data = th.state.order_detail_data[key] = value;
                        th.setState({ data });
                    });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });

    }


    async delete_row() {
        api_option.url = 'delete_seller_product';
        api_option.data = { id: this.state.id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                const res_data = res.data;
                if (res_data.status) {
                    toast(res_data.message);
                    this.get_product_list();
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
                    <link href="/assets/seller/plugins/switchery/switchery.min.css" rel="stylesheet" />
                    <link href="/assets/seller/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
                    <link href="/assets/seller/css/icons.css" rel="stylesheet" type="text/css" />
                    <link href="/assets/seller/css/flag-icon.min.css" rel="stylesheet" type="text/css" />
                    <link href="/assets/seller/css/style.css" rel="stylesheet" type="text/css" />

                    <script src="/assets/seller/js/jquery.min.js"></script>
                    <script src="/assets/seller/js/popper.min.js"></script>
                    <script src="/assets/seller/js/bootstrap.min.js"></script>
                    <script src="/assets/seller/js/modernizr.min.js"></script>
                    <script src="/assets/seller/js/detect.js"></script>
                    <script src="/assets/seller/js/jquery.slimscroll.js"></script>
                    <script src="/assets/seller/js/vertical-menu.js"></script>
                    <script src="/assets/seller/plugins/switchery/switchery.min.js"></script>
                    <script src="/assets/seller/js/custom/custom-ecommerce-order-detail-page.js"></script>
                    <script src="/assets/seller/js/core.js"></script>
                </Helmet>

                <div class="breadcrumbbar">
                    <div class="row align-items-center">
                        <div class="col-md-8 col-lg-8">
                            <h4 class="page-title">Order Detail</h4>
                            <div class="breadcrumb-list">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><NavLink exact to={'/Dashborad/'}>Home</NavLink></li>
                                    {/* <li class="breadcrumb-item"><a href="#">eCommerce</a></li> */}
                                    <li class="breadcrumb-item active" aria-current="page">Order Detail</li>
                                </ol>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-4">
                            <div class="widgetbar">
                                {/* <button class="btn btn-primary">Update Now</button> */}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="contentbar">

                    {/*  */}
                    <div className="row">
                        <div className="col-md-12 grid-margin stretch-card">
                            <button className='btn btn-primary float-right' onClick={() => pdfFromReact("#download-order-pdf", "My-file", "p", true, false)
                            }>Download PDF</button>
                        </div>
                    </div>
                    <div id="download-order-pdf">
                        <div className="row" >
                            <div className="col-md-12 grid-margin stretch-card">
                                <div className="card  m-b-30">
                                    {/* <div className="form_header">
                                <h6 className="card-title">Order Detail</h6><hr />
                            </div> */}
                                    <div className="card-body">

                                        <div className='row'>
                                            <div className='col-md-4'>
                                                <h4>Shipping Detail</h4>
                                                <p><b>{this.state.order_detail_data.o_shipping_first_name} {this.state.order_detail_data.o_shipping_last_name}</b></p>
                                                <p>Email : {this.state.order_detail_data.o_shipping_email}</p>
                                                <p>Mobile : {this.state.order_detail_data.o_shipping_mobile}</p>
                                                <p>Address : {this.state.order_detail_data.o_shipping_house_no}, {this.state.order_detail_data.o_shipping_apartment}, {this.state.order_detail_data.o_shipping_city}, {this.state.order_detail_data.o_shipping_postcode}</p>

                                            </div>
                                            <div className='col-md-4'>
                                                <h4>Billing Detail</h4>
                                                <p><b>{this.state.order_detail_data.o_billing_first_name} {this.state.order_detail_data.o_billing_last_name}</b></p>
                                                <p>Email : {this.state.order_detail_data.o_billing_email}</p>
                                                <p>Mobile : {this.state.order_detail_data.o_billing_mobile}</p>
                                                <p>Address : {this.state.order_detail_data.o_billing_house_no}, {this.state.order_detail_data.o_billing_apartment}, {this.state.order_detail_data.o_billing_city}, {this.state.order_detail_data.o_billing_postcode}</p>
                                            </div>

                                            <div className='col-md-4'>
                                                <p>
                                                    <b>Status</b> : {(() => {
                                                        if (this.state.order_detail_data.o_status == 0) {
                                                            return (<span>Processing</span>)
                                                        } else if (this.state.order_detail_data.o_status == 1) {
                                                            return (<span>On-Hold</span>)
                                                        } else if (this.state.order_detail_data.o_status == 2) {
                                                            return (<span>Shipped</span>)
                                                        } else if (this.state.order_detail_data.o_status == 3) {
                                                            return (<span>Out for Delivery</span>)
                                                        } else if (this.state.order_detail_data.o_status == 4) {
                                                            return (<span>Delivered</span>)
                                                        } else if (this.state.order_detail_data.o_status == 5) {
                                                            return (<span>Completed</span>)
                                                        } else if (this.state.order_detail_data.o_status == 6) {
                                                            return (<span>Return & Refund</span>)
                                                        } else if (this.state.order_detail_data.o_status == 7) {
                                                            return (<span>Cancelled</span>)
                                                        } else {
                                                            return (<span></span>)
                                                        }
                                                    })()}
                                                </p>
                                                <p><b>Date :</b> {this.state.order_detail_data.o_created_at}</p>

                                                <p><b>Paypal Transaction ID</b> : {this.state.order_detail_data.o_paypal_id ? this.state.order_detail_data.o_paypal_id : '-'}</p>
                                                <p><b>Paypal Status</b> : {this.state.order_detail_data.o_paypal_status ? this.state.order_detail_data.o_paypal_status : '-'}</p>
                                            </div>
                                        </div>

                                        <table className="table mt-5">
                                            <thead>
                                                <tr>
                                                    {/* <th>#</th> */}
                                                    <th>Name</th>
                                                    <th>Product</th>
                                                    <th>Seller</th>
                                                    <th>Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(this.state.product_data).map(([i, v]) => (
                                                    <>
                                                        <tr>
                                                            {/* <td>{v.o_id}</td> */}
                                                            <td>{v.u_name}</td>
                                                            <td>{v.tp_title}</td>
                                                            <td>{v.seller_name}</td>
                                                            <td>{v.od_total}</td>
                                                        </tr>
                                                    </>

                                                ))}
                                            </tbody>
                                        </table>

                                        <div className='row mt-5'>
                                            <div className='offset-md-8 col-md-2'>
                                                Sub Total
                                            </div>
                                            <div className='col-md-2'>
                                                {this.state.order_detail_data.o_total}
                                            </div>
                                        </div><hr />
                                        {(() => {
                                            if (this.state.order_detail_data.o_shipping_amount && this.state.order_detail_data.o_shipping_amount != "" && this.state.order_detail_data.o_shipping_amount != "NaN") {
                                                return (
                                                    <>
                                                        <div className='row'>
                                                            <div className='offset-md-8 col-md-2'>
                                                                Shipping Amount
                                                            </div>
                                                            <div className='col-md-2'>
                                                                {this.state.order_detail_data.o_shipping_amount}
                                                            </div>
                                                        </div><hr />
                                                    </>
                                                )
                                            }
                                        })()}
                                        {(() => {
                                            if (this.state.order_detail_data.o_discount && this.state.order_detail_data.o_discount != "" && this.state.order_detail_data.o_discount != "NaN") {
                                                return (
                                                    <>
                                                        <div className='row'>
                                                            <div className='offset-md-8 col-md-2'>
                                                                Discount
                                                            </div>
                                                            <div className='col-md-2'>
                                                                {this.state.order_detail_data.o_discount}
                                                            </div>
                                                        </div><hr />
                                                    </>
                                                )
                                            }
                                        })()}

                                        <div className='row'>
                                            <div className='offset-md-8 col-md-2'>
                                                Total
                                            </div>
                                            <div className='col-md-2'>
                                                {(() => {
                                                    if (this.state.order_detail_data.o_grand_total && this.state.order_detail_data.o_grand_total != "" && this.state.order_detail_data.o_grand_total != "NaN") {
                                                        return (
                                                            <>
                                                                {this.state.order_detail_data.o_grand_total}
                                                            </>
                                                        )
                                                    } else {
                                                        return (
                                                            <>
                                                                {this.state.order_detail_data.o_total}
                                                            </>
                                                        )
                                                    }
                                                })()}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*  */}

                    {/* <div class="row">
                        <div class="col-lg-7 col-xl-8">
                            <div class="card m-b-30">
                                <div class="card-header">
                                    <div class="row align-items-center">
                                        <div class="col-7">
                                            <h5 class="card-title mb-0">Order No : #{this.state.order_detail_data.o_id}</h5>
                                        </div>
                                        <div class="col-5 text-right">
                                            {this.state.order_detail_data.o_status == 0 && <span class="badge badge-success-inverse">Processing</span>
                                                || this.state.order_detail_data.o_status == 1 && <span class="badge badge-success-inverse">On Hold</span>
                                                || this.state.order_detail_data.o_status == 2 && <span class="badge badge-success-inverse">Shipped</span>
                                                || this.state.order_detail_data.o_status == 3 && <span class="badge badge-success-inverse">Out for delivery</span>
                                                || this.state.order_detail_data.o_status == 4 && <span class="badge badge-success-inverse">Delivered</span>
                                                || this.state.order_detail_data.o_status == 5 && <span class="badge badge-success-inverse">Completed</span>
                                                || this.state.order_detail_data.o_status == 6 && <span class="badge badge-success-inverse">Return & Refund</span>
                                                || this.state.order_detail_data.o_status == 7 && <span class="badge badge-success-inverse">Cancelled</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="row mb-5">
                                        <div class="col-md-6 col-lg-6 col-xl-3">
                                            <div class="order-primary-detail mb-4">
                                                <h6>Order Placed</h6>
                                                <p class="mb-0">{this.state.form_data.o_created_at}</p>
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-lg-6 col-xl-3">
                                            <div class="order-primary-detail mb-4">
                                                <h6>Name</h6>
                                                <p class="mb-0">{this.state.order_detail_data.u_name}</p>
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-lg-6 col-xl-3">
                                            <div class="order-primary-detail mb-4">
                                                <h6>Email ID</h6>
                                                <p class="mb-0">{this.state.order_detail_data.u_email}</p>
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-lg-6 col-xl-3">
                                            <div class="order-primary-detail mb-4">
                                                <h6>Contact No</h6>
                                                <p class="mb-0"> {this.state.order_detail_data.u_mobile}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row">
                                        <div class="col-md-6 col-lg-6 col-xl-6 ">
                                            <div class="order-primary-detail mb-4">

                                                <p> {this.state.order_detail_data.o_shipping_house_no}, {this.state.order_detail_data.o_shipping_apartment},<br /> {this.state.order_detail_data.o_shipping_city}<br /> {this.state.order_detail_data.o_shipping_postcode}</p>

                                                <p class="mb-0">{this.state.order_detail_data.o_shipping_mobile}</p>
                                            </div>
                                        </div>
                                        <div class="col-md-6 col-lg-6 col-xl-6 ">
                                            <div class="order-primary-detail mb-4">

                                                <p> {this.state.order_detail_data.o_billing_house_no}, {this.state.order_detail_data.o_billing_apartment},<br /> {this.state.order_detail_data.o_billing_city}<br /> {this.state.order_detail_data.o_billing_postcode}</p>
                                                <p class="mb-0">{this.state.order_detail_data.o_billing_mobile}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="card m-b-30">
                                <div class="card-header">
                                    <h5 class="card-title">Order Items</h5>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive ">
                                        <table class="table table-borderless">
                                            <thead>
                                                <tr>
                                                    <th scope="col">#</th>
                                                    <th scope="col">Photo</th>
                                                    <th scope="col">Product</th>
                                                    <th scope="col">Qty</th>
                                                    <th scope="col">Price</th>
                                                    <th scope="col" class="text-right">Total</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                <tr>
                                                    <th scope="row">1</th>
                                                    <td><img src="/assets/images/ecommerce/product_01.svg" class="img-fluid" width="35" alt="product" /></td>
                                                    <td>{this.state.order_detail_data.tp_title}</td>
                                                    <td>{this.state.order_detail_data.od_quantity}</td>
                                                    <td>RO {this.state.order_detail_data.tp_sale_price}</td>
                                                    <td class="text-right">RO {this.state.order_detail_data.od_total}</td>
                                                </tr> */}
                    {/* <tr>
                                                    <th scope="row">2</th>
                                                    <td><img src="/assets/images/ecommerce/product_02.svg" class="img-fluid" width="35" alt="product" /></td>
                                                    <td>Dell Alienware</td>
                                                    <td>2</td>
                                                    <td>$20</td>
                                                    <td class="text-right">$200</td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">3</th>
                                                    <td><img src="/assets/images/ecommerce/product_03.svg" class="img-fluid" width="35" alt="product" /></td>
                                                    <td>Acer Predator Helios</td>
                                                    <td>3</td>
                                                    <td>$30</td>
                                                    <td class="text-right">$300</td>
                                                </tr> */}
                    {/* </tbody>
                                        </table>
                                    </div>
                                    <div class="row border-top pt-3">
                                        <div class="col-md-12 order-2 order-lg-1 col-lg-4 col-xl-6">
                                            <div class="order-note">
                                                <p class="mb-5"><span class="badge badge-secondary-inverse">{this.state.order_detail_data.tp_shipping_class}</span></p>
                                                <h6>Note :</h6>
                                                <p>{this.state.order_detail_data.o_note}</p>
                                            </div>
                                        </div>
                                        <div class="col-md-12 order-1 order-lg-2 col-lg-8 col-xl-6">
                                            <div class="order-total table-responsive ">
                                                <table class="table table-borderless text-right">
                                                    <tbody>
                                                        <tr>
                                                            <td>Sub Total :</td>
                                                            <td>RO {this.state.order_detail_data.od_total}</td>
                                                        </tr>
                                                        <tr>
                                                            <td>Shipping :</td>
                                                            <td>RO 0.00</td>
                                                        </tr> */}
                    {/* <tr>
                                                            <td>Tax(18%) :</td>
                                                            <td>$180.00</td>
                                                        </tr> */}
                    {/* <tr>
                                                            <td class="text-black f-w-7 font-18">Amount :</td>
                                                            <td class="text-black f-w-7 font-18">RO {this.state.order_detail_data.od_total}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer text-right">
                                    <button type="button" class="btn btn-danger-rgba my-1"><i class="feather icon-trash mr-2"></i>Cancel</button>
                                </div>
                            </div>
                            <div class="card m-b-30">
                                <div class="card-header">
                                    <div class="row align-items-center">
                                        <div class="col-7">
                                            <h5 class="card-title mb-0">Invoice PDF Details</h5>
                                        </div>
                                        <div class="col-5 text-right">
                                            <button type="button" class="btn btn-success py-1"><i class="feather icon-download mr-2"></i>Invoice</button>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="order-primary-detail">
                                        <h6>Current PDF Details</h6>
                                        <p class="mb-0">Invoice No : #986953</p>
                                        <p class="mb-0">Seller GST : 24HY87078641Z0</p>
                                        <p class="mb-0">Purchase GST : 24HG9878961Z1</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-lg-5 col-xl-4">
                            <div class="card m-b-30">
                                <div class="card-header">
                                    <div class="row align-items-center">
                                        <div class="col-12">
                                            <h5 class="card-title mb-0">Via</h5>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <form>
                                        <div class="form-group">
                                            <select id="orderCategory" class="form-control">
                                                <option selected>Select Type</option>
                                                <option value="processing">Processing</option>
                                                <option value="on-hold">On-Hold</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="out-for-delivery">Out for Delivery</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="completed">Completed</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <textarea class="form-control" name="specialMessage" id="specialMessage" rows="3" placeholder="Add Special Message"></textarea>
                                        </div>
                                        <button type="submit" class="btn btn-primary"><i class="feather icon-send mr-2"></i>Send</button>
                                    </form>
                                </div>
                            </div>
                            <div class="card m-b-30">
                                <div class="card-header">
                                    <h5 class="card-title">Downloads</h5>
                                </div>
                                <div class="card-body">
                                    <p><button type="button" class="btn btn-primary-rgba my-1"><i class="feather icon-file mr-2"></i>Invoice</button></p>
                                    <p><button type="button" class="btn btn-info-rgba my-1"><i class="feather icon-box mr-2"></i>Packaing Slip</button></p>
                                    <p><button type="button" class="btn btn-success-rgba my-1"><i class="feather icon-gift mr-2"></i>Gift Wrap Detail</button></p>
                                </div>
                            </div>
                        </div>
                    </div> */}




                </div>

            </>
        );
    }
}
export default OrderDetail;