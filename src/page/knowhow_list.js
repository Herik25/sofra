import React, { Component } from 'react';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import axios from 'axios';
import $ from 'jquery';
import { Helmet } from "react-helmet";
class KnowHowList extends Component {
    constructor(props) {
        super(props);
        //console.log(this.props)
        // const device_type = this.props.match.params.device_type;
        // if (this.props.match.params.device_type) {
        //     localStorage.setItem('device_type', device_type);
        // } else {

        //     localStorage.setItem('device_type', 'web');
        // }


        this.initialState = {
            form_data: {
                banner_data: ''
            },
            error: ''
        }
    }
    render() {
        return (
            <>
                <Helmet>

                    <link rel="stylesheet" href="/assets/css/custom.css" />
                    <link rel="stylesheet" href="/assets/css/mobile.css" />
                    <script src="/assets/js/custom.js"></script>
                </Helmet>
                <div class="knowhow-page">
                    <div class="container">
                        <div class="bwp-top-bar">
                            <div class="bwp-bar">
                                <h1 class="pg-title">Know-how articles</h1>
                            </div>
                            <div>
                                <select class="sort-list">
                                    <option disabled="">Sort</option>
                                    <option value="Most Popular">Most Viewed</option>
                                    <option>Highest Rated</option>
                                    <option>Newest</option>
                                </select>
                            </div>
                        </div>
                        <div class="icon-filter">
                            <div class="icon-filter-item active">
                                <img src="/assets/images/knowhow-cat/icon-0.svg" />
                                <span>All</span>
                            </div>
                            <div class="icon-filter-item">
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
                            </div>
                        </div>
                        <div class="knowhow-grid">
                            <div class="projectList-items">
                                <a href=""></a>
                                <div class="thumbtag"><span class="new">New</span></div>
                                <div class="thumbsave">
                                    <button class="save-trigger"><i class="bi-heart"></i></button>
                                </div>
                                <div class="projectList-cover"><img src="/assets/images/projects/project-cover-1.jpg" /></div>
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
                            </div>
                        </div>
                    </div>
                </div>



                <div class="container">
                    <div class="cta-wrapper">
                        <div class="bg-cover" style={{ background: "url(/assets/images/parallax_land3.jpg)" }}></div>
                        <div class="cta-wrapper-info">
                            <div class="cta-content">
                                <h2>Share your concerns and ask a question</h2>
                            </div>
                            <a href="" class="btn btn-white">Ask a Question</a>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default KnowHowList;