import React from 'react';

const HexToColorPreview = ({ hexColor }) => {

    const divStyle = {
        backgroundColor: hexColor,
        width: '60px',
        height: '40px',
        marginLeft: '250px',
        border: '1px solid #000',
    };

    return (
        <div>
            <div style={divStyle}></div>

        </div>
    );
};

export default HexToColorPreview;
