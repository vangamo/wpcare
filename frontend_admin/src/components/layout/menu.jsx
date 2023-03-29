import { NavLink } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react/build/FeatherIcon';
import PropTypes from 'prop-types';

export default function Menu({ showMenu, onClickOption }) {
  return (
    <section className={'sidenav shadow-right ' + (!showMenu && 'hidden')}>
      <nav className="sidenav_menu">
        <div className="sidenav__menuheading">Overview</div>
        <NavLink className="sidenav__menulink" to="/" onClick={onClickOption} aria-current="page">
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="activity" size="24" />
          </span>
          Dashboard
        </NavLink>
        {/*
        <NavLink className="sidenav__menulink">
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="clock" size="24" />
          </span>
          Load times
        </NavLink>
        */}
        <div className="sidenav__menuheading">Webs</div>
        <NavLink className="sidenav__menulink" to="/sites" onClick={onClickOption}>
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="folder" size="24" />
          </span>
          Sites
          <span className="sidenav__menulink--arrow">
            <FeatherIcon icon="chevron-right" size="24" />
          </span>
        </NavLink>
        {/*
        <NavLink className="sidenav__menulink">
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="layout" size="24" />
          </span>
          Pages
          <span className="sidenav__menulink--arrow">
            <FeatherIcon icon="chevron-right" size="24" />
          </span>
        </NavLink>
        <NavLink className="sidenav__menulink" to="/clients/">
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="briefcase" size="24" />
          </span>
          Clients
          <span className="sidenav__menulink--arrow">
            <FeatherIcon icon="chevron-right" size="24" />
          </span>
        </NavLink>
        */}
        <div className="sidenav__menuheading">WP</div>
        <NavLink className="sidenav__menulink" to="/plugins/" onClick={onClickOption}>
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="slider" size="24" />
          </span>
          Plugins
          <span className="sidenav__menulink--arrow">
            <FeatherIcon icon="chevron-right" size="24" />
          </span>
        </NavLink>
        <div className="sidenav__menuheading">Tests</div>
        <div className="sidenav__menuheading">Tools</div>
        <NavLink className="sidenav__menulink" to="/backup" onClick={onClickOption}>
          <span className="sidenav__menulink--icon">
            <FeatherIcon icon="package" size="24" />
          </span>
          Import/Export
        </NavLink>
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
