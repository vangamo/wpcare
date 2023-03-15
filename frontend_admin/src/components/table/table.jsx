import { useEffect, useRef, useState } from 'preact/hooks';
import PropTypes from 'prop-types';

import TableHeaderColumns from './tableHeaderColumns';
import TableRowList from './tableRowList';
import { COLUMN_TYPE, DATA_TYPE, DETAILS_SECTION_TYPE } from './tableTypes';
import './table.scss';

export default function Table({ columns, data, detailsElement, onCreate, onUpdate, onDelete }) {
  const columnIdIndex = columns.findIndex((col) => col.type === 'id');

  if (columnIdIndex === -1) {
    onUpdate = null;
    onDelete = null;
  } else {
    const columnId = columns.splice(columnIdIndex, 1)[0];
    columns.unshift(columnId);
  }

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

  if (onUpdate || onDelete) {
    columns.push({ type: 'actions', heading: 'Actions' });
  }

  return (
    <form onSubmit={handleSubmit}>
      <table className="table" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <TableHeaderColumns columns={columns} />
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
