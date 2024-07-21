import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { NavLink, Redirect } from 'react-router-dom';
import { api_option, setUserSession, is_login, removeUserSession } from '../api/Helper';

class Logout extends Component {
    constructor(props) {
        super(props);
        var device_type = localStorage.getItem('device_type');

        removeUserSession();
        localStorage.clear();
        localStorage.setItem('device_type', device_type);
        if (device_type == 'web') {
            this.props.history.push('/');
        } else {
            this.props.history.push('/home/' + device_type);
        }

    }
    //view load home page
    render() {

        return (
            <>

            </>
        );
    }
}


export default Logout;
