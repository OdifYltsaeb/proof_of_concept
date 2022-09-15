import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';

import NavLink from '../atoms/navLink';
import logUserOut from '../../utils/logout';
import LinkWithCallback from '../atoms/LinkWithCallback';
import withUser from '../../utils/user';

const UserComponent = function () {
    const [dropdownOpen, setDropdownState] = useState(false);
    const dropDown = useRef(null);
    const { user } = withUser();

    let name;
    let email;

    if (user) {
        ({ name, email } = user);
    }

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

    return (
        <div
            className={classNames('dropdown dropdown-end pl-0 pr-0 ml-7', {
                'dropdown-open': dropdownOpen === true,
            })}
        >
            <button
                type="button"
                className="btn btn-ghost"
                onClick={() => setDropdownState(!dropdownOpen)}
                onKeyDown={() => setDropdownState(!dropdownOpen)}
            >
                <span className="mr-2">{`${name}, (${email})`}</span>
                <FontAwesomeIcon
                    className={classNames({ 'rotate-180': dropdownOpen })}
                    icon={faAngleDown}
                />
            </button>
            <ul
                className="p-2 shadow menu dropdown-content bg-base-100 rounded-box w-52 text-neutral"
                ref={dropDown}
            >
                {/*<li>*/}
                {/*    <NavLink href="/profile" activeClassName="active">*/}
                {/*        <LinkWithCallback clickCallback={closeMenu}>Profile</LinkWithCallback>*/}
                {/*    </NavLink>*/}
                {/*</li>*/}
                <li>
                    <LinkWithCallback clickCallback={() => logUserOut()}>Log out</LinkWithCallback>
                </li>
            </ul>
        </div>
    );
};

export default UserComponent;
