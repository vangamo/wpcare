import { useState } from 'preact/hooks';
import './table.scss';

function TableColumns(columns) {
  return [
    <th key='id'></th>,
    ...columns.map((column) => <th key={column}>{column}</th>),
  ];
}

function TableRow(row) {
  return (
    <>
      <td>
        <input type='checkbox' />
      </td>
      <td>
        <a href={row.url}>{row.name}</a>
      </td>
      <td>{row.type}</td>
      <td>{row.lastAccess}</td>
    </>
  );
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
        {TableRow(row)}
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
