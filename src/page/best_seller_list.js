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

class BestSellerList extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        this.validator = new SimpleReactValidator();

        var user_id = user_data ? user_data.u_id : '';


        this.initialState = {
            form_data: {
                best_seller: [],
            },
            u_id: user_id,


            error: '',
        }

        this.state = this.initialState;
        this.get_front_best_seller();

    }



    componentDidMount() {

    }

    async get_front_best_seller(props) {

        api_option.url = 'get_front_best_seller';

        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {
                    var shop_by_data = res.data.data;
                    this.setState(this.state.form_data.best_seller = shop_by_data);
                } else {
                }
            })
            .catch(error => {
            });

    }




    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>
                <Helmet>

                </Helmet>

                <div class="room-wrapper">
                    <div class="container">
                        <div class="bwp-top-bar">
                            <div class="bwp-bar">
                                <h1 class="pg-title">Sellers</h1>
                            </div>
                        </div>
                        <div className='row'>
                            {Object.entries(this.state.form_data.best_seller).map(([o, p]) => (
                                <div className='col-md-4'>
                                    <Link to={`/Seller-detail/${p.u_id}`}>
                                        <div className='room-item'>
                                            <img className='seller-image' src={p.u_image ? p.u_image : '/assets/images/placeholder.png'} />
                                        </div>
                                        <h4>{p.u_name} <small className='float-right'><i className='fa fa-pin'></i> {p.u_city ? p.u_city + ", " : ""} {p.u_country}</small></h4>
                                    </Link>
                                </div>
                            ))}

                        </div>
                        {/* <div class="room-grid">
                            {Object.entries(this.state.form_data.best_seller).map(([o, p]) => (
                                <div class="room-item">
                                    <Link to={`/Seller-detail/${p.u_id}`}>
                                        <img className='seller-image' src={p.u_image ? p.u_image : '/assets/images/placeholder.png'} />
                                        <span>{p.u_name}</span>
                                    </Link>
                                </div>
                            ))}

                        </div> */}
                    </div>
                </div>



            </>
        );
    }
}
export default BestSellerList;