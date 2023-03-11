import Page from '../../layout/page';
import Table from '../../table/table';
import './sites.scss';

export default function () {
  return (
    <Page name='Sites' title='Sites' description='Listing all sites'>
      <div className='row-1'>
        <div className='box'>
          <h3 className='box__title'>Sites</h3>
          <div className='box__content'>
            <Table
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
                  name: 'Other',
                  url: 'https://preact.io',
                  type: 'WP',
                  lastAccess: '3 days',
                },
              ]}
              columns={['Name', 'Type', 'Last access']}
              detailsElement={(data) => <p>Details of {data.name} page</p>}
            ></Table>
          </div>
        </div>
      </div>
    </Page>
  );
}
