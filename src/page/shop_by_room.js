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

class ShopByRoom extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        this.validator = new SimpleReactValidator();

        var user_id = user_data ? user_data.u_id : '';


        this.initialState = {
            form_data: {
                shop_by_room: [],
            },
            u_id: user_id,


            error: '',
        }

        this.state = this.initialState;
        this.get_shop_by_room();

    }



    componentDidMount() {

    }

    async get_shop_by_room(props) {

        api_option.url = 'get_shop_by_room';

        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {
                    var shop_by_data = res.data.data;
                    this.setState(this.state.form_data.shop_by_room = shop_by_data);

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

                <div class="category-wrapper">
                    <div class="container">
                        <div class="bwp-top-bar">
                            <div class="bwp-bar">
                                <h1 class="pg-title">Shop By Rooms</h1>
                            </div>
                        </div>
                        <div className='row justify-content-center'>
                            {Object.entries(this.state.form_data.shop_by_room).map(([o, p]) => (
                                <div class="col-md-4">
                                    <div class="catbox mb-5">
                                        <Link to={`/shop-by-subcat/${p.pc_id}`}>
                                            <img src={p.pc_image} />
                                            <span>{p.pc_title}</span>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>


                        {/* <div class="room-item">
                                <a href="">
                                    <img src="/assets/images/rooms/livingRoom.jpg" />
                                    <span>Living Room</span>
                                </a>
                            </div>
                            <div class="room-item">
                                <a href="">
                                    <img src="/assets/images/rooms/bathroom.jpg" />
                                    <span>Bathroom</span>
                                </a>
                            </div>
                            <div class="room-item">
                                <a href="">
                                    <img src="/assets/images/rooms/childrenRoom.jpg" />
                                    <span>Children Room</span>
                                </a>
                            </div>
                            <div class="room-item">
                                <a href="">
                                    <img src="/assets/images/rooms/dining.jpg" />
                                    <span>Dining</span>
                                </a>
                            </div>
                            <div class="room-item">
                                <a href="">
                                    <img src="/assets/images/rooms/kitchen.jpg" />
                                    <span>Kitchen</span>
                                </a>
                            </div>
                            <div class="room-item">
                                <a href="">
                                    <img src="/assets/images/rooms/hallway.jpg" />
                                    <span>Hallway</span>
                                </a>
                            </div>
                            <div class="room-item">
                                <a href="">
                                    <img src="/assets/images/rooms/outdoor.jpg" />
                                    <span>Outdoor</span>
                                </a>
                            </div>
                            <div class="room-item">
                                <a href="">
                                    <img src="/assets/images/rooms/office.jpg" />
                                    <span>Office</span>
                                </a>
                            </div> */}

                    </div>
                </div>



            </>
        );
    }
}
export default ShopByRoom;