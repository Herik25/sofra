import React, { Component } from 'react';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail, web_url } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import { Helmet } from "react-helmet";
import { appendScript } from '../utils/appendScript'
class Footer extends Component {
    constructor(props) {
        super(props);

        this.get_cms_data();
        this.get_article_data();
        this.footerState = {
            footer_form_data: {
                cms_data: '',
                article_data: ''
            },
            form_data: {
                emailss: ''
            },
            error: ''
        }
        const currentURL = window.location.href;

        this.state = {
            currentURL: currentURL,
        }
    }
    componentDidMount() {
        // setTimeout(() => {
        //     $('.dropdown-toggle').dropdown();
        //     $(".data_toggle_new").toggle();
        // }, 1000);
        appendScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js" + "?ts=" + new Date().getTime());
        appendScript("https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js" + "?ts=" + new Date().getTime());
        appendScript("/assets/js/dropdown_toggle.js" + "?ts=" + new Date().getTime());
    }



    openSellerLogin() {
        // window.location.href +
        // window.open(web_url + "Seller-login", "", "width=1200,height=800");
        window.open(web_url + "Seller-login", "_blank");

    }
    openProfessionalLogin() {

        // window.open(web_url + "Professional-login", "", "width=1200,height=800");
        window.open(web_url + "Professional-login", "_blank");
    }

    async get_cms_data() {
        api_option.url = 'get_front_cms_list';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    var cms_data = res.data.data;
                    this.setState(this.footerState.footer_form_data.cms_data = cms_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    async get_article_data() {
        // api_option.url = 'get_front_article_list';
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

    handleSubscribe() {
        const validateEmail = (email) => {
            return email.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        };
        var email = $("#emailss").val()
        if (email != '' && validateEmail(email)) {
            api_option.url = 'email_subscribe';
            api_option.data = { email: email };
            api_option.headers.Authorization = sessionStorage.getItem('token');
            axios(api_option)
                .then(res => {
                    const res_data = res.data;
                    if (res_data.status) {
                        $("#emailss").val('');
                        toast.success('Thank You. Your Email ID is successfully added to our newsletter');
                    } else {
                        toast.error('Something went wrong');
                    }
                })
                .catch(error => {
                    //this.setState({ redirect: '/logout' });
                });
        } else {
            toast.error('Please enter valid email id');
        }

    }
    render() {
        return (
            <>
                {localStorage.getItem('device_type') == 'web' && <footer>
                    <div className="container">
                        <div className="footer-top">
                            <div className="row">
                                <div className="col-md-3">
                                    <img src="/assets/images/logo.png" className="ft-logo" />
                                    <p className="ft-dec">Shorfa is a one stop
                                        platform for space
                                        owners, professionals
                                        and sellers. Through
                                        Shorfa, people can find
                                        and share projects,
                                        experiences and
                                        products.</p>
                                    <ul className="social">
                                        <li><a href="https://www.instagram.com/shorfa.co/" target="_blank"><img src="/assets/images/instagram.svg" /></a></li>
                                        {/* https://www.linkedin.com/company/shorfa/ */}
                                        <li><a href="https://www.linkedin.com/company/86445240/admin/?feedType=following" target="_blank"><img src="/assets/images/linkedin.svg" /></a></li>
                                        <li><a href="https://www.youtube.com/channel/UC0hUW4sv9H4oL367Eoiq_lQ" target="_blank"><img src="/assets/images/youtube.svg" /></a></li>
                                        <li><a href="https://www.facebook.com/shorfa.co/" target="_blank"><img src="/assets/images/facebook.svg" /></a></li>
                                    </ul>
                                    <p className="copyrights">© 2020 Shorfa - All rights reserved</p>
                                </div>

                                <div className="col-md-2">
                                    <span className="ft-title">Company</span>

                                    <ul className="ft-links">


                                        {Object.entries(this.footerState.footer_form_data.cms_data).map(([j, p]) => (
                                            <>
                                                {p.cms_id != 6 && <li>
                                                    <a onClick={() => { window.location.href = web_url + "detail/" + p.cms_slug; }} style={{ cursor: 'pointer' }}>
                                                        {p.cms_title}
                                                    </a>
                                                    {/*  */}
                                                    {/* <Link to={`/detail/${p.cms_slug}`}>{p.cms_title}</Link> */}
                                                </li>}
                                            </>
                                        ))}

                                        <NavLink className="icon-list" exact to={'/contact/'}>Contact Us</NavLink>

                                    </ul>
                                </div>
                                <div className="col-md-2">
                                    <span className="ft-title">Business Services</span>

                                    <ul className="ft-links">

                                        {localStorage.getItem('type') == 3 && is_login() && <NavLink className="icon-list" exact to={'/My-account/'}>Seller Profile
                                        </NavLink>}

                                        {!is_login() && <a href="javascript:void(0)"><span className="icon-list" onClick={this.openSellerLogin}>Become a Seller
                                        </span></a>
                                        }

                                        {localStorage.getItem('type') == 2 && is_login() && <NavLink className="icon-list" exact to={'/Professional-profile/'}>Professional Profile
                                        </NavLink>}

                                        {!is_login() && <a href="javascript:void(0)"><span className="icon-list" onClick={this.openProfessionalLogin}>Become a Professional
                                        </span></a>}

                                        <NavLink className="icon-list" exact to={'/question-list/'}>Ask a Question</NavLink>

                                        <NavLink className="icon-list" exact to={'/payment_form/'}>Subscription Payment</NavLink>

                                    </ul>

                                </div>
                                <div className="col-md-2">
                                    <span className="ft-title">News and Info</span>
                                    <ul className="ft-links">
                                        {Object.entries(this.footerState.footer_form_data.article_data).map(([j, p]) => (
                                            <li>
                                                <a onClick={() => { window.location.href = web_url + "acrticle_detail/" + p.article_id; }} style={{ cursor: 'pointer' }}>{p.article_title}</a>
                                                {/* <Link to={`/acrticle_detail/${p.article_id}`}>{p.article_title}</Link> */}
                                            </li>
                                        ))}
                                        {/* <li><Link to={`/acrticle_detail/1`}>View All</Link></li> */}
                                    </ul>
                                </div>
                                <div className="col-md-3">
                                    <span className="ft-title">Our Newsletter</span>
                                    <div className="subscribeBox">

                                        <i className="bi bi-envelope-open"></i>

                                        <input type="email" name="emailss" id="emailss" placeholder="Email" data-validation="required email" onChange={this.handleChange} />
                                        <button className="btn btn-primary" onClick={this.handleSubscribe}>Subscribe</button>
                                    </div>
                                    <p class="ft-dec">Join our ever growing
                                        community and sign
                                        up to receive our
                                        latest updates directly
                                        to your inbox.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
                }
            </>
        );
    }

}

export default Footer;
