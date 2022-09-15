import classNames from 'classnames';
import NavLink from '../atoms/navLink';
import UserComponent from "./UserComponent";

import styles from '../../styles/components/navbar.module.scss';


const NavBar = function () {
    return (
        <div className={classNames('navbar', styles.navbar)}>
            <nav>
                <NavLink activeClassName={styles.active} href="/">
                    <a>Unprotected frontpage</a>
                </NavLink>
                <NavLink activeClassName={styles.active} href="/protected">
                    <a>Protected page</a>
                </NavLink>
                <UserComponent />
            </nav>
        </div>
    );
};

export default NavBar;
