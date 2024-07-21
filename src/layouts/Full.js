import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Full({ children }) {
    window.scrollTo(0, 0);
    return (
        <>
            <ToastContainer />
            {children}
        </>
    );
}

export default Full;
