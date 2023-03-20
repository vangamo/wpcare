import { useEffect, useState } from 'preact/hooks';
import FeatherIcon from 'feather-icons-react';
import Page from '../../../layout/page';
import Table from '../../../table/table';
import { proccessInput } from './pluginsImport';
/*
const SITES_COLUMNS = [
  { type: 'id', col: 'id' },
  { heading: 'Name', type: 'link', col: 'name', colLink: 'url' },
  { heading: 'Type', type: 'text', col: 'type' },
  { heading: 'Last access', type: 'datetime', col: 'lastAccess' },
];
*/
const PLUGINS_COLUMNS = [
  { type: 'id', col: 'id' },
  { heading: 'Name', type: 'text', col: 'name' },
  { heading: 'Version', type: 'text', col: 'version' },
  { heading: 'Author', type: 'text', col: 'author' },
  { heading: 'Sites', type: 'text', col: 'sites' },
];

export default function () {
  const [isShownMultiplePluginBox, setIsShownMultiplePluginBox] = useState(false);
  const [multiplePluginsInput, setMultiplePluginsInput] = useState('');
  const [isShownEditRow, setShownEditRow] = useState(false);
  const [listStatus, setListStatus] = useState('pending');
  const [pluginsList, setPluginsList] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/plugins/', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        if (data.info.success) {
          setListStatus('ok');
          setPluginsList(data.results);
        } else {
          setListStatus(data.info.error);
        }
      });
  }, []);

  const handleClickCreateMultiple = () => {
    fetch('http://localhost:5000/api/sites/', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        if (data.info.success) {
          const allSites = data.results;
          const sitesInfo = proccessInput(multiplePluginsInput);

          for (const site of sitesInfo) {
            const siteInfo = allSites.find((s) => s.url === site.url);

            if (siteInfo) {
              const siteId = siteInfo.id;

              for (const eachPluginOfSite of site.plugins.activePlugins) {
                handleSavePlugin({ ...eachPluginOfSite, active: true, sitewp_id: siteId });
              }
            } else {
              console.log('Site ' + site.url + ' not registered.');
            }
          }
        } else {
          console.error(data);
        }
      });
  };

  const handleSavePlugin = (data) => {
    setShownEditRow(false);
    console.log('Create', data);

    fetch('http://localhost:5000/api/plugin/', {
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

  const handleUpdatePlugin = (newData, oldData) => {
    console.log('Edit', { newData, oldData });

    fetch('http://localhost:5000/api/plugin/' + oldData.id, {
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

  const handleDeletePlugin = (id) => {
    console.log('Delete', id);

    fetch('http://localhost:5000/api/plugin/' + id, { method: 'DELETE' })
      .then((response) => {
        console.dir(response);
        return response.json();
      })
      .then((data) => console.log(data));
  };

  return (
    <Page name="Plugins" title="Plugins" description="Listing all plugins">
      <div className="row-1">
        <div className="box">
          <div className="box__title">
            <h3 className="box__title__text">Plugins</h3>
            <div className="box__title__toolbox">
              <button onClick={() => setShownEditRow(!isShownEditRow)} title="Register a new plugin">
                <FeatherIcon icon="file-plus" size="24" />
              </button>
              <button
                onClick={() => setIsShownMultiplePluginBox(!isShownMultiplePluginBox)}
                title="Import plugin list from script JSON"
              >
                <FeatherIcon icon="layers" size="24" />
              </button>
            </div>
          </div>
          {!isShownMultiplePluginBox && (
            <div className="box__content">
              <textarea
                onInput={({ target }) => setMultiplePluginsInput(target.value)}
                value={multiplePluginsInput}
              ></textarea>
              <button onClick={handleClickCreateMultiple}>Save</button>
              <button onClick={() => setIsShownMultiplePluginBox(!isShownMultiplePluginBox)}>Cancel</button>
            </div>
          )}
          <div className="box__content">
            {listStatus === 'pending' && <p>Retrieving data</p>}
            {listStatus !== 'pending' && listStatus !== 'ok' && (
              <p>An error occurred while retrieving data. Please, try it again later.</p>
            )}
            {listStatus === 'ok' && (
              <Table
                onCreate={isShownEditRow && handleSavePlugin}
                onUpdate={handleUpdatePlugin}
                onDelete={handleDeletePlugin}
                data={pluginsList}
                columns={PLUGINS_COLUMNS}
                detailsElement={(data) => <p>Details of plugin {data.name}</p>}
              ></Table>
            )}
          </div>
        </div>
      </div>
    </Page>
  );
}
