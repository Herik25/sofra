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
import "datatables.net-dt/css/jquery.dataTables.min.css";
import Modal from 'react-bootstrap/Modal';
import { pdfFromReact } from "generate-pdf-from-react-html";

class OrderList extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';

        this.initialState = {
            product_data: {},
            order_form_data: {
                u_name: '',

                u_email: '',
                u_mobile: '',
                u_dob: '',
                u_id: '',
                u_image: '',

                u_city: ''
            },
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
            id: 0,
            ord_id: '',
            ord_status: '',
            category_list: [],
            subcategory_list: [],

            error: '',
            show_order_modal: false
        }


        this.state = this.initialState;
        this.handleDelete = this.delete_row.bind(this);
        // this.handleSaveData = this.handleSaveData.bind(this);
        // this.handleChangeCategory = this.handleChangeCategory.bind(this);
        // this.handleChangeSubcategory = this.handleChangeSubcategory.bind(this);
        // this.handleChange = this.handleChange.bind(this);

        this.openOrderModal = this.openOrderModal.bind(this);
        this.hideOrderModal = this.hideOrderModal.bind(this);

    }

    async get_order_detail(id) {
        /* const edit_id = this.props.match.params.id;
        if (edit_id) { */
        api_option.url = 'get_order_detail';
        api_option.data = { id: id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var res_data = res.data.data;
                    const th = this;
                    th.state.product_data = res.data.product_data;
                    $.each(res_data, function (key, value) {
                        var data = th.state.order_form_data[key] = value;
                        th.setState({ data });
                    });
                    console.log(th.state.order_form_data);
                    th.openOrderModal();
                } else {
                    this.setState({ redirect: '/order-manage' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
        // }
    }

    componentDidMount() {
        this.get_order_list();
    }

    openOrderModal(e) {
        this.setState({ show_order_modal: true });
    }

    hideOrderModal(e) {
        this.setState({ show_order_modal: false });
    }


    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
    }



    get_order_list() {
        var th = this;

        var table = $('#dataTableExample').DataTable({
            destroy: true,
            // "dom": 'Bfrtip',
            // "sDom": "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'<'#colvis'>p>",

            // "sDom": "B<'row'><'row'<'col-md-6'l><'col-md-6'f>r>t<'row'<'col-md-4'i>><'row'p>B",
            "bProcessing": true,
            "bServerSide": true,
            'searching': true,
            'stateSave': true,
            "scrollX": false,
            buttons: ['copy', 'excel', 'pdf', 'colvis'],
            "sServerMethod": "POST",
            "sAjaxSource": api_url + 'get_seller_order_list?user_id=' + getUserId(),
            "sAjaxData": { id: '2' },
            "order": [[0, 'desc']],
            columnDefs: [{ "targets": 0, "visible": false }],
            fnDrawCallback: function (aoData, fnCallback) {
                // $('.btn_edit').click(function () {
                //     th.setState({ redirect: '/edit-sellerproduct/' + $(this).data('id') });
                // });
                // $('.change_status').click(function () {
                //     var id = $(this).data('id');
                //     th.setState({ id: id });
                //     var type = $(this).data('status');
                //     th.setState({ status: type });
                //     th.change_status();
                // });
                $('.btn_delete').click(function () {

                    var id = $(this).data('id');
                    th.setState({ id: id });
                });

                $('.btn_order_detail').click(function () {
                    var id = $(this).data('id');
                    th.get_order_detail(id)
                });


                $(".prd_detail").change(function () {
                    var end = this.value;
                    var id = $(this).data('oid');
                    th.setState({ ord_id: id });
                    var ord_status = $('.prd_detail').val();
                    th.setState({ ord_status: ord_status });
                    th.change_order_status();

                });

                $(".ord_detail").click(function () {
                    var id = $(this).data('id');
                    th.setState({ redirect: '/Order-detail/' + id });
                });

                // $('.prd_detail').click(function () {
                //     var id = $(this).find(':selected').data('id')
                //     alert(id)
                // });
            },
        });

        /* table.buttons().container()
            .appendTo('#dataTableExample_wrapper .col-sm-6:eq(0)'); */

        /* var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5'
            ]
        }).container().appendTo($('#buttons')); */
        //table.buttons().container().appendTo('#dataTableExample_wrapper .col-md-6:eq(0)');

        /*  new $.fn.dataTable.Buttons(table, {
             buttons: [
                 'copy', 'excel', 'pdf'
             ]
         }); */

        //table.Buttons().container()
        //.appendTo('#dataTableExample .col-md-6:eq(0)');

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
                    this.get_order_list();
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });

    }

    //change latest
    async change_order_status() {
        api_option.url = 'change_Seller_order_status';
        api_option.data = { ord_id: this.state.ord_id, ord_status: this.state.ord_status };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                const res_data = res.data;
                if (res_data.status) {
                    toast(res_data.message);
                    this.get_order_list();
                } else {
                    //this.setState({ redirect: '/order-manage/' });
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
                    <link href="/assets/seller/plugins/datatables/dataTables.bootstrap4.min.css" rel="stylesheet" type="text/css" />
                    <link href="/assets/seller/plugins/datatables/buttons.bootstrap4.min.css" rel="stylesheet" type="text/css" />
                    <link href="/assets/seller/plugins/datatables/responsive.bootstrap4.min.css" rel="stylesheet" type="text/css" />
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
                    <script src="/assets/seller/js/vertical-menu.js"></script>
                    <script src="/assets/seller/plugins/switchery/switchery.min.js"></script>
                    <script src="/assets/seller/plugins/datatables/jquery.dataTables.min.js"></script>
                    <script src="/assets/seller/plugins/datatables/dataTables.bootstrap4.min.js"></script>
                    {/* <script src="/assets/seller/plugins/datatables/jquery.dataTables.min.js"></script> */}
                    <script src="/assets/seller/plugins/datatables/dataTables.bootstrap4.min.js"></script>
                    <script src="/assets/seller/plugins/datatables/dataTables.buttons.min.js"></script>
                    <script src="/assets/seller/plugins/datatables/buttons.bootstrap4.min.js"></script>
                    <script src="/assets/seller/plugins/datatables/jszip.min.js"></script>
                    <script src="/assets/seller/plugins/datatables/pdfmake.min.js"></script>
                    <script src="/assets/seller/plugins/datatables/vfs_fonts.js"></script>
                    <script src="/assets/seller/plugins/datatables/buttons.html5.min.js"></script>
                    <script src="/assets/seller/plugins/datatables/buttons.print.min.js"></script>
                    <script src="/assets/seller/plugins/datatables/buttons.colVis.min.js"></script>
                    <script src="/assets/seller/plugins/datatables/dataTables.responsive.min.js"></script>
                    <script src="/assets/seller/plugins/datatables/responsive.bootstrap4.min.js"></script>
                    <script src="/assets/seller/js/core.js"></script>

                    <script src="assets/js/custom-popup.js"></script>
                    <script src="assets/js/custom.js?12"></script>
                    <script src="assets/js/aks.js?12"></script>
                    <script src="assets/js/developer_signup_popup.js?123"></script>
                    <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js'></script>
                    <script src='https://unpkg.com/aksfileupload@1.0.0/dist/aksFileUpload.min.js'></script>
                    <script src='https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1-rc.1/js/select2.min.js'></script>
                </Helmet>

                <div class="breadcrumbbar">
                    <div class="row align-items-center">
                        <div class="col-md-8 col-lg-8">
                            <h4 class="page-title">Order List</h4>
                            <div class="breadcrumb-list">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><NavLink exact to={'/Dashborad/'}>Home</NavLink></li>
                                    {/* <li class="breadcrumb-item"><a href="#">eCommerce</a></li> */}
                                    <li class="breadcrumb-item active" aria-current="page">Order List</li>
                                </ol>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-4">
                            <div class="widgetbar">

                            </div>
                        </div>
                    </div>
                </div>
                <div class="contentbar">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="card m-b-30">
                                <div class="card-header">
                                    <div class="row align-items-center">
                                        <div class="col-6">
                                            <h5 class="card-title mb-0">All Orders</h5>
                                        </div>
                                        <div class="col-6">
                                            <ul class="list-inline-group text-right mb-0 pl-0">
                                                <li class="list-inline-item">
                                                    <div class="form-group mb-0 amount-spent-select">
                                                        <select class="form-control" id="formControlSelect">
                                                            <option>All</option>
                                                            <option>Last Week</option>
                                                            <option>Last Month</option>
                                                        </select>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-body">
                                    <div class="table-responsive">
                                        <table class="table table-bordered" id="dataTableExample" style={{ 'width': '100%' }}>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>Invoice</th>
                                                    <th>Customer</th>
                                                    <th>Product</th>
                                                    <th>Date</th>
                                                    <th>Total</th>
                                                    <th>Status</th>
                                                    <th>Change Status</th>
                                                    <th>Status Update</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {/* <tr>
                                                    <th scope="row">#o2599</th>
                                                    <td>11</td>
                                                    <td>Amy Adams</td>
                                                    <td>02/06/2019</td>
                                                    <td>$1,95,000</td>
                                                    <td><span class="badge badge-primary-inverse">Processing</span></td>
                                                    <td>
                                                        <div class="button-list">
                                                            <NavLink exact to="/Order-detail/1" class="btn btn-primary-rgba"><i class="feather icon-file"></i></NavLink>
                                                            <a href="#" class="btn btn-success-rgba"><i class="feather icon-edit-2"></i></a>
                                                            <a href="#" class="btn btn-danger-rgba"><i class="feather icon-trash"></i></a>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">#o2600</th>
                                                    <td>12</td>
                                                    <td>Shiva Radharaman</td>
                                                    <td>01/06/2019</td>
                                                    <td>$85,000</td>
                                                    <td><span class="badge badge-secondary-inverse">Shipped</span></td>
                                                    <td>
                                                        <div class="button-list">
                                                            <a href="#" class="btn btn-primary-rgba"><i class="feather icon-file"></i></a>
                                                            <a href="#" class="btn btn-success-rgba"><i class="feather icon-edit-2"></i></a>
                                                            <a href="#" class="btn btn-danger-rgba"><i class="feather icon-trash"></i></a>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">#o2601</th>
                                                    <td>13</td>
                                                    <td>Ryan Smith</td>
                                                    <td>28/05/2019</td>
                                                    <td>$70,000</td>
                                                    <td><span class="badge badge-success-inverse">Completed</span></td>
                                                    <td>
                                                        <div class="button-list">
                                                            <a href="#" class="btn btn-primary-rgba"><i class="feather icon-file"></i></a>
                                                            <a href="#" class="btn btn-success-rgba"><i class="feather icon-edit-2"></i></a>
                                                            <a href="#" class="btn btn-danger-rgba"><i class="feather icon-trash"></i></a>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">#o2602</th>
                                                    <td>14</td>
                                                    <td>James Witherspon</td>
                                                    <td>21/05/2019</td>
                                                    <td>$1,25,000</td>
                                                    <td><span class="badge badge-warning-inverse">Refunded</span></td>
                                                    <td>
                                                        <div class="button-list">
                                                            <a href="#" class="btn btn-primary-rgba"><i class="feather icon-file"></i></a>
                                                            <a href="#" class="btn btn-success-rgba"><i class="feather icon-edit-2"></i></a>
                                                            <a href="#" class="btn btn-danger-rgba"><i class="feather icon-trash"></i></a>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">#o2603</th>
                                                    <td>15</td>
                                                    <td>Courney Berry</td>
                                                    <td>17/05/2019</td>
                                                    <td>$1,30,000</td>
                                                    <td><span class="badge badge-danger-inverse">Cancelled</span></td>
                                                    <td>
                                                        <div class="button-list">
                                                            <a href="#" class="btn btn-primary-rgba"><i class="feather icon-file"></i></a>
                                                            <a href="#" class="btn btn-success-rgba"><i class="feather icon-edit-2"></i></a>
                                                            <a href="#" class="btn btn-danger-rgba"><i class="feather icon-trash"></i></a>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">#o2604</th>
                                                    <td>16</td>
                                                    <td>Lisa Perry</td>
                                                    <td>12/05/2019</td>
                                                    <td>$1,50,000</td>
                                                    <td><span class="badge badge-info-inverse">Delivered</span></td>
                                                    <td>
                                                        <div class="button-list">
                                                            <a href="#" class="btn btn-primary-rgba"><i class="feather icon-file"></i></a>
                                                            <a href="#" class="btn btn-success-rgba"><i class="feather icon-edit-2"></i></a>
                                                            <a href="#" class="btn btn-danger-rgba"><i class="feather icon-trash"></i></a>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th scope="row">#o2605</th>
                                                    <td>17</td>
                                                    <td>John Doe</td>
                                                    <td>01/05/2019</td>
                                                    <td>$5,000</td>
                                                    <td><span class="badge badge-success-inverse">Completed</span></td>
                                                    <td>
                                                        <div class="button-list">
                                                            <a href="#" class="btn btn-primary-rgba"><i class="feather icon-file"></i></a>
                                                            <a href="#" class="btn btn-success-rgba"><i class="feather icon-edit-2"></i></a>
                                                            <a href="#" class="btn btn-danger-rgba"><i class="feather icon-trash"></i></a>
                                                        </div>
                                                    </td>
                                                </tr> */}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal show={this.state.show_order_modal} id="hide-order-pop" onHide={this.hideOrderModal} dialogClassName="modal-lg">
                    <div class="modal-header">
                        <h6 class="modal-title" id="hide-order-popLabel">Order Detail</h6>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.hideOrderModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div className="row">
                            <div className="col-md-12 grid-margin stretch-card">
                                <button className='btn btn-primary float-right' onClick={() => pdfFromReact("#download-order-pdf", "My-file", "p", true, false)
                                }>Download PDF</button>
                            </div>
                        </div>
                        <div id="download-order-pdf">
                            <div className="row" >
                                <div className="col-md-12 grid-margin stretch-card">
                                    <div className="card">
                                        {/* <div className="form_header">
                                        <h6 className="card-title">Order Detail</h6><hr />
                                    </div> */}
                                        <div className="card-body">

                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <h4>Shipping Detail</h4>
                                                    <p><b>{this.state.order_form_data.o_shipping_first_name} {this.state.order_form_data.o_shipping_last_name}</b></p>
                                                    <p>Email : {this.state.order_form_data.o_shipping_email}</p>
                                                    <p>Mobile : {this.state.order_form_data.o_shipping_mobile}</p>
                                                    <p>Address : {this.state.order_form_data.o_shipping_house_no}, {this.state.order_form_data.o_shipping_apartment}, {this.state.order_form_data.o_shipping_city}, {this.state.order_form_data.o_shipping_postcode}</p>

                                                </div>
                                                <div className='col-md-4'>
                                                    <h4>Billing Detail</h4>
                                                    <p><b>{this.state.order_form_data.o_billing_first_name} {this.state.order_form_data.o_billing_last_name}</b></p>
                                                    <p>Email : {this.state.order_form_data.o_billing_email}</p>
                                                    <p>Mobile : {this.state.order_form_data.o_billing_mobile}</p>
                                                    <p>Address : {this.state.order_form_data.o_billing_house_no}, {this.state.order_form_data.o_billing_apartment}, {this.state.order_form_data.o_billing_city}, {this.state.order_form_data.o_billing_postcode}</p>
                                                </div>

                                                <div className='col-md-4'>
                                                    <p>
                                                        <b>Status</b> : {(() => {
                                                            if (this.state.order_form_data.o_status == 0) {
                                                                return (<span>Processing</span>)
                                                            } else if (this.state.order_form_data.o_status == 1) {
                                                                return (<span>On-Hold</span>)
                                                            } else if (this.state.order_form_data.o_status == 2) {
                                                                return (<span>Shipped</span>)
                                                            } else if (this.state.order_form_data.o_status == 3) {
                                                                return (<span>Out for Delivery</span>)
                                                            } else if (this.state.order_form_data.o_status == 4) {
                                                                return (<span>Delivered</span>)
                                                            } else if (this.state.order_form_data.o_status == 5) {
                                                                return (<span>Completed</span>)
                                                            } else if (this.state.order_form_data.o_status == 6) {
                                                                return (<span>Return & Refund</span>)
                                                            } else if (this.state.order_form_data.o_status == 7) {
                                                                return (<span>Cancelled</span>)
                                                            } else {
                                                                return (<span></span>)
                                                            }
                                                        })()}
                                                    </p>
                                                    <p><b>Date :</b> {this.state.order_form_data.o_created_at}</p>

                                                    <p><b>Paypal Transaction ID</b> : {this.state.order_form_data.o_paypal_id ? this.state.order_form_data.o_paypal_id : '-'}</p>
                                                    <p><b>Paypal Status</b> : {this.state.order_form_data.o_paypal_status ? this.state.order_form_data.o_paypal_status : '-'}</p>
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
                                                    {this.state.order_form_data.o_total}
                                                </div>
                                            </div><hr />
                                            {(() => {
                                                if (this.state.order_form_data.o_shipping_amount && this.state.order_form_data.o_shipping_amount != "" && this.state.order_form_data.o_shipping_amount != "NaN") {
                                                    return (
                                                        <>
                                                            <div className='row'>
                                                                <div className='offset-md-8 col-md-2'>
                                                                    Shipping Amount
                                                                </div>
                                                                <div className='col-md-2'>
                                                                    {this.state.order_form_data.o_shipping_amount}
                                                                </div>
                                                            </div><hr />
                                                        </>
                                                    )
                                                }
                                            })()}
                                            {(() => {
                                                if (this.state.order_form_data.o_discount && this.state.order_form_data.o_discount != "" && this.state.order_form_data.o_discount != "NaN") {
                                                    return (
                                                        <>
                                                            <div className='row'>
                                                                <div className='offset-md-8 col-md-2'>
                                                                    Discount
                                                                </div>
                                                                <div className='col-md-2'>
                                                                    {this.state.order_form_data.o_discount}
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
                                                        if (this.state.order_form_data.o_grand_total && this.state.order_form_data.o_grand_total != "" && this.state.order_form_data.o_grand_total != "NaN") {
                                                            return (
                                                                <>
                                                                    {this.state.order_form_data.o_grand_total}
                                                                </>
                                                            )
                                                        } else {
                                                            return (
                                                                <>
                                                                    {this.state.order_form_data.o_total}
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

                    </div>
                </Modal>

            </>
        );
    }
}
export default OrderList;