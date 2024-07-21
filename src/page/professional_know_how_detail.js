import React, { Component } from 'react';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail, web_url } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import $ from 'jquery';
import { Helmet } from "react-helmet";
class ProfessionalKnowHowDetail extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        var user_email = (user_data) ? user_data.u_email : '';
        var user_name = (user_data) ? user_data.u_name : '';
        var user_mobile = (user_data) ? user_data.u_mobile : '';
        const project_comment_id = this.props.match.params.know_id;

        this.state = {
            form_data: {
                know_how_detail_data: '',
                project_tag_data: '',
                user_project_tag_data: '',
                detail_list: [],
                seller_project: '',
                know_how: '',
            },

            error: ''
        }
        this.get_know_how_detail();


        this.openLoginModal = this.openLoginModal.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.get_seller_project();
        this.get_know_how();
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
                    this.setState(this.state.form_data.know_how = know_how);


                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    async get_seller_project() {
        var th = this;
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var login_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_fav_project';
        api_option.data = { login_id: login_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');
        await axios(api_option)
            .then(res => {
                if (res.data.status) {
                    var seller_project = res.data.data;
                    th.setState(this.state.form_data.seller_project = seller_project);
                    // this.state.form_data.project_view_count = project_view_count
                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }

    componentDidMount() {

    }




    openTagDetail(event) {

        $(".lg-hotspot").removeClass("lg-hotspot--selected");
        $(event.target).parents(".lg-hotspot").toggleClass("lg-hotspot--selected");
    }



    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.comment_data[name] = value;
        this.setState({ data });
    }

    async get_know_how_detail() {
        var user_data = getUserDetail();
        const know_id = this.props.match.params.know_id;

        var user_id = user_data ? user_data.u_id : '';
        api_option.url = 'get_know_how_detail';
        api_option.data = { know_id: know_id, user_id: user_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {

                if (res.data.status) {
                    var detail_data = res.data.data;

                    this.setState(this.state.form_data.know_how_detail_data = detail_data);
                    this.setState(this.state.form_data.project_tag_data = res.data.project_tag_data);
                    this.setState(this.state.form_data.user_project_tag_data = res.data.user_project_tag_data);

                } else {
                    this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });
    }







    openLoginModal(e) {
        e.preventDefault();
        window.$("#access-modal").modal("show")
    }




    //view load home page
    render() {

        return (
            <>
                <Helmet>
                    <script src="/assets/js/project_detail.js"></script>
                    <script src="/assets/js/jquery-3.2.1.min.js"></script>
                    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"></script>
                    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js"></script>
                    <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>

                    <script src="/assets/js/custom.js"></script>
                </Helmet>


                <div class="page-breadcrumb">
                    <div class="container">
                        <ul>
                            <li><a href=""><i class="bi-house"></i></a></li>
                            <li>Know How</li>
                            <li>{this.state.form_data.know_how_detail_data.know_how_name}</li>
                        </ul>
                    </div>
                </div>

                <div class="projectFull-page">
                    <div class="project-page-top">
                        <div class="container">
                            <div class="projectDetials-header">
                                <div class="projectDetials-header-left">
                                    <h1>{this.state.form_data.know_how_detail_data.know_how_name}</h1>
                                </div>
                                <div class="projectDetials-header-right">
                                    <p>{this.state.form_data.know_how_detail_data.know_how_short_desc}</p>

                                    {this.state.form_data.know_how_detail_data.u_type == 3 && <div class="projectDetials-author">
                                        <Link to={`/Seller-detail/${this.state.form_data.know_how_detail_data.u_id}`}>
                                            <div class="author-list">
                                                <img src={this.state.form_data.know_how_detail_data.u_image} />
                                                <div class="auth-dec">
                                                    <strong>{this.state.form_data.know_how_detail_data.u_name}</strong>
                                                    <span>{this.state.form_data.know_how_detail_data.u_created_date}</span>
                                                </div>
                                            </div>
                                        </Link>

                                    </div>
                                    }
                                    {this.state.form_data.know_how_detail_data.u_type == 2 && <div class="projectDetials-author">
                                        <Link to={`/Professional-detail/${this.state.form_data.know_how_detail_data.u_id}`}>
                                            <div class="author-list">
                                                <img src={this.state.form_data.know_how_detail_data.u_image} />
                                                <div class="auth-dec">
                                                    <strong>{this.state.form_data.know_how_detail_data.u_name}</strong>
                                                    <span>{this.state.form_data.know_how_detail_data.u_created_date}</span>
                                                </div>
                                            </div>
                                        </Link>

                                    </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div class="project-banner-section">
                            <img src={this.state.form_data.know_how_detail_data.know_how_image} />

                        </div>
                    </div>
                    <div class="container container-small">
                        <div class="project-features">
                            <div class="pFeature-list">
                                <img src="/assets/images/pFeature-1.svg" />
                                <div>
                                    <span>Type</span>
                                    <strong>Apartment</strong>
                                </div>
                            </div>

                            <div class="pFeature-list">
                                <img src="/assets/images/pFeature-3.svg" />
                                <div>
                                    <span>Work</span>
                                    <strong>{this.state.form_data.know_how_detail_data.know_how_work}</strong>
                                </div>
                            </div>
                            <div class="pFeature-list">
                                <img src="/assets/images/pFeature-4.svg" />
                                <div>
                                    <span>Time</span>
                                    <strong>{this.state.form_data.know_how_detail_data.know_how_time}</strong>
                                </div>
                            </div>
                        </div>
                        <div class="project-detail-metadata">
                            <div>Detailed construction:</div>
                            {Object.entries(this.state.form_data.user_project_tag_data).map(([i, sp]) => (
                                <span>{sp.pt_tag}</span>
                            ))}

                        </div>
                        <div class="project-actionButtons">
                            {is_login() && this.state.form_data.is_like == 1 && <button class="like" onClick={this.handleLike}><i class="bi bi-hand-thumbs-up-fill"></i> </button>}
                            {is_login() && this.state.form_data.is_like == 0 && <button class="like" onClick={this.handleLike}><i class="bi bi-hand-thumbs-up"></i> </button>}
                            {!is_login() && <button class="like" onClick={this.openLoginModal}><i class="bi bi-hand-thumbs-up"></i> </button>
                            }
                            {/* <button class="like"><i class="bi bi-hand-thumbs-up-fill"></i></button> */}
                            {/* <button class="comment"><i class="bi bi-chat-dots-fill"></i></button> */}
                            {is_login() && this.state.form_data.is_favourite == 1 && <button class="bookmark" onClick={this.handleFavourite}><i class="bi bi-heart-fill"></i></button>}
                            {is_login() && this.state.form_data.is_favourite == 0 && <button class="bookmark" onClick={this.handleFavourite}><i class="bi bi-heart"></i> </button>}

                            {!is_login() && <button class="bookmark" onClick={this.openLoginModal}><i class="bi bi-heart"></i></button>
                            }
                            {/* <button class="bookmark"><i class="bi bi-heart-fill"></i></button> */}
                            {/* <button class="share"><i class="bi bi-share-fill"></i></button> */}
                        </div>
                        <div class="project-detail-content">
                            {Object.entries(this.state.form_data.project_tag_data).map(([i, sp]) => (
                                <div>
                                    {sp.tkhd_title && <h4>{sp.tkhd_title}</h4>}
                                    {sp.tkhd_desc && <p>{sp.tkhd_desc}</p>}


                                    {/* {sp.tkhd_image && !sp.tkhd_tag_data &&
                                        <div class="media-image"><img src={sp.tkhd_image} /></div>
                                    } */}
                                    {sp.tkhd_image && sp.tag_data &&
                                        <div class="spot-container">
                                            <div class="lg-container">
                                                <img src={sp.tkhd_image} class="lg-image" />


                                                {Object.entries(sp.tag_data).map(([i, td]) => (
                                                    <div style={{ 'top': td.image_y, 'left': td.image_x }} data-spot={i} class="lg-hotspot lg-hotspot--top-left">
                                                        <div class="lg-hotspot__button" onClick={this.openTagDetail.bind(this)}></div>
                                                        <div class="lg-hotspot__label">
                                                            <div class="hotspot-product">
                                                                {td.product_image != undefined && <img src={td.product_image} />}
                                                                <div>
                                                                    <a href="" class="hs-p-name">{td.product_name}</a>
                                                                    <span class="hs-p-price">RO {td.product_price}</span>
                                                                    <Link to={`/productdetail/${td.product}`} class="hs-p-link">View Product</Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {/* <div class="spot-thumb">
                                                {Object.entries(sp.tag_data).map(([i, td]) => (
                                                    <div class="spot-items" data-id={i}><a href=""><img src={td.product_image} /></a></div>
                                                ))}
                                               <div class="spot-items" data-id="2"><a href=""><img src="/assets/images/product-2.jpg" /></a></div>
                                                <div class="spot-items" data-id="3"><a href=""><img src="/assets/images/product-3.jpg" /></a></div>
                                                <div class="spot-items" data-id="4"><a href=""><img src="/assets/images/product-4.jpg" /></a></div>
                                            </div> */}
                                        </div>
                                    }

                                    {Object.entries(this.state.form_data.project_tag_data).map(([i, sp]) => (
                                        <div class="products-listing-wrapper">
                                            <div class="products-grid">
                                                {sp.tkhd_image && sp.tag_data &&

                                                    Object.entries(sp.tag_data).map(([i, sp]) => (
                                                        <div class="product-item">
                                                            <div class="product-thumb">
                                                                <div class="thumbtag">
                                                                    {/* <span class="sale">Sale</span> */}
                                                                </div>
                                                                <Link to={`/productdetail/${sp.product}`}>
                                                                    <img src={sp.product_image} />
                                                                </Link>
                                                            </div>
                                                            <div class="product-info" style={{ "display": "none" }}>
                                                                <h4 class="product-name"><Link to={`/productdetail/${sp.product}`}>{sp.product_name}</Link></h4>
                                                                <div class="just-in">

                                                                    <div class="product-price">{sp.product_price > 0 && <del>RO {sp.product_price}</del>}<span>RO {sp.product_sale_price}</span></div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }

                                            </div>
                                        </div>
                                    ))}



                                </div>
                            ))}
                        </div>


                        {/* <div class="browse-wrapper">
                            <h5 class="md-title">Browse other houses</h5>
                            <div class="project-tags">
                                <a href="">Apartment</a>
                                <a href="">1440 sq.ft</a>
                                <a href="">Expert</a>
                                <a href="">Remodeling</a>
                                <a href="">House with preschool children</a>
                                <a href="">natural</a>
                                <a href="">Wooden floor</a>
                                <a href="">Porcelain Tile</a>
                                <a href="">Kitchen remodeling</a>
                                <a href="">Lighting construction</a>
                            </div>
                        </div> */}

                        <div class="commentbox">

                            <ul class="comment-feed-list">


                                {/* <li class="comment-feed-item">
                                    <article>
                                        <p class="comment-feed-content">
                                            <a href=""><img src="/assets/images/avatar-4.jpg" />Mark Burks</a>
                                            <span>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.</span>
                                        </p>
                                        <time>12 hours ago</time>
                                    </article>
                                </li>
                                <li class="comment-feed-item">
                                    <article>
                                        <p class="comment-feed-content">
                                            <a href=""><img src="/assets/images/avatar-5.jpg" />Ramiro Lovett</a>
                                            <span>Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</span>
                                        </p>
                                        <time>12 hours ago</time>
                                    </article>
                                </li>
                                <li class="comment-feed-item">
                                    <article>
                                        <p class="comment-feed-content">
                                            <a href=""><img src="/assets/images/avatar-6.jpg" />Jill Carrington</a>
                                            <span>Sed ut perspiciatis unde omnis iste natus error sit voluptatem</span>
                                        </p>
                                        <time>12 hours ago</time>
                                    </article>
                                </li>
                                <li class="comment-feed-item">
                                    <article>
                                        <p class="comment-feed-content">
                                            <a href=""><img src="/assets/images/avatar-7.jpg" />Marcella Woods</a>
                                            <span>accusantium doloremque laudantium</span>
                                        </p>
                                        <time>12 hours ago</time>
                                    </article>
                                </li> */}
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="stories-section">
                    <div class="uncol">
                        <h5 class="md-title">How about a story like this?</h5>
                        <div class="swiper-container">
                            <div class="swiper-wrapper">
                                {Object.entries(this.state.form_data.know_how).map(([o, p]) => (
                                    // {Object.entries(this.state.form_data.seller_project).map(([o, p]) => (
                                    <div class="swiper-slide">
                                        <a onClick={() => { document.location = web_url + "know-how-detail/" + p.know_how_id; }} style={{ cursor: 'pointer' }}>
                                            <div class="sl-story-item" style={{ width: 'max-content', margin: 'auto' }}>
                                                <Link to={`/know-how-detail/${p.know_how_id}`}></Link>
                                                <div class="sl-story-cover">
                                                    <img src={p.know_how_image} className={'sliderimgsize'} />
                                                </div>
                                                <div class="sl-story-info">
                                                    <h6>{p.u_name}</h6>
                                                    <h3>{p.know_how_name}</h3>

                                                    <span><a onClick={() => { document.location = web_url + "know-how-detail/" + p.know_how_id; }} style={{ cursor: 'pointer' }}>Read More</a></span>

                                                    {/* <span><Link to={`/know-how-detail/${p.know_how_id}`}>Read More</Link></span> */}
                                                </div>
                                            </div>
                                        </a>
                                    </div>
                                ))}

                            </div>
                            {/* <div class="swiper-wrapper">
                                <div class="swiper-slide">
                                    <div class="sl-story-item">
                                        <a href=""></a>
                                        <div class="sl-story-cover">
                                            <img src="/assets/images/story-1.jpg" />
                                        </div>
                                        <div class="sl-story-info">
                                            <h6>Online housewarming</h6>
                                            <h3>Soryu-heon, a house where the smiles of a couple of potters flow</h3>
                                            <span>Read More</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="swiper-slide">
                                    <div class="sl-story-item">
                                        <a href=""></a>
                                        <div class="sl-story-cover">
                                            <img src="/assets/images/story-2.jpg" />
                                        </div>
                                        <div class="sl-story-info">
                                            <h6>Online housewarming</h6>
                                            <h3>Soryu-heon, a house where the smiles of a couple of potters flow</h3>
                                            <span>Read More</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="swiper-slide">
                                    <div class="sl-story-item">
                                        <a href=""></a>
                                        <div class="sl-story-cover">
                                            <img src="/assets/images/story-3.jpg" />
                                        </div>
                                        <div class="sl-story-info">
                                            <h6>Online housewarming</h6>
                                            <h3>Soryu-heon, a house where the smiles of a couple of potters flow</h3>
                                            <span>Read More</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="swiper-slide">
                                    <div class="sl-story-item">
                                        <a href=""></a>
                                        <div class="sl-story-cover">
                                            <img src="/assets/images/story-4.jpg" />
                                        </div>
                                        <div class="sl-story-info">
                                            <h6>Online housewarming</h6>
                                            <h3>Soryu-heon, a house where the smiles of a couple of potters flow</h3>
                                            <span>Read More</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="swiper-slide">
                                    <div class="sl-story-item">
                                        <a href=""></a>
                                        <div class="sl-story-cover">
                                            <img src="/assets/images/story-5.jpg" />
                                        </div>
                                        <div class="sl-story-info">
                                            <h6>Online housewarming</h6>
                                            <h3>Soryu-heon, a house where the smiles of a couple of potters flow</h3>
                                            <span>Read More</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="swiper-slide">
                                    <div class="sl-story-item">
                                        <a href=""></a>
                                        <div class="sl-story-cover">
                                            <img src="/assets/images/story-6.jpg" />
                                        </div>
                                        <div class="sl-story-info">
                                            <h6>Online housewarming</h6>
                                            <h3>Soryu-heon, a house where the smiles of a couple of potters flow</h3>
                                            <span>Read More</span>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                            <div class="swiper-pagination"></div>
                        </div>
                    </div>
                </div>

            </>
        );
    }
}


export default ProfessionalKnowHowDetail;
