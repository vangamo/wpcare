import { Link } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import PropTypes from 'prop-types';

export default function Menu({ showMenu }) {
  return (
    <section className={'sidenav shadow-right ' + (!showMenu && 'hidden')}>
      <nav className="sidenav_menu">
        <div className="sidenav__menuheading">Overview</div>
        <Link className="sidenav__menulink active" to="/" aria-current="page">
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="activity" size="24" />
          </span>
          Dashboard
        </Link>
        {/*
        <Link className="sidenav__menulink">
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="clock" size="24" />
          </span>
          Load times
        </Link>
        */}
        <div className="sidenav__menuheading">Webs</div>
        <Link className="sidenav__menulink" to="/sites">
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="folder" size="24" />
          </span>
          Sites
          <span className="sidenav__menulink--arrow">
            <FeatherIcon icon="chevron-right" size="24" />
          </span>
        </Link>
        {/*
        <Link className="sidenav__menulink">
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="layout" size="24" />
          </span>
          Pages
          <span className="sidenav__menulink--arrow">
            <FeatherIcon icon="chevron-right" size="24" />
          </span>
        </Link>
        <Link className="sidenav__menulink" to="/clients/">
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="briefcase" size="24" />
          </span>
          Clients
          <span className="sidenav__menulink--arrow">
            <FeatherIcon icon="chevron-right" size="24" />
          </span>
        </Link>
        */}
        <div className="sidenav__menuheading">WP</div>
        <Link className="sidenav__menulink" to="/plugins/">
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="slider" size="24" />
          </span>
          Plugins
          <span className="sidenav__menulink--arrow">
            <FeatherIcon icon="chevron-right" size="24" />
          </span>
        </Link>
        <div className="sidenav__menuheading">Tests</div>
        <div className="sidenav__menuheading">Tools</div>
        <Link className="sidenav__menulink" to="/backup">
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="package" size="24" />
          </span>
          Import/Export
        </Link>
      </nav>
      <dl className="sidenav_footer">
        <dt className="sidenav_footer--subtitle">Logged in as:</dt>
        <dd className="sidenav_footer--title">Christine de Pizan</dd>
      </dl>
    </section>
  );
}

Menu.propTypes = {
  showMenu: PropTypes.bool,
};
