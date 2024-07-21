import React from 'react';
import { NavLink } from 'react-router-dom';
import { Helmet } from "react-helmet";
function Seller_footer() {

    return (
        <>
            {localStorage.getItem('device_type') == 'web' && <div class="footerbar">
                <footer class="footer p-0">
                    <p class="mb-0">© 2021 Shorfa - All Rights Reserved.</p>
                </footer>
            </div>
            }
            <Helmet>

            </Helmet>
        </>
    );

}

export default Seller_footer;
