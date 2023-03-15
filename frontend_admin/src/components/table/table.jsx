import { useEffect, useRef, useState } from 'preact/hooks';
import PropTypes from 'prop-types';

import TableHeaderColumns from './tableHeaderColumns';
import './table.scss';

const COLUMN_TYPE = PropTypes.exact({
  heading: PropTypes.string,
  type: PropTypes.string,
  col: PropTypes.string,
  colLink: PropTypes.string,
});

const DATA_TYPE = PropTypes.object;

const DETAILS_SECTION_TYPE = PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.node, PropTypes.func]);

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

function TableRow({ row, columns, rowIdx, actions, editable, onSave }) {
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

Table.propTypes = {
  columns: PropTypes.arrayOf(COLUMN_TYPE).isRequired,
  row: DATA_TYPE.isRequired,
  rowIdx: PropTypes.number.idRequired,
};

function TableRowList({ data, columns, detailsElement, onUpdate, onDelete }) {
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
      <tr key={idx} data-key={idx} onClick={detailsElement && handleClickRow} title="Click to show details">
        <TableRow
          row={row}
          columns={columns}
          idx={idx}
          editable={editableRows.includes(idx)}
          onSave={onUpdate}
          actions={
            (onUpdate || onDelete) && (
              <td>
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
              </td>
            )
          }
        />
      </tr>
      <tr key={idx + '-detail'} className={'table__details ' + (!openRows.includes(idx) && 'collapsed')}>
        <td colspan={1 + columns.length}>{callDetailsRenderer(row, idx)}</td>
      </tr>
    </>
  ));
}

TableRowList.propTypes = {
  columns: PropTypes.arrayOf(COLUMN_TYPE).isRequired,
  data: PropTypes.arrayOf(DATA_TYPE).isRequired,
  detailsElement: DETAILS_SECTION_TYPE,
};

export default function Table({ columns, data, detailsElement, onCreate, onUpdate, onDelete }) {
  const [newData, setNewData] = useState({});

  const inputRefs = columns.map((col) => useRef(null));

  useEffect(() => {
    if (onCreate) {
      inputRefs[1].current.focus();
    }
  }, [onCreate]);

  const handleChangeInputNew = (ev) => {
    setNewData({ ...newData, [ev.target.name]: ev.target.value });
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();

    if (onCreate) {
      if (document.activeElement.tagName === 'INPUT') {
        const focusedInput = document.activeElement;
        const focusedInputIdx = inputRefs.findIndex((input) => input.current === focusedInput);

        const nextInputIdx = (focusedInputIdx + 1) % 4;
        inputRefs[nextInputIdx].current.focus();
      } else {
        onCreate(newData);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <table className="table" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <TableHeaderColumns columns={columns} />
            {(onUpdate || onDelete) && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {onCreate && (
            <>
              <tr>
                {columns.map((col, idx) => {
                  if (col.type === 'checkbox') {
                    return (
                      <td className="editRow" key={'edit-' + idx}>
                        <button tabIndex={columns.length} ref={inputRefs[idx]}>
                          Save
                        </button>
                      </td>
                    );
                  } else if (col.type === 'link') {
                    return (
                      <td className="editRow" key={'edit-' + idx}>
                        <input
                          type="text"
                          style={{ width: '50%' }}
                          name={col.col}
                          placeholder={col.heading}
                          tabIndex={idx}
                          ref={inputRefs[idx]}
                          onInput={handleChangeInputNew}
                        />
                        <input
                          type="text"
                          style={{ width: '50%' }}
                          name={col.colLink}
                          placeholder="Link"
                          tabIndex={idx}
                          ref={inputRefs[idx]}
                          onInput={handleChangeInputNew}
                        />
                      </td>
                    );
                  } else {
                    return (
                      <td className="editRow" key={'edit-' + idx}>
                        <input
                          type="text"
                          name={col.col}
                          placeholder={col.heading}
                          tabIndex={idx}
                          ref={inputRefs[idx]}
                          onInput={handleChangeInputNew}
                        />
                      </td>
                    );
                  }
                })}
              </tr>
              <tr className="table__details collapsed">
                <td colspan={1 + columns.length}></td>
              </tr>
            </>
          )}
          <TableRowList
            data={data}
            columns={columns}
            detailsElement={detailsElement}
            onUpdate={onUpdate}
            onDelete={onDelete}
          />
        </tbody>
      </table>
    </form>
  );
}

Table.propTypes = {
  columns: PropTypes.arrayOf(COLUMN_TYPE).isRequired,
  data: PropTypes.arrayOf(DATA_TYPE).isRequired,
  detailsElement: DETAILS_SECTION_TYPE,
};
