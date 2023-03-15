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

export const ROW_VALUE_RENDERERS = {
  id: (rowValues, columnDef) => {
    return <input type="checkbox" />;
  },
  link: (rowValues, columnDef) => {
    return <a href={rowValues[columnDef.colLink]}>{rowValues[columnDef.col]}</a>;
  },
  text: (rowValues, columnDef) => {
    return rowValues[columnDef.col];
  },
  datetime: (rowValues, columnDef) => {
    return rowValues[columnDef.col];
  },
};
