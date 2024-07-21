import React, { Component } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail, getUserId } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import swal from 'sweetalert';
import Select from 'react-select';
import $ from 'jquery';
import { Helmet } from "react-helmet";
import { Multiselect } from 'multiselect-react-dropdown';
import Loader from "react-loader";
var serialize = require('form-serialize');
class WriteKnowHow extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        var user_data = getUserDetail();
        var user_id = user_data ? user_data.u_id : '';

        // login form data
        this.initialState = {
            form_data: {
                know_how: '',

            },

            error: '',
            know_how_category: '',
            category_list: '',
            loaded: true

        }
        this.state = this.initialState;
        this.category_list_dropdown();
        this.know_how_category();
        this.get_know_how();

        this.handleSaveData = this.handleSaveData.bind(this);
        this.handleChangeCategory = this.handleChangeCategory.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleAddClick = this.handleAddClick.bind(this);
        this.handleAddTitleClick = this.handleAddTitleClick.bind(this);
        this.handleChangeTextBlock = this.handleChangeTextBlock.bind(this);
        this.handleChangeTextTitle = this.handleChangeTextTitle.bind(this);
        // setTimeout(() => {
        //     this.handleAddClick();
        // }, 1000);
    }
    handleAddTitleClick() {
        var data = this.state.form_data['text_title'].push({ value: "" });
        this.setState({ data });
    }
    handleAddClick() {
        var data = this.state.form_data['text_block'].push({ value: "" });
        this.setState({ data });
    }
    handleRemoveClick(i) {

        var data = this.state.form_data['text_block'].splice(i, 1);
        var new_data = this.state.form_data['text_block'];
        this.setState({ new_data });
    }
    handleRemoveTitleClick(i) {

        var data = this.state.form_data['text_title'].splice(i, 1);
        var new_data = this.state.form_data['text_title'];
        this.setState({ new_data });
    }
    handleChangeTextBlock(event, i) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data['text_block'][i][name] = value;
        this.setState({ data });

    }
    handleChangeTextTitle(event, i) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.form_data['text_title'][i][name] = value;
        this.setState({ data });

    }
    componentDidMount() {

    }

    async get_know_how() {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var login_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_fav_knowhow';
        api_option.data = { login_id: login_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var know_how = res.data.data;
                    this.setState(this.initialState.form_data.know_how = know_how);


                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    handleCategory(id, event) {
        $('.icon-filter-item').removeClass("active")
        $(event.target).addClass('active')
        var user_data = getUserDetail();
        var login_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_fav_knowhow';
        api_option.data = { login_id: login_id, id: id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var know_how = res.data.data;
                    this.setState(this.initialState.form_data.know_how = know_how);
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }


    handleCategoryFilter(event) {

        api_option.url = 'get_fav_filter_knowhow';
        api_option.data = { type: event.target.value };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var know_how = res.data.data;
                    this.setState(this.initialState.form_data.know_how = know_how);
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    know_how_category() {

        api_option.url = 'know_how_category';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var know_how = res.data.data;
                    this.setState(this.state.know_how_category = know_how);


                } else {
                    this.setState({ redirect: '/logout' });
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

    async handleChangeCategory(event) {


        const name = event.lable;
        const value = event.value;
        var data = this.state.form_data['category_id'] = { label: event.label, value: value };
        this.setState({ data });

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
        // console.log(this.state.category_list)
    }


    handleFavourite(event, kid) {

        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'add_to_favourite_knowhow';
        api_option.data = { knowhow_id: kid, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        const th = this;
        axios(api_option)
            .then(res => {
                if (res.data.status) {

                    toast.success(res.data.message);
                    th.get_know_how();
                    // th.setState({ redirect: '/productdetail/' + product_id });


                } else {
                    toast.error(res.data.message);
                    th.get_know_how();

                    // this.setState({ redirect: '/logout' });

                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
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
            api_option.url = 'save_know_how';
            const formData = new FormData();
            formData.append('id', this.state.form_data.u_id);
            formData.append('project_name', this.state.form_data.project_name);
            formData.append('category', this.state.form_data.category_id['value']);

            formData.append('work', this.state.form_data.work);
            formData.append('time', this.state.form_data.time);
            formData.append('text_title', JSON.stringify(this.state.form_data.text_title));
            formData.append('text_block', JSON.stringify(this.state.form_data.text_block));
            formData.append('profile_pic', this.state.form_data.image);
            api_option.data = formData;
            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        this.state.form_data.project_name = '';
                        this.state.form_data.category = '';

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

    }


    onSelect(selectedList, selectedItem) {

    }

    onRemove(selectedList, removedItem) {

    }



    // view load header page
    render() {
        const { options, value } = this.state;
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


                    <link rel='stylesheet' href='https://unpkg.com/aksfileupload@1.0.0/dist/aksFileUpload.min.css' />
                    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1-rc.1/css/select2.min.css' />

                    <script src="/assets/js/aks.js?12"></script>


                    <script src='https://cdnjs.cloudflare.com/ajax/libs/jquery-easing/1.3/jquery.easing.min.js'></script>
                    <script src='https://unpkg.com/aksfileupload@1.0.0/dist/aksFileUpload.min.js'></script>
                    <script src='https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.1-rc.1/js/select2.min.js'></script>


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

                <div class="knowhow-page">
                    <div class="container">
                        <div class="bwp-top-bar">
                            <div class="bwp-bar">
                                <h1 class="pg-title">Know-how articles</h1>
                            </div>
                            <div>
                                <select class="sort-list" onChange={this.handleCategoryFilter.bind(this)}>
                                    {/* <option>Sort</option> */}
                                    <option value="Most Popular">Most Viewed</option>
                                    <option>Newest</option>
                                    <option>Oldest</option>
                                </select>
                                {/* <select class="sort-list" onChange={this.handleCategoryFilter.bind(this)}>

                                    <option>Sort</option>
                                    <option>Most Popular</option>
                                    <option>Newest</option>
                                </select> */}
                            </div>
                        </div>
                        <div class="icon-filter">

                            {Object.entries(this.state.know_how_category).map(([h, k]) => (
                                <div class="icon-filter-item " onClick={this.handleCategory.bind(this, k.knowhow_title)}>
                                    <img src={k.knowhow_icon} />
                                    <span>{k.knowhow_title}</span>
                                </div>
                            ))}

                            {this.state.know_how_category.length == 0 && <div class="icon-filter-item ">
                                <h3>Sorry!! No article found</h3>
                            </div>}
                            {/* <div class="icon-filter-item">
                                <img src="/assets/images/knowhow-cat/icon-1.svg" />
                                <span>Cost</span>
                            </div>
                            <div class="icon-filter-item">
                                <img src="/assets/images/knowhow-cat/icon-2.svg" />
                                <span>plan</span>
                            </div>
                            <div class="icon-filter-item">
                                <img src="/assets/images/knowhow-cat/icon-3.svg" />
                                <span>Walls</span>
                            </div>
                            <div class="icon-filter-item">
                                <img src="/assets/images/knowhow-cat/icon-4.svg" />
                                <span>Floor</span>
                            </div>
                            <div class="icon-filter-item">
                                <img src="/assets/images/knowhow-cat/icon-5.svg" />
                                <span>Lighting</span>
                            </div>
                            <div class="icon-filter-item">
                                <img src="/assets/images/knowhow-cat/icon-6.svg" />
                                <span>arrangement</span>
                            </div>
                            <div class="icon-filter-item">
                                <img src="/assets/images/knowhow-cat/icon-7.svg" />
                                <span>organization</span>
                            </div>
                            <div class="icon-filter-item">
                                <img src="/assets/images/knowhow-cat/icon-8.svg" />
                                <span>fabrics</span>
                            </div>
                            <div class="icon-filter-item">
                                <img src="/assets/images/knowhow-cat/icon-9.svg" />
                                <span>appliances</span>
                            </div> */}
                        </div>
                        <div class="knowhow-grid">
                            {Object.entries(this.initialState.form_data.know_how).map(([o, p]) => (
                                <div class="projectList-items">
                                    <Link to={`/know-how-detail/${p.know_how_id}`}></Link>
                                    <div class="thumbsave">
                                        {localStorage.getItem('type') == 1 && is_login() && p.favourites == 0 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.know_how_id)}><i class="bi-heart"></i></button>}
                                        {localStorage.getItem('type') == 1 && is_login() && p.favourites == 1 && <button class="save-trigger" onClick={this.handleFavourite.bind(this, o, p.know_how_id)}><i class="bi-heart-fill"></i></button>}
                                    </div>
                                    <div class="projectList-cover"><img src={p.know_how_image} /></div>
                                    <div class="overlap-content">
                                        <div class="projectList-title"><h2>{p.know_how_name}</h2></div>
                                        <div class="projectList-ft">


                                            <div class="projectList-author"><img src={p.u_image} />{p.u_name}</div>
                                            {/* <div class="projectList-author"><img src="/assets/images/professionals/professionals-1.png" />{p.u_name}</div> */}
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

                            {/* <div class="projectList-items">
                                <a href=""></a>
                                <div class="thumbtag"><span class="new">New</span></div>
                                <div class="thumbsave">
                                    <button class="save-trigger"><i class="bi-heart"></i></button>
                                </div>
                                <div class="projectList-cover"><img src="/assets/images/projects/project-cover-2.jpg" /></div>
                                <div class="overlap-content">
                                    <div class="projectList-title"><h2>Use it to organize kitchen utensils and dressing tables that are not used!</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="/assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                            </div>
                            <div class="projectList-items">
                                <a href=""></a>
                                <div class="thumbtag"><span class="new">New</span></div>
                                <div class="thumbsave">
                                    <button class="save-trigger"><i class="bi-heart"></i></button>
                                </div>
                                <div class="projectList-cover"><img src="/assets/images/projects/project-cover-3.jpg" /></div>
                                <div class="overlap-content">
                                    <div class="projectList-title"><h2>Use it to organize kitchen utensils and dressing tables that are not used!</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="/assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                            </div>
                            <div class="projectList-items">
                                <a href=""></a>
                                <div class="thumbsave">
                                    <button class="save-trigger"><i class="bi-heart"></i></button>
                                </div>
                                <div class="projectList-cover"><img src="/assets/images/projects/project-cover-4.jpg" /></div>
                                <div class="overlap-content">
                                    <div class="projectList-title"><h2>Use it to organize kitchen utensils and dressing tables that are not used!</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="/assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                            </div>
                            <div class="projectList-items">
                                <a href=""></a>
                                <div class="thumbsave">
                                    <button class="save-trigger"><i class="bi-heart"></i></button>
                                </div>
                                <div class="projectList-cover"><img src="/assets/images/projects/project-cover-5.jpg" /></div>
                                <div class="overlap-content">
                                    <div class="projectList-title"><h2>Use it to organize kitchen utensils and dressing tables that are not used!</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="/assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                            </div>
                            <div class="projectList-items">
                                <a href=""></a>
                                <div class="thumbsave">
                                    <button class="save-trigger"><i class="bi-heart"></i></button>
                                </div>
                                <div class="projectList-cover"><img src="/assets/images/projects/project-cover-6.jpg" /></div>
                                <div class="overlap-content">
                                    <div class="projectList-title"><h2>Use it to organize kitchen utensils and dressing tables that are not used!</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="/assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                            </div>
                            <div class="projectList-items">
                                <a href=""></a>
                                <div class="thumbsave">
                                    <button class="save-trigger"><i class="bi-heart"></i></button>
                                </div>
                                <div class="projectList-cover"><img src="/assets/images/projects/project-cover-7.jpg" /></div>
                                <div class="overlap-content">
                                    <div class="projectList-title"><h2>Use it to organize kitchen utensils and dressing tables that are not used!</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="/assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                            </div>
                            <div class="projectList-items">
                                <a href=""></a>
                                <div class="thumbsave">
                                    <button class="save-trigger"><i class="bi-heart"></i></button>
                                </div>
                                <div class="projectList-cover"><img src="/assets/images/projects/project-cover-8.jpg" /></div>
                                <div class="overlap-content">
                                    <div class="projectList-title"><h2>Use it to organize kitchen utensils and dressing tables that are not used!</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="/assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                            </div>
                            <div class="projectList-items">
                                <a href=""></a>
                                <div class="thumbsave">
                                    <button class="save-trigger"><i class="bi-heart"></i></button>
                                </div>
                                <div class="projectList-cover"><img src="/assets/images/projects/project-cover-9.jpg" /></div>
                                <div class="overlap-content">
                                    <div class="projectList-title"><h2>Use it to organize kitchen utensils and dressing tables that are not used!</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="/assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                            </div>
                            <div class="projectList-items">
                                <a href=""></a>
                                <div class="thumbsave">
                                    <button class="save-trigger"><i class="bi-heart"></i></button>
                                </div>
                                <div class="projectList-cover"><img src="/assets/images/projects/project-cover-10.jpg" /></div>
                                <div class="overlap-content">
                                    <div class="projectList-title"><h2>Use it to organize kitchen utensils and dressing tables that are not used!</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="/assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                            </div>
                            <div class="projectList-items">
                                <a href=""></a>
                                <div class="thumbsave">
                                    <button class="save-trigger"><i class="bi-heart"></i></button>
                                </div>
                                <div class="projectList-cover"><img src="/assets/images/projects/project-cover-11.jpg" /></div>
                                <div class="overlap-content">
                                    <div class="projectList-title"><h2>Use it to organize kitchen utensils and dressing tables that are not used!</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="/assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                            </div>
                            <div class="projectList-items">
                                <a href=""></a>
                                <div class="thumbsave">
                                    <button class="save-trigger"><i class="bi-heart"></i></button>
                                </div>
                                <div class="projectList-cover"><img src="/assets/images/projects/project-cover-12.jpg" /></div>
                                <div class="overlap-content">
                                    <div class="projectList-title"><h2>Use it to organize kitchen utensils and dressing tables that are not used!</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="/assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                            </div>
                            <div class="projectList-items">
                                <a href=""></a>
                                <div class="thumbsave">
                                    <button class="save-trigger"><i class="bi-heart"></i></button>
                                </div>
                                <div class="projectList-cover"><img src="/assets/images/projects/project-cover-13.jpg" /></div>
                                <div class="overlap-content">
                                    <div class="projectList-title"><h2>Use it to organize kitchen utensils and dressing tables that are not used!</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="/assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                            </div>
                            <div class="projectList-items">
                                <a href=""></a>
                                <div class="thumbsave">
                                    <button class="save-trigger"><i class="bi-heart"></i></button>
                                </div>
                                <div class="projectList-cover"><img src="/assets/images/projects/project-cover-14.jpg" /></div>
                                <div class="overlap-content">
                                    <div class="projectList-title"><h2>Use it to organize kitchen utensils and dressing tables that are not used!</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="/assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                            </div>
                            <div class="projectList-items">
                                <a href=""></a>
                                <div class="thumbsave">
                                    <button class="save-trigger"><i class="bi-heart"></i></button>
                                </div>
                                <div class="projectList-cover"><img src="/assets/images/projects/project-cover-15.jpg" /></div>
                                <div class="overlap-content">
                                    <div class="projectList-title"><h2>Use it to organize kitchen utensils and dressing tables that are not used!</h2></div>
                                    <div class="projectList-ft">
                                        <div class="projectList-author"><img src="/assets/images/professionals/professionals-1.png" />BM Architects</div>
                                        <span class="projectViews">246 Views</span>
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>



                <div class="container">
                    <div class="cta-wrapper">
                        <div class="bg-cover" style={{ background: "url(/assets/images/parallax_land3.jpg)" }} ></div>
                        <div class="cta-wrapper-info">
                            <div class="cta-content">
                                <h2>Share your concerns and ask a question</h2>
                            </div>
                            <Link to={`/question-list`} class="btn btn-white">Ask a Question</Link>
                        </div>
                    </div>
                </div>
            </>

        );
    }
}

export default WriteKnowHow;
