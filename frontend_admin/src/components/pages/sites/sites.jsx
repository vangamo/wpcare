import { useState } from 'preact/hooks';
import FeatherIcon from 'feather-icons-react';
import Page from '../../layout/page';
import Table from '../../table/table';
import './sites.scss';

export default function () {
  const [isShownEditRow, setShownEditRow] = useState(false);
  const handleSaveSite = (data) => {
    setShownEditRow(false);
    console.log(data);
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
            <Table
              onCreate={isShownEditRow && handleSaveSite}
              onUpdate={() => {}}
              onDelete={() => {}}
              data={[
                {
                  name: 'Python',
                  url: 'https://www.python.org/',
                  type: 'web',
                  lastAccess: '1 day',
                },
                {
                  name: 'Preact',
                  url: 'https://preactjs.com/',
                  type: 'web',
                  lastAccess: '3 days',
                },
                {
                  name: 'Wordpress news',
                  url: 'https://wordpress.org/news/',
                  type: 'WP',
                  lastAccess: '1 week',
                },
              ]}
              columns={[
                { type: 'checkbox' },
                { heading: 'Name', type: 'link', col: 'name', colLink: 'url' },
                { heading: 'Type', type: 'text', col: 'type' },
                { heading: 'Last access', type: 'datetime', col: 'lastAccess' },
              ]}
              detailsElement={(data) => <p>Details of {data.name} page</p>}
            ></Table>
          </div>
        </div>
      </div>
    </Page>
  );
}
