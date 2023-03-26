import PropTypes from 'prop-types';
import { ROW_VALUE_RENDERERS, COLUMN_TYPE, DATA_TYPE } from './tableTypes';

export default function TableRow({ row, columns, rowIdx, actions }) {
  const RENDERER = { ...ROW_VALUE_RENDERERS, actions: () => actions };

  return columns.map((columnDef, colIdx) => (
    <td key={'row-value-' + rowIdx + '-' + colIdx}>
      {RENDERER[columnDef.type] ? RENDERER[columnDef.type](row, columnDef) : RENDERER['text'](row, columnDef)}
    </td>
  ));
}

TableRow.propTypes = {
  row: DATA_TYPE.isRequired,
  columns: PropTypes.arrayOf(COLUMN_TYPE).isRequired,
  rowIdx: PropTypes.number.idRequired,
  actions: PropTypes.oneOfType([PropTypes.element, PropTypes.node]),
};
