import { useState } from 'preact/hooks';
import PropTypes from 'prop-types';
import TableRow from './tableRow';
import { COLUMN_TYPE, DATA_TYPE, DETAILS_SECTION_TYPE } from './tableTypes';

export default function TableRowList({ data, columns, detailsElement, onUpdate, onDelete }) {
  const [openRows, setOpenRows] = useState([]);
  const [editableRows, setEditableRows] = useState([]);

  const handleClickRow = ({ target, currentTarget }) => {
    if (target.tagName !== 'A' && target.tagName !== 'BUTTON') {
      const clickedRowIndex = parseInt(currentTarget.dataset.key);

      if (openRows.includes(clickedRowIndex)) {
        setOpenRows(openRows.filter((i) => i !== clickedRowIndex));
      } else {
        setOpenRows([...openRows, clickedRowIndex]);
      }
    }
  };

  const handleClickEdit = ({ currentTarget }) => {
    const clickedRowIndex = parseInt(currentTarget.dataset.key);

    if (editableRows.includes(clickedRowIndex)) {
      setEditableRows(editableRows.filter((i) => i !== clickedRowIndex));
    } else {
      setEditableRows([...editableRows, clickedRowIndex]);
    }
  };

  const handleClickDelete = ({ currentTarget }) => {
    const clickedRowId = parseInt(currentTarget.dataset.rowId);

    onDelete(clickedRowId);
  };

  const callDetailsRenderer = (row, idx) => {
    if (typeof detailsElement === 'function') {
      return detailsElement(row, idx, data);
    } else {
      return detailsElement;
    }
  };

  return data.map((row, idx) => (
    <>
      <tr key={'row-' + idx} data-key={idx} onClick={detailsElement && handleClickRow} title="Click to show details">
        <TableRow
          row={row}
          columns={columns}
          rowIdx={idx}
          editable={editableRows.includes(idx)}
          onSave={onUpdate}
          actions={
            (onUpdate || onDelete) && (
              <>
                {onUpdate && (
                  <button onClick={handleClickEdit} data-key={idx}>
                    edit
                  </button>
                )}
                {onDelete && (
                  <button onClick={handleClickDelete} data-rowId={row.id}>
                    del
                  </button>
                )}
              </>
            )
          }
        />
      </tr>
      <tr key={'row-detail-' + idx} className={'table__details ' + (!openRows.includes(idx) && 'collapsed')}>
        <td colspan={1 + columns.length}>{callDetailsRenderer(row, idx)}</td>
      </tr>
    </>
  ));
}

TableRowList.propTypes = {
  data: PropTypes.arrayOf(DATA_TYPE).isRequired,
  columns: PropTypes.arrayOf(COLUMN_TYPE).isRequired,
  detailsElement: DETAILS_SECTION_TYPE,
  onUpdate: PropTypes.func,
  onDelete: PropTypes.func,
};
