import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail, getUserId } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import $ from 'jquery';
import Select from 'react-select';
import { Multiselect } from 'multiselect-react-dropdown';
import Select2 from 'react-select2-wrapper';
import 'react-select2-wrapper/css/select2.css';
import { Helmet } from "react-helmet";
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Loader from "react-loader";
class Product extends Component {
    constructor(props) {

        super(props);
        var user_data = getUserDetail();
        this.validator = new SimpleReactValidator();
        var user_id = user_data ? user_data.u_id : '';

        this.initialState = {
            form_data: {
                category_id: '',
                tp_id: '',
                tp_product_link: '',
                u_id: user_id,
                subcat_id: '',
                tp_title: '',

                tp_price: '',
                tp_sale_price: '',
                tp_dimension: '',
                tp_size: '',
                tp_color: '',
                values: '',
                tp_sku: '',
                tp_stock_status: '',
                tp_quantity: '',
                tp_weight: '',
                tp_shipping_class: '',
                purchaseNote: '',
                u_image: '',
                previewImages: [],
                Images: [],
                tag: '',
                description: '',
                long_description: '',
                tp_descr: '',
                tp_long_descr: '',
                text_title: [{ value: "", title: "" }],

            },
            delete_images_id: [],
            color_form_data: {

            },
            tag_form_data: [],
            category_list: [],
            size_list: [],
            color_list: [],
            subcategory_list: [],
            subcategory_list_new: [],

            error: '',
            loaded: true
        }

        //console.log(this.initialState.form_data.previewImages)

        this.category_list_dropdown();
        this.size_list_dropdown();
        this.color_list_dropdown();
        this.state = this.initialState;
        this.handleSaveData = this.handleSaveData.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChangeSize = this.handleChangeSize.bind(this);
        this.handleChangeColor = this.handleChangeColor.bind(this);
        this.handleChangeSubcategory = this.handleChangeSubcategory.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.handleRemoveClick = this.handleRemoveClick.bind(this);
        this.handleTitleRemoveClick = this.handleTitleRemoveClick.bind(this);
        this.handleSaveTagData = this.handleSaveTagData.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleAddTitleClick = this.handleAddTitleClick.bind(this);

        this.handleChangeTextTitle = this.handleChangeTextTitle.bind(this);
        this.get_form_data();
        //  this.get_user_product_tag();
        this.get_product_color();
        this.get_product_size();
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            $(".icon-item").addClass("visgh");
        }

