import Page from '../../layout/page';

const MIME_TYPE = 'application/json';

const downloadContent = (filename, content, mime = MIME_TYPE) => {
  const downloadElement = document.createElement('a');
  downloadElement.setAttribute('download', filename);
  downloadElement.setAttribute('type', mime);
  downloadElement.setAttribute('href', 'data:' + mime + ',' + content);
  downloadElement.click();
};

export default function backupTool() {
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
      </div>
    </Page>
  );
}
