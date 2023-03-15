import PropTypes from 'prop-types';
export const COLUMN_TYPE = PropTypes.exact({
  heading: PropTypes.string,
  type: PropTypes.string,
  col: PropTypes.string,
  colLink: PropTypes.string,
});

export const DATA_TYPE = PropTypes.object;

export const DETAILS_SECTION_TYPE = PropTypes.oneOfType([
  PropTypes.element,
  PropTypes.string,
  PropTypes.node,
  PropTypes.func,
]);
