import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession, is_login } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import swal from 'sweetalert';
import { Helmet } from "react-helmet";
import Loader from "react-loader";
import Select from 'react-select';
class ProfessionalSignup extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        // login form data
        this.initialState = {
            form_data: { name: '', email: '', password: '' },
            dashboard_form_data: {
                tp_id: 1,
                tp_title: '',
                tp_b_image: '',
                image: [],
                tp_desc: '',
                tp_happy_customer: '',
                tp_service_category: '',
                tp_service_profession: '',
                tp_city: '',
                tp_image1: '',
                image1: [],
                tp_image2: '',
                image2: [],
                tp_icon1: '',
                icon1: [],
                tp_icon2: '',
                icon2: [],
                tp_icon3: '',
                icon3: [],
                tp_title1: '',
                tp_desc1: '',
                tp_title2: '',
                tp_desc2: '',
                tp_title3: '',
                tp_desc3: '',
            },
            country_list: [],
            state_list: [],
            city_list: [],
            error: '',
            loaded: true
        }

        this.state = this.initialState;
        this.handleSaveData = this.handleSaveData.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleChangeCountry = this.handleChangeCountry.bind(this);

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
            api_option.url = 'city_list_dropdown';
            ;
            api_option.data = { country_id: value };
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
    // async handleChangeState(event) {

    //     const name = event.lable;
    //     const value = event.value;
    //     var data = this.state.form_data['state_id'] = { label: event.label, value: value };
    //     this.setState({ data });

    //     if (value != "") {
    //         api_option.url = 'city_list_dropdown';
    //         ;
    //         api_option.data = { state_id: value };
    //         axios(api_option)
    //             .then(res => {
    //                 if (res.data.status) {

    //                     var fnldata = [];
    //                     $.each(res.data.city_list, function (i, item) {
    //                         var temparr = new Object;
    //                         temparr['value'] = res.data.city_list[i].id;
    //                         temparr['label'] = res.data.city_list[i].text;
    //                         fnldata.push(temparr);
    //                     });
    //                     this.setState({ city_list: fnldata });
    //                 } else {
    //                     this.setState({ redirect: '/home/' });
    //                 }

    //             })
    //             .catch(error => {
    //                 //this.setState({ redirect: '/logout' });
    //             });
    //     } else {
    //         this.setState({ city_list: {} });
    //     }
    // }
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

    handleClick() {
        $(".pw-toggle").find("i").toggleClass("bi-eye bi-eye-slash");
        var input = $($('.pw-toggle').parents(".password-field").find("input"));
        if (input.attr("type") == "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    }

    //get edit form data
    async get_form_data(props) {

        api_option.url = 'get_prof_dashboard_detail';
        api_option.data = { id: 1 };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    this.setState(this.state.dashboard_form_data = res.data.data);

                } else {
                    this.setState({ redirect: '/professionaldashboard-manage/' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });


    }



    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
    }

    handleSaveData(event) {
        event.preventDefault();
        if (!this.validator.allValid()) {
            this.validator.showMessages();
            this.forceUpdate();
        } else {
            this.setState({ loaded: false });
            api_option.url = 'save_professional_user_data';
            api_option.data = this.state.form_data;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        localStorage.setItem('professionalemail', this.state.form_data.email);

                        toast.success(res.data.message);
                        this.state.form_data.email = '';
                        this.state.form_data.name = '';
                        this.state.form_data.password = '';
                        //this.setState({ redirect: '/Setup-profile/' + res_data.professional_id });
                        this.setState({ redirect: '/Professional-otp/' + res_data.professional_id });
                        // this.setState({ redirect: '/Setup-profile/' + res_data.professional_id + '/' + 'test' });
                        //window.open('/Setup-profile/' + res_data.professional_id);
                    } else {
                        toast.error(res.data.message);

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
                    <script src="/assets/js/custom.js?12"></script>
                    <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js'></script>

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
                <div className="professional-signup-wrapper" style={{ background: "unset", backgroundImage: "url('" + this.state.dashboard_form_data.tp_b_image + "')", backgroundPosition: 'center', backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}>
                    <div className="container">
                        <div className="professional-hero">
                            <div className="professional-hero-content">
                                <h1>{this.state.dashboard_form_data.tp_title}</h1>
                                <p>{this.state.dashboard_form_data.tp_desc}</p>
                                {/* <a href="javascript:void(0)">
                                    <div className="video-button">
                                        <span className="play-icon"></span>
                                        <span>Learn More</span>
                                    </div>
                                </a> */}
                            </div>
                            {/* <img src={this.state.dashboard_form_data.tp_b_image} className="professional-hero-object" /> */}

                        </div>
                    </div>
                </div>
                <div className="clearfix"></div>

                <div className="seller-signup">
                    <div className="container">
                        <div className="row d-flex align-items-center justify-content-center">
                            <div className="col-md-5">
                                <div className="grid-1">
                                    <div className="feature-box">
                                        <div className="featurebox-img"><img src={this.state.dashboard_form_data.tp_icon1} /></div>
                                        <div className="featurebox-content">
                                            <h3>{this.state.dashboard_form_data.tp_title1}</h3>
                                            <p>{this.state.dashboard_form_data.tp_desc1}.</p>
                                        </div>
                                    </div>
                                    <div className="feature-box">
                                        <div className="featurebox-img"><img src={this.state.dashboard_form_data.tp_icon2} /></div>
                                        <div className="featurebox-content">
                                            <h3>{this.state.dashboard_form_data.tp_title2}</h3>
                                            <p>{this.state.dashboard_form_data.tp_desc2}.</p>
                                        </div>
                                    </div>
                                    <div className="feature-box">
                                        <div className="featurebox-img"><img src={this.state.dashboard_form_data.tp_icon3} /></div>
                                        <div className="featurebox-content">
                                            <h3>{this.state.dashboard_form_data.tp_title3}</h3>
                                            <p>{this.state.dashboard_form_data.tp_desc3}.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 offset-md-1">
                                {/*  */}
                                <div className="professional-hero-form">
                                    <form id="kt_login_signin_form" onSubmit={this.handleSaveData}>
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
                                    </div> */}
                                        {/*
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
                                    </div> */}

                                        {/* <div className="form-group">
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
                                            <input type="text" className="text-control" name="name" id="name" placeholder="Name" value={this.state.form_data.name} onChange={this.handleChange} />
                                            {this.validator.message('name', this.state.form_data.name, 'required')}
                                        </div>
                                        <div className="form-group">
                                            <label>Email ID</label>
                                            <input type="email" className="text-control" name="email" id="email" placeholder="Email" value={this.state.form_data.email} onChange={this.handleChange} />
                                            {this.validator.message('email', this.state.form_data.email, 'required|email')}
                                        </div>
                                        <div className="form-group">
                                            <label>Password</label>
                                            <div class="password-field">
                                                <input type="password" className="text-control" name="password" id="password" placeholder="Password" value={this.state.form_data.password} onChange={this.handleChange} />
                                                <span onClick={this.handleClick} class="pw-toggle"><i class="bi bi-eye"></i></span>
                                                {this.validator.message('password', this.state.form_data.password, 'required')}
                                            </div>
                                        </div>

                                        {/* <div className="form-group">
                                        <label>Confirm Password</label>
                                        <input type="password" className="text-control" name="confirmpassword" id="confirmpassword" placeholder="Confirm Password" data-validation="required" value={this.state.form_data.confirmpassword} onChange={this.handleChange} />
                                    </div> */}

                                        <div className="form-group">

                                            {/* <a href="javascript:void(0)" className="text-primary">Terms of Use</a> */}
                                            <small className="text-muted">By filling this form, I agree to <NavLink className="text-primary" exact to={'/detail/termsofuse'}>Terms of Use</NavLink></small>
                                        </div>
                                        <button className="btn btn-primary btn-block">Create Professional Account</button>

                                        <b> You already have an account ? please <NavLink className="icon-list" exact to={'/Professional-login/'}>Sign in</NavLink></b>
                                    </form>
                                </div>
                                {/*  */}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="grid-4">
                        <div className="stats">
                            <strong>{this.state.dashboard_form_data.tp_happy_customer}</strong>
                            <span>Happy Customer</span>
                        </div>
                        <div className="stats">
                            <strong>{this.state.dashboard_form_data.tp_service_category}</strong>
                            <span>Service Categories</span>
                        </div>
                        <div className="stats">
                            <strong>{this.state.dashboard_form_data.tp_service_profession}</strong>
                            <span>Trusted Service Professionels</span>
                        </div>
                        <div className="stats">
                            <strong>{this.state.dashboard_form_data.tp_city}</strong>
                            <span>Cities</span>
                        </div>
                    </div>
                </div>

                <div className="professional-features">
                    <div className="container">
                        <div className="row d-flex align-items-center justify-content-center">
                            <div className="col-md-12">
                                <img src={this.state.dashboard_form_data.tp_image1} />
                            </div>
                            <div className="col-md-5" style={{ display: 'none' }}>
                                <div className="grid-1">
                                    <div className="feature-box">
                                        <div className="featurebox-img"><img src={this.state.dashboard_form_data.tp_icon1} /></div>
                                        <div className="featurebox-content">
                                            <h3>{this.state.dashboard_form_data.tp_title1}</h3>
                                            <p>{this.state.dashboard_form_data.tp_desc1}.</p>
                                        </div>
                                    </div>
                                    <div className="feature-box">
                                        <div className="featurebox-img"><img src={this.state.dashboard_form_data.tp_icon2} /></div>
                                        <div className="featurebox-content">
                                            <h3>{this.state.dashboard_form_data.tp_title2}</h3>
                                            <p>{this.state.dashboard_form_data.tp_desc2}.</p>
                                        </div>
                                    </div>
                                    <div className="feature-box">
                                        <div className="featurebox-img"><img src={this.state.dashboard_form_data.tp_icon3} /></div>
                                        <div className="featurebox-content">
                                            <h3>{this.state.dashboard_form_data.tp_title3}</h3>
                                            <p>{this.state.dashboard_form_data.tp_desc3}.</p>
                                        </div>
                                    </div>
                                </div>
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
                                        <a className="ac-title">{this.state.dashboard_form_data.tp_question}</a>
                                        <div className="ac-content">
                                            <p>{this.state.dashboard_form_data.tp_answer}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <a className="ac-title">{this.state.dashboard_form_data.tp_question1}</a>
                                        <div className="ac-content">
                                            <p>{this.state.dashboard_form_data.tp_answer1}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <a className="ac-title">{this.state.dashboard_form_data.tp_question2}</a>
                                        <div className="ac-content">
                                            <p>{this.state.dashboard_form_data.tp_answer2}</p>
                                        </div>
                                    </li>
                                    <li>
                                        <a className="ac-title">{this.state.dashboard_form_data.tp_question3}</a>
                                        <div className="ac-content">
                                            <p>{this.state.dashboard_form_data.tp_answer3}</p>
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
export default ProfessionalSignup;
