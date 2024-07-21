import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession, is_login } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
// import Select from 'react-select';
import $ from 'jquery';
import Select from 'react-select';
import Loader from "react-loader";
import { Helmet } from "react-helmet";
// import { Helmet } from "react-helmet";

class SellerSignUp extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        // if (is_login()) {
        //     alert('login');
        // }else{
        //     alert('logout');
        // }

        // login form data

        this.initialState = {
            form_data: { email: '', password: '', country_id: '', state_id: '', city_id: '' },
            dashboard_form_data: {
                ts_id: 1,
                ts_title: '',
                ts_b_image: '',
                image: [],
                ts_desc: '',

                ts_icon1: '',
                icon1: [],
                ts_icon2: '',
                icon2: [],
                ts_icon3: '',
                icon3: [],
                ts_title1: '',
                ts_desc1: '',
                ts_title2: '',
                ts_desc2: '',
                ts_title3: '',
                ts_desc3: '',
            },
            country_list: [],
            state_list: [],
            city_list: [],
            error: '',
            loaded: true
        }

        this.state = this.initialState;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChangeCountry = this.handleChangeCountry.bind(this);
        // this.handleChangeState = this.handleChangeState.bind(this);
        this.handleChangeCity = this.handleChangeCity.bind(this);
        this.get_form_data();
        this.country_list_dropdown();
    }

    componentDidMount() {

    }

    async handleChangeCountry(event) {

        const name = event.lable;
        const value = event.value;
        var data = this.state.form_data['country_id'] = { label: event.label, value: value };
        this.setState({ data });

        if (value != "") {
            api_option.url = 'state_list_dropdown';
            ;
            api_option.data = { country_id: value };
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        var fnldata = [];
                        $.each(res.data.state_list, function (i, item) {
                            var temparr = new Object;
                            temparr['value'] = res.data.state_list[i].id;
                            temparr['label'] = res.data.state_list[i].text;
                            fnldata.push(temparr);
                        });
                        this.setState({ state_list: fnldata });
                    } else {
                        this.setState({ redirect: '/home/' });
                    }

                })
                .catch(error => {
                    //this.setState({ redirect: '/logout' });
                });
        } else {
            this.setState({ state_list: {} });
        }
    }
    async handleChangeState(event) {

        const name = event.lable;
        const value = event.value;
        var data = this.state.form_data['state_id'] = { label: event.label, value: value };
        this.setState({ data });

        if (value != "") {
            api_option.url = 'city_list_dropdown';
            ;
            api_option.data = { state_id: value };
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        var fnldata = [];
                        $.each(res.data.city_list, function (i, item) {
                            var temparr = new Object;
                            temparr['value'] = res.data.city_list[i].id;
                            temparr['label'] = res.data.city_list[i].text;
                            fnldata.push(temparr);
                        });
                        this.setState({ city_list: fnldata });
                    } else {
                        this.setState({ redirect: '/home/' });
                    }

                })
                .catch(error => {
                    //this.setState({ redirect: '/logout' });
                });
        } else {
            this.setState({ city_list: {} });
        }
    }
    async handleChangeCity(event) {

        const name = event.lable;
        const value = event.value;
        var data = this.state.form_data['city_id'] = { label: event.label, value: value };
        this.setState({ data });

    }

    country_list_dropdown() {

        api_option.url = 'country_list_dropdown';
        api_option.data = {};
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var fnldata = [];
                    $.each(res.data.country_list, function (i, item) {
                        var temparr = new Object;
                        temparr['value'] = res.data.country_list[i].id;
                        temparr['label'] = res.data.country_list[i].text;
                        fnldata.push(temparr);
                    });
                    this.setState({ country_list: fnldata });
                } else {
                    this.setState({ redirect: '/product/' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }

    //get edit form data
    async get_form_data(props) {

        api_option.url = 'get_sel_dashboard_detail';
        api_option.data = { id: 1 };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    this.setState(this.state.dashboard_form_data = res.data.data);

                } else {
                    this.setState({ redirect: '/sellerdashboard-manage/' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });

    }



    handleClick() {
        $(".pw-toggle").find("i").toggleClass("bi-eye bi-eye-slash");
        var input = $($('.pw-toggle').parents(".password-field").find("input"));
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
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
            api_option.url = 'save_seller_user_data';
            api_option.data = this.state.form_data;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        localStorage.setItem('selleremail', this.state.form_data.email);
                        this.state.form_data.email = '';
                        this.state.form_data.name = '';
                        this.state.form_data.password = '';
                        toast.success(res.data.message);

                        this.setState({ redirect: '/Seller-otp/' + res_data.seller_id });
                    } else {

                        toast.error(res.data.message);

                        // this.setState({error:res_data.message});
                    }
                })
                .catch(error => console.log(error));
        }

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
                <ToastContainer />
                <div className="seller-signup-wrapper" style={{ background: "unset", backgroundImage: "url('" + this.state.dashboard_form_data.ts_b_image + "')", backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                    <div className="container">
                        <div className="seller-hero">
                            <div className="seller-hero-content">
                                <h1>{this.state.dashboard_form_data.ts_title}</h1>
                            </div>
                            {/* <img src={this.state.dashboard_form_data.ts_b_image} className="seller-hero-object" alt="img" /> */}
                        </div>
                    </div>
                </div>

                <div className="seller-signup">
                    <div className="container">
                        <div className="row d-flex align-items-center justify-content-center">
                            <div className="col-md-5">
                                <div className="grid-1">
                                    <div className="feature-box">
                                        <div className="featurebox-img"><img src={this.state.dashboard_form_data.ts_icon1} /></div>
                                        <div className="featurebox-content">
                                            <h3>{this.state.dashboard_form_data.ts_title1}</h3>
                                            <p>{this.state.dashboard_form_data.ts_desc1}</p>
                                        </div>
                                    </div>
                                    <div className="feature-box">
                                        <div className="featurebox-img"><img src={this.state.dashboard_form_data.ts_icon2} /></div>
                                        <div className="featurebox-content">
                                            <h3>{this.state.dashboard_form_data.ts_title2}</h3>
                                            <p>{this.state.dashboard_form_data.ts_desc2}</p>
                                        </div>
                                    </div>
                                    <div className="feature-box">
                                        <div className="featurebox-img"><img src={this.state.dashboard_form_data.ts_icon3} /></div>
                                        <div className="featurebox-content">
                                            <h3>{this.state.dashboard_form_data.ts_title3}</h3>
                                            <p>{this.state.dashboard_form_data.ts_desc3}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 offset-md-1">
                                <form id="kt_login_signin_form" onSubmit={this.handleSubmit}>
                                    {/* <div className="form-group">
                                        <label>Select Country</label>
                                        <Select
                                            value={this.state.form_data.country_id}
                                            onChange={this.handleChangeCountry}
                                            isSearchable={true}
                                            options={this.state.country_list}
                                            id="country_id" name="country_id"
                                        />
                                        {this.validator.message('Country', this.state.form_data.country_id, 'required')}
                                    </div>

                                    <div className="form-group">
                                        <label>Select State</label>
                                        <Select
                                            value={this.state.form_data.state_id}
                                            onChange={this.handleChangeState}
                                            isSearchable={true}
                                            options={this.state.state_list}
                                            id="state_id" name="state_id"
                                        />
                                        {this.validator.message('State', this.state.form_data.state_id, 'required')}
                                    </div>

                                    <div className="form-group">
                                        <label>Select City</label>
                                        <Select
                                            value={this.state.form_data.city_id}
                                            onChange={this.handleChangeCity}
                                            isSearchable={true}
                                            options={this.state.city_list}
                                            id="city_id" name="city_id"
                                        />
                                        {this.validator.message('Country', this.state.form_data.city_id, 'required')}
                                    </div> */}

                                    <div className="form-group">
                                        <label>Full Name</label>
                                        <input type="text" className="text-control" name="name" id="name" placeholder="Full Name" data-validation="required email" value={this.state.form_data.name} onChange={this.handleChange} />
                                        {this.validator.message('Name', this.state.form_data.name, 'required')}
                                    </div>
                                    <div className="form-group">
                                        <label>Email ID</label>
                                        <input type="email" className="text-control" name="email" id="email" placeholder="Email" data-validation="required email" value={this.state.form_data.email} onChange={this.handleChange} />
                                        {this.validator.message('Email', this.state.form_data.email, 'required|email')}
                                    </div>
                                    <div className="form-group">
                                        <label>Password</label>
                                        <div class="password-field">
                                            <input type="password" className="text-control" name="password" id="password" placeholder="Password" data-validation="required" value={this.state.form_data.password} onChange={this.handleChange} />
                                            <span onClick={this.handleClick} class="pw-toggle"><i class="bi bi-eye"></i></span>
                                        </div>
                                        {/* <input type="password" className="text-control" name="password" id="password" placeholder="Password" data-validation="required" value={this.state.form_data.password} onChange={this.handleChange} /> */}
                                        {this.validator.message('Password', this.state.form_data.password, 'required')}
                                    </div>
                                    <div className="form-group">

                                        {/* <a href="javascript:void(0)" className="text-primary">Terms of Use</a> */}
                                        <small className="text-muted">By filling this form, I agree to <NavLink className="text-primary" exact to={'/detail/termsofuse'}>Terms of Use</NavLink></small>
                                    </div>
                                    <button className="btn btn-primary btn-block">Signup</button>
                                    <b> You already have an account ? please <NavLink className="icon-list" exact to={'/seller-login/'}>Sign in</NavLink></b>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="seller-faqs">
                    <div className="container">
                        <div className="row d-flex justify-content-center">
                            <div className="col-md-8">
                                <div className="title-section text-center">
                                    <h5 className="sub">FAQs</h5>
                                    <h2 className="title">Common Questions</h2>
                                </div>
                                <ul className="accordion">
                                    <li>
                                        <a className="ac-title">{this.state.dashboard_form_data.ts_question}</a>
                                        <div className="ac-content">
                                            <p>{this.state.dashboard_form_data.ts_answer}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <a className="ac-title">{this.state.dashboard_form_data.ts_question1}</a>
                                        <div className="ac-content">
                                            <p>{this.state.dashboard_form_data.ts_answer1}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <a className="ac-title">{this.state.dashboard_form_data.ts_question2}</a>
                                        <div className="ac-content">
                                            <p>{this.state.dashboard_form_data.ts_answer2}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <a className="ac-title">{this.state.dashboard_form_data.ts_question3}</a>
                                        <div className="ac-content">
                                            <p>{this.state.dashboard_form_data.ts_answer3}</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>


            </>
        );
    }
}
export default SellerSignUp;
