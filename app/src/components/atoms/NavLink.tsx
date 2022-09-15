import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import Link from 'next/link';
import React, { Children } from 'react';

const NavLink = function ({ children, activeClassName, ...props }) {
    const { asPath } = useRouter();
    const child = Children.only(children);
    const childClassName = child.props.className || '';

    // pages/index.js will be matched via props.href
    // pages/about.js will be matched via props.href
    // pages/[slug].js will be matched via props.as
    const className =
        asPath.startsWith(props.href) || (props.as && asPath.startsWith(props.as))
            ? `${childClassName} ${activeClassName}`.trim()
            : childClassName;

    return (
        <Link {...props}>
            {React.cloneElement(child, {
                className: className || null,
            })}
        </Link>
    );
};

NavLink.defaultProps = {
    className: '',
    as: '',
};

NavLink.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
    href: PropTypes.string.isRequired,
    activeClassName: PropTypes.string.isRequired,
    className: PropTypes.string,
    as: PropTypes.string,
};

export default NavLink;

/*
 * Example of usage: https://github.com/vercel/next.js/blob/canary/examples/active-class-name/components/Nav.js
 * */
