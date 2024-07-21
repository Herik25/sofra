import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import $ from 'jquery';
import { Helmet } from "react-helmet";
class Thankyou extends Component {
    constructor(props) {
        super(props);
        //console.log(this.props)
        // const device_type = this.props.match.params.device_type;
        // if (this.props.match.params.device_type) {
        //     localStorage.setItem('device_type', device_type);
        // } else {

        //     localStorage.setItem('device_type', 'web');
        // }

        // this.get_living_experience();
        // this.initialState = {
        //     form_data: {
        //         living_experience: ''
        //     },
        //     error: ''
        // }

    }
    componentDidMount() {

    }


    render() {
        return (
            <>
                <Helmet>

                    <link rel="stylesheet" href="/assets/css/custom.css" />
                    <link rel="stylesheet" href="/assets/css/mobile.css" />
                    <script src="/assets/js/slider.js"></script>

                    <script src="/assets/js/custom.js"></script>
                </Helmet>
                <div class="livingexperience-page">
                    <div class="le-banner">
                        <div class="swiper-container">
                            <div class="swiper-wrapper">
                                <div class="swiper-slide">
                                    <div class="le-cover" style={{ background: "url(assets/images/addBanner-1.jpg)" }} ></div>
                                    <div class="container">
                                        <div class="le-banner-content">
                                            <div class="projectList-title"><h2>Thank you for shopping with us</h2></div>
                                            <NavLink exact to="/Home/"><button type="submit" id="Profile_disabled" class="btn btn-primary">Explore More</button></NavLink>

                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>
            </>
        )
    }
}
export default Thankyou;