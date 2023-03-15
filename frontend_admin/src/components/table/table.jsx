import { useEffect, useRef, useState } from 'preact/hooks';
import PropTypes from 'prop-types';
import './table.scss';

const COLUMN_TYPE = PropTypes.exact({
  heading: PropTypes.string,
  type: PropTypes.string,
  col: PropTypes.string,
  colLink: PropTypes.string,
});

const DATA_TYPE = PropTypes.object;

const DETAILS_SECTION_TYPE = PropTypes.oneOfType([PropTypes.element, PropTypes.string, PropTypes.node, PropTypes.func]);

function TableColumns({ columns }) {
  return columns.map((col, idx) =>
    col.type === 'checkbox' ? <th key={'col-' + idx}></th> : <th key={'col-' + idx}>{col.heading}</th>
  );
}
TableColumns.propTypes = {
  columns: PropTypes.arrayOf(COLUMN_TYPE).isRequired,
};

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

function TableRow({ row, columns, rowIdx }) {
  return columns.map((columnDef, colIdx) => (
    <td key={'row-' + rowIdx + colIdx}>
      {ROW_VALUE_RENDERER[columnDef.type]
        ? ROW_VALUE_RENDERER[columnDef.type](row, columnDef)
        : ROW_VALUE_RENDERER['text'](row, columnDef)}
    </td>
  ));
}

Table.propTypes = {
  columns: PropTypes.arrayOf(COLUMN_TYPE).isRequired,
  row: DATA_TYPE.isRequired,
  rowIdx: PropTypes.number.idRequired,
};

function TableRowList({ data, columns, detailsElement }) {
  const [openRows, setOpenRows] = useState([]);

  const handleClickRow = ({ target, currentTarget }) => {
    if (target.tagName !== 'A') {
      const clickedRowIndex = parseInt(currentTarget.dataset.key);

      if (openRows.includes(clickedRowIndex)) {
        setOpenRows(openRows.filter((i) => i !== clickedRowIndex));
      } else {
        setOpenRows([...openRows, clickedRowIndex]);
      }
    }
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
        <TableRow row={row} columns={columns} idx={idx} />
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

export default function Table({ columns, data, detailsElement, onCreate }) {
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

    if (document.activeElement.tagName === 'INPUT') {
      const focusedInput = document.activeElement;
      const focusedInputIdx = inputRefs.findIndex((input) => input.current === focusedInput);

      const nextInputIdx = (focusedInputIdx + 1) % 4;
      inputRefs[nextInputIdx].current.focus();
    } else {
      onCreate(newData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <table className="table" cellspacing="0" cellpadding="0">
        <thead>
          <tr>
            <TableColumns columns={columns} />
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
          <TableRowList data={data} columns={columns} detailsElement={detailsElement} />
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
