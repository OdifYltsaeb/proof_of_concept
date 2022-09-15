import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { connect } from 'react-redux';

// import NavLink from '../atoms/NavLink';
import logUserOut from '../../utils/logout';
import LinkWithCallback from '../atoms/LinkWithCallback';
import {clearAuthenticatedUser, getUser, isAuthenticated} from "../../stores/authentication";
import NavLink from "../atoms/NavLink";

const UserComponent = function ({ authenticated, user, clearUser }) {
    const [dropdownOpen, setDropdownState] = useState(false);
    const dropDown = useRef(null);

    const closeMenu = () => {
        setDropdownState(false);
        document.activeElement.blur();
    };

    useEffect(() => {
        const closeDropDown = (e:any) => {
            const element = dropDown.current;
            if (e.target !== element && !element.contains(e.target) && dropdownOpen) {
                setDropdownState(false);
            }
        };
        document.addEventListener('click', closeDropDown);

        // Specify how to clean up after this effect:
        return () => {
            document.removeEventListener('click', closeDropDown);
        };
    }, [dropdownOpen]);

    let el = <NavLink ref={dropDown} href="/login" activeClassName="active" className="ml-auto"><a>Login</a></NavLink>;
    if (authenticated) {
        const { name, email } = user;
        el = (
            <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setDropdownState(!dropdownOpen)}
                onKeyDown={() => setDropdownState(!dropdownOpen)}
            >
                <span className="mr-2">{`${name}, (${email})`}</span>
                <FontAwesomeIcon
                    className={classNames({'rotate-180': dropdownOpen})}
                    icon={faAngleDown}
                />
            </button>
        );
    }

    return (
        <div
            className={classNames('dropdown dropdown-end pl-0 pr-0 ml-auto', {
                'dropdown-open': dropdownOpen === true,
            })}
        >
            {el}
            <ul
                className={classNames("p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52 text-neutral", {hidden: !authenticated})}
                ref={dropDown}
            >
                {/*<li>*/}
                {/*    <NavLink href="/profile" activeClassName="active">*/}
                {/*        <LinkWithCallback clickCallback={closeMenu}>Profile</LinkWithCallback>*/}
                {/*    </NavLink>*/}
                {/*</li>*/}
                <li>
                    <LinkWithCallback clickCallback={() => logUserOut(clearUser)}>Log out</LinkWithCallback>
                </li>
            </ul>
        </div>
    );

};

const mapStateToProps = (state) => ({
    user: getUser(state),
    authenticated: isAuthenticated(state),
});

const mapDispatchToProps = (dispatch) => ({
    clearUser: () => dispatch(clearAuthenticatedUser()),
});


export default connect(mapStateToProps, mapDispatchToProps)(UserComponent);
