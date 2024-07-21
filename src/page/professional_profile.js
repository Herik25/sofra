import React, { Component } from 'react';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Helmet } from "react-helmet";
import Select from 'react-select';
import swal from 'sweetalert';
import SweetAlert from 'react-bootstrap-sweetalert';
import { Multiselect } from 'multiselect-react-dropdown';
import Select2 from 'react-select2-wrapper';
import 'react-select2-wrapper/css/select2.css';
import Loader from "react-loader";
// import Select from 'react-select';
import $, { readyException } from 'jquery';
// import { Helmet } from "react-helmet";
import Modal from 'react-bootstrap/Modal';

class ProfessionalProfile extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.change_form_data_validator = new SimpleReactValidator();

        var user_data = getUserDetail();
        var u_id = user_data ? user_data.u_id : '';

        var user_email = (user_data) ? user_data.u_email : '';
        var user_name = (user_data) ? user_data.u_name : '';
        var user_mobile = (user_data) ? user_data.u_mobile : '0';


        this.initialState = {
            status_data: [],
            loaded: false,

            form_data: {
                u_name: '',

                u_email: '',
                u_mobile: '0',
                u_id: u_id,
                u_vat_number: '',
                u_address: '',
                u_business_address: '',
                address: '',
                u_country: '',
                u_website: '',
                u_state: '',
                u_city: '',
                u_pincode: '',
                u_link: '',
                u_account_number: '',
                u_bank_name: '',
                u_ifsc_code: '',
                u_swift_code: '',
                tp_area: '',
                u_about_us: '',
                image: {},
                u_image: {},

            },
            service_form_data: {

            },
            category_add_more: [{ category: '', subcategory: '0', subcat_list: [] }],
            social_add_more: [{ platform: '', u_link: '' }],
            change_form_data: {
                u_id: u_id,
                u_old_password: '',
                u_new_password: '',
            },
            push_notification: '',
            email_notification: '',
            newsletter: '',
            document: '',
            document_status: '',
            profile_detail: [],
            category_list: [],
            area_list: [],
            professional_project_data: '',
            professional_booking: '',
            professional_project_count: '',
            professional_knowhow_data: '',
            professional_knowhow_count: '',
            error: ''
        }

        this.state = this.initialState;
        this.handleLogoutFinal = this.handleLogoutFinal.bind(this);
        this.handleUploadData = this.handleUploadData.bind(this);
        this.handleSocialChange = this.handleSocialChange.bind(this);
        this.handleSocialChangePlatform = this.handleSocialChangePlatform.bind(this);
        // login form data

        this.handleChange = this.handleChange.bind(this);

        this.handleLogout = this.handleLogout.bind(this);
        this.reloadPage = this.reloadPage.bind(this);
        this.handleSaveData = this.handleSaveData.bind(this);
        this.handleSaveServiceData = this.handleSaveServiceData.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeSubcategory = this.handleChangeSubcategory.bind(this);
        this.handlechangePass = this.handlechangePass.bind(this);
        this.handleinputChangepass = this.handleinputChangepass.bind(this);
        this.handleAddMore = this.handleAddMore.bind(this);
        this.handleAddSocialMedia = this.handleAddSocialMedia.bind(this);

        this.openLogoutModal = this.openLogoutModal.bind(this);
        this.hideLogoutModal = this.hideLogoutModal.bind(this);

        this.handleRemove = this.handleRemove.bind(this);
        this.handleRemoveMedia = this.handleRemoveMedia.bind(this);
        this.area_list_dropdown();
        this.get_profile_data();
        this.get_professional_setting();
        this.get_professional_project();
        this.get_professional_knowhow();
        this.get_professional_booking();
        this.get_professional_service();
        this.get_professional_document();
        this.category_list_dropdown();


    }

    openLogoutModal(e) {
        this.setState({ show_logout: true });
    }

    hideLogoutModal(e) {
        e.preventDefault();
        this.setState({ show_logout: false });
    }

    reloadPage() {

        $(".account-sidebar").removeClass("hide");
        $(".account-component").removeClass("visible");
    }
    componentDidMount() {

    }

    async handleLogoutFinal() {
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
    async handleUploadData() {
        var image = $('#image').val();

        api_option.url = 'prof_upload_document';
        api_option.data = { professional_id: this.state.form_data.u_id, image: image };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    if (res.data.data > 0) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    toast.error(res.data.message);
                    //  this.get_cart_data();
                }
            })
            .catch(error => {

            });
    }

    handleRemove(e, i) {
        var data = this.state['category_add_more'].splice(i, 1);
        this.setState({ data });
    }
    handleRemoveMedia(e, i) {
        var data = this.state['social_add_more'].splice(i, 1);
        this.setState({ data });
    }
    handleAddMore() {

        var data = this.state['category_add_more'].push({ category: '', subcategory: '', subcat_list: [] });

        this.setState({ data });
    }

    handleAddSocialMedia() {

        var data = this.state['social_add_more'].push({ platform: '', u_link: '' });

        this.setState({ data });
    }

    async get_professional_setting() {
        api_option.url = 'get_setting';
        api_option.data = { professional_id: this.state.form_data.u_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        await axios(api_option)
            .then(res => {
                if (res.data.status) {

                    // this.state.form_data.push_notification = res.data.data.push_notification;
                    this.setState({ push_notification: res.data.data.push_notification });
                    this.setState({ email_notification: res.data.data.email_notification });
                    this.setState({ newsletter: res.data.data.newsletter });


                } else {
                    toast.error(res.data.message);
                    //  this.get_cart_data();
                }
            })
            .catch(error => {

            });

    }
    async get_professional_document() {
        this.setState({ loaded: false });
        api_option.url = 'get_prof_document';
        api_option.data = { professional_id: this.state.form_data.u_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {

                    // this.state.form_data.push_notification = res.data.data.push_notification;
                    this.setState({ document: res.data.data.tud_file });
                    this.setState({ document_status: res.data.data.tud_status });


                } else {
                    toast.error(res.data.message);
                    //  this.get_cart_data();
                }
            })
            .catch(error => {

            });

    }

    handleSettingsPush(event) {

        api_option.url = 'update_setting_push';
        api_option.data = { professional_id: this.state.form_data.u_id, status: event.target.checked };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {

                if (res.data.status) {
                    toast.success(res.data.message);
                    this.get_professional_setting();
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
                    toast.success(res.data.message);
                    this.get_professional_setting();
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

                    toast.success(res.data.message);
                    this.get_professional_setting();

                } else {
                    toast.error(res.data.message);
                    //  this.get_cart_data();
                }
            })
            .catch(error => {

            });
    }

    handleStatus(event, index, booking_id) {

        api_option.url = 'update_booking_status';
        api_option.data = { booking_id: booking_id, status: event.target.value };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {

                if (res.data.status) {

                    this.get_professional_booking();
                    toast.success(res.data.message);

                } else {

                    //  this.get_cart_data();
                }
            })
            .catch(error => {

            });

    }

    area_list_dropdown() {

        api_option.url = 'area_list_dropdown';
        api_option.data = {};
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var fnldata = [];
                    $.each(res.data.area_list, function (i, item) {

                        var temparr = new Object;
                        temparr['id'] = res.data.area_list[i].id;
                        temparr['text'] = res.data.area_list[i].text;
                        fnldata.push(temparr);

                    });
                    console.log(fnldata);
                    this.setState({ area_list: fnldata });

                } else {
                    this.setState({ redirect: '/product/' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }



    async get_professional_service(props) {
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';

        this.setState({ loaded: false });
        api_option.url = 'get_professional_service';
        api_option.data = { id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {
                    if (res.data.data.length > 0) {

                        var data = this.state.form_data.tp_area = res.data.data[0].tps_area_id;
                        this.setState({ data });

                        this.state['category_add_more'] = [];

                        for (var i = 0; i < res.data.data.length; i++) {
                            // var edit_data = {
                            //     category: res.data.data[i].tps_category_id,
                            //     subcategory: res.data.data[i].tps_subcategory_id,
                            //     subcat_list: [],
                            // }
                            // async function get_subcategory(i) {


                            //     api_option.url = 'professional_subcategory_list_dropdown';
                            //     ;
                            //     api_option.data = { category_id: res.data.data[i]['tps_category_id'] };
                            //     await axios(api_option)
                            //         .then(res => {
                            //             if (res.data.status) {

                            //                 var fnldata = [];
                            //                 $.each(res.data.subcategory_list, function (j, item) {
                            //                     fnldata.push({ 'value': res.data.subcategory_list[j].id, "label": res.data.subcategory_list[j].text });
                            //                 });

                            //                 edit_data['subcat_list'] = fnldata

                            //             } else {

                            //             }
                            //         })
                            //         .catch(error => {
                            //             // var data = this.state.category_add_more.push({ category: res.data.data[i]['tps_category_id'], subcategory: res.data.data[i]['tps_subcategory_id'], subcat_list: [] });
                            //             // this.setState({ data });
                            //             //this.setState({ redirect: '/logout' });
                            //         });
                            // }
                            // get_subcategory(i);
                            // var data = this.state.category_add_more.push(edit_data);

                            // this.setState({ data });


                            var data = this.state['category_add_more'].push({ category: res.data.data[i]['tps_category_id'], subcategory: res.data.data[i]['tps_subcategory_id'], subcat_list: [] });

                            this.setState({ data });
                            this.get_subcategory(res.data.data[i]['tps_category_id'], i);
                        }
                    }
                    // this.setState(this.state.service_form_data = res.data.data);

                    // var category_add_more = [];
                    // for (var i = 0; i < res.data.data.length; i++) {
                    //     category_add_more.push(res);
                    //     var data = this.state.form_data['category_add_more'] = valuedata;
                    //     this.setState({ data });
                    // }




                } else {
                    //this.setState({ redirect: '/Product/' });
                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
            });
    }


    handleFavourite(event, pid, sellerid) {

        var user_data = getUserDetail();

        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'add_to_favourite_project';
        api_option.data = { project_id: pid, user_id: user_id, sellerid: sellerid };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        axios(api_option)
            .then(res => {
                if (res.data.status) {

                    toast.success(res.data.message);
                    th.get_professional_project();
                    // th.setState({ redirect: '/productdetail/' + product_id });


                } else {
                    toast.error(res.data.message);
                    th.get_professional_project();

                    // this.setState({ redirect: '/logout' });

                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    handleLogout(event) {
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
        //window.$("#logoutModal").modal("show");

    }
    handleinputChangepass(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.change_form_data[name] = value;
        this.setState({ data });
    }
    handleChange(event) {

        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
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

        var data1 = this.state.form_data['u_is_image_delete'] = 'no';
        this.setState({ data1 });
    }


    // handleSaveServiceData(event) {

    //     event.preventDefault();
    //     api_option.url = 'save_services';

    //     const formData = new FormData();

    //     formData.append('id', this.state.form_data.u_id);
    //     formData.append('category_add_more', JSON.stringify(this.state.category_add_more));
    //     api_option.data = formData;
    //     console.log(formData)
    //     axios(api_option)
    //         .then(res => {
    //             const res_data = res.data;
    //             if (res_data.status) {
    //                 toast.success(res.data.message);

    //             } else {
    //                 toast.error(res.data.message);
    //             }
    //         })
    //         .catch(error => console.log(error));
    // }

    handleSaveServiceData(event) {

        event.preventDefault();
        // if (!this.validator.allValid()) {
        //     this.validator.showMessages();
        //     this.forceUpdate();
        // } else {

        if (this.state.form_data.tp_area != '') {
            var is_cat = true;
            for (var i = 0; i < this.state.category_add_more.length; i++) {
                if (this.state.category_add_more[i].category != '') {
                } else {
                    toast.error('Please select category');
                    is_cat = false;
                    // this.state.category_add_more.splice(i, 1);
                }
            }
            if (!is_cat) {
                return false
            }
        } else {
            toast.error('Please select service area');
            return false
        }
        this.setState({ loaded: false });
        api_option.url = 'save_services';
        api_option.data = { id: this.state.form_data.u_id, area: this.state.form_data.tp_area, category_add_more: JSON.stringify(this.state.category_add_more) };


        axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                const res_data = res.data;
                if (res_data.status) {
                    toast.success(res.data.message);
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(error => console.log(error));
        // }

    }

    handleRemoveKnowHow(id, event) {
        if (window.confirm("Are you sure to delete this item?")) {
            api_option.url = 'get_remove_know_how';
            api_option.data = { id: id };
            api_option.headers.Authorization = localStorage.getItem('token');
            axios(api_option)
                .then(res => {
                    const th = this;
                    const res_data = res.data;
                    if (res_data.status) {
                        toast.success(res.data.message);
                        this.get_professional_knowhow();
                    } else {
                        toast.error(res.data.message);
                        this.get_professional_knowhow();
                    }


                })
                .catch(error => {
                    // this.setState({ redirect: '/logout' });
                });
        }
        return false
    }
    handleRemoveProject(id, event) {
        if (window.confirm("Are you sure to delete this item?")) {
            api_option.url = 'get_remove_project';
            api_option.data = { id: id };
            api_option.headers.Authorization = localStorage.getItem('token');
            axios(api_option)
                .then(res => {
                    const th = this;
                    const res_data = res.data;
                    if (res_data.status) {
                        toast.success(res.data.message);
                        this.get_professional_project();
                    } else {
                        toast.error(res.data.message);
                        this.get_professional_project();
                    }


                })
                .catch(error => {
                    // this.setState({ redirect: '/logout' });
                });
        }
        return false
    }
    handleRedirectProjectAdd(id, event) {

        this.setState({ redirect: '/Upload-project/' + id });
    }
    handleRedirectProject(id, event) {

        this.setState({ redirect: '/professionalprojectdetail/' + id });
    }
    handleRedirectKnowHowAdd(id, event) {

        this.setState({ redirect: '/add-know-how/' + id });
    }
    handleRedirectKnowHow(id, event) {

        this.setState({ redirect: '/professionalknowhowdetail/' + id });
    }

    // change password
    handlechangePass(event) {

        event.preventDefault();
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
                    } else {
                        toast.error(res.data.message);
                    }
                })
                .catch(error => console.log(error));
        }

    }

    category_list_dropdown() {

        api_option.url = 'professional_category_list_dropdown';
        api_option.data = {};
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var fnldata = [];
                    $.each(res.data.category_list, function (i, item) {

                        var temparr = new Object;
                        temparr['value'] = res.data.category_list[i].id;
                        temparr['label'] = res.data.category_list[i].text;
                        fnldata.push(temparr);
                    });

                    this.setState({ category_list: fnldata });
                } else {
                    this.setState({ redirect: '/product/' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }

    async handleChangeSubcategory(event, i) {


        const name = event.lable;
        const value = event.target.value;
        var data = this.state.category_add_more[i]['subcategory'] = value;

        this.setState({ data });

    }


    async handleChangeArea(event) {

        const name = event.target.name;
        var options = event.target.selectedOptions;
        var value = [];
        for (var i = 0, l = options.length; i < l; i++) {
            if (options[i].selected) {
                value.push(options[i].value);
            }
        }
        var data = this.state.form_data[name] = value;
        this.setState({ data });
    }


    async get_subcategory(cat_id, i) {
        const value = cat_id;


        if (value != "") {
            api_option.url = 'professional_subcategory_list_dropdown';
            ;
            api_option.data = { category_id: value };
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        var fnldata = [];
                        $.each(res.data.subcategory_list, function (i, item) {
                            fnldata.push({ 'value': res.data.subcategory_list[i].id, "label": res.data.subcategory_list[i].text });
                        });
                        var data = this.state.category_add_more[i]['subcat_list'] = fnldata;
                        this.setState({ data });
                    } else {
                        this.setState({ redirect: '/home/' });
                    }
                })
                .catch(error => {
                    //this.setState({ redirect: '/logout' });
                });
        } else {
            this.setState({ subcat_list: {} });
        }
    }

    handleSocialChangePlatform(event, i) {

        const name = event.lable;
        const value = event.target.value;
        var data = this.state.social_add_more[i]['platform'] = value;
        this.setState({ data });
    }
    handleSocialChange(event, i) {
        const name = event.lable;
        const value = event.target.value;
        var data = this.state.social_add_more[i]['u_link'] = value;
        this.setState({ data });
    }

    async handleChangeCategory(event, i) {
        const name = event.lable;
        const value = event.target.value;
        var data = this.state.category_add_more[i]['category'] = value;
        this.setState({ data });

        if (value != "") {
            api_option.url = 'professional_subcategory_list_dropdown';
            ;
            api_option.data = { category_id: value };
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        var fnldata = [];
                        $.each(res.data.subcategory_list, function (i, item) {
                            fnldata.push({ 'value': res.data.subcategory_list[i].id, "label": res.data.subcategory_list[i].text });
                        });

                        var data = this.state.category_add_more[i]['subcat_list'] = fnldata;
                        this.setState({ data });
                    } else {
                        this.setState({ redirect: '/home/' });
                    }
                })
                .catch(error => {
                    //this.setState({ redirect: '/logout' });
                });
        } else {
            this.setState({ subcat_list: {} });
        }
    }

    async get_professional_booking() {

        api_option.url = 'get_professional_booking';
        api_option.data = { id: this.state.form_data.u_id };
        api_option.headers.Authorization = localStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                const th = this;
                if (res.data.status) {
                    const th = this;
                    var res_data = res.data.data;

                    this.setState(this.state.professional_booking = res.data.data);


                } else {
                    // this.setState({ redirect: '/user/' });
                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
            });
    }
    async get_professional_project() {

        api_option.url = 'get_professional_project';
        api_option.data = { id: this.state.form_data.u_id };
        api_option.headers.Authorization = localStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                const th = this;
                if (res.data.status) {
                    const th = this;
                    var res_data = res.data.data;

                    this.setState(this.state.professional_project_data = res.data.data);

                    this.setState(this.state.professional_project_count = res.data.project_count);

                } else {
                    this.setState({ redirect: '/user/' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    async get_professional_knowhow() {

        api_option.url = 'get_professional_knowhow';
        api_option.data = { id: this.state.form_data.u_id };
        api_option.headers.Authorization = localStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                const th = this;
                if (res.data.status) {
                    const th = this;
                    var res_data = res.data.data;
                    this.setState(this.state.professional_knowhow_data = res.data.data);

                } else {
                    // this.setState({ redirect: '/user/' });
                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
            });
    }
    async get_profile_data() {
        api_option.url = 'get_profile_data';
        api_option.data = { id: this.state.form_data.u_id };
        api_option.headers.Authorization = localStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                const th = this;
                if (res.data.status) {
                    const th = this;
                    var res_data = res.data.data;
                    console.log(res.data.data)
                    this.setState(this.state.form_data = res.data.data);
                    this.state['social_add_more'] = [];
                    if (res.data.data.social_add_more.length > 0) {
                        for (var j = 0; j < res.data.data.social_add_more.length; j++) {
                            var data = this.state['social_add_more'].push({ platform: res.data.data.social_add_more[j]['us_platform'], u_link: res.data.data.social_add_more[j]['us_link'] });
                            this.setState({ data });
                        }
                    }
                } else {
                    // this.setState({ redirect: '/user/' });
                }
            })
            .catch(error => {
                // this.setState({ redirect: '/logout' });
            });
    }



    handleSaveData(event) {
        // console.log("fsdfsfsdfsd");
        event.preventDefault();
        if (!this.validator.allValid()) {
            this.validator.showMessages();
            this.forceUpdate();
        } else {
            for (var i = 0; i < this.state.social_add_more.length; i++) {
                if (this.state.social_add_more[i].platform != '') {
                } else {
                    toast.error('Please select platform');
                    return false
                    // this.state.category_add_more.splice(i, 1);
                }

                if (this.state.social_add_more[i].u_link != '') {
                } else {
                    toast.error('Please enter link');
                    return false
                    // this.state.category_add_more.splice(i, 1);
                }
            }
            this.setState({ loaded: false });
            api_option.url = 'update_professional_profile_data';
            const formData = new FormData();
            formData.append('u_id', this.state.form_data.u_id);
            formData.append('u_business_name', this.state.form_data.u_business_name);
            formData.append('u_name', this.state.form_data.u_name);
            formData.append('u_email', this.state.form_data.u_email);
            formData.append('u_mobile', this.state.form_data.u_mobile);
            formData.append('u_website', this.state.form_data.u_website);
            formData.append('u_vat_number', this.state.form_data.u_vat_number);
            formData.append('u_business_address', this.state.form_data.u_business_address);
            formData.append('u_country', this.state.form_data.u_country);
            formData.append('u_state', this.state.form_data.u_state);
            formData.append('u_city', this.state.form_data.u_city);
            formData.append('u_pincode', this.state.form_data.u_pincode);
            formData.append('u_account_number', this.state.form_data.u_account_number);
            formData.append('u_bank_name', this.state.form_data.u_bank_name);
            formData.append('u_ifsc_code', this.state.form_data.u_ifsc_code);
            formData.append('u_swift_code', this.state.form_data.u_swift_code);
            formData.append('profile_pic', this.state.form_data.u_image);
            formData.append('u_about_us', this.state.form_data.u_about_us);
            formData.append('social_add_more', JSON.stringify(this.state.social_add_more));
            api_option.data = formData;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        toast.success(res.data.message);
                        // this.setState({ redirect: '/My-Account/' });
                        this.props.history.push('/Professional-profile');

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
                    <link href="/assets/seller/plugins/select2/select2.min.css" rel="stylesheet" type="text/css" />
                    <script src="/assets/js/custom.js?12"></script>
                    <script src="/assets/js/developer_signup_popup.js?123"></script>
                    <script src="/assets/js/steps.js"></script>

                    <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js'></script>
                    <script src='https://unpkg.com/aksfileupload@1.0.0/dist/aksFileUpload.min.js'></script>
                    <script src='https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1-rc.1/js/select2.min.js'></script>

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
                <div class="account-page-wrapper">
                    <div class="container">
                        <div class="account-page">
                            <div class="account-sidebar">
                                <div class="account-sidebar-links">
                                    <div class="ac-link-group">
                                        <ul class="nav">
                                            <li><span>Account</span></li>

                                            <li><a href="#profile" data-toggle="tab" ><i class="bi bi-person"></i> Profile Details</a></li>
                                            <li><a href="#prof_password" data-toggle="tab"><i class="bi bi-lock"></i> Change Password</a></li>
                                            <li><a href="#Services" data-toggle="tab"><i class="bi bi-box"></i> Services</a></li>
                                            <li><a href="#bank" data-toggle="tab"><i class="bi bi-heart"></i> Bank Details</a></li>
                                            {/* <li><a href="#verification" data-toggle="tab"><i class="bi bi-file-earmark-check"></i> Verification</a></li> */}
                                            <li><span>Activity</span></li>
                                            <li><a href="#bookings" data-toggle="tab"><i class="bi bi-journal-text"></i> My Bookings</a></li>
                                            <li><a href="#projects" data-toggle="tab"><i class="bi bi-app-indicator"></i> My Projects</a></li>
                                            <li><a href="#knowhow" data-toggle="tab"><i class="bi bi-journal-check"></i> My Know-how</a></li>
                                            <li><span>General</span></li>
                                            <li><a href="#settings" data-toggle="tab"><i class="bi bi-gear"></i> Settings</a></li>
                                            <li><a onClick={this.handleLogout} style={{ cursor: "pointer" }}><i class="bi bi-box-arrow-left"></i>Logout</a></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div class="account-component">
                                <div class="tab-content">
                                    <div class="tab-pane active" id="profile">
                                        <div class="bwp-top-bar"><div class="bwp-bar"><button onClick={this.reloadPage} class="back"></button><h2 class="pg-title">Profile Details</h2></div></div>
                                        <div class="w-70">
                                            <form onSubmit={this.handleSaveData}>
                                                <div class="ms-formfield">
                                                    <div class="form-group">
                                                        <div class="thumb-upload">
                                                            <div class="custom-upload">
                                                                <input type="file" id="file" name="u_image" onChange={this.handleChangeFile} />
                                                                <label for="file">
                                                                    <span><img src={this.state.form_data.u_image} class="img-fluid" id="user_image" alt="profile" style={{ height: "100px" }} /></span>
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="text-grid two">
                                                        <div class="form-group">
                                                            <label>Name</label>
                                                            <input type="text" class="text-control" name="u_name" id="u_name" data-validation="required" value={this.state.form_data.u_name} onChange={this.handleChange} />
                                                        </div>
                                                        <div class="form-group">
                                                            <label>Business Name</label>
                                                            <input type="text" class="text-control" name="u_business_name" id="u_business_name" value={this.state.form_data.u_business_name} onChange={this.handleChange} />
                                                            {this.validator.message('Business name', this.state.form_data.u_business_name, 'required')}
                                                            <input type="hidden" className="text-control" name="u_id" id="u_id" value={this.state.form_data.u_id} />
                                                        </div>
                                                    </div>
                                                    <div class="text-grid two">
                                                        <div class="form-group">
                                                            <label>Email</label>
                                                            <input type="text" class="text-control" name="u_email" id="u_email" value={this.state.form_data.u_email} onChange={this.handleChange} />
                                                            {this.validator.message('Email', this.state.form_data.u_email, 'required|email')}
                                                        </div>
                                                        <div class="form-group">
                                                            <label>Phone Number</label>
                                                            <input type="text" class="text-control" name="u_mobile" id="u_mobile" value={this.state.form_data.u_mobile} onChange={this.handleChange} />
                                                            {/* {this.validator.message('Phone', this.state.form_data.u_mobile, 'required|numeric')} */}
                                                        </div>
                                                    </div>
                                                    <div class="text-grid two">
                                                        <div class="form-group">
                                                            <label>Website</label>
                                                            <input type="text" class="text-control" name="u_website" id="u_website" value={this.state.form_data.u_website} onChange={this.handleChange} />
                                                            {this.validator.message('Website', this.state.form_data.u_website, 'url')}
                                                        </div>
                                                        <div class="form-group">
                                                            <label>VAT number</label>
                                                            <input type="text" class="text-control" name="u_vat_number" id="u_vat_number" value={this.state.form_data.u_vat_number} onChange={this.handleChange} />

                                                        </div>
                                                    </div>
                                                    <div class="text-grid">
                                                        <div class="form-group">
                                                            <label>About</label>
                                                            <textarea class="text-control" name="u_about_us" id="u_about_us" value={this.state.form_data.u_about_us} onChange={this.handleChange}>{this.state.form_data.u_about_us}</textarea>
                                                        </div>
                                                    </div>
                                                    <div class="text-grid">
                                                        <div class="form-group">
                                                            <label>Address</label>
                                                            <input type="text" name="u_business_address" id="u_business_address" value={this.state.form_data.u_business_address} onChange={this.handleChange} class="text-control" />
                                                            {this.validator.message('Address', this.state.form_data.u_business_address, 'required')}
                                                        </div>
                                                    </div>
                                                    <div class="text-grid two">
                                                        <div class="form-group">
                                                            <label>Country</label>
                                                            <input type="text" className="text-control" name="u_country" id="u_country" value={this.state.form_data.u_country} onChange={this.handleChange} />
                                                            {this.validator.message('Country', this.state.form_data.u_country, 'required')}
                                                        </div>
                                                        {/* <div class="form-group">
                                                            <label>State</label>
                                                            <input type="text" className="text-control" name="u_state" id="u_state" value={this.state.form_data.u_state} onChange={this.handleChange} />
                                                            {this.validator.message('State', this.state.form_data.u_state, 'required')}
                                                        </div> */}
                                                    </div>
                                                    <div class="text-grid two">
                                                        <div class="form-group">
                                                            <label>City</label>
                                                            <input type="text" className="text-control" name="u_city" id="u_city" value={this.state.form_data.u_city} onChange={this.handleChange} />
                                                            {this.validator.message('City', this.state.form_data.u_city, 'required')}
                                                        </div>
                                                        <div class="form-group">
                                                            <label>Pincode</label>
                                                            <input type="text" className="text-control" name="u_pincode" id="u_pincode" value={this.state.form_data.u_pincode} onChange={this.handleChange} />
                                                            {this.validator.message('Zipcode', this.state.form_data.u_pincode, 'required|numeric')}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div class="my-4">
                                                    <h6>Social Media</h6>
                                                    {Object.entries(this.state.social_add_more).map(([i, v]) => (
                                                        <div class="list-input-wrap">

                                                            <div>
                                                                <select class="text-control" name="platform" id="platform" value={v.platform} onChange={e => this.handleSocialChangePlatform(e, i)}>
                                                                    <option value="0">Select</option>
                                                                    <option value="facebook">Facebook</option>
                                                                    <option value="twitter">Twitter</option>
                                                                    <option value="linkedin">LinkedIn</option>
                                                                    <option value="youtube">Youtube</option>
                                                                    <option value="instagram">Instagram</option>
                                                                </select>
                                                            </div>

                                                            <div class="input-link">
                                                                <input type="text" class="text-control" name="u_link" id="u_link" value={v.u_link} onChange={e => this.handleSocialChange(e, i)} placeholder="Link" />

                                                            </div>
                                                            {i != 0 && <button type="button" class="addServices-trigger" onClick={er => this.handleRemoveMedia(er, i)} ><i class="bi bi-file-minus"></i></button>}
                                                        </div>
                                                    ))}
                                                    <div class="input-add">
                                                        <button class="addServices-trigger" type="button" onClick={this.handleAddSocialMedia}><i class="bi bi-plus"></i></button>
                                                    </div>
                                                </div>
                                                <button class="btn btn-primary">Save</button>
                                            </form>
                                        </div>
                                    </div>

                                    <div class="tab-pane fade" id="prof_password">
                                        <div class="bwp-top-bar"><div class="bwp-bar"><button onClick={this.reloadPage} class="back"></button><h2 class="pg-title"><small>Change Password</small></h2></div></div>
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

                                    <div class="tab-pane fade" id="Services">
                                        <div class="bwp-top-bar"><div class="bwp-bar"><button onClick={this.reloadPage} class="back"></button><h2 class="pg-title">Services</h2></div></div>
                                        <form onSubmit={this.handleSaveServiceData}>
                                            <div class="w-80">
                                                <div>
                                                    <div class="form-group ">
                                                        <label>Services Areas</label>

                                                        <Select2
                                                            multiple
                                                            name="tp_area"
                                                            data={this.state.area_list}
                                                            isSearchable={true}
                                                            onChange={this.handleChangeArea.bind(this)}
                                                            defaultValue={this.state.form_data.tp_area}
                                                            options={{ placeholder: 'Select Area', closeOnSelect: true }} />

                                                    </div>
                                                </div>

                                                <div class="addServices-wrapper">
                                                    {Object.entries(this.state.category_add_more).map(([i, v]) => (
                                                        <div class="addServices-row">
                                                            <div class="form-group services-category">
                                                                <label>Select Category</label>
                                                                {/* <select
                                                                    // value={v.category}
                                                                    value={this.state.form_data.category_id}
                                                                    onChange={e => this.handleChangeCategory(e, i)}

                                                                    isSearchable={true}
                                                                    options={this.state.category_list}
                                                                    id="category_id" name="category_id"
                                                                /> */}
                                                                <select className="form-control" value={v.category} onChange={e => this.handleChangeCategory(e, i)}>
                                                                    <option value="">Select Category</option>
                                                                    {Object.entries(this.state.category_list).map(([o, p]) => (
                                                                        <option value={p.value}>{p.label}</option>

                                                                    ))}

                                                                </select>
                                                            </div>
                                                            <div class="form-group services-subcategory">
                                                                <label>Select Sub-Category</label>
                                                                {/* <Select
                                                                    value={this.state.form_data.subcat_id}
                                                                    onChange={ev => this.handleChangeSubcategory(ev, i)}
                                                                    options={v.subcat_list}
                                                                    id="subcat_id" name="subcat_id"
                                                                /> */}
                                                                <select className="form-control" value={v.subcategory} onChange={e => this.handleChangeSubcategory(e, i)}>
                                                                    <option value="">Select Sub Category</option>
                                                                    {Object.entries(v.subcat_list).map(([o, p]) => (


                                                                        <option value={p.value}>{p.label}</option>

                                                                    ))}

                                                                </select>
                                                                {i != 0 && <button type="button" class="addServices-trigger" onClick={er => this.handleRemove(er, i)} >Remove Item<i class="bi bi-minus"></i></button>}


                                                            </div>


                                                        </div>
                                                    ))}
                                                    <button class="addServices-trigger" type="button" onClick={this.handleAddMore} >Add More <i class="bi bi-plus"></i></button>
                                                </div>
                                                <button class="btn btn-primary" >Save</button>
                                            </div>
                                        </form>
                                    </div>

                                    <div class="tab-pane fade" id="bank">
                                        <div class="bwp-top-bar"><div class="bwp-bar"><button onClick={this.reloadPage} class="back"></button><h2 class="pg-title">Bank Details</h2></div></div>
                                        <form onSubmit={this.handleSaveData}>
                                            <div class="w-70">
                                                <div class="ms-formfield">
                                                    <div class="text-grid">
                                                        <div class="form-group">
                                                            <label>Account Number</label>
                                                            <input type="text" className="text-control" name="u_account_number" id="u_account_number" data-validation="required" value={this.state.form_data.u_account_number} onChange={this.handleChange} />
                                                        </div>
                                                    </div>
                                                    <div class="text-grid two">
                                                        <div class="form-group">
                                                            <label>Bank Name</label>
                                                            <input type="text" className="text-control" name="u_bank_name" id="u_bank_name" data-validation="required" value={this.state.form_data.u_bank_name} onChange={this.handleChange} />
                                                        </div>
                                                        <div class="form-group">
                                                            <label>IFSC</label>
                                                            <input type="text" className="text-control" name="u_ifsc_code" id="u_ifsc_code" data-validation="required" value={this.state.form_data.u_ifsc_code} onChange={this.handleChange} />
                                                        </div>
                                                    </div>
                                                    <div class="text-grid">
                                                        <div class="form-group">
                                                            <label>Swift Code</label>
                                                            <input type="text" className="text-control" name="u_swift_code" id="u_swift_code" data-validation="required" value={this.state.form_data.u_swift_code} onChange={this.handleChange} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <button class="btn btn-primary">Save</button>
                                            </div>
                                        </form>
                                    </div>

                                    <div class="tab-pane fade" id="verification">
                                        <div class="bwp-top-bar"><div class="bwp-bar"><button onClick={this.reloadPage} class="back"></button><h2 class="pg-title">Verification</h2></div></div>
                                        <div class="w-70">
                                            <div class="doc-grid">
                                                {this.state.document_status == 0 && <div class="doc-list">
                                                    <figure><img src={this.state.document} /></figure>

                                                </div>}
                                                {this.state.document_status == 1 && <div class="doc-list">
                                                    <figure><img src={this.state.document} /></figure>
                                                    <span class="doc-status bg-success">Verified</span>
                                                </div>}
                                                {this.state.document_status == 2 && <div class="doc-list">
                                                    <figure><img src={this.state.document} /></figure>
                                                    <span class="doc-status bg-danger">Rejected</span>
                                                    <button class="btn btn-black" data-toggle="modal" data-target="#documentModal" >Submit Again</button>
                                                </div>}
                                            </div>
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

                                            {Object.entries(this.state.professional_booking).map(([o, k]) => (
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
                                                            <h5>{k.title}.</h5>
                                                            <div class="prof-ex-info">
                                                                <span><i class="bi bi-geo-alt-fill"></i>{k.location}</span>
                                                            </div>
                                                            <p>{k.description}</p>
                                                            <div class="product-options">
                                                                <strong>Status:</strong>
                                                                <div class="box-selection">
                                                                    <select class="cart-qty" id="orderstatus" name="orderstatus" onChange={e => this.handleStatus(e, o, k.id, k.status)}>
                                                                        <option>Choose</option>
                                                                        {k.status == 'Done' && <option selected>Done</option>}
                                                                        {k.status == 'Done' && <option>Open</option>}
                                                                        {k.status == 'Done' && <option>Cancel</option>}
                                                                        {k.status == 'Open' && <option selected>Open</option>}
                                                                        {k.status == 'Open' && <option>Done</option>}
                                                                        {k.status == 'Open' && <option>Cancel</option>}
                                                                        {k.status == 'Cancel' && <option selected>Cancel</option>}
                                                                        {k.status == 'Cancel' && <option >Done</option>}
                                                                        {k.status == 'Cancel' && <option >Open</option>}
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}

                                        </div>
                                    </div>

                                    <div class="tab-pane fade" id="projects">
                                        <div class="bwp-top-bar">
                                            <div class="bwp-bar"><button onClick={this.reloadPage} class="back"></button><h2 class="pg-title">My Projects <small>({this.state.professional_project_data.length}) item</small></h2></div>
                                            <div>
                                                <NavLink exact to="/upload-project/"><button class="btn btn-outline">Add Project</button></NavLink>
                                            </div>
                                        </div>
                                        <div class="projectpage-grid">

                                            {Object.entries(this.state.professional_project_data).map(([o, p]) => (
                                                <div class="projectList-items">
                                                    {p.save_type == 'Draft' && <div>
                                                        <div class="thumbtag"><span class="new">Draft</span></div>
                                                        <div class="thumbsave">
                                                            {(localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && is_login() && p.favourites == 0 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.tpro_id, p.tpro_seller_id)}><i class="bi-heart"></i></button>}
                                                            {(localStorage.getItem('type') == 1 || localStorage.getItem('type') == 2) && is_login() && p.favourites == 1 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.tpro_id, p.tpro_seller_id)}><i class="bi-heart-fill"></i></button>}
                                                            <a href="javascript:void(0)"><button type="button" class="save-trigger" onClick={this.handleRemoveProject.bind(this, p.tpro_id)}><img src="https://img.icons8.com/material-outlined/24/000000/delete-sign.png" /></button></a>
                                                        </div>

                                                        <div class="projectList-cover"><img src={p.tpro_image} /></div>
                                                        <div class="projectList-title pronm" onClick={this.handleRedirectProjectAdd.bind(this, p.tpro_id)}><h2>{p.tpro_name}</h2></div>
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
                                                <div class="thumbtag"><span class="new">New</span></div>
                                                <div class="thumbsave">
                                                    <button class="save-trigger"><i class="bi-heart"></i></button>
                                                </div>
                                                <div class="projectList-cover"><img src="/assets/images/projects/project-cover-1.jpg" /></div>
                                                <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                                <div class="projectList-ft">
                                                    <div class="projectList-author">BM Architects</div>
                                                    <span class="projectViews">246 Views</span>
                                                </div>
                                            </div>
                                            <div class="projectList-items">
                                                <a href="javascript:void(0)"></a>
                                                <div class="thumbtag"><span class="new">New</span></div>
                                                <div class="thumbsave">
                                                    <button class="save-trigger"><i class="bi-heart"></i></button>
                                                </div>
                                                <div class="projectList-cover"><img src="/assets/images/projects/project-cover-2.jpg" /></div>
                                                <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                                <div class="projectList-ft">
                                                    <div class="projectList-author">BM Architects</div>
                                                    <span class="projectViews">246 Views</span>
                                                </div>
                                            </div>
                                            <div class="projectList-items">
                                                <a href="javascript:void(0)"></a>
                                                <div class="thumbtag"><span class="new">New</span></div>
                                                <div class="thumbsave">
                                                    <button class="save-trigger"><i class="bi-heart"></i></button>
                                                </div>
                                                <div class="projectList-cover"><img src="/assets/images/projects/project-cover-3.jpg" /></div>
                                                <div class="projectList-title"><h2>A cozy recharge space for rich marketers in their twenties</h2></div>
                                                <div class="projectList-ft">
                                                    <div class="projectList-author">BM Architects</div>
                                                    <span class="projectViews">246 Views</span>
                                                </div>
                                            </div> */}
                                        </div>
                                    </div>

                                    <div class="tab-pane fade" id="knowhow">
                                        <div class="bwp-top-bar">
                                            <div class="bwp-bar"><button onClick={this.reloadPage} class="back"></button><h2 class="pg-title">Know-how <small>({this.state.professional_knowhow_data.length}) item</small></h2></div>
                                            <div>
                                                <NavLink exact to="/add-know-how/"><button class="btn btn-outline">Add know how</button></NavLink>
                                            </div>
                                        </div>
                                        <div class="knowhow-grid">
                                            {Object.entries(this.state.professional_knowhow_data).map(([o, p]) => (
                                                <div class="projectList-items">
                                                    {p.save_type == 'Draft' && <div>
                                                        <div class="thumbtag"><span class="new">Draft</span></div>
                                                        <div class="thumbsave">
                                                            <a href="javascript:void(0)"><button type="button" class="save-trigger" onClick={this.handleRemoveKnowHow.bind(this, p.know_how_id)}><img src="https://img.icons8.com/material-outlined/24/000000/delete-sign.png" /></button></a>
                                                        </div>

                                                        <div class="projectList-cover"><img src={p.know_how_image} /></div>
                                                        <div class="projectList-title pronm" href="javascript:void(0)" onClick={this.handleRedirectKnowHowAdd.bind(this, p.know_how_id)}><h2>{p.know_how_name}</h2></div>
                                                    </div>}

                                                    {p.save_type == 'Publish' && <div>
                                                        <div class="thumbtag"><span class="new">Publish</span></div>
                                                        <div class="thumbsave" >

                                                            <a href="javascript:void(0)"><button type="button" class="save-trigger" onClick={this.handleRemoveKnowHow.bind(this, p.know_how_id)}><img src="https://img.icons8.com/material-outlined/24/000000/delete-sign.png" /></button></a>
                                                        </div>

                                                        <div class="projectList-cover"><img src={p.know_how_image} /></div>
                                                        <div class="projectList-title pronm" href="javascript:void(0)" onClick={this.handleRedirectKnowHow.bind(this, p.know_how_id)}><h2>{p.know_how_name}</h2></div>
                                                    </div>}
                                                </div>
                                            ))}

                                        </div>
                                    </div>

                                    <div class="tab-pane fade" id="livexp">
                                        <div class="bwp-top-bar"><div class="bwp-bar"><button onClick={this.reloadPage} class="back"></button><h2 class="pg-title">Living Experience</h2></div></div>
                                    </div>

                                    <div class="tab-pane fade" id="settings">
                                        <div class="bwp-top-bar"><div class="bwp-bar"><button onClick={this.reloadPage} class="back"></button><h2 class="pg-title"><small>Settings</small></h2></div></div>
                                        <div class="settings-block">
                                            <div class="list-justify">
                                                <strong>Push Notification</strong>
                                                {this.state.push_notification == 1 && <label class="switch"><input type="checkbox" id="push" checked defaultChecked={this.props.defaultChecked} onChange={this.handleSettingsPush.bind(this)} name="setting" /><span></span></label> || <label class="switch"><input type="checkbox" id="push" onChange={this.handleSettingsPush.bind(this)} name="setting" /><span></span></label>}

                                            </div>
                                            <div class="list-justify">
                                                <strong>Email Notification</strong>
                                                {this.state.email_notification == 1 && <label class="switch"><input type="checkbox" id="email" checked onChange={this.handleSettingsEmail.bind(this)} name="setting" /><span></span></label> || <label class="switch"><input type="checkbox" id="email" onChange={this.handleSettingsEmail.bind(this)} name="setting" /><span></span></label>}

                                            </div>
                                            <div class="list-justify">
                                                <strong>Newsletter</strong>
                                                {this.state.newsletter == 1 && <label class="switch"><input type="checkbox" checked id="newsletter" onChange={this.handleSettingsNewsLetter.bind(this)} name="setting" /><span></span></label> || <label class="switch"><input type="checkbox" id="newsletter" onChange={this.handleSettingsNewsLetter.bind(this)} name="setting" /><span></span></label>}

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >

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

                <div className="modal fade" id="documentModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="exampleModalLabel">Upload document</h5>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <span><input type="file" name="image" id="image" className='form-control' /></span>

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-danger" data-dismiss="modal">Cancel</button>
                                <button onClick={this.handleUploadData} data-dismiss="modal" className="btn btn-success">Submit</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}
export default ProfessionalProfile;
