import './sites.scss';

export default function () {
  return (
    <section className="Sites">
      <div className="main__background"></div>
      <div className="main__wrapper">
        <div className="main__header">
          <h2 className="main__title">Sites</h2>
          <p className="main__description">Listing all sites</p>
        </div>
        <div className="content">
          <div className="row-1">
            <div className="box">
              <h3 className="box__title">Sites</h3>
              <div className="box__content">
                <table className="table" cellspacing="0" cellpadding="0">
                  <thead>
                    <tr>
                      <th></th>
                      <th>Name</th>
                      <th>Client</th>
                      <th>WP version</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>
                        <a href="/site/1">Python</a>
                      </td>
                      <td>Pythonics</td>
                      <td>5.8.3</td>
                    </tr>
                    <tr>
                      <td>
                        <input type="checkbox" />
                      </td>
                      <td>
                        <a href="/site/2">ReactJS</a>
                      </td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>{" "}
        {"<!-- .content -->"}
      </div>
    </section>
  );
}
