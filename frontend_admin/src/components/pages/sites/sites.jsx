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
  const [listStatus, setListStatus] = useState('pending');
  const [sitesList, setSitesList] = useState([]);

  useEffect(() => {
    //fetch('http://localhost:5000/api/site/', {method:'POST', headers:{'Content-Type':'application/json'}, body:'{"name":"React JS","url":"https://reactjs.org","type":"web"}'}).then(response=>{console.dir(response);return response.json()}).then(data=>console.log(data));

    //fetch('http://localhost:5000/api/site/3', {method:'PUT', headers:{'Content-Type':'application/json'}, body:'{"name":"Other"}'}).then(response=>{console.dir(response);return response.json()}).then(data=>console.log(data));

    //fetch('http://localhost:5000/api/site/3', {method:'DELETE'}).then(response=>{console.dir(response);return response.json()}).then(data=>console.log(data));

    fetch('http://localhost:5000/api/sites/', {method: 'GET'})
      .then(response => response.json())
      .then(data => {
        if( data.info.success ) {
          setListStatus('ok');
          setSitesList(data.results);
        }
        else {
          setListStatus(data.info.error);
        }
      });
  }, [])

  return (
    <Page name='Sites' title='Sites' description='Listing all sites'>
      <div className='row-1'>
        <div className='box'>
          <h3 className='box__title'>Sites</h3>
          <div className='box__content'>
            {(listStatus === 'pending') && <p>Retrieving data</p>}
            {(listStatus !== 'pending') && (listStatus !== 'ok') && <p>An error occurred while retrieving data. Please, try it again later.</p>}
            {(listStatus==='ok') && <Table
              data={sitesList}
              columns={SITES_COLUMNS}
            ></Table>
            }
          </div>
        </div>
      </div>
    </Page>
  );
}