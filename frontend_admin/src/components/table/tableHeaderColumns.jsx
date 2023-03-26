import PropTypes from 'prop-types';
import { COLUMN_TYPE } from './tableTypes';

export default function TableHeaderColumns({ columns }) {
  return columns.map((col, idx) =>
    col.type === 'checkbox' ? <th key={'row-header-' + idx}></th> : <th key={'row-header-' + idx}>{col.heading}</th>
  );
}
TableHeaderColumns.propTypes = {
  columns: PropTypes.arrayOf(COLUMN_TYPE).isRequired,
};
