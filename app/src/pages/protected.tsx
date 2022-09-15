import React from 'react';

import SEO from '../components/atoms/seo';

const Protected = function () {
    return (
        <>
            <SEO title="Protected" />
            <div className="px-7 py-10 w-full">
                <h1 className="text-xl">Hi! you should only see this if you're authenticated</h1>
                <hr />
            </div>
        </>
    );
};

export default Protected;
