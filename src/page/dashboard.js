import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail, getUserId } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import { Helmet } from "react-helmet";
class Dashboard extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();

        var user_id = user_data ? user_data.u_id : '';

        if (user_data) {
            var is_approved = user_data.u_is_approved;
        } else {
            var is_approved = 0;
        }
        this.initialState = {
            form_data: { is_approved: is_approved },
            order_data: '',
            product_data: '',
            project_data: '',
        }
        this.state = this.initialState;
        this.get_profile_data(user_id);
        this.get_form_data(user_id);
    }

    //get edit form data
    async get_form_data(user_id) {

        api_option.url = 'get_seller_dashboard_data';
        api_option.data = { user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var data = this.state.order_data = res.data.data;
                    this.setState({ data });

                    var data = this.state.product_data = res.data.product_count;
                    this.setState({ data });

                    var data = this.state.project_data = res.data.project_count;
                    this.setState({ data });


                } else {
                    //  this.setState({ redirect: '/sellerdashboard-manage/' });
                }
            })
            .catch(error => {
                //  this.setState({ redirect: '/logout' });
            });


    }
    async get_profile_data(user_id) {
        if (user_id) {
            api_option.url = 'get_seller_profile_data';
            api_option.data = { id: user_id };
            api_option.headers.Authorization = localStorage.getItem('token');
            await axios(api_option)
                .then(res => {
                    const th = this;
                    if (res.data.status) {

                        setUserSession(res.data.user_token, res.data.profile_detail);



                        var data = th.state.form_data.is_approved = res.data.profile_detail.u_is_approved;
                        th.setState({ data });
                    }
                })
                .catch(error => {
                    this.setState({ redirect: '/logout' });
                });
        }
        //console.log(this.state.approved_form_data.is_approved)
    }

    componentDidMount() {

    }



    render() {
        // if (this.state.redirect) {
        //     return <Redirect to={this.state.redirect} />
        // }
        return (
            <>
                <Helmet>
                    <link rel="shortcut icon" href="/assets/seller/images/icon.png" />
                    <link href="/assets/seller/plugins/switchery/switchery.min.css" rel="stylesheet" />
                    <link href="/assets/seller/plugins/apexcharts/apexcharts.css" rel="stylesheet" />
                    <link href="/assets/seller/plugins/jvectormap/jquery-jvectormap-2.0.2.css" rel="stylesheet" />
                    <link href="/assets/seller/plugins/slick/slick.css" rel="stylesheet" />
                    <link href="/assets/seller/plugins/slick/slick-theme.css" rel="stylesheet" />
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
                    <script src="/assets/seller/plugins/apexcharts/apexcharts.min.js"></script>
                    <script src="/assets/seller/plugins/apexcharts/irregular-data-series.js"></script>
                    <script src="/assets/seller/plugins/jvectormap/jquery-jvectormap-2.0.2.min.js"></script>
                    <script src="/assets/seller/plugins/jvectormap/jquery-jvectormap-world-mill-en.js"></script>
                    <script src="/assets/seller/plugins/slick/slick.min.js"></script>
                    <script src="/assets/seller/js/custom/custom-dashboard-ecommerce.js"></script>
                    <script src="/assets/seller/js/core.js"></script>
                </Helmet>
                <div class="breadcrumbbar">
                    <div class="row align-items-center">
                        <div class="col-md-8 col-lg-8">
                            <h4 class="page-title">Dashboard</h4>
                            <div class="breadcrumb-list">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><NavLink exact to={'/Dashborad/'}>Home</NavLink></li>
                                    <li class="breadcrumb-item active" aria-current="page">Dashboard</li>
                                </ol>
                            </div>
                        </div>
                        {this.state.form_data.is_approved == 1 ? (<div class="col-md-4 col-lg-4">
                            <div class="widgetbar">
                                <NavLink exact to={'/Product'}> <button class="btn btn-primary-rgba"><i class="feather icon-plus mr-2"></i>Add Products</button></NavLink>
                            </div>
                        </div>) : (<div class="widgetbar"></div>)}

                    </div>
                </div>
                {this.state.form_data.is_approved == 1 ? (
                    <div class="contentbar">

                        <div class="row">
                            <div class="col-lg-12 col-xl-12">
                                <div class="row">
                                    <div class="col-lg-3">
                                        <div class="card text-center m-b-30">
                                            <div class="card-header">
                                                <h5 class="card-title mb-0">Orders</h5>
                                            </div>
                                            <div class="card-body px-0 pb-0">
                                                <p class="dash-analytic-icon"><i class="feather icon-shopping-bag success-rgba text-success"></i></p>
                                                <h4 class="mb-3">{this.state.order_data}</h4>

                                                <div class="progress" style={{ height: "5px" }}>
                                                    <div class="progress-bar bg-success" role="progressbar" style={{ width: "60%" }} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-3">
                                        <div class="card text-center m-b-30">
                                            <div class="card-header">
                                                <h5 class="card-title mb-0">Products</h5>
                                            </div>
                                            <div class="card-body px-0 pb-0">
                                                <p class="dash-analytic-icon"><i class="feather icon-shopping-bag success-rgba text-success"></i></p>
                                                <h4 class="mb-3">{this.state.product_data}</h4>

                                                <div class="progress" style={{ height: "5px" }}>
                                                    <div class="progress-bar bg-success" role="progressbar" style={{ width: "60%" }} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-3">
                                        <div class="card text-center m-b-30">
                                            <div class="card-header">
                                                <h5 class="card-title mb-0">Projects</h5>
                                            </div>
                                            <div class="card-body px-0 pb-0">
                                                <p class="dash-analytic-icon"><i class="feather icon-shopping-bag success-rgba text-success"></i></p>
                                                <h4 class="mb-3">{this.state.project_data}</h4>

                                                <div class="progress" style={{ height: "5px" }}>
                                                    <div class="progress-bar bg-success" role="progressbar" style={{ width: "60%" }} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-3">
                                        <div class="card text-center m-b-30">
                                            <div class="card-header">
                                                <h5 class="card-title mb-0">Total Revenue</h5>
                                            </div>
                                            <div class="card-body px-0 pb-0">
                                                <p class="dash-analytic-icon"><i class="feather icon-shopping-bag success-rgba text-success"></i></p>
                                                <h4 class="mb-3">RO {this.state.order_total}</h4>

                                                <div class="progress" style={{ height: "5px" }}>
                                                    <div class="progress-bar bg-success" role="progressbar" style={{ width: "60%" }} aria-valuenow="60" aria-valuemin="0" aria-valuemax="100"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                ) : (<div class="contentbar">
                    <center style={{ color: 'red' }}>Your account is under verification...!!</center>

                </div>)}



            </>
        );
    }
}
export default Dashboard;