import { useEffect, useState } from 'preact/hooks';
import Page from '../../layout/page';
import Table from '../../table/table';
import './sites.scss';

const SITES_COLUMNS = [
  { type: 'checkbox' },
  { heading: 'Name', type: 'link', col: 'name', colLink: 'url' },
  { heading: 'Type', type: 'text', col: 'type' },
  { heading: 'Last access', type: 'datetime', col: 'lastAccess' },
];

export default function () {
  const [sitesList, setSitesList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/sites/', {method: 'GET'})
      .then(response => response.json())
      .then(data => setSitesList(data))
  }, [])

  return (
    <Page name='Sites' title='Sites' description='Listing all sites'>
      <div className='row-1'>
        <div className='box'>
          <h3 className='box__title'>Sites</h3>
          <div className='box__content'>
            <Table
              data={sitesList}
              columns={SITES_COLUMNS}
            ></Table>
          </div>
        </div>
      </div>
    </Page>
  );
}
