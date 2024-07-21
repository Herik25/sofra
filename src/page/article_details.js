import React, { Component, useState, useEffect } from 'react';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import $ from 'jquery';
import { Helmet } from "react-helmet";

class Detail extends Component {
    constructor(props) {
        super(props);
        this.get_article_data();
        const article_id = this.props.match.params.article_id;
        this.footerState = {
            footer_form_data: {
                detail_data: '',
                article_data: ''
            },
            error: ''
        }
        this.get_article_detail();

    }
    componentDidUpdate(prevProps) {
        //check if the route has changed
        if (this.props.location !== prevProps.location) {
            this.get_article_detail();
        }
    }
    componentDidMount() {

    }

    async get_article_detail() {
        const article_id = this.props.match.params.article_id;
        api_option.url = 'get_front_article_detail';
        api_option.data = { article_id: article_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var detail_data = res.data.data;
                    console.log(detail_data)
                    this.setState(this.footerState.footer_form_data.detail_data = detail_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    async get_article_data() {
        api_option.url = 'get_front_article_list_all';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var article_data = res.data.data;
                    console.log(article_data);
                    this.setState(this.footerState.footer_form_data.article_data = article_data);
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }


    //view load home page
    render() {
        return (
            <>
                <Helmet>
                    <script src="/assets/js/home_init.js"></script>
                </Helmet>

                <div class="container">
                    <div class="s-rte">
                        <div class="row">
                            <div class="col-md-3 articleList">
                                <h3>Article List</h3><hr></hr>
                                {Object.entries(this.footerState.footer_form_data.article_data).map(([j, p]) => (
                                    //set li active class if article id is equal to current article id

                                    <li class={this.props.match.params.article_id == p.article_id ? 'active' : ''}>
                                        <NavLink exact to={`/acrticle_detail/${p.article_id}`}>{p.article_title}</NavLink>
                                    </li>
                                ))}
                            </div>
                            <div class="col-md-9">
                                <div class="row">
                                    <div class="col-md-12">
                                        <div class="bwp-top-bar">
                                            <div class="bwp-bar">
                                                <img style={{ height: "350px", width: "500px" }} src={this.footerState.footer_form_data.detail_data.article_image}></img>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-12">
                                        <h1 class="pg-title">{this.footerState.footer_form_data.detail_data.article_title}</h1>
                                    </div>
                                    <div class="col-md-12">
                                        <span dangerouslySetInnerHTML={{ __html: this.footerState.footer_form_data.detail_data.article_description }}></span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default Detail;