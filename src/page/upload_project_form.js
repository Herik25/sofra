import axios from 'axios';
import $ from 'jquery';
import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import { NavLink, Redirect } from 'react-router-dom';
import Select from 'react-select';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SimpleReactValidator from 'simple-react-validator';
import { api_option, getUserDetail } from '../api/Helper';
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { appendScript } from '../utils/appendScript'
import { function1 } from '../utils/jslibrary'
import ScriptTag from 'react-script-tag';
import Loader from "react-loader";
import Select2 from 'react-select2-wrapper';
import 'react-select2-wrapper/css/select2.css';
var serialize = require('form-serialize');

class UploadProject extends Component {

    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';
        var user_type = user_data ? user_data.u_type : '';

        // if (localStorage.getItem('project_name')) {
        //     var pname = localStorage.getItem('project_name');
        // } else {
        //     var pname = '';
        // }
        // if (localStorage.getItem('category_id')) {
        //     var cat_id = localStorage.getItem('category_id');

        // } else {
        //     var cat_id = '';
        // }
        // if (localStorage.getItem('size')) {
        //     var sze = localStorage.getItem('size');
        // } else {
        //     var sze = '';
        // }
        // if (localStorage.getItem('time')) {
        //     var tim = localStorage.getItem('time');
        // } else {
        //     var tim = '';
        // }
        // if (localStorage.getItem('work')) {
        //     var wrk = localStorage.getItem('work');
        // } else {
        //     var wrk = '';
        // }
        // if (localStorage.getItem('multiple_data')) {
        //     var multiple_data = JSON.parse(localStorage.getItem('multiple_data'));

