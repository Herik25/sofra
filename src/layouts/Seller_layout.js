import React from 'react';
// component

import SellerHeader from '../include/seller_header';
import SellerFooter from '../include/seller_footer';
import Sidebar from '../include/seller_sidebar';

function Default({ children }) {
    window.scrollTo(0, 0);
    let current_url = window.location.href;
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
    return (
        <>

            <div class="infobar-settings-sidebar-overlay"></div>
            <div id="containerbar">
                <SellerHeader />
                <div class="rightbar">
                    <Sidebar />
                    {children}
                    <SellerFooter />
                </div>
            </div>
        </>
    );
}

export default Default;
