import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import $ from 'jquery';
import { Helmet } from "react-helmet";
class Detail extends Component {
    constructor(props) {
        super(props);
        const cms_id = this.props.match.params.cms_id;

        this.footerState = {
            footer_form_data: {
                detail_data: ''
            },
            error: ''
        }
        this.get_cms_detail();
    }

    componentDidMount() {

    }

    async get_cms_detail() {
        const cms_id = this.props.match.params.cms_id;

        api_option.url = 'get_front_cms_detail';
        api_option.data = { cms_id: cms_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    var detail_data = res.data.data;
                    this.setState(this.footerState.footer_form_data.detail_data = detail_data);

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

                <div class="container container-small">
                    <div class="s-rte">
                        <div class="bwp-top-bar">
                            <div class="bwp-bar">
                                <h1 class="pg-title">{this.footerState.footer_form_data.detail_data.cms_title}</h1>
                            </div>
                        </div>
                        <span dangerouslySetInnerHTML={{ __html: this.footerState.footer_form_data.detail_data.cms_description }}></span>
                    </div>
                </div>

            </>
        );
    }
}


export default Detail;
