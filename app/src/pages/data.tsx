import React, { useState } from 'react';

import SEO from '../components/atoms/SEO';
import axios from "../utils/axios";

const DataView = function () {
    const [data, setData] = useState({});
    const loadData = () => {
        axios.get('/api/user/me').then((response) => {
            setData(response.data);
        }).catch(() => {});
    }

    let stuff = <button className="btn btn-primary" onClick={() => loadData()}>Load the data</button>;
    if ('email' in data) {
        stuff = <pre>{JSON.stringify(data, null, 2) }</pre>
    }

    return (
        <>
            <SEO title="Some data" />
            <div className="px-7 py-10 w-full">
                <h1 className="text-xl">Hi! you should only see this if you're authenticated</h1>
                <hr className="mb-8" />
                {stuff}
            </div>
        </>
    );
};

export default DataView;
