import React, { Component } from 'react';
import { NavLink, Redirect, Link } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession, getUserDetail, web_url } from '../api/Helper';
import SimpleReactValidator from 'simple-react-validator';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import $ from 'jquery';
import { Helmet } from "react-helmet";
import Loader from "react-loader";
import ShowMoreText from "react-show-more-text";
class QuestionDetail extends Component {
    constructor(props) {
        super(props);
        var user_data = getUserDetail();
        this.validator = new SimpleReactValidator();
        var user_image = user_data ? user_data.u_image : web_url + '/assets/images/profile.svg';
        var user_id = user_data ? user_data.u_id : '';
        const question_id = this.props.match.params.question_id;
        this.initialState = {
            form_data: {
                question_detail: [],
                u_id: user_id,
                user_image: user_image,
            },
            comment_data: {
                comment: '',
                comment_count: 0,
                user_comment_id: user_id,
                question_id: question_id,
                comment_data: [],
            },
            loaded: false,

        }
        this.state = this.initialState;

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.get_question_detail();
        this.get_comment_question();

        console.log(this.state.form_data.user_image)
    }
    componentDidMount() {

    }

    delete_question(event, question_id) {
        if (window.confirm("Are you sure to delete this Topic?")) {

            var user_data = getUserDetail();
            var user_id = user_data ? user_data.u_id : '';
            /* console.log("Que : ", this.state.form_data.question_detail.id);
            return false; */
            api_option.url = 'delete_question';
            api_option.data = { user_id: user_id, id: this.state.form_data.question_detail.id };
            api_option.headers.Authorization = sessionStorage.getItem('token');
            /* console.log("ds", api_option.data);
            return false; */
            const th = this;
            axios(api_option)
                .then(res => {
                    if (res.data.status) {
                        toast.success(res.data.message);
                        $("#back_btn_question").trigger("click");
                        //th.setState({ redirect: '/question-list' });
                        // this.get_question_list();

                    } else {
                        toast.error(res.data.message);
                    }
                })
                .catch(error => {
                    // this.setState({ redirect: '/logout' });
                });
        }
    }

    delete_comment(comment_id, event) {
        if (window.confirm("Are you sure to delete this comment?")) {
            console.log("as", comment_id);
            var user_data = getUserDetail();
            var user_id = user_data ? user_data.u_id : '';
            /* console.log("Que : ", this.state.form_data.question_detail.id);
            return false; */
            api_option.url = 'delete_question_comment';
            api_option.data = { user_id: user_id, id: comment_id };
            api_option.headers.Authorization = sessionStorage.getItem('token');
            /* console.log("ds", api_option.data);
            return false; */
            const th = this;
            axios(api_option)
                .then(res => {
                    if (res.data.status) {
                        toast.success(res.data.message);
                        $(event.target).parent().parent().remove();
                        // $("#back_btn_question").trigger("click");
                        //th.setState({ redirect: '/question-list' });
                        // this.get_question_list();

                    } else {
                        toast.error(res.data.message);
                    }
                })
                .catch(error => {
                    // this.setState({ redirect: '/logout' });
                });
        }
    }

    handleChange(event) {
        const name = event.target.name;
        const value = event.target.value;
        var data = this.state.comment_data[name] = value;
        this.setState({ data });
    }



    async get_question_detail(props) {
        const question_id = this.props.match.params.question_id;

        api_option.url = 'get_question_detail';
        api_option.headers.Authorization = sessionStorage.getItem('token');
        api_option.data = { question_id: question_id };
        const th = this;
        await axios(api_option)
            .then(res => {
                this.setState({ loaded: true });
                if (res.data.status) {

                    var question_data = res.data.data;

                    this.setState(this.state.form_data.question_detail = question_data);


                } else {
                }
            })
            .catch(error => {
            });

    }

    async get_comment_question(props) {
        var user_data = getUserDetail();
        // console.log(user_data.u_id)
        var user_id = user_data ? user_data.u_id : '';
        const question_id = this.props.match.params.question_id;
        api_option.url = 'get_comment_question';
        api_option.data = { question_id: question_id };
        api_option.headers.Authorization = sessionStorage.getItem('token');

        const th = this;
        await axios(api_option)
            .then(res => {

                if (res.data.status) {

                    var comment_data = res.data.comment_list;
                    this.setState(this.state.comment_data.comment_data = comment_data);

                } else {

                    //this.setState({ redirect: '/logout' });
                }
            })
            .catch(error => {
                this.setState({ redirect: '/logout' });
            });

    }

