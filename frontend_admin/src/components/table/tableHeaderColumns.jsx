import PropTypes from 'prop-types';
import { COLUMN_TYPE } from './tableTypes';

export default function TableHeaderColumns({ columns }) {
  return columns.map((col, idx) =>
    col.type === 'checkbox' ? <th key={'col-' + idx}></th> : <th key={'col-' + idx}>{col.heading}</th>
  );
}
TableHeaderColumns.propTypes = {
  columns: PropTypes.arrayOf(COLUMN_TYPE).isRequired,
};
