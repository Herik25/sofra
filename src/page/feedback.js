import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession, web_url, getUserDetail } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import Loader from "react-loader";
import { Helmet } from "react-helmet";
// import Select from 'react-select';
import $ from 'jquery';
import { PayPalButton } from "react-paypal-button-v2";
// import { Helmet } from "react-helmet";
class Feedback extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();


        // login form data

        this.initialState = {
            subscription_payment_price: 0,
            form_data: { uname: '', company: '', email: '', mobile: '', message: '' },
            payment_btn_show: 0,
            payment_id: 0,
            error: '',
            loaded: true,
            paypal_price: 0,
        }

        this.footerState = {
            footer_form_data: {
                detail_data: ''
            },
            error: ''
        }

        this.state = this.initialState;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

        this.get_settings_data();
    }

    componentDidMount() {

    }



    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
    }




    // form submit event
    handleSubmit(event) {

        event.preventDefault();
        if (!this.validator.allValid()) {
            this.validator.showMessages();
            this.forceUpdate();
        } else {
            this.setState({ loaded: false });
            api_option.url = 'add_feedback';
            api_option.data = this.state.form_data;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        $('#message').val('');
                        toast.success('Feedback added successfully.');

                        // this.setState({ redirect: '/contact' });
                    } else {

                        toast.error(res.data.message);

                        //this.setState({error:res_data.message});
                    }
                })
                .catch(error => console.log(error));
        }
    }

    async get_settings_data() {
        api_option.url = 'settings_data';
        api_option.data = {};
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var data = this.state['subscription_payment_price'] = res.data.settings_data.subscription_payment_price;
                    this.setState({ data });
                    this.convert_to_usd();
                } else {
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }




    // view load header page
    render() {

        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }

        return (
            <>
                <Helmet>
                    <script src="/assets/js/accordion.js"></script>
                </Helmet>
                <ToastContainer />
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
                <div class="bg-blue">
                    <div class="container">
                        {/* projects-cat */}
                        <div class="p-3">
                            <div class="pCat-title w-100">
                                <span>Feedback</span>
                            </div>
                        </div>
                        <div class="p-3">

                        </div>
                    </div>
                </div>
                <div className="contact-main mt-5">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-7 m-auto">



                                <form id="kt_login_signin_form" onSubmit={this.handleSubmit}>

                                    <div className="form-group">
                                        <label>Message</label>
                                        <textarea type="text" name="message" className="text-control" id="message" onChange={this.handleChange}>{this.state.form_data.message}</textarea>


                                        {this.validator.message('Message', this.state.form_data.message, 'required')}
                                    </div>


                                    <button className="btn btn-primary btn-block">Send Feedback</button>
                                </form>

                            </div>
                        </div>
                    </div>
                </div>






            </>
        );
    }
}
export default Feedback;