        $('#OpenImgUpload').click(function () { $('#imgupload').trigger('click'); });
    }
    handleAddTitleClick() {
        var data = this.state.form_data['text_title'].push({ value: "" });
        this.setState({ data });
    }
    handleTitleRemoveClick(i) {
        var data = this.state.form_data['text_title'].splice(i, 1);
        this.setState({ data });
    }
    handleSearch(event) {
        this.remarks = event.target.value;
    }

    onSelect(selectedList, selectedItem) {

    }

    onRemove(selectedList, removedItem) {

    }

    onSelectSize(selectedList, selectedItem) {

    }

    onRemoveSize(selectedList, removedItem) {

    }
    handleChangeTextTitle(event, i) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data['text_title'][i]['title'] = value;
        this.setState({ data });
    }
    handleChangeTextValue(event, i) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data['text_title'][i]['value'] = value;
        this.setState({ data });
    }
    handleRemoveClick(i, id) {
        //delete_images_id

        var datas = this.state.delete_images_id.push(id);
        this.setState({ datas });
        var data = this.state.form_data['previewImages'].splice(i, 1);
        this.setState({ data });

        var data1 = this.state.form_data['Images'].splice(i, 1);
        this.setState({ data1 });


    }

    //get edit form data
    async get_form_data(props) {
        const edit_id = this.props.match.params.id;
        if (edit_id) {
            api_option.url = 'get_seller_product_detail';
            api_option.data = { id: edit_id };
            api_option.headers.Authorization = sessionStorage.getItem('token');
            await axios(api_option)
                .then(res => {
                    if (res.data.status) {
                        this.setState(this.state.form_data = res.data.data);

                        var data = this.state.form_data['category_id'] = { label: res.data.data.pc_title, value: res.data.data.tp_c_id };
                        this.setState({ data });

                        var data = this.state.form_data['subcat_id'] = { label: res.data.data.sc_title, value: res.data.data.tp_sc_id };
                        this.setState({ data });

                        var image_array = [];
                        for (let i = 0; i < res.data.image_data.length; i++) {
                            image_array.push({
                                id: res.data.image_data[i].tpi_id,
                                image: res.data.image_data[i].tpi_image
                            });
                            //th.setState({ data });
                        }
                        var data = this.state.form_data['previewImages'] = image_array;
                        this.setState({ data });
                        var data = this.state.form_data['Images'] = [];
                        this.setState({ data });
                        var valuedata = [];
                        for (var i = 0; i < res.data.color_data.length; i++) {
                            valuedata.push(res.data.color_data[i]['tc_id']);

                        }
                        var data = this.state.form_data['tp_color'] = valuedata;
                        this.setState({ data });

                        var valuedata1 = [];
                        for (var i = 0; i < res.data.size_data.length; i++) {
                            valuedata1.push(res.data.size_data[i]['s_id']);

                        }
                        var data = this.state.form_data['tp_size'] = valuedata1;
                        this.setState({ data });


                    } else {
                        this.setState({ redirect: '/ProductList/' });
                    }
                })
                .catch(error => {
                    //  this.setState({ redirect: '/logout' });
                });
        }
    }






    //get user product tag
    // async get_user_product_tag(props) {
    //     var user_data = getUserDetail();
    //     var user_id = user_data ? user_data.u_id : '';
    //     var product_id = this.props.match.params.id;
    //     api_option.url = 'get_user_product_tag';
    //     api_option.data = { id: user_id, product_id: product_id };
    //     api_option.headers.Authorization = sessionStorage.getItem('token');
    //     await axios(api_option)
    //         .then(res => {
    //             if (res.data.status) {
    //                 this.setState(this.state.tag_form_data = res.data.data);

    //             } else {
    //                 this.setState({ redirect: '/Product/' });
    //             }
    //         })
    //         .catch(error => {
    //             this.setState({ redirect: '/logout' });
    //         });
    // }


    //get product color
    async get_product_color() {
        api_option.url = 'get_product_color';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var res_data = res.data.data;
                    // var valuedata = [];
                    // for (var i = 0; i < res_data.length; i++) {
                    //     valuedata.push(res_data[i]['tc_id']);
                    //     var data = this.state.form_data['tp_color'] = valuedata;
                    //     this.setState({ data });
                    // }
                    this.setState(this.state.color_form_data = res.data.data);

                } else {
                    this.setState({ redirect: '/Product/' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    //get product color
    async get_product_size() {
        api_option.url = 'get_product_edit_size';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var res_data = res.data.data;

                    // var valuedata = [];
                    // for (var i = 0; i < res_data.length; i++) {
                    //     valuedata.push(res_data[i]['s_id']);
                    //     var data = this.state.form_data['tp_size'] = valuedata;
                    //     this.setState({ data });
                    // }
                    this.setState(this.state.color_form_data = res.data.data);

                } else {
                    this.setState({ redirect: '/Product/' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }
    //handle Change File
    handleChangeFile(event) {


        // var data = this.state.form_data['package_detail'].push({ no_of_pkgs: "", type_of_packaging: "",amount:'' });
        // this.setState({ data });
        // let images = [];
        // var reader = new FileReader();
        // reader.onload = function (e) {
        //     //$('#user_image').attr('src', e.target.result);
        //     images.push(e.target.result)
        // }
        // reader.readAsDataURL(event.target.files[0]);
        // this.setState({
        //     previewImages: images
        // });
        // let images = [];
        var th = this;

        for (let i = 0; i < event.target.files.length; i++) {
            var reader = new FileReader();
            reader.onload = function (e) {
                var data = th.state.form_data['previewImages'].push({ image: e.target.result, id: 0 });
                th.setState({ data });
            }
            // console.log(th.state.form_data['Images'])
            reader.readAsDataURL(event.target.files[i]);

            var data1 = th.state.form_data['Images'].push(event.target.files[i]);

            th.setState({ data1 });

        }


        // var data = this.state.form_data['previewImages'].push(URL.createObjectURL(event.target.files[0]));
        // this.setState({ data });



        // const file_name = event.target.name;
        // const file_value = event.target.files[0];
        // const data = this.state.form_data[file_name] = file_value;
        // this.setState({ data });
    }


    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
    }


    handleSaveTagData(event) {
        api_option.url = 'add_product_tag';
        api_option.data = this.state.form_data;
        axios(api_option)
            .then(res => {
                const res_data = res.data;
                if (res_data.status) {
                    this.state.form_data.tag = '';
                    toast.success(res.data.message);
                    this.state.tag_form_data.push(res.data.data);
                    this.setState({ tag_form_data: this.state.tag_form_data });
                    //this.setState({ redirect: '/Product' });
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(error => console.log(error));
    }




    category_list_dropdown() {

        api_option.url = 'category_list_dropdown';
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


    size_list_dropdown() {

        api_option.url = 'size_list_dropdown';
        api_option.data = {};
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var fnldata = [];
                    $.each(res.data.size_list, function (i, item) {
                        var temparr = new Object;
                        temparr['id'] = res.data.size_list[i].id;
                        temparr['text'] = res.data.size_list[i].text;
                        fnldata.push(temparr);
                    });
                    this.setState({ size_list: fnldata });

                } else {
                    this.setState({ redirect: '/product/' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }


    color_list_dropdown() {

        api_option.url = 'color_list_dropdown';
        api_option.data = {};
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var fnldata = [];
                    $.each(res.data.color_list, function (i, item) {

                        var temparr = new Object;
                        temparr['id'] = res.data.color_list[i].id;
                        temparr['text'] = res.data.color_list[i].text;
                        fnldata.push(temparr);

                    });

                    this.setState({ color_list: fnldata });

                } else {
                    this.setState({ redirect: '/product/' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }

    // async handleChangeSize(event) {

    //     const name = event.lable;
    //     const value = event.value;
    //     // var data = this.state.form_data['tp_size'] = { label: event.label, value: value };
    //     // this.setState({ data });

    //     var data = this.state.form_data['tp_size'].push({ label: event.label, value: value });
    //     this.setState({ data });

    // }

    handleChangeSize(event) {
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

    // async handleChangeColor(event) {

    //     const name = event.lable;
    //     const value = event.value;
    //     var data = this.state.form_data['tp_color'] = { label: event.label, value: value };
    //     this.setState({ data });
    // }

    async handleChangeColor(event) {

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


    async handleChangeSubcategory(event) {

        const name = event.lable;
        const value = event.value;
        var data = this.state.form_data['subcat_id'] = { label: event.label, value: value };
        this.setState({ data });
    }


    async handleChangeCategory(event) {


        const name = event.lable;
        const value = event.value;
        var data = this.state.form_data['category_id'] = { label: event.label, value: value };
        this.setState({ data });
        var data = this.state.form_data['subcat_id'] = null;
        this.setState({ data });
        this.setState({ subcategory_list: {} });
        if (value != "") {
            api_option.url = 'subcategory_list_dropdown';

            api_option.data = { category_id: value };
            axios(api_option)
                .then(res => {
                    if (res.data.status) {

                        var fnldata = [];
                        $.each(res.data.subcategory_list, function (i, item) {
                            fnldata.push({ 'value': res.data.subcategory_list[i].id, "label": res.data.subcategory_list[i].text });
                        });
                        this.setState({ subcategory_list_new: fnldata });
                        this.setState({ subcat_list: fnldata });
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


    // form submit event
    handleSaveData(event) {
        event.preventDefault();
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';


        const tp_id = this.props.match.params.id;
        if (!this.validator.allValid()) {
            this.validator.showMessages();
            this.forceUpdate();
        } else {
            if (this.state.form_data['previewImages'].length == 0) {
                alert("Please upload atleast one image");
                return false;
            }
            this.setState({ loaded: false });
            api_option.url = 'add_seller_product';
            const formData = new FormData();
            formData.append('delete_images_id', this.state.delete_images_id);
            formData.append('category_id', this.state.form_data.category_id.value);
            formData.append('tp_size', this.state.form_data.tp_size);
            formData.append('tp_id', this.state.form_data.tp_id);
            formData.append('tp_product_link', this.state.form_data.tp_product_link);
            formData.append('tp_descr', this.state.form_data.tp_descr);
            formData.append('tp_long_descr', this.state.form_data.tp_long_descr);
            formData.append('tp_color', this.state.form_data.tp_color);
            formData.append('u_id', user_id);
            formData.append('subcat_id', this.state.form_data.subcat_id.value);
            formData.append('tp_title', this.state.form_data.tp_title);
            formData.append('tp_price', this.state.form_data.tp_price);
            formData.append('tp_sale_price', this.state.form_data.tp_sale_price);
            formData.append('tp_sku', this.state.form_data.tp_sku);
            formData.append('tp_stock_status', this.state.form_data.tp_stock_status);
            formData.append('tp_quantity', this.state.form_data.tp_quantity);
            formData.append('tp_weight', this.state.form_data.tp_weight);
            formData.append('tp_dimension', this.state.form_data.tp_dimension);
            formData.append('text_title', this.state.form_data.text_title);
            formData.append('tp_shipping_class', this.state.form_data.tp_shipping_class);
            formData.append('purchaseNote', this.state.form_data.purchaseNote);

            for (const key of Object.keys(this.state.form_data.Images)) {
                formData.append('Images', this.state.form_data.Images[key])
            }
            //formData.append('Images', this.state.form_data.Images);
            api_option.data = formData;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        this.setState({ redirect: '/ProductList' });
                        toast.success(res.data.message);
                        $(".icon-item").removeClass("visgh");

                    } else {
                        toast.error(res.data.message);
                    }
                })
                .catch(error => console.log(error));
        }
    }


    render() {
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>
                <Helmet>
                    <link rel="shortcut icon" href="/assets/seller/images/icon.png" />
                    <link href="/assets/seller/plugins/switchery/switchery.min.css" rel="stylesheet" />
                    <link href="/assets/seller/plugins/summernote/summernote-bs4.css" rel="stylesheet" />
                    <link href="/assets/seller/plugins/dropzone/dist/dropzone.css" rel="stylesheet" type="text/css" />
                    <link href="/assets/seller/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
                    <link href="/assets/seller/css/icons.css" rel="stylesheet" type="text/css" />
                    <link href="/assets/seller/css/flag-icon.min.css" rel="stylesheet" type="text/css" />
                    <link href="/assets/seller/plugins/select2/select2.min.css" rel="stylesheet" type="text/css" />
                    <link href="/assets/seller/css/style.css" rel="stylesheet" type="text/css"></link>

                    <script src="/assets/seller/js/jquery.min.js"></script>
                    <script src="/assets/seller/js/add_more.js"></script>
                    <script src="/assets/seller/js/popper.min.js"></script>
                    <script src="/assets/seller/js/bootstrap.min.js"></script>
                    <script src="/assets/seller/js/modernizr.min.js"></script>
                    <script src="/assets/seller/js/detect.js"></script>
                    <script src="/assets/seller/js/jquery.slimscroll.js"></script>
                    <script src="/assets/seller/js/vertical-menu.js"></script>
                    <script src="/assets/seller/plugins/switchery/switchery.min.js"></script>
                    <script src="/assets/seller/plugins/summernote/summernote-bs4.min.js"></script>
                    <script src="/assets/seller/plugins/dropzone/dist/dropzone.js"></script>
                    <script src="/assets/seller/js/custom/custom-ecommerce-product-detail-page.js"></script>
                    <script src="/assets/seller/plugins/select2/select2.min.js"></script>

                    <script src="/assets/seller/plugins/bootstrap-tagsinput/bootstrap-tagsinput.min.js"></script>
                    <script src="/assets/seller/plugins/bootstrap-tagsinput/typeahead.bundle.js"></script>
                    <script src="/assets/seller/js/custom/custom-form-select.js"></script>

                    <script src="/assets/seller/js/core.js"></script>
                    <script src="/assets/js/ckeditor.js"></script>
                    <script src="/assets/js/ck_init.js"></script>

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
                <div class="breadcrumbbar">
                    <div class="row align-items-center">
                        <div class="col-md-12 col-lg-12">
                            <h4 class="page-title">Add Product</h4>
                            <div class="breadcrumb-list">
                                <ol class="breadcrumb">
                                    <li class="breadcrumb-item"><NavLink exact to={'/Dashborad/'}>Home</NavLink></li>
                                    {/* <li class="breadcrumb-item"><a href="#">eCommerce</a></li> */}
                                    <li class="breadcrumb-item active" aria-current="page">Add Product</li>
                                </ol>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="contentbar">
                    <form onSubmit={this.handleSaveData}>
                        <div class="row">
                            <div class="col-lg-8 col-xl-9">
                                <div class="card m-b-30">
                                    <div class="card-header">
                                        <h5 class="card-title">Add Product</h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="form-group row">
                                            <label for="productTitle" class="col-sm-12 col-form-label">Product Title</label>
                                            <div class="col-sm-12">
                                                <input type="text" class="form-control font-20" name="tp_title" id="productTitle" placeholder="Title" value={this.state.form_data.tp_title} onChange={this.handleChange} />
                                                {this.validator.message('productTitle', this.state.form_data.tp_title, 'required')}
                                                <input type="hidden" className="text-control" name="seller_id" id="seller_id" value={this.state.form_data.u_id} />
                                                <input type="hidden" className="text-control" name="tp_id" id="product_id" value={this.state.form_data.tp_id} />
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label for="productTitle" class="col-sm-12 col-form-label">Product Link</label>
                                            <div class="col-sm-12">
                                                <input type="text" class="form-control font-20" name="tp_product_link" id="tp_product_link" placeholder="Link" value={this.state.form_data.tp_product_link} onChange={this.handleChange} />


                                            </div>
                                        </div>
                                        <div class="form-group row">
                                            <label class="col-sm-12 col-form-label">Short Description</label>
                                            <div class="col-sm-12">
                                                <CKEditor
                                                    editor={ClassicEditor}

                                                    onChange={(event, editor) => {
                                                        const data = editor.getData();

                                                        const data1 = this.state.form_data['tp_descr'] = data;
                                                        this.setState({ data1 });
                                                    }}

                                                    // data="ddd"
                                                    data={this.state.form_data['tp_descr']}
                                                //data={this.state.data1}
                                                />
                                                {/* <div class="summernote"></div>
                                                {this.validator.message('Description', this.state.form_data.productTitle, 'required')} */}
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label class="col-sm-12 col-form-label">Long Description</label>
                                            <div class="col-sm-12">
                                                <CKEditor
                                                    editor={ClassicEditor}


                                                    onChange={(event, editor) => {
                                                        const data = editor.getData();

                                                        const data1 = this.state.form_data['tp_long_descr'] = data;
                                                        this.setState({ data1 });
                                                    }}
                                                    data={this.state.form_data['tp_long_descr']}
                                                />
                                                {/* <div class="summernote"></div>
                                                {this.validator.message('Description', this.state.form_data.productTitle, 'required')} */}
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col-lg-12 col-xl-4">
                                        <div class="card m-b-30">
                                            <div class="card-body">
                                                <div class="nav flex-column nav-pills" id="v-pills-product-tab" role="tablist" aria-orientation="vertical">
                                                    <a class="nav-link mb-2 active" id="v-pills-general-tab" data-toggle="pill" href="#v-pills-general" role="tab" aria-controls="v-pills-general" aria-selected="true"><i class="feather icon-feather mr-2"></i>General</a>
                                                    <a class="nav-link mb-2" id="v-pills-stock-tab" data-toggle="pill" href="#v-pills-stock" role="tab" aria-controls="v-pills-stock" aria-selected="false"><i class="feather icon-box mr-2"></i>Stock</a>
                                                    {this.validator.message('Stock', this.state.form_data.tp_sku, 'required') || this.validator.message('Stock', this.state.form_data.tp_stock_status, 'required') || this.validator.message('Stock', this.state.form_data.tp_quantity, 'required')}
                                                    <a class="nav-link mb-2" id="v-pills-shipping-tab" data-toggle="pill" href="#v-pills-shipping" role="tab" aria-controls="v-pills-shipping" aria-selected="false"><i class="feather icon-truck mr-2"></i>Shipping</a>
                                                    {this.validator.message('Shipping', this.state.form_data.tp_weight, 'required') || this.validator.message('Shipping', this.state.form_data.tp_shipping_class, 'required')}
                                                    {/* <a class="nav-link mb-2" id="v-pills-advanced-tab" data-toggle="pill" href="#v-pills-advanced" role="tab" aria-controls="v-pills-advanced" aria-selected="false"><i class="feather icon-settings mr-2"></i>Overview</a> */}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-12 col-xl-8">
                                        <div class="card m-b-30">
                                            <div class="card-body">
                                                <div class="tab-content" id="v-pills-product-tabContent">
                                                    <div class="tab-pane fade show active" id="v-pills-general" role="tabpanel" aria-labelledby="v-pills-general-tab">

                                                        <div class="form-group row">
                                                            <label for="regularPrice" class="col-sm-4 col-form-label">Price(RO)</label>
                                                            <div class="col-sm-8">
                                                                <input type="text" class="form-control" name="tp_price" id="regularPrice" placeholder="100" value={this.state.form_data.tp_price} onChange={this.handleChange} />
                                                                {this.validator.message('regularPrice', this.state.form_data.tp_price, 'required')}
                                                            </div>
                                                        </div>
                                                        <div class="form-group row mb-0">
                                                            <label for="salePrice" class="col-sm-4 col-form-label">Sale Price(RO)</label>
                                                            <div class="col-sm-8">
                                                                <input type="text" class="form-control" name="tp_sale_price" id="salePrice" placeholder="50" value={this.state.form_data.tp_sale_price} onChange={this.handleChange} />

                                                            </div>
                                                        </div>
                                                        <div class="form-group row mb-0">
                                                            <label for="salePrice" class="col-sm-4 col-form-label">Dimension</label>
                                                            <div class="col-sm-8">
                                                                <input type="text" class="form-control" name="tp_dimension" id="tp_dimension" placeholder="50" value={this.state.form_data.tp_dimension} onChange={this.handleChange} />
                                                                {this.validator.message('Dimension', this.state.form_data.tp_dimension, 'required')}
                                                            </div>
                                                        </div>
                                                        <div class="form-group row mb-0">
                                                            <label for="salePrice" class="col-sm-4 col-form-label">Size</label>
                                                            <div class="col-sm-8">

                                                                {/* <Multiselect
                                                                    options={this.state.size_list}
                                                                    selectedValues={this.state.form_data.tp_size}
                                                                    onSelect={this.onSelectSize}
                                                                    onRemove={this.onRemoveSize}
                                                                    displayValue="name"
                                                                    onChange={this.handleChangeSize}
                                                                    id="tp_size" name="tp_size"
                                                                /> */}
                                                                {/* <Select
                                                                    value={this.state.form_data.tp_size}
                                                                    onChange={this.handleChangeSize}
                                                                    isSearchable={true}
                                                                    isMulti
                                                                    options={this.state.size_list}
                                                                    id="tp_size" name="tp_size"
                                                                    className="basic-multi-select"
                                                                    classNamePrefix="select"
                                                                /> */}


                                                                <Select2
                                                                    multiple
                                                                    name="tp_size"
                                                                    data={this.state.size_list}
                                                                    defaultValue={this.state.form_data.tp_size}
                                                                    onChange={this.handleChangeSize.bind(this)}
                                                                    options={{ placeholder: 'Select Size', closeOnSelect: true }} />



                                                                {/* <select multiple onChange={this.handleChange.bind(this)}>

                                                                    <option value="1">test</option>
                                                                    <option value="2">test2</option>
                                                                    <option value="2">test2</option>
                                                                    <option value="2">test2</option>
                                                                    <option value="2">test2</option>
                                                                    <option value="2">test2</option>
                                                                    <option value="2">test2</option>
                                                                    <option value="2">test2</option>
                                                                    <option value="2">test2</option>
                                                                    <option value="2">test2</option>
                                                                    <option value="2">test2</option>
                                                                    <option value="2">test2</option>

                                                                </select> */}
                                                                {this.validator.message('Size', this.state.form_data.tp_size, 'required')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="tab-pane fade" id="v-pills-stock" role="tabpanel" aria-labelledby="v-pills-stock-tab">

                                                        <div class="form-group row">
                                                            <label for="sku" class="col-sm-4 col-form-label">SKU</label>
                                                            <div class="col-sm-8">
                                                                <input type="text" class="form-control" name="tp_sku" id="sku" placeholder="SKU001" value={this.state.form_data.tp_sku} onChange={this.handleChange} />
                                                                {this.validator.message('sku', this.state.form_data.tp_sku, 'required')}
                                                            </div>
                                                        </div>
                                                        <div class="form-group row">
                                                            <label for="stockStatus" class="col-sm-4 col-form-label">Stock Status</label>
                                                            <div class="col-sm-8">
                                                                <select class="form-control" id="stockStatus" name="tp_stock_status" value={this.state.form_data.tp_stock_status} onChange={this.handleChange}>
                                                                    <option value="">Select</option>
                                                                    {this.state.form_data.tp_stock_status == 'instock' && <option value="instock" selected>In Stock</option>}
                                                                    {this.state.form_data.tp_stock_status != 'instock' && <option value="instock">In Stock</option>}
                                                                    {this.state.form_data.tp_stock_status == 'outofstock' && <option value="outofstock" selected>Out of Stock</option>}
                                                                    {this.state.form_data.tp_stock_status != 'outofstock' && <option value="outofstock">Out of Stock</option>}

                                                                </select>
                                                                {this.validator.message('Stockstatus', this.state.form_data.tp_stock_status, 'required')}
                                                            </div>
                                                        </div>
                                                        <div class="form-group row mb-0">
                                                            <label for="stockQuantity" class="col-sm-4 col-form-label">Quantity</label>
                                                            <div class="col-sm-8">
                                                                <input type="text" class="form-control" name="tp_quantity" id="stockQuantity" placeholder="100" value={this.state.form_data.tp_quantity} onChange={this.handleChange} />
                                                                {this.validator.message('stockQuantity', this.state.form_data.tp_quantity, 'required')}
                                                            </div>
                                                        </div>

                                                    </div>
                                                    <div class="tab-pane fade" id="v-pills-shipping" role="tabpanel" aria-labelledby="v-pills-shipping-tab">

                                                        <div class="form-group row">
                                                            <label for="weight" class="col-sm-4 col-form-label">Weight(kg)</label>
                                                            <div class="col-sm-8">
                                                                <input type="text" class="form-control" name="tp_weight" id="weight" placeholder="0" value={this.state.form_data.tp_weight} onChange={this.handleChange} />
                                                                {this.validator.message('weight', this.state.form_data.tp_weight, 'required')}
                                                            </div>
                                                        </div>
                                                        <div class="form-group row mb-0">
                                                            <label for="shippingClass" class="col-sm-4 col-form-label">Shipping Class</label>
                                                            <div class="col-sm-8">
                                                                <select class="form-control" id="shippingClass" name="tp_shipping_class" value={this.state.form_data.tp_shipping_class} onChange={this.handleChange}>
                                                                    <option value="">Select</option>
                                                                    {this.state.form_data.tp_shipping_class == 'noshipping' && <option value="noshipping" selected>No Shipping</option>}
                                                                    {this.state.form_data.tp_shipping_class != 'noshipping' && <option value="noshipping" >No Shipping</option>}
                                                                    {/* {this.state.form_data.tp_shipping_class == 'freeshipping' && <option value="freeshipping" selected>Free Shipping</option>}
                                                                    {this.state.form_data.tp_shipping_class != 'freeshipping' && <option value="freeshipping" >Free Shipping</option>} */}
                                                                    {this.state.form_data.tp_shipping_class == 'fixedshiping' && <option value="fixedshiping" selected>Fixed Shipping</option>}
                                                                    {this.state.form_data.tp_shipping_class != 'fixedshiping' && <option value="fixedshiping" >Fixed Shipping</option>}
                                                                </select>
                                                                {this.validator.message('stockStatus', this.state.form_data.tp_shipping_class, 'required')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="tab-pane fade" id="v-pills-advanced" role="tabpanel" aria-labelledby="v-pills-advanced-tab">
                                                        {/* <div class="cf-container">
                                                            {Object.entries(this.state.form_data.text_title).map(([i, v]) => (
                                                                <div class="cf-row" >
                                                                    <div class="cf-column"><input type="text" onChange={e => this.handleChangeTextTitle(e, i)} name="text_title" class="form-control" placeholder="Title" /></div>
                                                                    <div class="cf-column"><input type="text" name="title_value" onChange={e => this.handleChangeTextValue(e, i)} class="form-control" placeholder="Value" /></div>
                                                                    {i == 0 && <span class="cf-button" onClick={this.handleAddTitleClick}><i class="feather icon-plus" ></i></span>}
                                                                    {i != 0 && <span class="cf-button" onClick={() => this.handleTitleRemoveClick(i)} ><i class="feather icon-minus" ></i></span>}

                                                                </div>
                                                            ))}
                                                        </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="col-md-12 col-lg-12">
                                        <div class="widgetbar">
                                            <button type="submit" class="btn btn-primary">Publish</button>
                                        </div>
                                    </div>
                                </div>
                            </div>



                            <div class="col-lg-4 col-xl-3">
                                <div class="card m-b-30">
                                    <div class="card-header">
                                        <h5 class="card-title">Categories</h5>
                                    </div>
                                    <div class="card-body pt-0">
                                        <Select
                                            value={this.state.form_data.category_id}
                                            onChange={this.handleChangeCategory}
                                            isSearchable={true}
                                            options={this.state.category_list}
                                            id="category_id" name="category_id"
                                        />
                                        {this.validator.message('Category', this.state.form_data.category_id, 'required')}
                                    </div>
                                </div>
                                <div class="card m-b-30">
                                    <div class="card-header">
                                        <h5 class="card-title">Sub Categories</h5>
                                    </div>
                                    <div class="card-body pt-0">
                                        <Select
                                            value={this.state.form_data.subcat_id}
                                            onChange={this.handleChangeSubcategory}
                                            options={this.state.subcategory_list_new}
                                            id="subcat_id" name="subcat_id"
                                        />
                                        {this.validator.message('Subcategory', this.state.form_data.subcat_id, 'required')}
                                    </div>
                                </div>
                                <div class="card m-b-30">
                                    <div class="card-header">
                                        <h5 class="card-title">Color</h5>
                                    </div>
                                    <div class="card-body pt-3">
                                        <div class="custom-checkbox-button">
                                            {/* <Multiselect
                                                options={this.state.color_list}
                                                selectedValues={this.state.form_data.tp_color}
                                                onSelect={this.onSelect}
                                                onRemove={this.onRemove}
                                                displayValue="name"
                                                onChange={this.handleChangeColor}
                                                id="tp_color" name="tp_color"
                                            /> */}

                                            <Select2
                                                multiple
                                                name="tp_color"
                                                data={this.state.color_list}
                                                isSearchable={true}
                                                defaultValue={this.state.form_data.tp_color}
                                                onChange={this.handleChangeColor.bind(this)}
                                                options={{ placeholder: 'Select Color', closeOnSelect: true }} />
                                            {/* <Select
                                                value={this.state.form_data.tp_color}
                                                onChange={this.handleChangeColor}
                                                isSearchable={true}
                                                options={this.state.color_list}
                                                id="tp_color" name="tp_color"

                                            /> */}
                                            {this.validator.message('Color', this.state.form_data.tp_color, 'required')}

                                            {/* <div class="form-check-inline checkbox-primary">
                                                <input type="checkbox" id="customCheckboxInline5" name="customCheckboxInline2" checked />
                                                <label for="customCheckboxInline5"></label>
                                            </div>
                                            <div class="form-check-inline checkbox-secondary">
                                                <input type="checkbox" id="customCheckboxInline6" name="customCheckboxInline2" />
                                                <label for="customCheckboxInline6"></label>
                                            </div>
                                            <div class="form-check-inline checkbox-success">
                                                <input type="checkbox" id="customCheckboxInline7" name="customCheckboxInline2" />
                                                <label for="customCheckboxInline7"></label>
                                            </div>
                                            <div class="form-check-inline checkbox-danger">
                                                <input type="checkbox" id="customCheckboxInline8" name="customCheckboxInline2" />
                                                <label for="customCheckboxInline8"></label>
                                            </div>
                                            <div class="form-check-inline checkbox-warning">
                                                <input type="checkbox" id="customCheckboxInline9" name="customCheckboxInline2" />
                                                <label for="customCheckboxInline9"></label>
                                            </div>
                                            <div class="form-check-inline checkbox-info">
                                                <input type="checkbox" id="customCheckboxInline10" name="customCheckboxInline2" />
                                                <label for="customCheckboxInline10"></label>
                                            </div>
                                            <div class="form-check-inline checkbox-light">
                                                <input type="checkbox" id="customCheckboxInline11" name="customCheckboxInline2" />
                                                <label for="customCheckboxInline11"></label>
                                            </div>
                                            <div class="form-check-inline checkbox-dark">
                                                <input type="checkbox" id="customCheckboxInline12" name="customCheckboxInline2" />
                                                <label for="customCheckboxInline12"></label>
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                                <div class="card m-b-30">
                                    <div class="card-header">
                                        <h5 class="card-title">Tags</h5>
                                    </div>
                                    <div class="card-body">
                                        {/* <div class="product-tags">
                                            <span class="badge badge-secondary-inverse">{this.state.tag_form_data.tpt_tag}</span>
                                            <span class="badge badge-secondary-inverse">Latest</span>
                                            <span class="badge badge-secondary-inverse">Trending</span>
                                            <span class="badge badge-secondary-inverse">Popular</span>
                                            <span class="badge badge-secondary-inverse">Sale</span>
                                        </div> */}
                                        {this.props.match.params.id && this.props.match.params.id != '' && <div class="product-tags">
                                            {Object.entries(this.state.tag_form_data).map(([i, v]) => (
                                                <span class="badge badge-secondary-inverse">{v.tupt_tag}</span>
                                            ))}
                                        </div> || <div class="product-tags"></div>}
                                    </div>
                                    <div class="card-footer">
                                        <div class="add-product-tags">
                                            <form>
                                                <div class="input-group">
                                                    <input type="search" name="tag" id="tag" onInput={this.handleSearch} class="form-control" placeholder="Add Tags" aria-label="Search" aria-describedby="button-addonTags" value={this.state.form_data.tag} onChange={this.handleChange} />
                                                    <div class="input-group-append">
                                                        <button class="btn btn-primary-rgba btn-lg btn-block" onClick={this.handleSaveTagData} type="button">Add</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                                <div class="card m-b-30">
                                    <div class="card-header">
                                        <h5 class="card-title">Product Image Gallery</h5>
                                    </div>

                                    {this.state.form_data['previewImages'] && (
                                        <div class="card-body">
                                            <div class="productImg-display">
                                                {this.state.form_data['previewImages'].map((img, i) => {
                                                    return <div class="img-item">
                                                        <span onClick={() => this.handleRemoveClick(i, img.id)}></span>
                                                        <img src={img.image} id="user_image" alt="Rounded Image " class="img-fluid rounded" />
                                                    </div>
                                                })}

                                            </div>
                                        </div>
                                    )}
                                    {/* <div class="card-footer">
                                        <input type="file" id="u_image" name="u_image" onChange={this.handleChangeFile} class="btn btn-primary-rgba btn-lg btn-block" />Add Gallery
                                    </div> */}
                                    <div class="card-footer">
                                        <input type="file" multiple id="imgupload" name="Images[]" onChange={this.handleChangeFile} style={{ display: 'none' }} />
                                        {/* {this.validator.message('Images', this.state.form_data.Images, 'required')} */}

                                        <button type="button" id="OpenImgUpload" for="u_image" class="btn btn-primary-rgba btn-lg btn-block">Add Photos</button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </form>

                </div>



            </>
        );
    }
}
export default Product;