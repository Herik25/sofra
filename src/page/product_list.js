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

// import '../node_modules/bootstrap/dist/css/bootstrap.min.css';

class ProductList extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const professional_id = this.props.match.params.professional_id;

        this.initialState = {
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
        this.get_product_list();
    }

    //change_featured_product
    async change_featured_product() {
        api_option.url = 'change_featured_product';
        api_option.data = { id: this.state.id, type: this.state.type, status: this.state.status };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                const res_data = res.data;
                if (res_data.status) {
                    toast(res_data.message);
                    this.get_product_list();
                } else {
                    this.setState({ redirect: '/ProductList/' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }


    //change_draft_product
    async change_draft_product() {
        api_option.url = 'change_draft_product';
        api_option.data = { id: this.state.id, type: this.state.type, status: this.state.status };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                const res_data = res.data;
                if (res_data.status) {
                    toast(res_data.message);
                    this.get_product_list();
                } else {
                    this.setState({ redirect: '/ProductList/' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    //change_product_show
    async change_product_show() {
        api_option.url = 'change_product_show';
        api_option.data = { id: this.state.id, type: this.state.type, status: this.state.status };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                const res_data = res.data;
                if (res_data.status) {
                    toast(res_data.message);
                    this.get_product_list();
                } else {
                    this.setState({ redirect: '/ProductList/' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }


    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
    }

    get_product_list() {
        var th = this;

        $('#dataTableExample').DataTable({
            destroy: true,
            "bProcessing": true,
            "bServerSide": true,
            'searching': true,
            'stateSave': true,
            "scrollX": true,
            "sServerMethod": "POST",
            "sAjaxSource": api_url + 'get_seller_product_list?user_id=' + getUserId(),
            "sAjaxData": { id: '2' },
            "order": [[0, 'desc']],
            columnDefs: [{ "targets": 0, "visible": false }],
            fnDrawCallback: function (aoData, fnCallback) {
                $('.btn_edit').click(function () {
                    th.setState({ redirect: '/edit-sellerproduct/' + $(this).data('id') });
                });
                $('.change_featured_product').click(function () {
                    var id = $(this).data('id');
                    th.setState({ id: id });
                    var type = $(this).data('type');
                    th.setState({ type: type });
                    var status = $(this).data('status');
                    th.setState({ status: status });
                    th.change_featured_product();
                });
                $('.change_draft_product').click(function () {
                    var id = $(this).data('id');
                    th.setState({ id: id });
                    var type = $(this).data('type');
                    th.setState({ type: type });
                    var status = $(this).data('status');
                    th.setState({ status: status });
                    th.change_draft_product();
                });
                $('.change_product_show').click(function () {
                    var id = $(this).data('id');
                    th.setState({ id: id });
                    var type = $(this).data('type');
                    th.setState({ type: type });
                    var status = $(this).data('status');
                    th.setState({ status: status });
                    th.change_product_show();
                });
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
            },
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
                    <script src="/assets/seller/plugins/switchery/switchery.min.js"></script>
                    <script src="/assets/seller/plugins/datatables/jquery.dataTables.min.js"></script>
                    <script src="/assets/seller/plugins/datatables/dataTables.bootstrap4.min.js"></script>
                    {/* <script src="/assets/seller/plugins/datatables/jquery.dataTables.min.js"></script>
                    <script src="/assets/seller/plugins/datatables/dataTables.bootstrap4.min.js"></script> */}
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
                </Helmet>

                <div class="breadcrumbbar">
                    <div class="row align-items-center">
                        <div class="col-md-8 col-lg-8">
                            <h4 class="page-title">Product List</h4>
                            <div class="breadcrumb-list">
                                <ol class="breadcrumb">

                                    <li class="breadcrumb-item"><NavLink exact to={'/Dashborad/'}>Home</NavLink></li>
                                    {/* <li class="breadcrumb-item"><a href="#">eCommerce</a></li> */}
                                    <li class="breadcrumb-item active" aria-current="page">Product List</li>
                                </ol>
                            </div>
                        </div>
                        <div class="col-md-4 col-lg-4">
                            <div class="widgetbar">
                                <NavLink exact to={'/Product/'}> <button class="btn btn-primary-rgba"><i class="feather icon-plus mr-2"></i>Add Product</button></NavLink>
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
                                            <h5 class="card-title mb-0">All Products</h5>
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
                                        <table class="table table-borderless" id="dataTableExample" style={{ 'width': '100%' }}>
                                            <thead>
                                                <tr>
                                                    <th>ID</th>
                                                    <th>SKU</th>
                                                    <th>Name</th>
                                                    <th>Stock</th>
                                                    <th>Price</th>
                                                    <th>Categories</th>
                                                    <th>Draft Product</th>
                                                    <th>Show Product</th>
                                                    {/* <th>Tags</th>
                                                    <th>Orders</th>
                                                    <th>Date</th> */}
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>

                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Confirm Delete</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure to delete?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">No</button>
                                <button onClick={this.handleDelete} data-dismiss="modal" className="btn btn-primary">Yes</button>
                            </div>
                        </div>
                    </div>
                </div>

            </>
        );
    }
}
export default ProductList;