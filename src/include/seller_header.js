import React, { Component } from 'react';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { api_option, setUserSession, is_login, getUserDetail } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import { Helmet } from "react-helmet";
import $ from 'jquery';
import Modal from 'react-bootstrap/Modal';
// import Select from 'react-select';
// import $ from 'jquery';

class Seller_header extends Component {
    constructor(props) {
        super(props);

        this.validator = new SimpleReactValidator();
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';
        if (user_data) {
            if (user_data.u_is_approved == '1') {
                var is_approved = 1;
            } else {
                var is_approved = 0;
            }
        } else {
            var is_approved = 0;
        }


        // login form data
        this.initialState = {
            form_data: { email: '', password: '' },
            approved_form_data: { is_approved: is_approved },
            forgot_form_data: { email: '' },
            register_form_data: { name: '', email: '', password: '' },
            otp_form_data: { otp: '' },
            forgot_password: 'none',
            sign_in_form: 'flex',
            sign_up_form: 'flex',
            otp_verification: 'none',
            redirect: '',
            error: '',
            show_logout: false
        }
        this.state = this.initialState;
        this.handleLogout = this.handleLogout.bind(this);
        this.get_profile_data(user_id);
        this.handleLogoutFinal = this.handleLogoutFinal.bind(this);

        this.openLogoutModal = this.openLogoutModal.bind(this);
        this.hideLogoutModal = this.hideLogoutModal.bind(this);
    }

    openLogoutModal(e) {
        this.setState({ show_logout: true });
    }

    hideLogoutModal(e) {
        e.preventDefault();
        this.setState({ show_logout: false });
    }
    async handleLogoutFinal() {
        if (localStorage.getItem('device_type') && localStorage.getItem('device_type') == "ios") {
            // if (window.confirm("Are you sure to logout?")) {
            window.webkit.messageHandlers.callback.postMessage('{"action":"do_logout"}');
            this.setState({ redirect: '/logout' });
            // }

        } else {
            // if (window.confirm("Are you sure to logout?")) {
            this.setState({ redirect: '/logout' });
            // }
        }
        /* if (localStorage.getItem('device_type') && localStorage.getItem('device_type') == "ios") {
            window.webkit.messageHandlers.callback.postMessage('{"action":"do_logout"}');
            this.setState({ redirect: '/logout' });
        } else {
            this.setState({ redirect: '/logout' });
        } */
        // this.setState({ redirect: '/logout' });
    }
    componentDidMount() {
        //  $(".icon-item").addClass("show");
    }
    handleLogout(event) {
        /* if (localStorage.getItem('device_type') && localStorage.getItem('device_type') == "ios") {
            if (window.confirm("Are you sure to logout?")) {
                window.webkit.messageHandlers.callback.postMessage('{"action":"do_logout"}');
                this.setState({ redirect: '/logout' });
            }

        } else {
            if (window.confirm("Are you sure to logout?")) {
                this.setState({ redirect: '/logout' });
            }
        } */

        this.setState({ show_logout: true });
        // window.$("#logoutModal").modal("show");

    }

