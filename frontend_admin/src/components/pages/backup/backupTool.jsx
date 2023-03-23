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

export default function backupTool() {
  const IMPORT_FUNCTIONS = {
    '0.1.1': (data) => {
      const { sites } = data;
      for (const eachSite of sites) {
        console.log('Creating', eachSite);
        fetch('/api/site/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eachSite),
        })
          .then((response) => response.json())
          .then((data) => console.log(data));
      }
    },
  };
  const handleImport = (data) => {
    const version = data.version;

    if (!version || !IMPORT_FUNCTIONS[version]) {
      // Version error.
    } else {
      IMPORT_FUNCTIONS[version](data);
    }
  };

  const handleClickExport = () => {
    fetch('/api/sites/', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        if (data.info.success) {
          const sites = data.results;

          const exportDataJson = {
            version: '0.1.1',
            sites: sites,
          };

          const exportDataString = JSON.stringify(exportDataJson);
          const filename = 'wpcare-backup-' + format(new Date(), 'yyyy.MM.dd-HH.mm') + '.json';

          downloadContent(filename, exportDataString, MIME_TYPE);
        } else {
          console.error('Error', data);
        }
      });
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
