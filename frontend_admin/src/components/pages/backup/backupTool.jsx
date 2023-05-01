import { format } from 'date-fns';
import Page from '../../layout/page';

const MIME_TYPE = 'application/json';

// <https://stackoverflow.com/questions/45831191/generate-and-download-file-from-js>
const downloadContent = (filename, content, mime = MIME_TYPE) => {
  const downloadElement = document.createElement('a');
  downloadElement.setAttribute('download', filename);
  downloadElement.setAttribute('type', mime);
  downloadElement.setAttribute('href', 'data:' + mime + ',' + encodeURIComponent(content));
  downloadElement.click();
};

const SERVER_API = (import.meta.env.DEV) ? '//localhost:5000' : '';

export default function backupTool() {
  const IMPORT_FUNCTIONS = {
    '0.1.1': (data) => {
      const { sites } = data;
      for (const eachSite of sites) {
        console.log('Creating', eachSite);
        fetch(SERVER_API+'/api/site/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eachSite),
        })
          .then((response) => response.json())
          .then((data) => console.log(data));
      }
    },
    '0.1.2': (data) => {
      fetch(SERVER_API+'/api/sites/')
        .then((response) => response.json())
        .then(({results: savedSites}) => {
      fetch(SERVER_API+'/api/plugins/')
          .then((response) => response.json())
          .then(({results: savedPlugins}) => {
          console.log('Saved sites',savedSites);
          const { sites } = data;
          for (const eachSite of sites) {
            const foundSite = savedSites.find(s => s.url.replace(/\/$/, '').replace(/https?:\/\//, '').replace('www.','') === eachSite.url.replace(/\/$/, '').replace(/https?:\/\//, '').replace('www.',''));
            let siteId = foundSite?.id;

            if( foundSite ) {
              console.log('Site found', eachSite, foundSite);

              if( foundSite.name != eachSite.name || foundSite.type != eachSite.type || foundSite.lastAccess < eachSite.lastAccess) {
                console.log('Modifying site found', eachSite, foundSite);

                const siteData = {
                  name: eachSite.name,
                  type: eachSite.type,
                  url: eachSite.url,
                  lastAccess: eachSite.lastAccess,
                };
  
                fetch(SERVER_API+'/api/site/'+eachSite.id, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(siteData),
                })
                  .then((response) => response.json())
                  .then((data) => {
                    //console.log(data);
                    siteId = data.result.id;
                  });

              }
            }
            else {
              console.log('Creating site', eachSite);

              const siteData = {
                name: eachSite.name,
                type: eachSite.type,
                url: eachSite.url,
                lastAccess: eachSite.lastAccess,
              };

              fetch(SERVER_API+'/api/site/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(siteData),
              })
                .then((response) => response.json())
                .then((data) => console.log(data));
            }


            if( Array.isArray(eachSite.plugins) ) {
            for( const eachPlugin of eachSite.plugins ) {
              console.log(`Plugin ${eachPlugin.name} for ${eachSite.name} (id:${siteId})`, eachPlugin);

              eachPlugin.slug = eachPlugin.slug.substring(0, 63);
              eachPlugin.active = true;
              eachPlugin.sitewp_id = siteId;

              const foundPlugin = savedPlugins.find(
                (p) => p.slug === eachPlugin.slug && p.site_url === eachSite.url
              );

              if (foundPlugin) {
                // Upsert plugin
                if( foundPlugin.name != eachPlugin.name ||
                    foundPlugin.active != eachPlugin.active ||
                    foundPlugin.version != eachPlugin.version ||
                    foundPlugin.author != eachPlugin.author ||
                    foundPlugin.author_uri != eachPlugin.author_uri ||
                    foundPlugin.plugin_uri != eachPlugin.plugin_uri ||
                    foundPlugin.wp_req_version != eachPlugin.wp_req_version ||
                    foundPlugin.wp_min_version != eachPlugin.wp_min_version ||
                    foundPlugin.wp_tested_version != eachPlugin.wp_tested_version ||
                    foundPlugin.php_req_version != eachPlugin.php_req_version ||
                    foundPlugin.data != eachPlugin.data ||
                    foundPlugin.lastAccess < eachPlugin.lastAccess) {
                  console.log('Modifying plugin found', eachPlugin);

                  fetch(SERVER_API+'/api/plugin/'+foundPlugin.id, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(eachPlugin),
                  })
                    .then((response) => response.json())
                    .then((data) => console.log(data));
                }
              } else {
                // Insert plugin
                console.log('Creating plugin', eachPlugin);

                fetch(SERVER_API+'/api/plugin/', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(eachPlugin),
                })
                  .then((response) => response.json())
                  .then((data) => console.log(data));
              }
            }  // FOR eachPlugin
            }

          }  // FOR eachSite
        })});
      
    },
  };
  const handleImport = (data) => {
    const version = data.version;

    if (!version) {
      console.error("Imported file has not version.");
    } if (!IMPORT_FUNCTIONS[version]) {
      // Version error.
      console.error(`Unsupported version (v=${version}) of imported file.`);
    } else {
      IMPORT_FUNCTIONS[version](data);
    }
  };

  const getSites = () => {
    console.log('Lanzado sites');
    return fetch(SERVER_API+'/api/sites/', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        console.log('Recibido sites');
        return data.results;
      });
  };

  const getPlugins = () => {
    console.log('Lanzado plugins');
    return fetch(SERVER_API+'/api/plugins/', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        console.log('Recibido plugins');
        return data.results;
      });
  };

  const handleClickExport = async () => {
    try {
      const [sites, plugins] = await Promise.all([getSites(), getPlugins()]);

      plugins.forEach(p => {
        const siteOfPlugin = sites.find(s => s.url === p.site_url);
        if( siteOfPlugin ) {
          if( !siteOfPlugin.plugins ) {
            siteOfPlugin.plugins = [];
          }
          siteOfPlugin.plugins.push(p);
        }
      });

      const exportDataJson = {
        version: '0.1.2',
        sites: sites,
      };

      const exportDataString = JSON.stringify(exportDataJson);
      const filename =
        'wpcare-backup-' + format(new Date(), 'yyyy.MM.dd-HH.mm') + '.json';

      downloadContent(filename, exportDataString, MIME_TYPE);
    } catch (ex) {
      console.error('Error', data);
    }
/*
    fetch(SERVER_API+'/api/sites/', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        if (data.info.success) {
          const sites = data.results;

          const exportDataJson = {
            version: '0.1.2',
            sites: sites,
          };

          const exportDataString = JSON.stringify(exportDataJson);
          const filename = 'wpcare-backup-' + format(new Date(), 'yyyy.MM.dd-HH.mm') + '.json';

          downloadContent(filename, exportDataString, MIME_TYPE);
        } else {
          console.error('Error', data);
        }
      });
*/
  };

  const readFile = (fd) => {
    const fr = new FileReader();
    fr.onload = () => {
      const jsonData = JSON.parse(fr.result);
      handleImport(jsonData);
    };
    fr.readAsText(fd);
  };

  const handleChangeImport = (ev) => {
    console.dir(ev);
    readFile(ev.target.files[0]);
  };

  const handleDropFile = (ev) => {
    ev.preventDefault();
    // <https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop#process_the_drop>
    console.table(ev.dataTransfer.items);
    console.table(ev.dataTransfer.files);
    console.table(ev.dataTransfer.types);
    console.dir(ev.dataTransfer.items[0]);

    readFile(ev.dataTransfer.files[0]);
  };

  return (
    <Page name="Sites" title="Backup tools" description="Manage your data">
      <div className="row-1">
        <div className="box">
          <div className="box__title">
            <h3 className="box__title__text">Export</h3>
            <div className="box__title__toolbox"></div>
          </div>
          <div className="box__content">
            <button onClick={handleClickExport}>Export now</button>
          </div>
        </div>
        <div className="box">
          <div className="box__title">
            <h3 className="box__title__text">Import</h3>
            <div className="box__title__toolbox"></div>
          </div>
          <div className="box__content">
            <input id="importFile" type="file" onChange={handleChangeImport} style={{ display: 'none' }} />
            <label
              htmlFor="importFile"
              style={{ display: 'block', border: 'dotted 7px #888888', height: '4em' }}
              onDragOver={(ev) => ev.preventDefault()}
              onDrop={handleDropFile}
            >
              Load your file here
            </label>
          </div>
        </div>
      </div>
    </Page>
  );
}
