import { useState } from 'preact/hooks';
import './table.scss';

function TableColumns(columns) {
  return columns.map((col, idx) =>
    col.type === 'checkbox' ? (
      <th key={'col-' + idx}></th>
    ) : (
      <th key={'col-' + idx}>{col.heading}</th>
    )
  );
}

const ROW_VALUE_RENDERER = {
  checkbox: (rowValues, columnDef) => {
    return <input type='checkbox' />;
  },
  link: (rowValues, columnDef) => {
    return (
      <a href={rowValues[columnDef.colLink]}>{rowValues[columnDef.col]}</a>
    );
  },
  text: (rowValues, columnDef) => {
    return rowValues[columnDef.col];
  },
  datetime: (rowValues, columnDef) => {
    return rowValues[columnDef.col];
  },
};

function TableRow(row, columns, rowIdx) {
  return columns.map((columnDef, colIdx) => (
    <td key={'row-' + rowIdx + colIdx}>
      {ROW_VALUE_RENDERER[columnDef.type]
        ? ROW_VALUE_RENDERER[columnDef.type](row, columnDef)
        : ROW_VALUE_RENDERER['text'](row, columnDef)}
    </td>
  ));
}

function TableRowList(data, columns, detailsElement) {
  const [openRows, setOpenRows] = useState([]);

  const handleClickRow = ({ target, currentTarget }) => {
    if (target.tagName !== 'A') {
      const clickedRowIndex = parseInt(currentTarget.dataset.key);
      console.log(clickedRowIndex);
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
      <tr
        key={idx}
        data-key={idx}
        onClick={detailsElement && handleClickRow}
        title='Click to show details'
      >
        {TableRow(row, columns, idx)}
      </tr>
      <tr
        key={idx + '-detail'}
        className={'table__details ' + (!openRows.includes(idx) && 'collapsed')}
      >
        <td colspan={1 + columns.length}>{callDetailsRenderer(row, idx)}</td>
      </tr>
    </>
  ));
}

export default function Table({ columns, data, detailsElement }) {
  return (
    <table className='table' cellspacing='0' cellpadding='0'>
      <thead>
        <tr>{TableColumns(columns)}</tr>
      </thead>
      <tbody>{TableRowList(data, columns, detailsElement)}</tbody>
    </table>
  );
}