    // Add Question
    handleSubmit(event) {

        event.preventDefault();
        if (!this.validator.allValid()) {
            this.validator.showMessages();
            this.forceUpdate();
        } else {
            this.setState({ loaded: false });
            api_option.url = 'save_question_comment';
            api_option.data = this.state.comment_data;

            axios(api_option)
                .then(res => {
                    this.setState({ loaded: true });
                    const res_data = res.data;
                    if (res_data.status) {
                        this.state.comment_data.comment = '';
                        this.get_comment_question();
                        toast.success(res.data.message);
                    } else {
                        toast.error(res.data.message);
                        // this.setState({error:res_data.message});
                    }
                })
                .catch(error => console.log(error));
        }

    }


    render() {
        return (
            <>


                <Helmet>
                    delete_question

                </Helmet>




                <div class="forum-single">
                    <div class="container container-small">
                        <Link to={`/question-list/`}><button class="btn btn-outline back-arrow" id="back_btn_question"><i class="bi-arrow-left"></i></button></Link>
                        <div class="forum-main-topic">
                            <article class="forum-item">
                                <div class="forum-author">
                                    <a><img src={this.state.form_data.question_detail.u_image} /> {this.state.form_data.question_detail.u_name}</a>
                                </div>
                                <div class="forum-list-title">
                                    <h2>{this.state.form_data.question_detail.title}</h2>
                                    <p>{this.state.form_data.question_detail.description} {is_login() && this.state.form_data.question_detail.user_id == this.state.form_data.u_id && <button type="button" class="plain text-danger float-right" onClick={this.delete_question.bind(this, this.state.form_data.question_detail.id)}>Delete</button>}</p>
                                    {/* <ShowMoreText

                                        lines={3}
                                        more="Read More"
                                        less="Read Less"
                                        className="content-css"
                                        anchorClass="my-anchor-css-class"
                                        onClick={this.executeOnClick}
                                        expanded={false}
                                        width={280}
                                        truncatedEndingComponent={"... "}
                                    >
                                        {this.state.form_data.question_detail.description}{" "}
                                        <a
                                            href="https://www.yahoo.com/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >

                                        </a>{" "}

                                        <a
                                            href="https://www.google.bg/"
                                            title="Google"
                                            rel="nofollow"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >

                                        </a>
                                    </ShowMoreText> */}
                                </div>
                                <div class="forum-list-rt">
                                    <a class="forum-comment"><span><b>{this.state.comment_data.comment_data.length}</b></span> Comments</a>

                                    <time>{this.state.form_data.question_detail.created_at}</time>
                                </div>
                            </article>
                        </div>
                        <div class="forum-comments">
                            <div class="commentbox">
                                <h5 class="md-title"><span class="text-primary">{this.state.comment_data.comment_data.length}</span> Comments</h5>
                                <form class="post-comment" onSubmit={this.handleSubmit}>
                                    <div class="comment-user-thumb"><img src={this.state.form_data.user_image} /></div>
                                    <div class="comment-input">
                                        <input type="text" name="comment" value={this.state.comment_data.comment} onChange={this.handleChange} placeholder="Write here..." />
                                        <input type="hidden" name="project_id" value={this.state.comment_data.project_comment_id} />
                                        <input type="hidden" name="user_id" value={this.state.comment_data.user_comment_id} />
                                        {this.validator.message('Comment', this.state.comment_data.comment, 'required')}
                                        {localStorage.getItem('type') == 1 && is_login() && <button class="plain text-primary">Post</button> || <span style={{ color: 'red' }}>After login you can write a review for this question</span>}
                                    </div>
                                </form>
                                <ul class="comment-feed-list">
                                    {Object.entries(this.state.comment_data.comment_data).map(([o, comment]) => (

                                        <li class="comment-feed-item">
                                            <article>
                                                <p class="comment-feed-content">
                                                    <a href=""><img src={comment.u_image} /> {comment.u_name}</a>
                                                    &nbsp;<span>{comment.tpc_comment}</span>
                                                </p>
                                                <time>{comment.tpc_created_at}</time>
                                                {is_login() && comment.tpc_user_id == this.state.form_data.u_id && <button type="button" class="plain text-danger float-right" onClick={this.delete_comment.bind(this, comment.tpc_id)}>Delete</button>}
                                            </article>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}
export default QuestionDetail;