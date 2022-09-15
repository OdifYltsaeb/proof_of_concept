import classNames from 'classnames';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faExclamationCircle,
    faExclamationTriangle,
    faInfoCircle,
    faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

interface AlertProps {
    type: string,
    text: string,
    className: string,
}

const Alert = function ({ type, text, className }: AlertProps) {
    const svgs = {
        error: faExclamationCircle,
        warning: faExclamationTriangle,
        info: faInfoCircle,
        success: faCheckCircle,
    };

    const cssClass = {
        error: 'alert-error',
        warning: 'alert-warning',
        info: 'alert-info',
        success: 'alert-success',
    };

    return (
        <div className={classNames('alert', cssClass[type], className)}>
            <div className="flex-1 items-center">
                <FontAwesomeIcon icon={svgs[type]} />
                <label className="ml-3">{text}</label>
            </div>
        </div>
    );
};

Alert.defaultProps = {
    type: 'info',
    className: '',
};

Alert.propTypes = {
    type: PropTypes.string,
    text: PropTypes.string.isRequired,
    className: PropTypes.string,
};

export default Alert;