        // } else {
        //     var multiple_data = [];
        // }
        // alert(localStorage.getItem('project_name'))
        // login form data
        this.initialState = {
            form_data: {

                project_name: '',
                category_id: '',
                time_id: '',
                work_id: '',
                u_id: user_id,
                u_type: user_type,
                size: '',
                work: '',
                time: '',
                tag: '',
                p_tag: '',
                short_desc: '',
                save_type: 'Publish',
                image: {},
                text_title: [],
                text_block: [],
                text_image: [],
                text_image_display: [],
                multiple_data: [],
            },
            tag_form_data: {

            },
            product_form_data: [],
            category_list: [],
            time_list: [],
            work_list: [],
            tag_list: [],
            options: [{ name: 'Oman', id: 1 }, { name: 'Bahrain', id: 2 }, { name: 'Kuwait', id: 3 }],
            error: '',
            loaded: true
        }
        this.category_list_dropdown();
        this.time_list_dropdown();
        this.work_list_dropdown();
        this.project_tag_list_dropdown();
        this.get_product_list();
        if (this.props.match.params.id) {
            this.get_front_project_detail();
        }
        this.state = this.initialState;
        this.save_as_draft = this.save_as_draft.bind(this);
        this.save_as_publish = this.save_as_publish.bind(this);
        this.handleSaveData = this.handleSaveData.bind(this);
        this.handleGetTagData = this.handleGetTagData.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleOnSearch = this.handleOnSearch.bind(this);
        this.handleChangeFile = this.handleChangeFile.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.handleOnHover = this.handleOnHover.bind(this);
        this.handleOnSelect = this.handleOnSelect.bind(this);
        this.handleOnFocus = this.handleOnFocus.bind(this);
        this.formatResult = this.formatResult.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleTextLimit = this.handleTextLimit.bind(this);
        this.handleSaveTagData = this.handleSaveTagData.bind(this);
        //this.openHotspotModal = this.openHotspotModal.bind(this);
        this.handleChangeMultipleData = this.handleChangeMultipleData.bind(this);
        // setTimeout(() => {
        //     this.handleAddClick();
        // }, 1000);

    }


    async handleChangeTag(event) {

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

    project_tag_list_dropdown() {

        api_option.url = 'project_tag_list';
        api_option.data = {};
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var fnldata = [];
                    $.each(res.data.tag_list, function (i, item) {

                        var temparr = new Object;
                        temparr['id'] = res.data.tag_list[i].id;
                        temparr['text'] = res.data.tag_list[i].text;
                        fnldata.push(temparr);

                    });

                    this.setState({ tag_list: fnldata });

                } else {
                    this.setState({ redirect: '/product/' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }

    handleTextLimit(event) {
        if (event.target.value.length > 161) {

            toast.error('you can not enter more than 2 rows');
            event.target.value = event.target.value.substring(0, 161);
            var data = this.state.form_data['short_desc'] = event.target.value;
            this.setState({ data });
            return false;
        } else {
            var data = this.state.form_data['short_desc'] = event.target.value;
            this.setState({ data });
        }

    }
    handleGetTagData(event) {

        var pro_array = [];
        $(".t_tooltip_content_wrap").each(function (index) {
            var classList = $(this).attr("class");
            var classArr = classList.split(/\s+/);
            var position = '';
            var product = '';
            var styleProps = $(this).parent().css([
                "left", "top"
            ]);
            var image_x = '';
            var image_y = '';
            $.each(styleProps, function (prop, value) {
                if (prop == 'left') {
                    image_x = value;
                }
                if (prop == 'top') {
                    image_y = value;
                }

            });
            $.each(classArr, function (index, value) {
                if (index == 2) {
                    if (value == 'left' || value == 'right' || value == 'top' || value == 'bottom') {
                        position = value;
                    } else {
                        product = value;
                    }
                }
                if (index == 3) {
                    if (value == 'left' || value == 'right' || value == 'top' || value == 'bottom') {
                        position = value;
                    } else {
                        product = value;
                    }
                }
            });
            pro_array.push({ position: position, product: product, image_x: image_x, image_y: image_y });
        });
        var lengths = this.state.form_data['multiple_data'].length - 1;
        var data = this.state.form_data['multiple_data'][lengths]['product_data'] = pro_array;
        this.setState({ data });
        // this.state.form_data['text_title'] = [];
        // this.state.form_data['text_block'] = [];
        // this.state.form_data['text_image'] = [];
        // this.state.form_data['text_image_display'] = [];

        $(".t_hotSpot").remove();
        $(".hotspot-modal").removeClass("visible");
    }

    handleChangeFile(event) {
        var th = this;
        if (event.target.files && event.target.files[0]) {
            // console.log(event.target.files[0].type);
            var file = event.target.files[0];
            if (file.type == "image/jpeg" || file.type == "image/jpg" || file.type == "image/png") {
                var reader = new FileReader();

                reader.onload = function (e) {
                    console.log(e.target);
                    $('#user_image').attr('src', e.target.result);
                    var data = th.state.form_data['text_image_display'].push({ value: e.target.result });
                    th.setState({ data });
                    var datas = th.state.form_data['multiple_data'].push({ image: event.target.files[0], image_display: e.target.result });
                    th.setState({ datas });
                }
                var datas = th.state.form_data['text_image'].push({ value: event.target.files[0] });
                th.setState({ datas });
                //text_image
                reader.readAsDataURL(event.target.files[0]);
                setTimeout(() => {
                    $("#u_image").val('');
                }, 500);
            } else {
                $("#u_image").val('');
                toast.error('Only jpeg, jpg and png files are allowed');
                return false;
            }
        }
        const file_name = event.target.name;
        const file_value = event.target.files[0];
        const data1 = this.state.form_data[file_name] = file_value;
        this.setState({ data1 });
    }
    // handleAddTitleClick() {

    //     var data = this.state.form_data['multiple_data'].push({ title: "" });
    //     this.setState({ data });
    // }
    handleAddMultiple(type) {
        //this.state.form_data['text_image'] = [];
        if (type == 'text') {
            var data = this.state.form_data['multiple_data'].push({ text: "" });
            this.setState({ data });
        } else if (type == 'desc') {
            var data = this.state.form_data['multiple_data'].push({ desc: "" });
            this.setState({ data });
        }

    }
    openHotspotModal(i, image_src) {

        if (this.state.form_data['multiple_data'][i]['product_data'] != undefined) {
            console.log(this.state.form_data['multiple_data'][i]['product_data']);
        }
        if (this.state.form_data['text_image'].length > 0) {
            $('#user_image').attr('src', image_src);
            $(".hotspot-modal").addClass("visible");
        } else {
            toast.error('Please add image first');
        }
    }
    closeHotspotModal() {
        $(".t_hotSpot").remove();
        $(".hotspot-modal").removeClass("visible");
    }
    handleRemoveClick(i) {

        var data = this.state.form_data['text_block'].splice(i, 1);
        var new_data = this.state.form_data['text_block'];
        this.setState({ new_data });
    }
    handleRemoveMultipleData(i, type) {
        var data = this.state.form_data['multiple_data'].splice(i, 1);
        var new_data = this.state.form_data['multiple_data'];
        this.setState({ new_data });
        // if (type == 'text') {
        //     var data = this.state.form_data['multiple_data'].splice(i, 1);
        //     var new_data = this.state.form_data['multiple_data'];
        //     this.setState({ new_data });
        // } else if (type == 'desc') {
        //     var data = this.state.form_data['multiple_data'].splice(i, 1);
        //     var new_data = this.state.form_data['multiple_data'];
        //     this.setState({ new_data });
        // }

    }

    handleChangeMultipleData(event, i, type) {
        if (type == 'text') {
            var data = this.state.form_data['multiple_data'][i]['text'] = event.target.value;
            this.setState({ data });
        } else if (type == 'desc') {
            var data = this.state.form_data['multiple_data'][i]['desc'] = event.target.value;
            this.setState({ data });
        }
    }
    // handleSearch(event) {

    //     const search_keyword = event.target.value;
    //     api_option.url = 'search_product';

    //     api_option.data = { search_keyword: search_keyword };
    //     axios(api_option)
    //         .then(res => {

    //             if (res.data.status) {
    //                 console.log(res.data.search_product_data)
    //                 this.setState(this.state.product_form_data = res.data.search_product_data);

    //             } else {
    //                 toast.error(res.data.message);
    //             }
    //         })
    //         .catch(error => console.log(error));

    // }

    handleOnSearch = (string, results) => {
        // onSearch will have as the first callback parameter
        // the string searched and for the second the results.
        console.log(string, results)
    }
    handleOnHover = (result) => {
        // the item hovered
        console.log(result)
    }

    handleOnSelect = (item) => {
        // the item selected
        $("#tag_products").val(item.id)
        console.log(item.id)
    }

    handleOnFocus = () => {
        console.log('Focused')
    }

    onSelect(selectedList, selectedItem) {

    }

    onRemove(selectedList, removedItem) {

    }

    onSelectSize(selectedList, selectedItem) {

    }

    onRemoveSize(selectedList, removedItem) {

    }

    formatResult = (item) => {
        return item;
        // return (<p dangerouslySetInnerHTML={{__html: '<strong>'+item+'</strong>'}}></p>); //To format result as html
    }
    //handleSearch
    async handleSearch(event) {
        const search_keyword = event.target.value;
        api_option.url = 'search_product';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        api_option.data = { search_keyword: search_keyword };
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    this.setState(this.state.product_form_data = res.data.search_product_data);

                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }

    onItemClick() {
        if (!this.validator.allValid()) {
            this.validator.showMessages();
            this.forceUpdate();
        } else {

            localStorage.setItem('project_name', $("#project_name").val());
            localStorage.setItem('category_id', $("#category_id").val());
            localStorage.setItem('time_id', $("#time_id").val());
            localStorage.setItem('work_id', $("#work_id").val());
            localStorage.setItem('size', $("#size").val());
            localStorage.setItem('short_desc', $("#short_desc").val());
            // localStorage.setItem('time', $("#time").val());
            // localStorage.setItem('work', $("#work").val());
            // localStorage.setItem('multiple_data', JSON.stringify(this.state.form_data.multiple_data));

            var data = this.state.form_data['image'] = $('#aksfileupload').prop('files')[0];
            this.setState({ data });


            this.setState({ loaded: false });
            api_option.url = 'save_project';
            const formData = new FormData();

            for (var i = 0; i < this.state.form_data.multiple_data.length; i++) {
                var img = this.state.form_data.multiple_data[i]['image'];

                if (img != undefined) {
                    this.state.form_data.multiple_data[i]['image_display'] = '';
                    if (img.type == "image/png") {
                        formData.append("img" + i, img, i + ".png");
                    } else if (img.type == "image/jpeg" || img.type == "image/jpg") {
                        formData.append("img" + i, img, i + ".jpg");
                    } else if (img.type.type == "image/gif") {
                        formData.append("img" + i, img, i + ".gif");
                    }
                }
            }


            formData.append('id', this.state.form_data.u_id);
            formData.append('project_name', this.state.form_data.project_name);
            formData.append('category', this.state.form_data.category_id);
            formData.append('size', this.state.form_data.size);
            formData.append('work_id', this.state.form_data.work_id);
            formData.append('time_id', this.state.form_data.time_id);
            // formData.append('work', this.state.form_data.work);
            // formData.append('time', this.state.form_data.time);
            formData.append('multiple_data', JSON.stringify(this.state.form_data.multiple_data));
            formData.append('profile_pic', this.state.form_data.image);
            formData.append('p_tag', this.state.form_data.p_tag);
            formData.append('short_desc', this.state.form_data.short_desc);
            formData.append('save_type', 'Draft');
            formData.append('project_id', this.props.match.params.id);

            api_option.data = formData;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        this.state.form_data.project_name = '';
                        this.state.form_data.category_id = '';
                        this.state.form_data.size = '';
                        this.state.form_data.time = '';
                        this.state.form_data.short_desc = '';
                        this.state.form_data.text_title = '';
                        this.state.form_data.text_block = '';
                        this.state.options = '';
                        this.state.form_data.image = '';
                        //pro_array = "";
                        localStorage.removeItem("project_name");
                        localStorage.removeItem("category_id");
                        localStorage.removeItem("work_id");
                        localStorage.removeItem("time_id");
                        localStorage.removeItem("size");
                        localStorage.removeItem("short_desc");
                        // localStorage.removeItem("time");
                        // localStorage.removeItem("work");
                        localStorage.removeItem("multiple_data");

                        toast.success("Save data successfully");
                        if (this.state.form_data.u_type == '2') {
                            this.setState({ redirect: '/Professional-profile/' });
                        }
                        else if (this.state.form_data.u_type == '3') {
                            this.setState({ redirect: '/Dashboard/' });
                        } else {
                            this.setState({ redirect: '/My-profile/' });
                        }

                    } else {
                        toast.error(res.data.message);
                    }
                })
                .catch(error => console.log(error));



        }
    }


    get_product_list() {
        api_option.url = 'search_product';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    this.setState(this.state.product_form_data = res.data.search_product_data);

                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }
    componentDidMount() {
        appendScript("https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js" + "?ts=" + new Date().getTime());
        appendScript("https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js" + "?ts=" + new Date().getTime());
        appendScript("https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1-rc.1/js/select2.min.js" + "?ts=" + new Date().getTime());
        appendScript("https://unpkg.com/aksfileupload@1.0.0/dist/aksFileUpload.min.js" + "?ts=" + new Date().getTime());

        appendScript("/assets/js/hotspot.js" + "?ts=" + new Date().getTime());
        appendScript("/assets/js/custom.js" + "?ts=" + new Date().getTime());
        appendScript("/assets/js/aks.js" + "?ts=" + new Date().getTime());
    }



    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data[name] = value;
        this.setState({ data });
    }

    async handleChangeCategory(event) {

        const name = event.lable;
        const value = event.target.value;

        var data = this.state.form_data['category_id'] = value;
        this.setState({ data });

    }

    async handleChangeTime(event) {

        const name = event.lable;
        const value = event.target.value;
        var data = this.state.form_data['time_id'] = value;
        this.setState({ data });

    }
    async handleChangeWork(event) {

        const name = event.lable;
        const value = event.target.value;
        var data = this.state.form_data['work_id'] = value;
        this.setState({ data });

    }

    category_list_dropdown() {

        api_option.url = 'latest_project_category_list_dropdown';
        api_option.data = {};
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var fnldata = [];
                    $.each(res.data.category_list, function (i, item) {
                        var temparr = new Object;
                        temparr['value'] = res.data.category_list[i].text;
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

    time_list_dropdown() {

        api_option.url = 'time_list_dropdown';
        api_option.data = {};
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var fnldata = [];
                    $.each(res.data.time_list, function (i, item) {
                        var temparr = new Object;
                        temparr['value'] = res.data.time_list[i].text;
                        temparr['label'] = res.data.time_list[i].text;
                        fnldata.push(temparr);
                    });
                    this.setState({ time_list: fnldata });
                } else {
                    this.setState({ redirect: '/product/' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }

    work_list_dropdown() {

        api_option.url = 'work_list_dropdown';
        api_option.data = {};
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var fnldata = [];
                    $.each(res.data.work_list, function (i, item) {
                        var temparr = new Object;
                        temparr['value'] = res.data.work_list[i].text;
                        temparr['label'] = res.data.work_list[i].text;
                        fnldata.push(temparr);
                    });
                    this.setState({ work_list: fnldata });
                } else {
                    this.setState({ redirect: '/product/' });
                }
            })
            .catch(error => {
                //this.setState({ redirect: '/logout' });
            });
    }

    save_as_draft(event) {
        var data = this.state.form_data['save_type'] = "Draft";
        this.setState({ data });
        /* console.log(this.state.form_data);
        return false; */

        this.handleSaveData(event);
    }

    save_as_publish(event) {
        var data = this.state.form_data['save_type'] = "Publish";
        this.setState({ data });
        /* console.log(this.state.form_data);
        return false; */

        this.handleSaveData(event);
    }


    // form submit event
    handleSaveData(event) {

        event.preventDefault();

        var data = this.state.form_data['image'] = $('#aksfileupload').prop('files')[0];
        this.setState({ data });
        if (!this.validator.allValid()) {
            this.validator.showMessages();
            this.forceUpdate();
        } else {

            this.setState({ loaded: false });
            api_option.url = 'save_project';
            const formData = new FormData();

            for (var i = 0; i < this.state.form_data.multiple_data.length; i++) {
                var img = this.state.form_data.multiple_data[i]['image'];

                if (img != undefined) {
                    this.state.form_data.multiple_data[i]['image_display'] = '';
                    if (img.type == "image/png") {
                        formData.append("img" + i, img, i + ".png");
                    } else if (img.type == "image/jpeg" || img.type == "image/jpg") {
                        formData.append("img" + i, img, i + ".jpg");
                    } else if (img.type.type == "image/gif") {
                        formData.append("img" + i, img, i + ".gif");
                    }
                }
            }


            formData.append('id', this.state.form_data.u_id);
            formData.append('project_name', this.state.form_data.project_name);
            formData.append('category', this.state.form_data.category_id);
            formData.append('work_id', this.state.form_data.work_id);
            formData.append('time_id', this.state.form_data.time_id);
            formData.append('size', this.state.form_data.size);
            formData.append('short_desc', this.state.form_data.short_desc);
            // formData.append('work', this.state.form_data.work);
            // formData.append('time', this.state.form_data.time);
            formData.append('multiple_data', JSON.stringify(this.state.form_data.multiple_data));
            formData.append('profile_pic', this.state.form_data.image);
            formData.append('p_tag', this.state.form_data.p_tag);

            formData.append('save_type', this.state.form_data.save_type);
            // formData.append('save_type', 'Publish');
            formData.append('project_id', this.props.match.params.id);
            api_option.data = formData;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        this.state.form_data.project_name = '';
                        this.state.form_data.category_id = '';
                        this.state.form_data.size = '';
                        this.state.form_data.time = '';
                        this.state.form_data.short_desc = '';
                        this.state.form_data.text_title = '';
                        this.state.form_data.text_block = '';
                        this.state.options = '';
                        this.state.form_data.image = '';
                        //pro_array = "";
                        localStorage.removeItem("project_name");
                        localStorage.removeItem("category_id");
                        localStorage.removeItem("size");
                        localStorage.removeItem("time");
                        localStorage.removeItem("short_desc");
                        localStorage.removeItem("work");
                        localStorage.removeItem("multiple_data");

                        toast.success(res.data.message);
                        if (this.state.form_data.u_type == '2') {
                            this.setState({ redirect: '/Professional-profile/' });
                        }
                        else if (this.state.form_data.u_type == '3') {
                            this.setState({ redirect: '/Dashboard/' });
                        } else {
                            this.setState({ redirect: '/My-profile/' });
                        }


                    } else {
                        toast.error(res.data.message);
                    }
                })
                .catch(error => console.log(error));
        }

    }
    get_front_project_detail() {

        api_option.url = 'get_front_project_detail';
        const formData = new FormData();
        formData.append('project_id', this.props.match.params.id);
        api_option.data = formData;
        axios(api_option)
            .then(res => {
                const res_data = res.data;
                if (res_data.status) {

                    var work = res.data.data

                    var multiple_data = res.data.project_tag_data
                    var user_tag = res.data.user_project_tag_data

                    var blank_array = [];
                    for (var i = 0; i < multiple_data.length; i++) {

                        if (multiple_data[i]['tpd_title']) {
                            blank_array.push({
                                text: multiple_data[i]['tpd_title']
                            })
                        } else if (multiple_data[i]['tpd_desc']) {
                            blank_array.push({
                                desc: multiple_data[i]['tpd_desc']
                            })
                        } else if (multiple_data[i]['tpd_image']) {
                            blank_array.push({
                                image_display: multiple_data[i]['tpd_image'],
                                product_data: multiple_data[i]['tpd_tag_data'],
                            })
                            this.state.form_data['text_image'].push(multiple_data[i]['tpd_image']);
                        }
                    }
                    var blank_array1 = [];
                    for (var i = 0; i < user_tag.length; i++) {
                        if (user_tag[i]['pt_tag']) {
                            blank_array1.push(user_tag[i]['pt_id'])
                        }
                    }

                    this.setState({
                        form_data: {
                            ...this.state.form_data,
                            work_id: work.tpro_work,
                            time_id: work.tpro_time,
                            size: work.tpro_size,
                            project_name: work.tpro_name,
                            short_desc: work.tpro_short_desc,
                            category_id: work.tpro_category,
                            image: work.tpro_image,
                            multiple_data: blank_array,
                            p_tag: blank_array1,
                        },
                    })



                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(error => console.log(error));


    }
    handleSaveTagData(event) {

        event.preventDefault();

        api_option.url = 'save_project';
        const formData = new FormData();
        formData.append('id', this.state.form_data.u_id);
        formData.append('project_name', this.state.form_data.project_name);
        formData.append('category_id', this.state.form_data.category_id);
        formData.append('work_id', this.state.form_data.work_id);
        formData.append('time_id', this.state.form_data.time_id);
        formData.append('size', this.state.form_data.size);
        formData.append('short_desc', this.state.form_data.short_desc);
        // formData.append('work', this.state.form_data.work);
        // formData.append('time', this.state.form_data.time);
        formData.append('text_title', JSON.stringify(this.state.form_data.text_title));
        formData.append('text_block', JSON.stringify(this.state.form_data.text_block));
        formData.append('profile_pic', this.state.form_data.image);
        api_option.data = formData;
        axios(api_option)
            .then(res => {
                const res_data = res.data;
                if (res_data.status) {
                    this.state.form_data.project_name = '';
                    this.state.form_data.category_id = '';
                    this.state.form_data.work_id = '';
                    this.state.form_data.time_id = '';
                    this.state.form_data.size = '';
                    this.state.form_data.time = '';
                    this.state.form_data.text_title = '';
                    this.state.form_data.text_block = '';
                    this.state.options = '';
                    this.state.form_data.image = '';

                    toast.success(res.data.message);
                    if (localStorage.getItem('device_type') == 'web') {
                        //window.location.href = '/shorfa/#/ProjectList';
                    } else {
                        // this.setState({ redirect: '/ProjectList' });
                    }
                    //window.location.href = "/shorfa/#/ProjectList"
                    // this.setState({ redirect: '/ProjectList' });
                } else {
                    toast.error(res.data.message);
                }
            })
            .catch(error => console.log(error));


    }


    onSelect(selectedList, selectedItem) {

    }

    onRemove(selectedList, removedItem) {

    }




    // view load header page
    render() {
        const { options, value } = this.state;
        if (this.state.redirect) {
            return <Redirect to={this.state.redirect} />
        }
        return (
            <>

                <Helmet>

                    {/* <link rel='stylesheet' href='https://unpkg.com/aksfileupload@1.0.0/dist/aksFileUpload.min.css' />
                    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1-rc.1/css/select2.min.css' />
                    <link rel='stylesheet' href='https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/themes/smoothness/jquery-ui.css' />
                    <script src="/assets/js/aks.js?12"></script>
                    <script src="/assets/js/seller.js?id=123"></script>
                    <script src='https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js'></script>
                    <script src='https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1-rc.1/js/select2.min.js'></script>
                    <script src='/assets/js/aksFileUpload.min.js?id=123'></script> */}

                    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" />
                    <link rel="stylesheet" href="https://unpkg.com/swiper/swiper-bundle.min.css" />
                    <link rel='stylesheet' href='https://unpkg.com/aksfileupload@1.0.0/dist/aksFileUpload.min.css' />
                    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1-rc.1/css/select2.min.css' />
                    <link rel='stylesheet' href='https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/themes/smoothness/jquery-ui.css' />
                    <link rel='stylesheet' href='/assets/css/hotspot.css' />
                    <link rel='stylesheet' href='/assets/css/custom.css' />



                    {/* <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.3/jquery.min.js'></script>
                    <script src='https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js'></script> */}

                    {/* <script src='https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1-rc.1/js/select2.min.js'></script>
                    <script src='https://unpkg.com/aksfileupload@1.0.0/dist/aksFileUpload.min.js'></script> */}

                    {/* <script src="/assets/js/aks.js?12"></script>
                    <script src="/assets/js/hotspot.js?12"></script>
                    <script src="/assets/js/custom.js?12"></script> */}
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

                <div className="mobile-view mobile-header">
                    <div className="mobile-header-left">
                        <h1 className="md-title m-0">Create Project</h1>
                    </div>
                    <div className="mobile-header-right">

                    </div>
                </div>
                <form id="example-form" onSubmit={this.handleSaveData}>
                    <div className="addproject-page">
                        <div className="container container-small">
                            <h1 className="md-title-2 web-view">Create Project</h1>
                            <div className="createProject-wrapper">

                                <div className="text-grid">
                                    <div className="form-group">
                                        <label>Project Name</label>
                                        <input type="text" name="project_name" id="project_name" className="text-control" value={this.state.form_data.project_name} onChange={this.handleChange} />
                                        <input type="hidden" className="text-control" name="seller_id" id="seller_id" value={this.state.form_data.u_id} />
                                        {this.validator.message('project name', this.state.form_data.project_name, 'required')}
                                    </div>
                                </div>


                                <div className="form-group">
                                    <label>Project Tag</label>
                                    <Select2
                                        multiple
                                        name="p_tag"
                                        data={this.state.tag_list}
                                        isSearchable={true}
                                        defaultValue={this.state.form_data.p_tag}
                                        onChange={this.handleChangeTag.bind(this)}
                                        options={{ placeholder: 'Select Tag', closeOnSelect: true }} />
                                    {this.validator.message('Tag', this.state.form_data.p_tag, 'required')}

                                </div>
                                <div className="text-grid four">
                                    <div className="form-group">
                                        <label>Project Category</label>
                                        <select className="form-control" value={this.state.form_data.category_id} onChange={e => this.handleChangeCategory(e)} id="category_id" name="category_id">
                                            <option value="">Select Category</option>
                                            {Object.entries(this.state.category_list).map(([o, p]) => (
                                                <option value={p.value}>{p.label}</option>
                                            ))}
                                        </select>
                                        {/* <Select
                                            value={this.state.form_data.category_id}
                                            onChange={this.handleChangeCategory}
                                            isSearchable={true}
                                            options={this.state.category_list}
                                            id="category_id" name="category_id"
                                        />
                                        {this.validator.message('Category', this.state.form_data.category_id, 'required')} */}
                                        {/* <select className="text-control" name="category" id="category" value={this.state.form_data.category} onChange={this.handleChange}>
                                            <option>Select Category</option>
                                            <option>Furniture</option>
                                            <option>Living Room</option>
                                            <option>Bedroom</option>
                                            <option>Kitchen</option>
                                            <option>Bathroom</option>
                                        </select>
                                        {this.validator.message('Category', this.state.form_data.category, 'required')} */}
                                    </div>
                                    <div className="form-group">
                                        <label>Size</label>
                                        <input type="text" name="size" id="size" className="text-control" placeholder="In Sq.Meter" value={this.state.form_data.size} onChange={this.handleChange} />
                                        {this.validator.message('Size', this.state.form_data.size, 'required')}
                                    </div>
                                    {/* <div className="form-group">
                                        <label>Work</label>
                                        <select className="text-control" name="work" id="work" value={this.state.form_data.work} onChange={this.handleChange}>
                                            <option value="">Select</option>
                                            <option>Remodeling</option>
                                            <option>New</option>
                                        </select>
                                        {this.validator.message('Work', this.state.form_data.work, 'required')}
                                    </div>
                                    <div className="form-group">
                                        <label>Time</label>
                                        <select className="text-control" name="time" id="time" value={this.state.form_data.time} onChange={this.handleChange} >
                                            <option value="">Select</option>
                                            <option>1 weeks</option>
                                            <option>3 weeks</option>
                                            <option>5 weeks</option>
                                            <option>10 weeks</option>
                                            <option>20 weeks</option>
                                            <option>30 weeks</option>
                                        </select>
                                        {this.validator.message('Time', this.state.form_data.time, 'required')}
                                    </div> */}
                                    <div className="form-group">
                                        <label>Work</label>
                                        <select className="form-control" value={this.state.form_data.work_id} onChange={e => this.handleChangeWork(e)} id="work_id" name="work_id">
                                            <option value="">Select Work</option>
                                            {Object.entries(this.state.work_list).map(([o, p]) => (
                                                <option value={p.value}>{p.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Time</label>
                                        <select className="form-control" value={this.state.form_data.time_id} onChange={e => this.handleChangeTime(e)} id="time_id" name="time_id">
                                            <option value="">Select Time</option>
                                            {Object.entries(this.state.time_list).map(([o, p]) => (
                                                <option value={p.value}>{p.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label>Short Description</label>
                                    <textarea name="short_desc" id="short_desc" rows={2} className="form-control" value={this.state.form_data.short_desc} onChange={this.handleTextLimit}></textarea>

                                </div>
                                {/* <div className="text-grid">
                                    <div className="form-group">
                                        <label>Tags</label>
                                        <Multiselect
                                            options={this.state.options} displayValue="name" onSelect={this.onSelect}
                                            onRemove={this.onRemove} />
                                    </div>
                                </div> */}
                                <div className="uploadProjectBanner">
                                    <div className="form-group">
                                        <label>Project Main Banner<span style={{ color: "red" }}>(For best resolution upload size is 1960*600)</span></label>

                                        <div id="aks-file-upload" onChange={this.handleChange}></div>
                                    </div>
                                </div>

                                {/*<div class="customimg">
                                    <p>Drag & Drop your files or Browse</p>
                                    <input type="file"/>
                                </div>*/}

                                <div className="project-end">
                                    {/* {Object.entries(this.state.form_data.multiple_data).map(([key, value]) => console.log(`${key}: ${value}`))} */}
                                    {/* {Object.entries(this.state.form_data.multiple_data).forEach(([key, value]) => {
                                        <>
                                            <div>1</div>
                                        </>
                                    })} */}
                                    {Object.entries(this.state.form_data.multiple_data).map(([i, v]) => (

                                        <>
                                            {v.text != undefined && <div className="block-wrapper text-block-wrapper">
                                                <input type="text" className="text-control" name="text_title" value={v.text} placeholder="title" onChange={e => this.handleChangeMultipleData(e, i, 'text')} />

                                                <button onClick={() => this.handleRemoveMultipleData(i, 'text')} type="button" className="remove-block">
                                                    <i className="bi bi-x"></i>
                                                </button>
                                            </div>}

                                            {v.desc != undefined &&
                                                <div className="block-wrapper text-block-wrapper">
                                                    <textarea onChange={e => this.handleChangeMultipleData(e, i, 'desc')} value={v.desc} className="text-control" name="text_block" placeholder="Write Here"></textarea>
                                                    <button onClick={() => this.handleRemoveMultipleData(i, 'desc')} type="button" className="remove-block">
                                                        <i className="bi bi-x"></i>
                                                    </button>
                                                </div>}
                                            {v.image_display != undefined &&
                                                <div className="block-wrapper text-block-wrapper image-block-wrapper">
                                                    <img class="text-control image-control" src={v.image_display} />
                                                    <button onClick={() => this.handleRemoveMultipleData(i, 'image')} type="button" className="remove-block">
                                                        <i className="bi bi-x"></i>
                                                    </button>


                                                    <button type="button" onClick={() => this.openHotspotModal(i, v.image_display)} className="tag-block">
                                                        <i className="bi bi-app-indicator"></i>
                                                        Image with Tag
                                                    </button>
                                                </div>

                                            }

                                        </>
                                    ))}
                                </div>
                                {/* <div className="project-end">
                                    {Object.entries(this.state.form_data.text_title).map(([i, v]) => (

                                        <>
                                            <div className="block-wrapper text-block-wrapper">
                                                <input type="text" className="text-control" name="text_title" placeholder="title" onChange={e => this.handleChangeTextTitle(e, i)} />

                                                <button onClick={() => this.handleRemoveTitleClick(i)} type="button" className="remove-block">
                                                    <i className="bi bi-x"></i>
                                                </button>
                                            </div>
                                        </>
                                    ))}
                                </div>



                                <div className="project-end">
                                    {Object.entries(this.state.form_data.text_block).map(([i, v]) => (

                                        <>
                                            <div className="block-wrapper text-block-wrapper">
                                                <textarea onChange={e => this.handleChangeTextBlock(e, i)} className="text-control" name="text_block" placeholder="Write Here"></textarea>
                                                <button onClick={() => this.handleRemoveClick(i)} type="button" className="remove-block">
                                                    <i className="bi bi-x"></i>
                                                </button>
                                            </div>
                                        </>
                                    ))}
                                </div> */}


                                <div className="add-block">
                                    <span>Add New:</span>
                                    <button type="button" onClick={() => this.handleAddMultiple('text')} className="text-title">
                                        <i className="bi bi-type"></i>
                                        Title
                                    </button>
                                    <button type="button" onClick={() => this.handleAddMultiple('desc')} className="text-block">
                                        <i className="bi bi-textarea-t"></i>
                                        Text Block
                                    </button>
                                    <button type="button" className="image-block">
                                        <i className="bi bi-image"></i>
                                        <input type="file" id="u_image" name="u_image" onChange={this.handleChangeFile} />
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bottom-action">

                        {(this.state.form_data.u_type == '2') && <NavLink exact to={'/Professional-profile/'} className="btn btn-long btn-ghost">Cancel</NavLink>}
                        {(this.state.form_data.u_type == '3') && <NavLink exact to={'/Dashboard/'} className="btn btn-long btn-ghost">Cancel</NavLink>}
                        {(this.state.form_data.u_type == '1') && <NavLink exact to={'/My-profile/'} className="btn btn-long btn-ghost">Cancel</NavLink>}
                        {/* <a href="javascript:void(0)" className="btn btn-long btn-secondary ml-auto">Save as Draft</a> */}


                        {/* onClick={this.onItemClick} */}
                        <button type="button" name="btn" onClick={this.save_as_draft} className="btn btn-long btn-secondary ml-auto" >Save as Draft</button>
                        <button type="button" onClick={this.save_as_publish} className="btn btn-long btn-primary">Publish</button>
                    </div>
                </form>


                <div className="hotspot-modal">
                    <div id="toolTipGenerator">
                        <section className="properties">
                            <div>
                                <label for="t_popupPosition">Tooltip Position:</label>
                                <select id="t_popupPosition" name="t_popupPosition" className="text-control" >
                                    <option value="left">Left</option>
                                    <option value="right">Right</option>
                                    <option value="top">Top</option>
                                    <option value="bottom">Bottom</option>
                                </select>
                                {/* <input type="text" id="tag_products" /> */}
                            </div>
                            <div>
                                <label for="tag_products">Products:</label>
                                <select id="tag_products" className="text-control" name="tag_products">

                                    {Object.entries(this.state.product_form_data).map(([i, v]) => (
                                        <option value={v.id}>{v.name}</option>
                                    ))}
                                </select>
                                {/* <input type="text" id="tag_products" /> */}
                            </div>
                            {/* <div>
                                <label for="t_popupPosition">Tag Product:</label>

                                <ReactSearchAutocomplete
                                    items={this.state.product_form_data}
                                    onSearch={this.handleOnSearch}
                                    onHover={this.handleOnHover}
                                    onSelect={this.handleOnSelect}
                                    onFocus={this.handleOnFocus}
                                    autoFocus
                                    formatResult={this.formatResult}
                                    name="tag_product"
                                    id="tag_product"
                                />


                            </div> */}
                            <div>
                                <input id="t_deleteSpot" type="button" className="btn btn-secondary" value="Delete Spot" />
                            </div>
                            <hr />
                            <button className="btn btn-secondary btn-block" onClick={this.closeHotspotModal} >Cancel</button>
                            <button onClick={this.handleGetTagData} className="btn btn-primary btn-block cancel" >Add to Project</button>
                        </section>
                        <section className="image">
                            <img className="target" id="user_image" src="/assets/images/adviceThumb-2.jpg" />
                        </section>
                    </div>
                </div>


            </>

        );
    }
}

export default UploadProject;
