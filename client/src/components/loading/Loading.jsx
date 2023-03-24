import React from 'react';

const Loading = ({ show }) => (
    show ? 
        (
            <p tabIndex={1}>Loading...</p>
        ) : null
)

export default Loading;