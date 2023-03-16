import { useState } from 'preact/hooks';
import PropTypes from 'prop-types';
import { COLUMN_TYPE, DATA_TYPE } from './tableTypes';

export default function TableEditableRow({ row, columns, rowIdx, onSave }) {
  const [newData, setNewData] = useState({ ...row });

  const handleClick = (ev) => {
    onSave(rowIdx, newData, row);
  };

  const handleCancel = (ev) => {
    onSave(rowIdx);
  };

  const handleInput = ({ currentTarget }) => {
    setNewData({ ...newData, [currentTarget.name]: currentTarget.value });
  };

  const TEXT_RENDERER = (value, columnDef, rowValues) => (
    <input type="text" name={columnDef.col} onInput={handleInput} value={value} />
  );
  const RENDERER = {
    id: () => (
      <>
        <button onClick={handleClick}>Save</button>
        <button onClick={handleCancel}>Cancel</button>
      </>
    ),
    text: TEXT_RENDERER,
    link: TEXT_RENDERER,
    datetime: TEXT_RENDERER,
    actions: () => null,
  };

  return columns.map((columnDef, colIdx) => (
    <td key={'row-value-' + rowIdx + '-' + colIdx} className="editRow">
      {RENDERER[columnDef.type] && RENDERER[columnDef.type](newData[columnDef.col], columnDef, row)}
    </td>
  ));
}

TableEditableRow.propTypes = {
  row: DATA_TYPE.isRequired,
  columns: PropTypes.arrayOf(COLUMN_TYPE).isRequired,
  rowIdx: PropTypes.number.idRequired,
  onSave: PropTypes.func,
};
