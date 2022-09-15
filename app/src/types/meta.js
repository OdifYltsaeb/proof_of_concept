import PropTypes from 'prop-types';

export const metaNameType = PropTypes.shape({
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
});

export const metaPropertyType = PropTypes.shape({
    property: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
});

export const childrenType = PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
]);
