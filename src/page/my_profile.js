import React, { Component } from 'react';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import swal from 'sweetalert';
import Loader from "react-loader";
import Modal from 'react-bootstrap/Modal';
import { pdfFromReact } from "generate-pdf-from-react-html";

// import Select from 'react-select';
// import $ from 'jquery';
import { Helmet } from "react-helmet";

class MyProfile extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.profile_form_data_validator = new SimpleReactValidator();
        this.change_form_data_validator = new SimpleReactValidator();
        this.address_form_data_validator = new SimpleReactValidator();

        this.initialState = {
            product_data: {},
            form_data: {
                u_name: '',

                u_email: '',
                u_mobile: '',
                u_dob: '',
                u_id: '',
                u_image: '',

                u_city: ''
            },
            profile_form_data: {
                u_name: '',

                u_email: '',
                u_mobile: '',
                u_dob: '',
                u_id: '',
                u_image: '',

                u_city: ''
            },
            edit_form_data: {
                id: '',
                title: '',
                description: ''
            },

            address_form_data: {
                u_id: '',
                id: '',
                full_name: '',
                mobile: '',
                country: '',
                house_no: '',
                apartment: '',
                city: '',
                postcode: '',
                pincode: '',
                street_address: '',

            },

            change_form_data: {
                u_id: '',
                u_old_password: '',
                u_new_password: '',
            },
            u_id: '',
            push_notification: '',
            email_notification: '',
            newsletter: '',
            get_address_data: '',
            seller_project: '',
            living_experience: '',
            my_product: '',
            my_project: '',
            my_project_fav: '',
            my_knowhow: '',
            seller_favourite: '',
            professional_favourite: '',
            get_address_count: '',
            user_booking: '',
            my_order: '',
            question: '',
            shipping_country: '',
            error: '',
            loaded: true,
            show_logout: false,
            show_order_modal: false

        }

        this.state = this.initialState;
        this.handleSubmit = this.handleSubmit.bind(this);

        this.handleSaveAddress = this.handleSaveAddress.bind(this);
        this.handlechangePass = this.handlechangePass.bind(this);
        this.handleinputChangepass = this.handleinputChangepass.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleChangeAddress = this.handleChangeAddress.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleLogoutFinal = this.handleLogoutFinal.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleTopic = this.handleTopic.bind(this);
        this.hideQuestionModal = this.hideQuestionModal.bind(this);
        this.openLogoutModal = this.openLogoutModal.bind(this);
        this.hideLogoutModal = this.hideLogoutModal.bind(this);

        this.openOrderModal = this.openOrderModal.bind(this);
        this.hideOrderModal = this.hideOrderModal.bind(this);



        this.handleQuestionUpdate = this.handleQuestionUpdate.bind(this);

        this.reloadPage = this.reloadPage.bind(this);
        this.openAddressModal = this.openAddressModal.bind(this);
        this.hideAddressModal = this.hideAddressModal.bind(this);
        this.get_country();
        var th = this;
        // setTimeout(() => {
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';
        th.state.form_data['u_id'] = user_id;
        th.state['u_id'] = user_id;
        th.state.profile_form_data['u_id'] = user_id;
        th.state.change_form_data['u_id'] = user_id;
        th.state.address_form_data['u_id'] = user_id;

        th.get_professional_setting();
        th.get_form_data(user_id);
        th.get_user_address();
        th.get_my_product();
        th.get_my_project();
        th.get_favourite_seller(2);
        th.get_favourite_seller(3);
        th.get_my_order();
        th.get_seller_project();
        th.get_my_knowhow();
        th.get_living_experience();
        th.get_my_question();
        th.get_user_booking();


        // th.get_my_project();

        // this.setState({ redirect: '/My-profile' });
        // var user_email = (user_data) ? user_data.u_email : '';
        // var user_name = (user_data) ? user_data.u_name : '';
        // var user_mobile = (user_data) ? user_data.u_mobile : '';
        // }, 1000);


        /*  const order_id = this.props.match.params.order_id;
         console.log("fsfsdjkl ", order_id); */

    }

    async get_order_detail(id) {
        /* const edit_id = this.props.match.params.id;
        if (edit_id) { */
        api_option.url = 'get_order_detail';
        api_option.data = { id: id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var res_data = res.data.data;
                    const th = this;
                    th.state.product_data = res.data.product_data;
                    $.each(res_data, function (key, value) {
                        var data = th.state.form_data[key] = value;
                        th.setState({ data });
                    });
                    console.log(th.state.form_data);
                    th.openOrderModal();
                } else {
                    this.setState({ redirect: '/order-manage' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
        // }
    }

    reloadPage() {

        $(".account-sidebar").removeClass("hide");
        $(".account-component").removeClass("visible");
    }
    componentDidMount() {

    }

    async handleLogoutFinal() {
        console.log(localStorage.getItem('device_type'));
        if (localStorage.getItem('device_type') && localStorage.getItem('device_type') == "ios") {
            // if (window.confirm("Are you sure to logout?")) {
            window.webkit.messageHandlers.callback.postMessage('{"action":"do_logout"}');
            this.setState({ redirect: '/logout' });
            // }

        } else {
            // if (window.confirm("Are you sure to logout?")) {
            this.setState({ redirect: '/logout' });
            // }
        }
        // this.setState({ redirect: '/logout' });

    }

    handleCancelStatus(id, e) {
        api_option.url = 'cancel_order_status';
        api_option.data = { order_id: id };
        axios(api_option)
            .then(res => {
                const res_data = res.data;
                if (res_data.status) {
                    toast.success(res_data.message);
                    this.get_my_order();
                } else {
                    toast.error(res_data.message);
                    this.get_my_order();

                }
            })

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

    get_country() {

        api_option.url = 'country_list_dropdown';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var shipping_country = res.data.country_list;
                    this.setState(this.state.shipping_country = shipping_country);



                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    handleTopic(id, title, desc) {
        var data = this.state.edit_form_data['id'] = id;
        this.setState({ data });

        var data = this.state.edit_form_data['title'] = title;
        this.setState({ data });

        var data = this.state.edit_form_data['desc'] = desc;
        this.setState({ data });
        this.setState({ show1: true });

    }

    hideQuestionModal(e) {
        this.setState({ show1: false });
    }


    openOrderModal(e) {
        this.setState({ show_order_modal: true });
    }

    hideOrderModal(e) {
        this.setState({ show_order_modal: false });
    }

    openLogoutModal(e) {
        this.setState({ show_logout: true });
    }

    hideLogoutModal(e) {
        e.preventDefault();
        this.setState({ show_logout: false });
    }

    openAddressModal(e) {
        this.setState({ show: true });
    }

    hideAddressModal(e) {
        this.setState({ show: false });
    }


    handleEditAddress(id, full_name, apartment, city, mobile, pincode, house_no) {
        var data = this.state.address_form_data['id'] = id;
        this.setState({ data });

        var data = this.state.address_form_data['full_name'] = full_name;
        this.setState({ data });

        var data = this.state.address_form_data['apartment'] = apartment;
        this.setState({ data });

        var data = this.state.address_form_data['city'] = city;
        this.setState({ data });

        var data = this.state.address_form_data['mobile'] = mobile;
        this.setState({ data });

        var data = this.state.address_form_data['postcode'] = pincode;
        this.setState({ data });

        var data = this.state.address_form_data['house_no'] = house_no;
        this.setState({ data });


        this.setState({ show: true });

    }

    handleQuestionUpdate(event) {

        event.preventDefault();
        if (!this.validator.allValid()) {
            this.validator.showMessages();
            this.forceUpdate();
        } else {

            this.setState({ loaded: false });
            api_option.url = 'update_question';
            api_option.data = this.state.edit_form_data;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        toast.success(res.data.message);
                        this.setState({ show1: false });
                        this.get_my_question();

                    } else {
                        toast.error(res.data.message);
                        // this.setState({error:res_data.message});
                    }
                })
                .catch(error => console.log(error));
        }

    }

    handleDelete(id) {
        api_option.url = 'delete_address_data';
        api_option.data = { address_id: id };
        axios(api_option)
            .then(res => {
                const res_data = res.data;
                if (res_data.status) {
                    toast.success(res_data.message);
                    this.get_user_address();
                } else {
                    toast.error(res_data.message);
                    this.get_user_address();
                }
            })
    }

    handleFavouriteProduct(event, pid) {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        this.setState({ loaded: false });
        api_option.url = 'add_to_favourite';
        api_option.data = { product_id: pid, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {

                    toast.success(res.data.message);
                    th.get_my_product();
                    // th.setState({ redirect: '/productdetail/' + product_id });


                } else {
                    toast.error(res.data.message);
                    th.get_my_product();

                    // this.setState({ redirect: '/logout' });

                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
            });
    }


    handleQuestionDelete(id) {

        if (window.confirm("Are you sure to delete this item?")) {
            api_option.url = 'delete_question';
            api_option.data = { id: id };
            console.log(api_option)
            axios(api_option)
                .then(res => {
                    const res_data = res.data;
                    if (res_data.status) {

                        toast.success(res_data.message);
                        this.get_my_question();
                    } else {
                        toast.error(res_data.message);
                    }
                })
        }


    }


    handleFavouriteProject(event, pid) {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        this.setState({ loaded: false });
        api_option.url = 'add_to_favourite_project';
        api_option.data = { project_id: pid, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {

                    toast.success(res.data.message);
                    th.get_seller_project();
                    th.get_my_project();
                    // th.setState({ redirect: '/productdetail/' + product_id });


                } else {
                    toast.error(res.data.message);
                    th.get_seller_project();
                    th.get_my_project();

                    // this.setState({ redirect: '/logout' });

                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
            });
    }


    handleFavouriteKnowhow(event, pid) {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        this.setState({ loaded: false });
        api_option.url = 'add_to_favourite_knowhow';
        api_option.data = { knowhow_id: pid, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {

                    toast.success(res.data.message);
                    th.get_my_knowhow();
                    // th.setState({ redirect: '/productdetail/' + product_id });


                } else {
                    toast.error(res.data.message);
                    th.get_my_knowhow();

                    // this.setState({ redirect: '/logout' });

                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
            });
    }

    handleRemoveProject(id, event) {
        if (window.confirm("Are you sure to delete this item?")) {
            api_option.url = 'get_remove_project';
            api_option.data = { id: id };
            axios(api_option)
                .then(res => {
                    const res_data = res.data;
                    if (res_data.status) {
                        toast.success(res_data.message);
                        this.get_seller_project();
                        // this.get_seller_project();
                    } else {
                        toast.error(res_data.message);
                        this.get_seller_project();
                    }
                })
        }
    }


    handleRemoveLiving(id, event) {
        if (window.confirm("Are you sure to delete this item?")) {
            api_option.url = 'get_remove_living';
            api_option.data = { id: id };
            axios(api_option)
                .then(res => {
                    const res_data = res.data;
                    if (res_data.status) {
                        toast.success(res_data.message);
                        this.get_living_experience();
                        // this.get_seller_project();
                    } else {
                        toast.error(res_data.message);
                        this.get_living_experience();
                    }
                })
        }
    }

    handleFavourite(event, kid) {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        this.setState({ loaded: false });
        api_option.url = 'add_to_favourite_living';
        api_option.data = { living_id: kid, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {

                    toast.success(res.data.message);
                    th.get_living_experience();
                    // th.setState({ redirect: '/productdetail/' + product_id });


                } else {
                    toast.error(res.data.message);
                    th.get_living_experience();

                    // this.setState({ redirect: '/logout' });

                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    async get_living_experience() {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var login_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_fav_living_exp';
        api_option.data = { login_id: login_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var living_experience = res.data.data;
                    this.setState(this.state.living_experience = living_experience);


                } else {
                    //this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }



    handleLogout(event) {
        event.preventDefault();
        /* if (localStorage.getItem('device_type') && localStorage.getItem('device_type') == "ios") {
            if (window.confirm("Are you sure to logout?")) {
                window.webkit.messageHandlers.callback.postMessage('{"action":"do_logout"}');
                this.setState({ redirect: '/logout' });
            }

        } else {
            if (window.confirm("Are you sure to logout?")) {
                this.setState({ redirect: '/logout' });
            }
        } */

        this.setState({ show_logout: true });
        // window.$("#logoutModal").modal("show");

    }

    handleQuestionChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.edit_form_data[name] = value;
        this.setState({ data });
    }
    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.profile_form_data[name] = value;
        this.setState({ data });
    }
    handleChangeAddress(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.address_form_data[name] = value;
        this.setState({ data });
    }
    handleinputChangepass(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.change_form_data[name] = value;
        this.setState({ data });
    }


    //handle Change File
    handleChangeFile(event) {
        if (event.target.files && event.target.files[0]) {
            var reader = new FileReader();
            reader.onload = function (e) {
                $('#user_image').attr('src', e.target.result);
            }
            reader.readAsDataURL(event.target.files[0]);
        }
        const file_name = event.target.name;
        const file_value = event.target.files[0];
        const data = this.state.form_data[file_name] = file_value;
        this.setState({ data });
    }


    async get_professional_setting() {
        api_option.url = 'get_setting';
        api_option.data = { professional_id: this.state.form_data.u_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    this.setState({ push_notification: res.data.data.u_push_notification });
                    this.setState({ email_notification: res.data.data.u_email_notification });
                    this.setState({ newsletter: res.data.data.u_newsletter });

                } else {
                    toast.error(res.data.message);
                    //  this.get_cart_data();
                }
            })
            .catch(error => {

            });

    }


    handleRedirectProjectAdd(id, event) {

        this.setState({ redirect: '/Upload-project/' + id });
    }
    handleRedirectProject(id, event) {

        this.setState({ redirect: '/projectdetail/' + id });
    }
    handleRedirectLivingAdd(id, event) {

        this.setState({ redirect: '/add-living-experience/' + id });
    }
    handleRedirectLiving(id, event) {

        this.setState({ redirect: '/living-experience-detail/' + id });
    }

    handleSettingsPush(event) {

        api_option.url = 'update_setting_push';
        api_option.data = { professional_id: this.state.form_data.u_id, status: event.target.checked };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {

                if (res.data.status) {

                    this.get_professional_setting();
                    toast.success(res.data.message);


                } else {
                    toast.error(res.data.message);
                    //  this.get_cart_data();
                }
            })
            .catch(error => {

            });
    }

    handleSettingsEmail(event) {

        api_option.url = 'update_setting_email';
        api_option.data = { professional_id: this.state.form_data.u_id, status: event.target.checked };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {

                if (res.data.status) {
                    this.get_professional_setting();
                    toast.success(res.data.message);


                } else {
                    toast.error(res.data.message);
                    //  this.get_cart_data();
                }
            })
            .catch(error => {

            });
    }



    handleCloseAccount(event) {
        var device_type = localStorage.getItem('device_type');
        if (localStorage.getItem('device_type') == "ios") {
            window.webkit.messageHandlers.callback.postMessage('{"action":"close_account"}');
            return false;
        }

        var th = this;
        api_option.url = 'close_user_account';
        api_option.data = { id: th.state['u_id'] };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {

                if (res.data.status) {

                    // this.get_professional_setting();
                    toast.success(res.data.message);
                    this.setState({ redirect: '/logout' });
                } else {
                    toast.error(res.data.message);
                    //  this.get_cart_data();
                }
            })
            .catch(error => {

            });
    }

    handleSettingsNewsLetter(event) {

        api_option.url = 'update_setting_newsletter';
        api_option.data = { professional_id: this.state.form_data.u_id, status: event.target.checked };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {

                if (res.data.status) {

                    this.get_professional_setting();
                    toast.success(res.data.message);

                } else {
                    toast.error(res.data.message);
                    //  this.get_cart_data();
                }
            })
            .catch(error => {

            });
    }


    async get_my_project() {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var login_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_my_project_fav';
        api_option.data = { user_id: login_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var seller_project = res.data.data;
                    console.log(seller_project)
                    this.setState(this.state.my_project_fav = seller_project);
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    async get_favourite_seller(type = 0) {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var login_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_favourite_seller';
        if (type == 2) {
            api_option.data = { user_id: login_id, type: 2 };
        } else if (type == 3) {
            api_option.data = { user_id: login_id, type: 3 };
        } else {
            api_option.data = { user_id: login_id, type: 2 };
        }

        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    if (type == 2) {
                        var professional_favourite = res.data.data;
                        this.setState(this.state.professional_favourite = professional_favourite);
                    }
                    else if (type == 3) {
                        var seller_favourite = res.data.data;
                        this.setState(this.state.seller_favourite = seller_favourite);
                    }
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_seller_project() {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var login_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_my_project';
        api_option.data = { user_id: login_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var seller_project = res.data.data;
                    this.setState(this.state.my_project = seller_project);
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_my_knowhow() {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var login_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_my_knowhow';
        api_option.data = { user_id: login_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    var my_knowhow = res.data.data;

                    this.setState(this.state.my_knowhow = my_knowhow);


                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }



    async get_my_order() {
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';

        api_option.url = 'get_my_order';
        api_option.data = { id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    this.setState(this.initialState.my_order = res.data.data);
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_my_question() {
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';
        this.setState({ loaded: false });
        api_option.url = 'get_my_question';
        api_option.data = { id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {
                    this.setState(this.initialState.question = res.data.data);
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }


    async get_user_booking() {

        api_option.url = 'get_user_booking';
        api_option.data = { id: this.state.form_data.u_id };
        api_option.headers.Authorization = localStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                const th = this;
                if (res.data.status) {
                    const th = this;
                    var res_data = res.data.data;

                    this.setState(this.state.user_booking = res.data.data);


                } else {
                    // this.setState({ redirect: '/user/' });
                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
            });
    }


    async get_my_product() {
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';

        api_option.url = 'get_my_product';
        api_option.data = { user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var my_product = res.data.data;
                    this.setState(this.initialState.my_product = my_product);


                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }


    async get_user_address(props) {
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_user_address';
        api_option.data = { user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    this.setState(this.state.get_address_data = res.data.data);

                    this.setState(this.state.get_address_count = res.data.count);

                } else {
                    // this.setState({ redirect: '/ProductList/' });
                }
            })
            .catch(error => {
                //  this.setState({ redirect: '/logout' });
            });
    }

    //get edit form data
    async get_form_data(user_id) {
        api_option.url = 'get_profile_data';
        // api_option.data = { id: this.state.profile_form_data.u_id };
        api_option.data = { id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    const th = this;
                    var res_data = res.data.data;
                    this.setState(this.state.profile_form_data = res.data.data);

                    // this.setState({ redirect: '/My-profile/' });
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }


    //handleSaveAddress
    handleSaveAddress(event) {

        event.preventDefault();
        if (!this.address_form_data_validator.allValid()) {
            this.address_form_data_validator.showMessages();
            this.forceUpdate();
        } else {
            this.setState({ loaded: false });
            api_option.url = 'save_address';
            const formData = new FormData();
            formData.append('address_id', this.state.address_form_data.id);
            formData.append('id', this.state.address_form_data.u_id);
            formData.append('full_name', this.state.address_form_data.full_name);
            formData.append('mobile', this.state.address_form_data.mobile);
            formData.append('country', this.state.address_form_data.country);
            formData.append('house_no', this.state.address_form_data.house_no);
            formData.append('apartment', this.state.address_form_data.apartment);
            formData.append('postcode', this.state.address_form_data.postcode);
            formData.append('city', this.state.address_form_data.city);
            api_option.data = formData;
            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {

                        this.setState({ show: false });
                        toast.success(res.data.message);
                        this.get_user_address();
                        //this.setState({ redirect: '/' });
                    } else {
                        toast.error(res.data.message);
                    }
                })
                .catch(error => console.log(error));
        }
    }


    // form submit event
    handleSubmit(event) {

        event.preventDefault();
        if (!this.profile_form_data_validator.allValid()) {

            this.profile_form_data_validator.showMessages();
            this.forceUpdate();
        } else {

            //alert()
            // $(':input[type="submit"]').prop('disabled', true);
            this.setState({ loaded: false });
            api_option.url = 'update_profile';
            const formData = new FormData();

            formData.append('id', this.state.profile_form_data.u_id);
            formData.append('u_name', this.state.profile_form_data.u_name);
            formData.append('u_email', this.state.profile_form_data.u_email);
            formData.append('u_mobile', this.state.profile_form_data.u_mobile);
            formData.append('u_dob', this.state.profile_form_data.u_dob);
            if ($("#u_image").val() != "") {
                var image = $('#u_image')[0].files[0];
                formData.append('u_image', image);
            } else {
                formData.append('u_image', this.state.profile_form_data.u_image);
            }

            formData.append('u_city', this.state.profile_form_data.u_city);
            api_option.data = formData;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        toast.success(res.data.message);
                        // $(':input[type="submit"]').prop('disabled', false);
                        //this.setState({ redirect: '/' });
                    } else {
                        toast.error(res.data.message);
                    }
                })
                .catch(error => console.log(error));
        }

    }


    // form submit event
    handlechangePass(event) {

        event.preventDefault();

        //$('#change_form_data');
        if (!this.change_form_data_validator.allValid()) {
            this.change_form_data_validator.showMessages();
            this.forceUpdate();
        } else {
            this.setState({ loaded: false });
            api_option.url = 'change_password';
            api_option.data = this.state.change_form_data;
            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {

                        toast.success(res.data.message);
                        this.setState({ redirect: '/logout' });

                        //this.setState({ redirect: '/' });
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

                    <script src="assets/js/custom-popup.js"></script>
                    <script src="assets/js/custom.js?12"></script>
                    <script src="assets/js/aks.js?12"></script>
                    <script src="assets/js/developer_signup_popup.js?123"></script>
                    <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js'></script>
                    <script src='https://unpkg.com/aksfileupload@1.0.0/dist/aksFileUpload.min.js'></script>
                    <script src='https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1-rc.1/js/select2.min.js'></script>
                    {/* <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
                    <script src="https://code.jquery.com/ui/1.10.4/jquery-ui.js"></script>
                    <link href="https://code.jquery.com/ui/1.10.4/themes/ui-lightness/jquery-ui.css" rel="stylesheet"></link> */}

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
                <div class="account-page-wrapper">
                    <div class="container">
                        <div class="account-page">
                            <div class="account-sidebar">
                                <div class="mobile-view">
                                    <div class="wrap-profile">
                                        {this.state.profile_form_data.u_image != '' ? <figure><img src={this.state.profile_form_data.u_image} /></figure> : <figure><img src="assets/images/avatar-1.jpg" /></figure>}
                                        <div>
                                            <h5>{this.state.profile_form_data.u_name}</h5>
                                            <span>{this.state.profile_form_data.u_email}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="account-sidebar-links mobile-view">
                                    <div class="ac-link-group">
                                        <ul class="nav">
                                            <div class="profile-hl-links">
                                                <li><a href="#favourites" data-toggle="tab"><i class="bi bi-heart"></i><b>Favourites</b></a></li>
                                                <li><a href="#orders" data-toggle="tab"><i class="bi bi-box"></i><b>Order</b></a></li>
                                                <li><a href="#projects" data-toggle="tab"><i class="bi bi-app-indicator"></i><b>Projects</b></a></li>
                                                <li><a href="#livexp" data-toggle="tab"><i class="bi bi-emoji-smile"></i><b>Living Experience</b></a></li>
                                            </div>
                                            <li><span>Account</span></li>
                                            <li><a href="#profile" data-toggle="tab" class="active"><i class="bi bi-person"></i> Profile Details</a></li>
                                            <li><a href="#passworddcss" data-toggle="tab"><i class="bi bi-lock"></i> Change Password</a></li>
                                            <li><a href="#addresses" data-toggle="tab"><i class="bi bi-geo-alt"></i> My Addresses</a></li>
                                            <li><a href="#question" data-toggle="tab"><i class="bi bi-question-circle"></i> My Questions</a></li>
                                            <li><a href="#bookings" data-toggle="tab"><i class="bi bi-journal-text"></i> My Bookings</a></li>
                                            <li><span>General</span></li>
                                            <li><a href="#settings" data-toggle="tab"><i class="bi bi-gear"></i> Settings</a></li>

                                            <a onClick={this.handleLogout} style={{ cursor: "pointer" }}><i class="bi bi-box-arrow-left"></i>Logout</a>

                                        </ul>
                                    </div>
                                </div>
                                <div class="account-sidebar-links web-view">
                                    <div class="ac-link-group">
                                        <ul class="nav">
                                            <li><span>Account</span></li>
                                            <li><a href="#profile" data-toggle="tab" class="active"><i class="bi bi-person"></i> Profile Details</a></li>
                                            <li><a href="#passworddcss" data-toggle="tab"><i class="bi bi-lock"></i> Change Password</a></li>
                                            <li><a href="#orders" data-toggle="tab"><i class="bi bi-box"></i> My Order</a></li>
                                            <li><a href="#favourites" data-toggle="tab"><i class="bi bi-heart"></i> My Favourites</a></li>
                                            <li><a href="#addresses" data-toggle="tab"><i class="bi bi-geo-alt"></i> My Addresses</a></li>
                                            <li><a href="#question" data-toggle="tab"><i class="bi bi-question-circle"></i> My Questions</a></li>
                                            <li><a href="#bookings" data-toggle="tab"><i class="bi bi-journal-text"></i> My Bookings</a></li>
                                            <li><span>Activity</span></li>
                                            <li><a href="#projects" data-toggle="tab"><i class="bi bi-app-indicator"></i> My Projects</a></li>
                                            <li><a href="#livexp" data-toggle="tab"><i class="bi bi-emoji-smile"></i> My Living Experience</a></li>
                                            <li><span>General</span></li>
                                            <li><a href="#settings" data-toggle="tab"><i class="bi bi-gear"></i> Settings</a></li>
                                            <a onClick={this.handleLogout} style={{ cursor: "pointer" }}><i class="bi bi-box-arrow-left"></i>Logout</a>
                                            {/* <NavLink className="icon-list" exact to={'/Logout/'}><i class="bi bi-box-arrow-left"></i>Logout</NavLink> */}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div class="account-component">
                                <div class="tab-content">
                                    <div class="tab-pane active" id="profile">
                                        <div class="bwp-top-bar"><div class="bwp-bar"><button onClick={this.reloadPage} class="back"></button><h2 class="pg-title">Profile Details</h2></div></div>
                                        <div class="w-50">
                                            <form onSubmit={this.handleSubmit}>
                                                <div class="form-group">

                                                    <div class="thumb-upload 11">
                                                        {this.state.profile_form_data.u_image != '' ?
                                                            < figure > <img src={this.state.profile_form_data.u_image} id="user_image" /></figure>
                                                            :
                                                            < figure > <img src="/assets/images/profile.svg" id="user_image" /></figure>
                                                        }
                                                        <div class="custom-upload">
                                                            <input type="file" id="u_image" name="u_image" onChange={this.handleChangeFile} />
                                                            <label for="u_image">
                                                                <span>Upload Photo</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="form-group">
                                                    <label>Full Name</label>
                                                    <input type="text" className="text-control" name="u_name" id="u_name" value={this.state.profile_form_data.u_name} onChange={this.handleChange} />
                                                    {this.profile_form_data_validator.message('name', this.state.profile_form_data.u_name, 'required')}
                                                    <input type="hidden" className="text-control" name="u_id" id="u_id" value={this.state.profile_form_data.u_id} />
                                                </div>
                                                <div class="form-group">
                                                    <label>Email ID</label>
                                                    <input type="email" className="text-control" name="u_email" id="u_email" value={this.state.profile_form_data.u_email} onChange={this.handleChange} />
                                                    {this.profile_form_data_validator.message('Email', this.state.profile_form_data.u_email, 'required|email')}
                                                </div>
                                                <div class="form-group">
                                                    <label>Phone Number</label>
                                                    <input type="text" name="u_mobile" maxLength="10" id="u_mobile" class="text-control" value={this.state.profile_form_data.u_mobile} onChange={this.handleChange} />
                                                    {this.profile_form_data_validator.message('Phone', this.state.profile_form_data.u_mobile, 'required|numeric')}
                                                </div>
                                                <div class="form-group">
                                                    <label>Date of Birth (yyyy-mm-dd)</label>
                                                    <input type="text" class="text-control datepicker" name="u_dob" id="u_dob" value={this.state.profile_form_data.u_dob} onChange={this.handleChange} />
                                                    {this.profile_form_data_validator.message('dob', this.state.profile_form_data.u_dob, 'required')}
                                                </div>

                                                <div class="form-group">
                                                    <label>Location</label>
                                                    {/* <textarea name="u_city" id="u_city" data-validation="required" onChange={this.handleChange}>{this.state.form_data.u_city}</textarea> */}
                                                    <input type="text" class="text-control" name="u_city" id="u_city" value={this.state.profile_form_data.u_city} onChange={this.handleChange} />
                                                    {this.profile_form_data_validator.message('city', this.state.profile_form_data.u_city, 'required')}
                                                </div>
                                                <button type="submit" id="Profile_disabled" class="btn btn-primary">Save</button>
                                            </form>
                                        </div>
                                    </div>


                                    <div class="tab-pane fade" id="passworddcss">
                                        <div class="bwp-top-bar">
                                            <div class="bwp-bar">
                                                <button onClick={this.reloadPage} class="back"></button>
                                                <h2 class="pg-title"><small>Change Password</small></h2>
                                            </div>
                                        </div>
                                        <div class="w-50">
                                            <form onSubmit={this.handlechangePass}>
                                                <div class="form-group">
                                                    <label>Old Password</label>
                                                    <input type="password" name="u_old_password" id="u_old_password" class="text-control" value={this.state.change_form_data.u_old_password} onChange={this.handleinputChangepass} />
                                                    {this.change_form_data_validator.message('old password', this.state.change_form_data.u_old_password, 'required')}
                                                    <input type="hidden" className="text-control" name="u_id" id="u_id" value={this.state.change_form_data.u_id} />
                                                </div>
                                                <div class="form-group">
                                                    <label>New Password</label>
                                                    <div class="password-field">
                                                        <input type="password" name="u_new_password" id="u_new_password" class="text-control" value={this.state.change_form_data.u_new_password} onChange={this.handleinputChangepass} />
                                                        <span onClick={this.handleClick} class="pw-toggle"><i class="bi bi-eye"></i></span>
                                                        {this.change_form_data_validator.message('new password', this.state.change_form_data.u_new_password, 'required')}
                                                    </div>
                                                </div>

                                                <button class="btn btn-primary">Save</button>
                                            </form>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="question">
                                        <div class="bwp-top-bar"><div class="bwp-bar"><button onClick={this.reloadPage} class="back"></button><h2 class="pg-title"><small>My Questions</small></h2></div></div>
                                        <div>
                                            <Link to={`/question-list/`} ><button class="btn btn-outline" >Add New</button></Link>
                                        </div>
                                        <div class="forum-list">
                                            {Object.entries(this.initialState.question).map(([i, qu]) => (
                                                <article class="forum-item">
                                                    <div class="forum-new-my text-right">
                                                        <button class="btn-success post-forum" onClick={this.handleTopic.bind(this, qu.id, qu.title, qu.description)}>Edit</button>
                                                        <button class="btn-danger btn-small" onClick={this.handleQuestionDelete.bind(this, qu.id)} >Delete</button>
                                                    </div>

                                                    <div class="forum-list-title">
                                                        <Link to={`/question-detail/${qu.id}`}><h2>{qu.title}</h2></Link>
                                                        <p>{qu.description}.</p>
                                                    </div>
                                                    <div class="forum-list-rt">
                                                        <Link to={`/question-detail/${qu.id}`} class="forum-comment"><span><b>{qu.comment}</b></span> Comments</Link>
                                                        <time>{qu.created_at}</time>
                                                    </div>

                                                </article>
                                            ))}

                                        </div>
                                    </div>

                                    <div class="tab-pane fade" id="bookings">
                                        <div class="bwp-top-bar">
                                            <div class="bwp-bar">
                                                <button onClick={this.reloadPage} class="back"></button>
                                                <h1 class="pg-title">My Bookings</h1>
                                            </div>
                                            <div>
                                                <select class="sort-list">
                                                    <option disabled="">Sort</option>
                                                    <option>Done</option>
                                                    <option>Open</option>
                                                    <option>Cancel</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div class="bookings-wrapper">

                                            {Object.entries(this.state.user_booking).map(([o, k]) => (
                                                <div class="booking-items">
                                                    <div class="user-card">
                                                        <a href="javascript:void(0)">
                                                            <img src={k.u_image} />
                                                            <span>{k.u_name}</span>
                                                        </a>
                                                        <div class="booking-action">
                                                            <a href="tel:" class="call"><i class="bi bi-telephone-fill"></i></a>
                                                            <a href="mailto:" class="email"><i class="bi bi-envelope-fill"></i></a>
                                                        </div>
                                                    </div>
                                                    <div class="booking-details">
                                                        <div class="professional-card-details">
                                                            <span><i class="bi bi-geo-alt-fill"></i>{k.title}</span>
                                                            <div class="prof-ex-info">
                                                                <span><i class="bi bi-geo-alt-fill"></i>{k.location}</span>
                                                            </div>
                                                            <p>{k.description}</p>
                                                            <p>{k.professionalname}</p>

                                                        </div>
                                                    </div>
                                                </div>
                                            ))}



                                        </div>
                                    </div>

                                    <div class="tab-pane fade" id="orders">
                                        <div class="w-80">
                                            <div class="bwp-top-bar">
                                                <div class="bwp-bar">
                                                    <button onClick={this.reloadPage} class="back"></button><h2 class="pg-title">My Orders</h2>
                                                </div>
                                                {/* <div>
                                                    <select class="sort-list">
                                                        <option disabled="">Sort</option>
                                                        <option>All Order</option>
                                                        <option>Open</option>
                                                        <option>Delivered</option>
                                                    </select>
                                                </div> */}
                                            </div>
                                            <div class="orderItemList">


                                                {Object.entries(this.initialState.my_order).map(([i, ord]) => (

                                                    <div class="ItemList-itemView">
                                                        <div class="ItemList-topbar">
                                                            <div class="ItemStatus-itemStatus">
                                                                <span><i class="bi bi-box"></i></span>
                                                                <div>
                                                                    {ord.o_status == 0 && <strong class="text-warning">Processing</strong>}
                                                                    {ord.o_status == 1 && <strong class="text-warning">On-Hold</strong>}
                                                                    {ord.o_status == 2 && <strong class="text-warning">Shipped</strong>}
                                                                    {ord.o_status == 3 && <strong class="text-warning">Out for Delivery</strong>}
                                                                    {ord.o_status == 4 && <strong class="text-info">Delivered</strong>}
                                                                    {ord.o_status == 5 && <strong class="text-success">Completed</strong>}
                                                                    {ord.o_status == 6 && <strong class="text-warning">Return and Refund</strong>}
                                                                    {ord.o_status == 7 && <strong class="text-danger">Cancelled</strong>}
                                                                    {ord.o_updated_at != '' && <span>{ord.o_updated_at}</span> || <span>{ord.o_created_at}</span>}

                                                                </div>
                                                            </div>
                                                            {ord.o_status != 7 && <div class="itemOrder-action">
                                                                <button type="button" onClick={this.handleCancelStatus.bind(this, ord.o_id)} class="text-danger">Cancel Order</button>
                                                            </div>}

                                                        </div>
                                                        <div class="ItemProduct-details toggle-sidepop" onClick={this.get_order_detail.bind(this, ord.o_id)}>
                                                            <div class="ItemProduct-details-thumb"><img src={ord.image} /></div>
                                                            <div class="ItemProduct-details-info">
                                                                <strong>{ord.u_name}</strong>
                                                                <span>{ord.tp_title}</span>
                                                                <div class="option-selected">
                                                                    <span>Color:<strong>{ord.tc_color}</strong></span>
                                                                    <span>Size:<strong>{ord.s_title}</strong></span>
                                                                </div>
                                                            </div>
                                                            <div class="ItemProduct-details-info text-right">
                                                            </div>
                                                        </div>
                                                    </div>

                                                ))}
                                                {/* <div class="ItemList-itemView">
                                                    <div class="ItemList-topbar">
                                                        <div class="ItemStatus-itemStatus">
                                                            <span><i class="bi bi-box"></i></span>
                                                            <div>
                                                                <strong class="text-warning">Order Placed</strong>
                                                                <span>On Sat, 10 Apr</span>
                                                            </div>
                                                        </div>
                                                        <div class="itemOrder-action">
                                                            <a href="javascript:void(0)" class="text-danger">Cancel Order</a>
                                                        </div>
                                                    </div>
                                                    <div class="ItemProduct-details toggle-sidepop">
                                                        <div class="ItemProduct-details-thumb"><img src="assets/images/product-7.jpg" /></div>
                                                        <div class="ItemProduct-details-info">
                                                            <strong>KH Elite Architectural</strong>
                                                            <span>Eames Cole Lounge Chair Single</span>
                                                            <div class="option-selected">
                                                                <span>Color:<strong>Blue</strong></span>
                                                                <span>Size:<strong>XL</strong></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="ItemList-itemView">
                                                    <div class="ItemList-topbar">
                                                        <div class="ItemStatus-itemStatus">
                                                            <span><i class="bi bi-box"></i></span>
                                                            <div>
                                                                <strong class="text-success">Order Delivered</strong>
                                                                <span>On Thu, 2 Apr</span>
                                                            </div>
                                                        </div>
                                                        <div class="itemOrder-action">
                                                            <a href="javascript:void(0)" class="text-warning">Rate Now</a>
                                                        </div>
                                                    </div>
                                                    <div class="ItemProduct-details toggle-sidepop">
                                                        <div class="ItemProduct-details-thumb"><img src="assets/images/product-1.jpg" /></div>
                                                        <div class="ItemProduct-details-info">
                                                            <strong>KH Elite Architectural</strong>
                                                            <span>Eames Cole Lounge Chair Single</span>
                                                            <div class="option-selected">
                                                                <span>Color:<strong>Blue</strong></span>
                                                                <span>Size:<strong>XL</strong></span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="favourites">
                                        <div class="bwp-top-bar"><div class="bwp-bar"><button onClick={this.reloadPage} class="back"></button><h2 class="pg-title">My Favourites</h2></div></div>
                                        <div class="line-tab">
                                            <ul class="nav nav-tabs left-align">
                                                <li class="nav-item">
                                                    <a class="active show" data-toggle="tab" href="#fProducts">Products</a>
                                                </li>
                                                <li class="nav-item">
                                                    <a class="" data-toggle="tab" href="#fProjects">Projects</a>
                                                </li>
                                                <li class="nav-item">
                                                    <a class="" data-toggle="tab" href="#fknowhow">Know How</a>
                                                </li>
                                                <li class="nav-item">
                                                    <a class="" data-toggle="tab" href="#fprofessional">Professional</a>
                                                </li>
                                                <li class="nav-item">
                                                    <a class="" data-toggle="tab" href="#fseller">Seller</a>
                                                </li>
                                                {/* <li class="nav-item">
                                                    <a class="" data-toggle="tab" href="#fseller">Seller</a>
                                                </li> */}
                                            </ul>
                                        </div>
                                        <div class="tab-content">
                                            <div class="tab-pane active" id="fProducts">
                                                <div class="products-grid">

                                                    {Object.entries(this.initialState.my_product).map(([i, p]) => (
                                                        <div class="product-item">
                                                            <div class="product-thumb">

                                                                <div class="thumbsave">
                                                                    <button class="save-trigger" onClick={this.handleFavouriteProduct.bind(this, i, p.tp_id)}><i class="bi-heart-fill"></i></button>
                                                                </div>
                                                                <Link to={`/productdetail/${p.tp_id}`}>
                                                                    <img src={p.image} />
                                                                </Link>
                                                            </div>
                                                            <div class="product-info">
                                                                <h4 class="product-name"><Link to={`/productdetail/${p.tp_id}`}>{p.tp_title}</Link></h4>
                                                                <div class="just-in">

                                                                    <div class="product-price">{p.tp_price > 0 && <del>RO {p.tp_price}</del>}<span>RO {p.tp_sale_price}</span></div>

                                                                    {/* <div class="product-price">{p.tp_sale_price > 0 && <del>RO {p.tp_sale_price}</del>}<span>RO {p.tp_price}</span></div> */}
                                                                    <div class="rating-wapper">
                                                                        <span class="star-rating"><span class="stars four"></span></span>
                                                                    </div>
                                                                </div>
                                                                {/* <div class="product-brand"><a href="javascript:void(0)">{p.u_name}</a></div> */}
                                                            </div>
                                                        </div>
                                                    ))}


                                                </div>
                                            </div>
                                            <div class="tab-pane fade" id="fProjects">

                                                <div class="profile-project-grid">
                                                    {Object.entries(this.state.my_project_fav).map(([o, p]) => (
                                                        <div class="projectList-items">
                                                            <Link to={`/projectdetail/${p.tpro_id}`}></Link>

                                                            {/* <div class="thumbtag"><span class="new">New</span></div> */}
                                                            <div class="thumbsave">
                                                                <button class="save-trigger" onClick={this.handleFavouriteProject.bind(this, o, p.tpro_id, p.tpro_seller_id)}><i class="bi-heart-fill"></i></button>

                                                            </div>
                                                            <div class="projectList-cover"><img src={p.tpro_image} /></div>
                                                            <div class="projectList-title"><h2>{p.tpro_name}</h2></div>
                                                            <div class="projectList-ft">
                                                                {/* <div class="projectList-author">BM Architects</div>
                                                                <span class="projectViews">246 Views</span> */}
                                                            </div>
                                                        </div>
                                                    ))}



                                                </div>

                                            </div>
                                            <div class="tab-pane fade" id="fknowhow">
                                                <div class="knowhow-grid">
                                                    {Object.entries(this.state.my_knowhow).map(([o, p]) => (
                                                        <div class="projectList-items">
                                                            <Link to={`/know-how-detail/${p.know_how_id}`}></Link>

                                                            <div class="thumbsave">

                                                                <button class="save-trigger" onClick={this.handleFavouriteKnowhow.bind(this, o, p.know_how_id)}><i class="bi-heart-fill"></i></button>
                                                            </div>
                                                            <div class="projectList-cover"><img src={p.know_how_image} /></div>
                                                            <div class="overlap-content">
                                                                <div class="projectList-title"><h2>{p.know_how_name}</h2></div>
                                                                <div class="projectList-ft">
                                                                    <div class="projectList-author"><img src={p.u_image} />{p.u_name}</div>
                                                                    {/* <span class="projectViews">246 Views</span> */}
                                                                    {p.know_how_view_count > 0 &&
                                                                        <>
                                                                            {p.know_how_view_count > 1 && <span class="projectViews">{p.know_how_view_count} Views</span>}
                                                                            {p.know_how_view_count == 1 && <span class="projectViews">{p.know_how_view_count} View</span>}
                                                                        </>
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}

                                                </div>
                                            </div>
                                            {/* <div class="tab-pane fade" id="fseller">
                                                <div class="professional-listing">
                                                    {Object.entries(this.initialState.my_project).map(([i, pr]) => (
                                                        <div class="professional-list-card">
                                                            <div class="professional-list-header">
                                                                <div class="professional-card">
                                                                    <a href="javascript:void(0)"></a>
                                                                    <img src="assets/images/professionals/professionals-1.png" />
                                                                    <div class="professional-card-details">
                                                                        <h5>Ward Almuna Alkhonji Interior Design</h5>
                                                                        <span>Architectural Design Studio</span>
                                                                        <div class="prof-ex-info">
                                                                            <span><i class="bi bi-geo-alt-fill"></i>Matrah, Muscat, Sultanate of Oman</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div class="professional-card-right">
                                                                    <button class="btn btn-ghost">Book Now</button>
                                                                    <button class="btn btn-ghost icon"><i class="bi bi-bookmark-fill"></i></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}




                                                </div>
                                            </div> */}
                                            <div class="tab-pane fade" id="fseller">
                                                <div class="professional-listing">
                                                    {Object.entries(this.state.seller_favourite).map(([i, pr]) => (
                                                        <div class="professional-list-card">
                                                            <div class="professional-list-header">
                                                                <div class="professional-card">
                                                                    <Link to={`/professional-detail/${pr.u_id}`}></Link>
                                                                    <img src={pr.u_image} />
                                                                    <div class="professional-card-details">
                                                                        <h5>{pr.u_name}</h5>
                                                                        {/* <span>Architectural Design Studio</span>
                                                                        <div class="prof-ex-info">
                                                                            <span><i class="bi bi-geo-alt-fill"></i>Matrah, Muscat, Sultanate of Oman</span>
                                                                        </div> */}
                                                                    </div>
                                                                </div>
                                                                {/* <div class="professional-card-right">
                                                                    <button class="btn btn-ghost icon"><i class="bi bi-bookmark-fill"></i></button>
                                                                </div> */}
                                                            </div>
                                                        </div>
                                                    ))}


                                                </div>
                                            </div>
                                            <div class="tab-pane fade" id="fprofessional">
                                                <div class="professional-listing">
                                                    {Object.entries(this.state.professional_favourite).map(([i, pr]) => (
                                                        <div class="professional-list-card">
                                                            <div class="professional-list-header">
                                                                <div class="professional-card">
                                                                    <Link to={`/professional-detail/${pr.u_id}`}></Link>
                                                                    <img src={pr.u_image} />
                                                                    <div class="professional-card-details">
                                                                        <h5>{pr.u_name}</h5>
                                                                        {/* <span>Architectural Design Studio</span>
                                                                        <div class="prof-ex-info">
                                                                            <span><i class="bi bi-geo-alt-fill"></i>Matrah, Muscat, Sultanate of Oman</span>
                                                                        </div> */}
                                                                    </div>
                                                                </div>
                                                                {/* <div class="professional-card-right">
                                                                    <button class="btn btn-ghost icon"><i class="bi bi-bookmark-fill"></i></button>
                                                                </div> */}
                                                            </div>
                                                        </div>
                                                    ))}


                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="tab-pane fade" id="addresses">
                                        <div class="w-70">
                                            <div class="bwp-top-bar">
                                                <div class="bwp-bar"><button onClick={this.reloadPage} class="back"></button><h2 class="pg-title">My Address</h2></div>
                                                <div>
                                                    <button class="btn btn-outline address-pop" onClick={this.openAddressModal}>Add New</button>
                                                </div>
                                            </div>
                                            <div class="address-list">

                                                {Object.entries(this.state.get_address_data).map(([i, ad]) => (
                                                    <div class="address-items">
                                                        <div class="address-content">
                                                            <b>{ad.tua_full_name}</b>
                                                            <p>{ad.tua_street_address}, {ad.tua_apartment}, {ad.tua_city}, {ad.tua_pincode}</p>
                                                        </div>
                                                        <div class="address-action">
                                                            <div class="dropdown">
                                                                <button class="icon no-caret dropdown-toggle" type="button" data-toggle="dropdown">
                                                                    <i class="bi bi-three-dots-vertical"></i>
                                                                </button>
                                                                <div class="dropdown-menu dropdown-menu-right">

                                                                    <a class="dropdown-item address-pop" onClick={this.handleEditAddress.bind(this, ad.tua_id, ad.tua_full_name, ad.tua_apartment, ad.tua_city, ad.tua_mobile, ad.tua_pincode, ad.tua_street_address)}>Edit</a>
                                                                    <a class="dropdown-item" onClick={this.handleDelete.bind(this, ad.tua_id)}>Delete</a>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {/* <div class="address-items">
                                                    <div class="address-content">
                                                        <b>Adam show</b>
                                                        <p>8305 Santa Clara St.Chino Hills, South Lakeshore Dr.Fontana, Boston St. Bakersfield, CA 91709</p>
                                                    </div>
                                                    <div class="address-action">
                                                        <div class="dropdown">
                                                            <button class="icon no-caret dropdown-toggle" type="button" data-toggle="dropdown">
                                                                <i class="bi bi-three-dots-vertical"></i>
                                                            </button>
                                                            <div class="dropdown-menu dropdown-menu-right">
                                                                <a class="dropdown-item address-pop" href="#">Edit</a>
                                                                <a class="dropdown-item" href="#">Delete</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="address-items">
                                                    <div class="address-content">
                                                        <b>Franklin Guzman</b>
                                                        <p>8305 Santa Clara St.Chino Hills, South Lakeshore Dr.Fontana, Boston St. Bakersfield, CA 91709</p>
                                                    </div>
                                                    <div class="address-action">
                                                        <div class="dropdown">
                                                            <button class="icon no-caret dropdown-toggle" type="button" data-toggle="dropdown">
                                                                <i class="bi bi-three-dots-vertical"></i>
                                                            </button>
                                                            <div class="dropdown-menu dropdown-menu-right">
                                                                <a class="dropdown-item address-pop" href="#">Edit</a>
                                                                <a class="dropdown-item" href="#">Delete</a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}
                                            </div>
                                        </div>
                                    </div>

                                    <div class="tab-pane fade" id="projects">
                                        <div class="bwp-top-bar">
                                            <div class="bwp-bar"><button onClick={this.reloadPage} class="back"></button><h2 class="pg-title">My Projects <small></small></h2></div>
                                            <div>
                                                <NavLink exact to="/Upload-project/"><button class="btn btn-outline">Add</button></NavLink>
                                            </div>
                                        </div>
                                        <div class="projectpage-grid">
                                            {Object.entries(this.state.my_project).map(([o, p]) => (
                                                <div class="projectList-items">
                                                    {p.save_type == 'Draft' && <div>
                                                        <div class="thumbtag"><span class="new">Draft</span></div>
                                                        <div class="thumbsave">
                                                            {(localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && is_login() && p.favourites == 0 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.tpro_id, p.tpro_seller_id)}><i class="bi-heart"></i></button>}
                                                            {(localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && is_login() && p.favourites == 1 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.tpro_id, p.tpro_seller_id)}><i class="bi-heart-fill"></i></button>}
                                                            <a href="javascript:void(0)"><button type="button" class="save-trigger" onClick={this.handleRemoveProject.bind(this, p.tpro_id)}><img src="https://img.icons8.com/material-outlined/24/000000/delete-sign.png" /></button></a>
                                                        </div>

                                                        <div class="projectList-cover"><img src={p.tpro_image} /></div>
                                                        <div class="projectList-title pronm" href="javascript:void(0)" onClick={this.handleRedirectProjectAdd.bind(this, p.tpro_id)}><h2>{p.tpro_name}</h2></div>
                                                    </div>}

                                                    {p.save_type == 'Publish' && <div>
                                                        <div class="thumbtag"><span class="new">Publish</span></div>
                                                        <div class="thumbsave" >
                                                            {(localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && is_login() && p.favourites == 0 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.tpro_id, p.tpro_seller_id)}><i class="bi-heart"></i></button>}
                                                            {(localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && is_login() && p.favourites == 1 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.tpro_id, p.tpro_seller_id)}><i class="bi-heart-fill"></i></button>}
                                                            <a href="javascript:void(0)"><button type="button" class="save-trigger" onClick={this.handleRemoveProject.bind(this, p.tpro_id)}><img src="https://img.icons8.com/material-outlined/24/000000/delete-sign.png" /></button></a>
                                                        </div>

                                                        <div class="projectList-cover"><img src={p.tpro_image} /></div>

                                                        <div class="projectList-title pronm" href="javascript:void(0)" onClick={this.handleRedirectProject.bind(this, p.tpro_id)}><h2>{p.tpro_name}</h2></div>
                                                    </div>}
                                                </div>




                                            ))}
                                            {/* <div class="projectList-items">
                                                <a href="javascript:void(0)"></a>
                                                <div class="thumbsave">
                                                    <button class="save-trigger"><i class="bi-pencil"></i></button>
                                                </div>
                                                <div class="projectList-cover"><img src="assets/images/projects/project-cover-2.jpg" /></div>
                                                <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                                <div class="projectList-ft">
                                                    <div class="projectList-author">BM Architects</div>
                                                    <span class="projectViews">246 Views</span>
                                                </div>
                                            </div>
                                            <div class="projectList-items">
                                                <a href="javascript:void(0)"></a>
                                                <div class="thumbsave">
                                                    <button class="save-trigger"><i class="bi-pencil"></i></button>
                                                </div>
                                                <div class="projectList-cover"><img src="assets/images/projects/project-cover-3.jpg" /></div>
                                                <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                                <div class="projectList-ft">
                                                    <div class="projectList-author">BM Architects</div>
                                                    <span class="projectViews">246 Views</span>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>

                                    <div class="tab-pane fade" id="livexp">
                                        <div class="bwp-top-bar">
                                            <div class="bwp-bar"><button onClick={this.reloadPage} class="back"></button><h2 class="pg-title">Living Experience <small></small></h2></div>
                                            <div>
                                                <NavLink exact to="/add-living-experience/"><button class="btn btn-outline">Add</button></NavLink>
                                            </div>
                                        </div>

                                        {/* <div class="bwp-top-bar">
                                            <div class="bwp-bar"><button onClick={this.reloadPage} class="back"></button><h2 class="pg-title">My Projects <small></small></h2></div>
                                            <div>
                                                <NavLink exact to="/Upload-project/"><button class="btn btn-outline">New Project</button></NavLink>
                                            </div>
                                        </div> */}

                                        <div class="projectpage-grid">
                                            {Object.entries(this.state.living_experience).map(([o, p]) => (
                                                <div class="projectList-items">
                                                    {p.save_type == 'Draft' && <div>
                                                        <div class="thumbtag"><span class="new">Draft</span></div>
                                                        <div class="thumbsave">

                                                            <a href="javascript:void(0)"><button type="button" class="save-trigger" onClick={this.handleRemoveLiving.bind(this, p.living_id)}><img src="https://img.icons8.com/material-outlined/24/000000/delete-sign.png" /></button></a>
                                                        </div>

                                                        <div class="projectList-cover"><img src={p.living_image} /></div>
                                                        <div class="projectList-title pronm" href="javascript:void(0)" onClick={this.handleRedirectLivingAdd.bind(this, p.living_id)}><h2>{p.living_name}</h2></div>
                                                        <div class="projectList-ft">
                                                            <div class="projectList-author">{p.living_category}</div>
                                                            {/* <span class="projectViews">246 Views</span> */}
                                                        </div>
                                                    </div>}

                                                    {p.save_type == 'Publish' && <div>
                                                        <div class="thumbtag"><span class="new">Publish</span></div>
                                                        <div class="thumbsave">

                                                            <a href="javascript:void(0)"><button type="button" class="save-trigger" onClick={this.handleRemoveLiving.bind(this, p.living_id)}><img src="https://img.icons8.com/material-outlined/24/000000/delete-sign.png" /></button></a>
                                                        </div>

                                                        <div class="projectList-cover"><img src={p.living_image} /></div>
                                                        <div class="projectList-title pronm" href="javascript:void(0)" onClick={this.handleRedirectLiving.bind(this, p.living_id)}><h2>{p.living_name}</h2></div>
                                                        <div class="projectList-ft">
                                                            <div class="projectList-author">{p.living_category}</div>
                                                            {/* <span class="projectViews">246 Views</span> */}
                                                        </div>
                                                    </div>}
                                                </div>
                                            ))}
                                            {/* <div class="projectList-items">
                                                <a href="javascript:void(0)"></a>
                                                <div class="thumbsave">
                                                    <button class="save-trigger"><i class="bi-pencil"></i></button>
                                                </div>
                                                <div class="projectList-cover"><img src="assets/images/projects/project-cover-2.jpg" /></div>
                                                <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                                <div class="projectList-ft">
                                                    <div class="projectList-author">BM Architects</div>
                                                    <span class="projectViews">246 Views</span>
                                                </div>
                                            </div>
                                            <div class="projectList-items">
                                                <a href="javascript:void(0)"></a>
                                                <div class="thumbsave">
                                                    <button class="save-trigger"><i class="bi-pencil"></i></button>
                                                </div>
                                                <div class="projectList-cover"><img src="assets/images/projects/project-cover-3.jpg" /></div>
                                                <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                                <div class="projectList-ft">
                                                    <div class="projectList-author">BM Architects</div>
                                                    <span class="projectViews">246 Views</span>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>

                                    <div class="tab-pane fade" id="settings">
                                        <div class="bwp-top-bar"><div class="bwp-bar"><button onClick={this.reloadPage} class="back"></button><h2 class="pg-title"><small>Settings</small></h2></div></div>
                                        <div class="settings-block">
                                            <div class="list-justify">
                                                <strong>Push Notification </strong>
                                                {this.state.push_notification == 1 && <label class="switch"><input type="checkbox" id="push" checked defaultChecked={this.props.defaultChecked} onChange={this.handleSettingsPush.bind(this)} name="setting" /><span></span></label> || <label class="switch"><input type="checkbox" id="push" onChange={this.handleSettingsPush.bind(this)} name="setting" /><span></span></label>}

                                            </div>
                                            <div class="list-justify">
                                                <strong>Email Notification</strong>
                                                {this.state.email_notification == 1 && <label class="switch"><input type="checkbox" id="email" checked onChange={this.handleSettingsEmail.bind(this)} name="setting" className='aaa' /><span></span></label> || <label class="switch"><input type="checkbox" className='aaa' id="email" onChange={this.handleSettingsEmail.bind(this)} name="setting" /><span></span></label>}

                                            </div>
                                            <div class="list-justify">
                                                <strong>Newsletter</strong>
                                                {this.state.newsletter == 1 && <label class="switch"><input type="checkbox" checked id="newsletter" onChange={this.handleSettingsNewsLetter.bind(this)} name="setting" /><span></span></label> || <label class="switch"><input type="checkbox" id="newsletter" onChange={this.handleSettingsNewsLetter.bind(this)} name="setting" /><span></span></label>}

                                            </div>
                                        </div>

                                        <hr />
                                        <button type='button' className='btn btn-danger mt-5' onClick={this.handleCloseAccount.bind(this)}>Close Account</button>

                                    </div>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                {/* <div class="custom-popup">
                    <div class="pop-wrapper">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><i class="bi bi-x"></i></button>
                        <div class="order-detail-wrapper">
                            {Object.entries(this.initialState.my_order).map(([i, ord]) => (
                                <div class="order-item-main">
                                    <div class="ItemProduct-details">
                                        <div class="ItemProduct-details-thumb"><img src={ord.image} /></div>
                                        <div class="ItemProduct-details-info">
                                            <span>{ord.tp_title}</span>
                                            <div class="option-selected">
                                                <span>Color:<strong>{ord.tc_color}</strong></span>
                                                <span>Size:<strong>{ord.s_title}</strong></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div class="order-action-inpop">
                                <a href="" class="text-danger">Cancel Order</a>
                                <a href="" class="text-success">Get Help</a>
                            </div>
                            <div class="order-timeline-main">
                                <h5 class="sm-title">Tracking ID: 262684710563</h5>
                                <ul class="timeline">
                                    <li class="timeline-item">
                                        <div class="timeline-info">
                                            <span>Sat, 10 Apr, 5:00 PM</span>
                                        </div>
                                        <div class="timeline-marker"></div>
                                        <div class="timeline-content">
                                            <h3 class="timeline-title">Order Placed</h3>
                                        </div>
                                    </li>
                                    <li class="timeline-item">
                                        <div class="timeline-info">
                                            <span>Sat, 10 Apr, 9:30 PM</span>
                                        </div>
                                        <div class="timeline-marker"></div>
                                        <div class="timeline-content">
                                            <h3 class="timeline-title">Order Confirmed by KH Elite Architectural</h3>
                                        </div>
                                    </li>
                                    <li class="timeline-item">
                                        <div class="timeline-info">
                                            <span>Mon, 12 Apr, 8:00 AM</span>
                                        </div>
                                        <div class="timeline-marker"></div>
                                        <div class="timeline-content">
                                            <h3 class="timeline-title">Order Shipped by courier facility</h3>
                                        </div>
                                    </li>
                                    <li class="timeline-item">
                                        <div class="timeline-info">
                                            <span>Thu, 14 Apr, 3:00 PM</span>
                                        </div>
                                        <div class="timeline-marker"></div>
                                        <div class="timeline-content">
                                            <h3 class="timeline-title">Order Delivered</h3>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            <div class="order-pricebreakup-main">
                                <h5 class="sm-title">Price Summary</h5>
                                <div class="cart-pricebreakup">
                                    <dl>
                                        <dd>Total product amount</dd>
                                        <dt>$390</dt>
                                    </dl>
                                    <dl>
                                        <dd>shipping cost</dd>
                                        <dt class="text-danger">+ $30</dt>
                                    </dl>
                                    <dl>
                                        <dd>Discount</dd>
                                        <dt class="text-success">- $90</dt>
                                    </dl>
                                    <dl>
                                        <dd>Amount Paid</dd>
                                        <dt>$330</dt>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}
                <Modal show={this.state.show_order_modal} id="hide-order-pop" onHide={this.hideOrderModal} dialogClassName="modal-lg">
                    <div class="modal-header">
                        <h6 class="modal-title" id="hide-order-popLabel">Order Detail</h6>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.hideOrderModal}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div className="row">
                            <div className="col-md-12 grid-margin stretch-card">
                                <button className='btn btn-primary float-right' onClick={() => pdfFromReact("#download-order-pdf", "My-file", "p", true, false)
                                }>Download PDF</button>
                            </div>
                        </div>
                        <div id="download-order-pdf">
                            <div className="row" >
                                <div className="col-md-12 grid-margin stretch-card">
                                    <div className="card">
                                        {/* <div className="form_header">
                                        <h6 className="card-title">Order Detail</h6><hr />
                                    </div> */}
                                        <div className="card-body">

                                            <div className='row'>
                                                <div className='col-md-4'>
                                                    <h4>Shipping Detail</h4>
                                                    <p><b>{this.state.form_data.o_shipping_first_name} {this.state.form_data.o_shipping_last_name}</b></p>
                                                    <p>Email : {this.state.form_data.o_shipping_email}</p>
                                                    <p>Mobile : {this.state.form_data.o_shipping_mobile}</p>
                                                    <p>Address : {this.state.form_data.o_shipping_house_no}, {this.state.form_data.o_shipping_apartment}, {this.state.form_data.o_shipping_city}, {this.state.form_data.o_shipping_postcode}</p>

                                                </div>
                                                <div className='col-md-4'>
                                                    <h4>Billing Detail</h4>
                                                    <p><b>{this.state.form_data.o_billing_first_name} {this.state.form_data.o_billing_last_name}</b></p>
                                                    <p>Email : {this.state.form_data.o_billing_email}</p>
                                                    <p>Mobile : {this.state.form_data.o_billing_mobile}</p>
                                                    <p>Address : {this.state.form_data.o_billing_house_no}, {this.state.form_data.o_billing_apartment}, {this.state.form_data.o_billing_city}, {this.state.form_data.o_billing_postcode}</p>
                                                </div>

                                                <div className='col-md-4'>
                                                    <p>
                                                        <b>Status</b> : {(() => {
                                                            if (this.state.form_data.o_status == 0) {
                                                                return (<span>Processing</span>)
                                                            } else if (this.state.form_data.o_status == 1) {
                                                                return (<span>On-Hold</span>)
                                                            } else if (this.state.form_data.o_status == 2) {
                                                                return (<span>Shipped</span>)
                                                            } else if (this.state.form_data.o_status == 3) {
                                                                return (<span>Out for Delivery</span>)
                                                            } else if (this.state.form_data.o_status == 4) {
                                                                return (<span>Delivered</span>)
                                                            } else if (this.state.form_data.o_status == 5) {
                                                                return (<span>Completed</span>)
                                                            } else if (this.state.form_data.o_status == 6) {
                                                                return (<span>Return & Refund</span>)
                                                            } else if (this.state.form_data.o_status == 7) {
                                                                return (<span>Cancelled</span>)
                                                            } else {
                                                                return (<span></span>)
                                                            }
                                                        })()}
                                                    </p>
                                                    <p><b>Date :</b> {this.state.form_data.o_created_at}</p>

                                                    <p><b>Paypal Transaction ID</b> : {this.state.form_data.o_paypal_id ? this.state.form_data.o_paypal_id : '-'}</p>
                                                    <p><b>Paypal Status</b> : {this.state.form_data.o_paypal_status ? this.state.form_data.o_paypal_status : '-'}</p>
                                                </div>
                                            </div>

                                            <table className="table mt-5">
                                                <thead>
                                                    <tr>
                                                        {/* <th>#</th> */}
                                                        <th>Name</th>
                                                        <th>Product</th>
                                                        <th>Seller</th>
                                                        <th>Amount</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {Object.entries(this.state.product_data).map(([i, v]) => (
                                                        <>
                                                            <tr>
                                                                {/* <td>{v.o_id}</td> */}
                                                                <td>{v.u_name}</td>
                                                                <td>{v.tp_title}</td>
                                                                <td>{v.seller_name}</td>
                                                                <td>{v.od_total}</td>
                                                            </tr>
                                                        </>

                                                    ))}
                                                </tbody>
                                            </table>

                                            <div className='row mt-5'>
                                                <div className='offset-md-8 col-md-2'>
                                                    Sub Total
                                                </div>
                                                <div className='col-md-2'>
                                                    {this.state.form_data.o_total}
                                                </div>
                                            </div><hr />
                                            {(() => {
                                                if (this.state.form_data.o_shipping_amount && this.state.form_data.o_shipping_amount != "" && this.state.form_data.o_shipping_amount != "NaN") {
                                                    return (
                                                        <>
                                                            <div className='row'>
                                                                <div className='offset-md-8 col-md-2'>
                                                                    Shipping Amount
                                                                </div>
                                                                <div className='col-md-2'>
                                                                    {this.state.form_data.o_shipping_amount}
                                                                </div>
                                                            </div><hr />
                                                        </>
                                                    )
                                                }
                                            })()}
                                            {(() => {
                                                if (this.state.form_data.o_discount && this.state.form_data.o_discount != "" && this.state.form_data.o_discount != "NaN") {
                                                    return (
                                                        <>
                                                            <div className='row'>
                                                                <div className='offset-md-8 col-md-2'>
                                                                    Discount
                                                                </div>
                                                                <div className='col-md-2'>
                                                                    {this.state.form_data.o_discount}
                                                                </div>
                                                            </div><hr />
                                                        </>
                                                    )
                                                }
                                            })()}

                                            <div className='row'>
                                                <div className='offset-md-8 col-md-2'>
                                                    Total
                                                </div>
                                                <div className='col-md-2'>
                                                    {(() => {
                                                        if (this.state.form_data.o_grand_total && this.state.form_data.o_grand_total != "" && this.state.form_data.o_grand_total != "NaN") {
                                                            return (
                                                                <>
                                                                    {this.state.form_data.o_grand_total}
                                                                </>
                                                            )
                                                        } else {
                                                            return (
                                                                <>
                                                                    {this.state.form_data.o_total}
                                                                </>
                                                            )
                                                        }
                                                    })()}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </Modal>
                <Modal show={this.state.show} id="address-pop" onHide={this.hideAddressModal}>

                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h6 class="modal-title" id="exampleModalLabel">My Address</h6>

                            </div>
                            <div class="modal-body">
                                <form onSubmit={this.handleSaveAddress}>
                                    <div class="row">
                                        <div class="col-lg-6 col-md-6">
                                            <div class="form-group">
                                                <label>Full Name <span class="required" title="required">*</span></label>
                                                <input type="text" name="full_name" id="full_name" class="text-control" value={this.state.address_form_data.full_name} onChange={this.handleChangeAddress} />
                                                {this.address_form_data_validator.message('Full name', this.state.address_form_data.full_name, 'required')}
                                            </div>
                                        </div>
                                        <div class="col-lg-6 col-md-6">
                                            <div class="form-group">
                                                <label>Phone <span class="required" title="required">*</span></label>
                                                <input type="text" name="mobile" id="mobile" value={this.state.address_form_data.mobile} onChange={this.handleChangeAddress} class="text-control" />
                                                {this.address_form_data_validator.message('Mobile', this.state.address_form_data.mobile, 'required|phone')}
                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <div class="form-group">
                                                <label>Select Country <span class="required" title="required">*</span></label>
                                                <select className="form-control" name="country" >
                                                    <option value="">Select Country</option>
                                                    {Object.entries(this.state.shipping_country).map(([o, p]) => (
                                                        <option value={p.text}>{p.text}</option>

                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="form-group">
                                                <label>Town / City <span class="required" title="required">*</span></label>
                                                <input type="text" name="city" class="text-control" value={this.state.address_form_data.city} onChange={this.handleChangeAddress} />
                                                {this.address_form_data_validator.message('City', this.state.address_form_data.city, 'required')}
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <div class="form-group">
                                                <label>Postcode / ZIP (optional) <span class="required" title="required">*</span></label>
                                                <input type="text" name="postcode" class="text-control" value={this.state.address_form_data.postcode} onChange={this.handleChangeAddress} />
                                                {this.address_form_data_validator.message('Postcode', this.state.address_form_data.postcode, 'required')}
                                            </div>
                                        </div>
                                        <div class="col-lg-12">
                                            <div class="form-group">
                                                <label>Street address <span class="required" title="required">*</span></label>
                                                <input class="text-control" placeholder="House number and street name" name="house_no" value={this.state.address_form_data.house_no} type="text" onChange={this.handleChangeAddress} />
                                                <input class="text-control" placeholder="Apartment, suite, unit etc. (optional)" name="apartment" value={this.state.address_form_data.apartment} type="text" onChange={this.handleChangeAddress} />
                                                {this.address_form_data_validator.message('House number', this.state.address_form_data.house_no, 'required')}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-secondary" onClick={this.hideAddressModal} >Close</button>
                                        <input type="hidden" name="id" id="id" value={this.state.address_form_data.id} />
                                        <button class="btn btn-primary">Save</button>
                                    </div>
                                </form>
                            </div>

                        </div>
                    </div>

                </Modal>
                <Modal show={this.state.show_logout} id="new-forum" onHide={this.hideLogoutModal}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Confirm Logout</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.hideLogoutModal}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure to logout?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={this.hideLogoutModal}>No</button>
                            <button onClick={this.handleLogoutFinal} data-dismiss="modal" className="btn btn-primary">Yes</button>
                        </div>
                    </div>
                </Modal>
                {/* <div className="modal fade" id="logoutModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Confirm Logout</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure to logout?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">No</button>
                                <button onClick={this.handleLogoutFinal} data-dismiss="modal" className="btn btn-primary">Yes</button>
                            </div>
                        </div>
                    </div>
                </div> */}
                <Modal show={this.state.show1} id="new-forum" onHide={this.hideQuestionModal}>
                    <form onSubmit={this.handleQuestionUpdate}>

                        <div role="document">
                            <div class="modal-header">
                                <h6 class="modal-title" id="exampleModalLabel">Edit question</h6>

                            </div>
                            <div class="modal-body p-4">
                                <div class="form-group">
                                    <label>Thread Title</label>
                                    <input type="hidden" name="id" id="id" value={this.state.edit_form_data.id} />
                                    <input type="text" name="title" id="title" value={this.state.edit_form_data.title} onChange={this.handleQuestionChange} class="text-control" />
                                    {this.validator.message('Title', this.state.edit_form_data.title, 'required')}
                                </div>
                                <div class="form-group">
                                    <label>Description</label>
                                    <textarea class="text-control" name="desc" id="desc" value={this.state.edit_form_data.desc} onChange={this.handleQuestionChange}></textarea>
                                    {this.validator.message('Description', this.state.edit_form_data.desc, 'required')}
                                </div>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" onClick={this.hideQuestionModal}>Cancel</button>
                                {is_login() && localStorage.getItem('type') == 1 && <button type="submit" class="btn btn-primary">Update</button>}
                                {!is_login() && <button type="submit" class="btn btn-primary" onClick={this.openLoginModal}>Update</button>}

                            </div>
                        </div>
                    </form>
                </Modal>








            </>
        );
    }
}
export default MyProfile;
