import './layout.css'
import React from 'react';

const Layout: React.FC = function() {

    return (
        <div className="layout-full-container position-fixed top-0 left-0 h-100 w-100 d-flex justify-content-center align-items-center">
            <div className="layout-container">
                This is main page layout
            </div>
        </div>
    );
};

export default Layout;