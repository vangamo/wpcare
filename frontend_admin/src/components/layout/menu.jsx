import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import PropTypes from 'prop-types';

export default function Menu({showMenu}) {
  return (
    <section className={"sidenav shadow-right " + (!showMenu && "hidden")}>
      <nav className="sidenav_menu">
        <div className="sidenav__menuheading">Overview</div>
        <a className="sidenav__menulink active" href="#" aria-current="page">
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="activity" size="24" />
          </span>
          Dashboard
        </a>
        <a className="sidenav__menulink">
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="clock" size="24" />
          </span>
          Load times
        </a>
        <div className="sidenav__menuheading">Webs</div>
        <a className="sidenav__menulink" href="/sites">
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="folder" size="24" />
          </span>
          Sites
          <span className="sidenav__menulink--arrow">
            <FeatherIcon icon="chevron-right" size="24" />
          </span>
        </a>
        <a className="sidenav__menulink">
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="layout" size="24" />
          </span>
          Pages
          <span className="sidenav__menulink--arrow">
            <FeatherIcon icon="chevron-right" size="24" />
          </span>
        </a>
        <a className="sidenav__menulink" href="/clients/">
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="briefcase" size="24" />
          </span>
          Clients
          <span className="sidenav__menulink--arrow">
            <FeatherIcon icon="chevron-right" size="24" />
          </span>
        </a>
        <div className="sidenav__menuheading">Tests</div>
      </nav>
      <dl className="sidenav_footer">
        <dt className="sidenav_footer--subtitle">Logged in as:</dt>
        <dd className="sidenav_footer--title">Christine de Pizan</dd>
      </dl>
    </section>
  );
}

Menu.propTypes = {
  showMenu: PropTypes.bool
}