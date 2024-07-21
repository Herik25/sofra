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
import Loader from "react-loader";

class ShopByCategory extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        this.validator = new SimpleReactValidator();

        var user_id = user_data ? user_data.u_id : '';


        this.initialState = {
            form_data: {
                shop_by_category: [],

            },
            u_id: user_id,

            shop_by_sub_room: [],
            error: '',
            loaded: false
        }

        this.state = this.initialState;
        this.get_shop_by_category();

    }



    componentDidMount() {

    }

    onLoadMore() {

        return false
    }

    async get_shop_by_sub_room(id) {


        api_option.url = 'get_shop_by_sub_room';

        api_option.headers.Authorization = sessionStorage.getItem('token');
        api_option.data = { room_id: id };
        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {
                    var shop_by_data = res.data.data;
                    if (shop_by_data) {
                        this.setState(this.state.shop_by_sub_room = shop_by_data);
                    }

                } else {
                }
            })
            .catch(error => {
            });

    }

    async get_shop_by_category(props) {
        this.setState({ loaded: false });
        api_option.url = 'get_shop_by_category';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {
                    var shop_by_data = res.data.data;
                    this.setState(this.state.form_data.shop_by_category = shop_by_data);

                } else {
                }
            })
            .catch(error => {
            });

    }




    render() 
    {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>
                <Helmet>

                </Helmet>


                <Loader
                    loaded={this.state.loaded}
                    lines={15}
                    length={20}
                    width={10}
                    radius={30}
                    corners={1}
                    rotate={0}
                    direction={1}
                    color="#fff"
                    speed={1}
                    trail={60}
                    shadow={true}
                    hwaccel={false}
                    className="spinner"
                    position="fixed"
                    zIndex={2e9}
                    top="50%"
                    left="50%"
                    scale={0.5}
                    loadedClassName="loadedContent"
                />


                <div class="category-wrapper">
                    <div class="container">
                        <div class="text-center">
                            <h1 class="title">Shop By Category</h1>
                        </div>

                        <div class="category-grid">
                            {Object.entries(this.state.form_data.shop_by_category).map(([o, p]) => (
                                <div class="category-item">
                                    <div class="cat-img"><Link to={`/Living-Room/${p.pc_id}`}><img src={p.pc_image} /></Link></div>
                                    <div class="cat-list">
                                        <Link to={`/Living-Room/${p.pc_id}`}><h5>{p.pc_title}</h5></Link>
                                        {Object.entries(this.state.form_data.shop_by_category[o].sub_category).map(([o, pc]) => (
                                            <Link to={`/Living-Room/${pc.sc_id}`}>{pc.sc_title}</Link>
                                        ))}
                                        <a href="#" onClick={this.onLoadMore.bind()}>Load More</a>
                                    </div>

                                </div>
                            ))}
                        </div>

                    </div>
                </div>



            </>
        );
    }
}
export default ShopByCategory;