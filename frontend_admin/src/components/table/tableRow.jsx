import PropTypes from 'prop-types';
import { COLUMN_TYPE, DATA_TYPE } from './tableTypes';

const ROW_VALUE_RENDERER = {
  checkbox: (rowValues, columnDef) => {
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

export default function TableRow({ row, columns, rowIdx, actions, editable, onSave }) {
  const handleClick = (ev) => {
    onSave(row.id, row);
  };

  const handleInput = ({ currentTarget }) => {};

  const rowColumns = columns.map((columnDef, colIdx) => (
    <td key={'row-' + rowIdx + colIdx} className={editable && 'editRow'}>
      {editable && colIdx === 0 && <button onClick={handleClick}>Save</button>}
      {editable && colIdx !== 0 && <input type="text" onInput={handleInput} value={row[columnDef.col]} />}
      {!editable && ROW_VALUE_RENDERER[columnDef.type] && ROW_VALUE_RENDERER[columnDef.type](row, columnDef)}
      {!editable && !ROW_VALUE_RENDERER[columnDef.type] && ROW_VALUE_RENDERER['text'](row, columnDef)}
    </td>
  ));

  return (
    <>
      {rowColumns}
      {actions}
    </>
  );
}

TableRow.propTypes = {
  row: DATA_TYPE.isRequired,
  columns: PropTypes.arrayOf(COLUMN_TYPE).isRequired,
  idx: PropTypes.number.idRequired,
  actions: PropTypes.oneOfType([PropTypes.element, PropTypes.node]),
  editable: PropTypes.bool,
  onSave: PropTypes.func,
};
