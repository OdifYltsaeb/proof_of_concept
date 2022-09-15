import React from 'react';
import PropTypes from 'prop-types';
import { childrenType } from '../../types/meta';

const LinkWithCallback = React.forwardRef(
    ({ onClick, href, clickCallback, children, className }, ref) => {
        const cb = (e:any) => {
            onClick(e);
            clickCallback(e);
        };

        return (
            <a href={href} onClick={cb} ref={ref} className={`cursor-pointer ${className}`}>
                {children}
            </a>
        );
    },
);

LinkWithCallback.defaultProps = {
    onClick: () => {},
    clickCallback: () => {},
    className: undefined,
    children: () => {},
    href: undefined,
};

LinkWithCallback.propTypes = {
    onClick: PropTypes.func,
    clickCallback: PropTypes.func,
    href: PropTypes.string,
    className: PropTypes.string,
    children: childrenType,
};

export default LinkWithCallback;
