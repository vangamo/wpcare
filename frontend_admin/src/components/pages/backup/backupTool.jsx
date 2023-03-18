import Page from '../../layout/page';

const MIME_TYPE = 'application/json';

// <https://stackoverflow.com/questions/45831191/generate-and-download-file-from-js>
const downloadContent = (filename, content, mime = MIME_TYPE) => {
  const downloadElement = document.createElement('a');
  downloadElement.setAttribute('download', filename);
  downloadElement.setAttribute('type', mime);
  downloadElement.setAttribute('href', 'data:' + mime + ',' + content);
  downloadElement.click();
};

export default function backupTool() {
  const handleImport = (data) => {
    for (const eachSite of data) {
      console.log('Creating', eachSite);
      fetch('http://localhost:5000/api/site/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eachSite),
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => console.log(data));
    }
  };

  const handleClickExport = () => {
    fetch('http://localhost:5000/api/sites/', { method: 'GET' })
      .then((response) => response.json())
      .then((data) => {
        if (data.info.success) {
          const textData = JSON.stringify(data.results);

          downloadContent('wpcare-backup.json', textData, MIME_TYPE);
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