    handleClick(event) {
        if ($(".visgh").length > 0) {
            toast.error('Please click on publish button to update your product');
            event.preventDefault();
        }
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



                        var data = th.state.approved_form_data.is_approved = res.data.profile_detail.u_is_approved;
                        th.setState({ data });
                    }
                })
                .catch(error => {
                    this.setState({ redirect: '/logout' });
                });
        }
        //console.log(this.state.approved_form_data.is_approved)
    }


    // view load header page
    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>
                <Helmet>
                    <script type="text/javascript" src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"></script>
                    <script src="/assets/js/home_init.js"></script>
                    <link rel="stylesheet" href="/assets/css/rtl.css" />
                    {/* Put css and js into */}
                </Helmet>
                <ToastContainer />


                <div class="leftbar">
                    <div class="sidebar">
                        <div class="logobar">
                            <img src="/assets/seller/images/logo.png" class="img-fluid" alt="logo"  />
                            <NavLink className="logo logo-small" exact to='/Home'><img src="/assets/seller/images/logo.png" class="img-fluid" alt="logo" width="30px" /></NavLink>

                            {/* <img src="/assets/seller/images/logo.png" class="img-fluid" alt="logo" width="90px" /> */}


                        </div>
                        <div class="navigationbar">
                            {this.state.approved_form_data.is_approved == 1 ? (
                                <ul class="vertical-menu">
                                    <li>
                                        <NavLink onClick={this.handleClick.bind(this)} className="icon-item" exact to={'/Dashboard/'}>
                                            <img src="/assets/seller/images/svg-icon/tables.svg" class="img-fluid" alt="dashboard" /><span>Dashboard</span><i class="feather icon-chevron-right pull-right"></i>
                                        </NavLink>
                                    </li>

                                    <li>
                                        <NavLink onClick={this.handleClick.bind(this)} className="icon-item" exact to={'/My-Account'}>
                                            <img src="/assets/seller/images/svg-icon/user.svg" class="img-fluid" alt="dashboard" /><span>My Profile</span><i class="feather icon-chevron-right pull-right"></i>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink onClick={this.handleClick.bind(this)} className="icon-item" exact to={'/Orders'}>
                                            <img src="/assets/seller/images/svg-icon/ecommerce.svg" class="img-fluid" alt="order" /><span>Orders</span><i class="feather icon-chevron-right pull-right"></i>
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink onClick={this.handleClick.bind(this)} exact to={'/ProductList'}>
                                            <img src="/assets/seller/images/svg-icon/basic.svg" class="img-fluid" alt="product" /><span>Products</span><i class="feather icon-chevron-right pull-right"></i>
                                        </NavLink>
                                    </li>
                                    {<li>
                                        <NavLink onClick={this.handleClick.bind(this)} exact to={'/ProjectList'}>
                                            <img src="/assets/seller/images/svg-icon/dashboard.svg" class="img-fluid" alt="projects" /><span>Projects</span><i class="feather icon-chevron-right pull-right"></i>
                                        </NavLink>
                                    </li>}
                                    {/* <li>
                                        <NavLink onClick={this.handleClick.bind(this)} exact to={'/Reports'}>
                                            <img src="/assets/seller/images/svg-icon/chart.svg" class="img-fluid" alt="reports" /><span>Reports</span><i class="feather icon-chevron-right pull-right"></i>
                                        </NavLink>
                                    </li> */}
                                    <li>
                                        <a onClick={this.handleLogout} style={{ cursor: "pointer" }}>
                                            <img src="/assets/seller/images/svg-icon/chart.svg" class="img-fluid" alt="reports" /><span>Logout</span><i class="feather icon-chevron-right pull-right"></i>
                                        </a>
                                    </li>
                                </ul>

                            ) : (
                                <ul class="vertical-menu">
                                    <li>
                                        <a onClick={this.handleLogout} style={{ cursor: "pointer" }}>
                                            <img src="/assets/seller/images/svg-icon/chart.svg" class="img-fluid" alt="reports" /><span>Logout</span><i class="feather icon-chevron-right pull-right"></i>
                                        </a>
                                    </li>
                                </ul>
                            )}
                            {/* <ul class="vertical-menu">
                                <li>

                                    <NavLink className="icon-item" exact to={'/Dashboard/'}>
                                        <img src="/assets/seller/images/svg-icon/tables.svg" class="img-fluid" alt="dashboard" /><span>Dashboard</span><i class="feather icon-chevron-right pull-right"></i>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink className="icon-item" exact to='#'>
                                        <img src="/assets/seller/images/svg-icon/ecommerce.svg" class="img-fluid" alt="order" /><span>Orders</span><i class="feather icon-chevron-right pull-right"></i>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink  exact to={'/ProductList/'}>
                                        <img src="/assets/seller/images/svg-icon/basic.svg" class="img-fluid" alt="product" /><span>Products</span><i class="feather icon-chevron-right pull-right"></i>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink  exact to={'/ProjectList/'}>
                                        <img src="/assets/seller/images/svg-icon/dashboard.svg" class="img-fluid" alt="projects" /><span>Projects</span><i class="feather icon-chevron-right pull-right"></i>
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink  exact to='#'>
                                        <img src="/assets/seller/images/svg-icon/chart.svg" class="img-fluid" alt="reports" /><span>Reports</span><i class="feather icon-chevron-right pull-right"></i>
                                    </NavLink>
                                </li>
                            </ul> */}
                        </div>
                    </div>
                </div >
                <Modal show={this.state.show_logout} id="new-forum" onHide={this.hideLogoutModal}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Confirm Logout</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.hideLogoutModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure to logout?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.hideLogoutModal}>No</button>
                            <button onClick={this.handleLogoutFinal} data-dismiss="modal" className="btn btn-primary">Yes</button>
                        </div>
                    </div>
                </Modal>
                {/* <div className="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Confirm Logout</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure to logout?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">No</button>
                                <button onClick={this.handleLogoutFinal} data-dismiss="modal" className="btn btn-primary">Yes</button>
                            </div>
                        </div>
                    </div>
                </div> */}

            </>
        );
    }
}
export default Seller_header;
