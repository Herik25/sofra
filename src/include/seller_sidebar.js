import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession, is_login, getUserDetail } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import { Helmet } from "react-helmet";
// import Select from 'react-select';
import $ from 'jquery';

class Seller_sidebar extends Component {
    constructor(props) {


        super(props);
        var user_data = getUserDetail();
        var user_name = user_data ? user_data.u_name : '';
        var user_id = user_data ? user_data.u_id : '';
        this.initialState = {
            user_name: user_name,
            form_data: {
                u_id: user_id,
            },
        }
        this.state = this.initialState;
        this.handleLogout = this.handleLogout.bind(this);
        this.handleLogoutFinal = this.handleLogoutFinal.bind(this);
        this.get_form_seller_data();
    }

    async handleLogoutFinal() {
        this.setState({ redirect: '/logout' });

    }
    componentDidMount() {

    }
    handleLogout(event) {
        window.$("#logoutModal").modal("show");

    }

    handleClick(event) {
        alert($(".visgh").length)
        if ($(".visgh").length > 0) {
            toast.error('Please click on publish button to update your product');
            event.preventDefault();
        }
    }

    async get_form_seller_data() {

        api_option.url = 'get_sell_profile';
        api_option.data = { id: this.state.form_data.u_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    const th = this;
                    var res_data = res.data.data;
                    this.setState(this.state.form_data = res.data.data);

                    // this.setState({ redirect: '/My-profile/' });
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }


    // view load header page
    render() {

        return (
            <>
                <Helmet>
                    <script src="/assets/js/dropdown_toggle.js"></script>
                </Helmet>
                <div class="topbar-mobile">
                    <div class="row align-items-center">
                        <div class="col-md-12">
                            <div class="mobile-logobar">
                                <NavLink exact to='/Home' class="mobile-logo"><img src="/assets/seller/images/logo.png" class="img-fluid" alt="logo" width="30" /></NavLink>
                            </div>
                            <div class="mobile-togglebar">
                                <ul class="list-inline mb-0">
                                    <li class="list-inline-item">
                                        <div class="topbar-toggle-icon">
                                            <a class="topbar-toggle-hamburger" href="javascript:void();">
                                                <img src="/assets/seller/images/svg-icon/horizontal.svg" class="img-fluid menu-hamburger-horizontal" alt="horizontal" />
                                                <img src="/assets/seller/images/svg-icon/verticle.svg" class="img-fluid menu-hamburger-vertical" alt="verticle" />
                                            </a>
                                        </div>
                                    </li>
                                    <li class="list-inline-item">
                                        <div class="menubar">
                                            <a class="menu-hamburger" href="javascript:void();">
                                                <img src="/assets/seller/images/svg-icon/collapse.svg" class="img-fluid menu-hamburger-collapse" alt="collapse" />
                                                <img src="/assets/seller/images/svg-icon/close.svg" class="img-fluid menu-hamburger-close" alt="close" />
                                            </a>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="topbar">
                    <div class="row align-items-center">
                        <div class="col-md-12 align-self-center">
                            <div class="togglebar">
                                <ul class="list-inline mb-0">
                                    <li class="list-inline-item">
                                        <div class="menubar">
                                            <a class="menu-hamburger" href="javascript:void();">
                                                <img src="/assets/seller/images/svg-icon/collapse.svg" class="img-fluid menu-hamburger-collapse" alt="collapse" />
                                                <img src="/assets/seller/images/svg-icon/close.svg" class="img-fluid menu-hamburger-close" alt="close" />
                                            </a>
                                        </div>
                                    </li>
                                    {/* <li class="list-inline-item">
                                        <div class="searchbar">
                                            <form>
                                                <div class="input-group">
                                                    <input type="search" class="form-control" placeholder="Search" aria-label="Search" aria-describedby="button-addon2" />
                                                    <div class="input-group-append">
                                                        <button class="btn" type="submit" id="button-addon2"><img src="/assets/seller/images/svg-icon/search.svg" class="img-fluid" alt="search" /></button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </li> */}
                                </ul>
                            </div>
                            <div class="infobar">
                                <ul class="list-inline mb-0">
                                    <li class="list-inline-item">
                                        <div class="notifybar">
                                            <div class="dropdown">
                                                <a class="dropdown-toggle infobar-icon" href="#" role="button" id="notoficationlink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="/assets/seller/images/svg-icon/notifications.svg" class="img-fluid" alt="notifications" />
                                                    <span class="live-icon"></span></a>
                                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="notoficationlink">
                                                    <div class="notification-dropdown-title">
                                                        <h4>Notifications</h4>
                                                    </div>
                                                    <ul class="list-unstyled">
                                                        <li class="media dropdown-item">
                                                            <span class="action-icon badge badge-primary-inverse"><i class="feather icon-dollar-sign"></i></span>
                                                            <div class="media-body">
                                                                <h5 class="action-title">RO 135 received</h5>
                                                                <p><span class="timing">Today, 10:45 AM</span></p>
                                                            </div>
                                                        </li>
                                                        <li class="media dropdown-item">
                                                            <span class="action-icon badge badge-success-inverse"><i class="feather icon-file"></i></span>
                                                            <div class="media-body">
                                                                <h5 class="action-title">Project X prototype approved</h5>
                                                                <p><span class="timing">Yesterday, 01:40 PM</span></p>
                                                            </div>
                                                        </li>
                                                        <li class="media dropdown-item">
                                                            <span class="action-icon badge badge-danger-inverse"><i class="feather icon-eye"></i></span>
                                                            <div class="media-body">
                                                                <h5 class="action-title">John requested to view wireframe</h5>
                                                                <p><span class="timing">3 Sep 2019, 05:22 PM</span></p>
                                                            </div>
                                                        </li>
                                                        <li class="media dropdown-item">
                                                            <span class="action-icon badge badge-warning-inverse"><i class="feather icon-package"></i></span>
                                                            <div class="media-body">
                                                                <h5 class="action-title">Sports shoes are out of stock</h5>
                                                                <p><span class="timing">15 Sep 2019, 02:55 PM</span></p>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                    <li class="list-inline-item">
                                        <div class="profilebar">
                                            <div class="dropdown">
                                                {this.state.form_data.u_image != '' ?
                                                    <a class="dropdown-toggle" href="#" role="button" id="profilelink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src={this.state.form_data.u_image} class="img-fluid" id="seller_image_id" alt="profile" /><span class="feather icon-chevron-down live-icon"></span></a>
                                                    :
                                                    <a class="dropdown-toggle" href="#" role="button" id="profilelink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><img src="/assets/seller/images/users/profile.svg" id="seller_image_id" class="img-fluid" alt="profile" /><span class="feather icon-chevron-down live-icon"></span></a>
                                                }

                                                <div class="dropdown-menu dropdown-menu-right" aria-labelledby="profilelink">
                                                    <div class="dropdown-item">
                                                        <div class="profilename">
                                                            <h5>{this.state.user_name}</h5>
                                                        </div>
                                                    </div>
                                                    <div class="userbox">
                                                        {/* <ul class="list-unstyled mb-0">
                                                            <li class="media dropdown-item">
                                                                <NavLink onClick={this.handleClick.bind(this)} exact to={'/My-account'} class="profile-icon"><img src="/assets/seller/images/svg-icon/user.svg" class="img-fluid" alt="user" />My Profile</NavLink>
                                                            </li> */}
                                                        {/* <li class="media dropdown-item">
                                                                <a onClick={this.handleLogout} style={{ cursor: "pointer" }} class="profile-icon"><img src="/assets/seller/images/svg-icon/logout.svg" class="img-fluid" alt="logout" />Logout</a>

                                                            </li> */}
                                                        {/* </ul> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
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
                                <p>Are you sure to logout?</p>
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
export default Seller_sidebar;
