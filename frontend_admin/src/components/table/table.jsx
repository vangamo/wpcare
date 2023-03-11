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

function TableRowList(data, columns) {
  return data.map((row, idx) => (
    <>
      <tr key={idx}>{TableRow(row)}</tr>
      <tr key={idx + '-detail'} className='table__details collapsed'>
        <td colspan={1+columns.length}><p>Details</p></td>
      </tr>
    </>
  ));
}

export default function Table({ columns, data }) {
  return (
    <table className='table' cellspacing='0' cellpadding='0'>
      <thead>
        <tr>{TableColumns(columns)}</tr>
      </thead>
      <tbody>{TableRowList(data, columns)}</tbody>
    </table>
  );
}
