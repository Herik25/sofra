import React from 'react';
// component

import Header from '../include/product_header';
import Footer from '../include/footer';
import $ from 'jquery';

function ProductDefault({ children }) {
    window.scrollTo(0, 0);
    let current_url = window.location.href;
    //    JSInterface.login_success('');

    if (localStorage.getItem('current_language') && localStorage.getItem('current_language') == 'ar') {
        var lang = 'ar';
        $('html').addClass('shorfa-rtl');
    } else {
        var lang = 'en';
        localStorage.setItem('current_language', 'en')
        $('html').removeClass('shorfa-rtl');
    }
    if (current_url.includes("android")) {
        localStorage.setItem('device_type', 'android');
    } else if (current_url.includes("ios")) {
        localStorage.setItem('device_type', 'ios');
    } else {
        if (localStorage.getItem('device_type')) {

        } else {

            localStorage.setItem('device_type', 'web');
        }

    }

    if (current_url.includes("home") || current_url.includes("Home") || current_url == 'http://192.168.100.210:3000/#/') {
        localStorage.setItem('home_active', 'active');

    } else {
        localStorage.setItem('home_active', '');
    }

    return (
        <>
            <Header />
            {children}
            <Footer />
        </>
    );
}

export default ProductDefault;
