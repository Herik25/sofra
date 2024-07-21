import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Loader from "react-loader";
import swal from 'sweetalert';
// import Select from 'react-select';
import $ from 'jquery';
// import { Helmet } from "react-helmet";
class ProfessionalForgot extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();


        // login form data

        this.initialState = {
            form_data: { email: '', password: '' },
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
            forgot_form_data: { email: '' },
            error: '',
            loaded: true,
        }

        this.state = this.initialState;
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.get_form_data();

    }

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

    componentDidMount() {

    }






    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.forgot_form_data[name] = value;
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
            api_option.url = 'professional_forgot_password';
            api_option.data = this.state.forgot_form_data;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        this.state.forgot_form_data.email = '';
                        toast.success(res.data.message);



                    } else {

                        toast.error(res.data.message);

                        //this.setState({error:res_data.message});
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
                                <h1>Forgot Password</h1>

                            </div>
                            {/* <img src="/assets/images/professional/8.png" className="professional-hero-object" /> */}

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
                                <div className="professional-hero-form">
                                    <form id="kt_login_signin_form" onSubmit={this.handleSubmit}>

                                        <div className="form-group">
                                            <label>Email ID</label>
                                            <input type="email" className="text-control" name="email" id="email" placeholder="Email" data-validation="required email" value={this.state.forgot_form_data.email} onChange={this.handleChange} />
                                            {this.validator.message('Email', this.state.forgot_form_data.email, 'required')}
                                        </div>
                                        <button className="btn btn-primary btn-block">Forgot Password</button>
                                        <div className="text-center">
                                            <NavLink exact to={'/Professional-login/'} style={{ marginTop: "10px", cursor: "pointer" }} class="btn btn-primary">Back to login</NavLink>
                                        </div>
                                    </form>
                                </div>
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
export default ProfessionalForgot;
