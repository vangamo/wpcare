import { useEffect, useState } from 'preact/hooks';
import FeatherIcon from 'feather-icons-react';
import Page from '../../layout/page';
import Table from '../../table/table';
import './sites.scss';

const SITES_COLUMNS = [
  { type: 'id', col: 'id' },
  { heading: 'Name', type: 'link', col: 'name', colLink: 'url' },
  { heading: 'Type', type: 'text', col: 'type' },
  { heading: 'Last access', type: 'datetime', col: 'lastAccess' },
];

export default function () {
  const [isShownEditRow, setShownEditRow] = useState(false);
  const [listStatus, setListStatus] = useState('pending');
  const [sitesList, setSitesList] = useState([]);

  useEffect(() => {
    fetch('/api/sites/', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        if (data.info.success) {
          setListStatus('ok');
          setSitesList(data.results);
        } else {
          setListStatus(data.info.error);
        }
      });
  }, []);

  const handleSaveSite = (data) => {
    setShownEditRow(false);
    console.log('Create', data);

    fetch('/api/site/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.dir(response);
        return response.json();
      })
      .then((data) => console.log(data));
  };

  const handleUpdateSite = (newData, oldData) => {
    console.log('Edit', { newData, oldData });

    fetch('/api/site/' + oldData.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newData),
    })
      .then((response) => {
        console.dir(response);
        return response.json();
      })
      .then((data) => console.log(data));
  };

  const handleDeleteSite = (id) => {
    console.log('Delete', id);

    fetch('/api/site/' + id, { method: 'DELETE' })
      .then((response) => {
        console.dir(response);
        return response.json();
      })
      .then((data) => console.log(data));
  };

  return (
    <Page name="Sites" title="Sites" description="Listing all sites">
      <div className="row-1">
        <div className="box">
          <div className="box__title">
            <h3 className="box__title__text">Sites</h3>
            <div className="box__title__toolbox">
              <button onClick={() => setShownEditRow(!isShownEditRow)}>
                <FeatherIcon icon="file-plus" size="24" />
              </button>
            </div>
          </div>
          <div className="box__content">
            {listStatus === 'pending' && <p>Retrieving data</p>}
            {listStatus !== 'pending' && listStatus !== 'ok' && (
              <p>An error occurred while retrieving data. Please, try it again later.</p>
            )}
            {listStatus === 'ok' && (
              <Table
                onCreate={isShownEditRow && handleSaveSite}
                onUpdate={handleUpdateSite}
                onDelete={handleDeleteSite}
                data={sitesList}
                columns={SITES_COLUMNS}
                detailsElement={(data) => <p>Details of {data.name} page</p>}
              ></Table>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}
