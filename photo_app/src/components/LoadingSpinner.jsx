import React from "react";

const LoadingSpinner = () => {

    return (
        <div style={{
            display: 'flex', 
            justifyContent: 'center', 
            padding: '20px'
        }}>

            <div>🔄 Đang tải...</div>     
        </div>
    );
};


export default LoadingSpinner;