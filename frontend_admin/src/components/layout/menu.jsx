export default function Menu() {
  return (
    <section className="sidenav shadow-right hidden">
      <nav className="sidenav_menu">
        <div className="sidenav__menuheading">Overview</div>
        <a className="sidenav__menulink active" href="#" aria-current="page">
          <span className="sidenav__menulink--icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="feather feather-activity undefined"
            >
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
            </svg>
          </span>
          Dashboard
        </a>
        <a className="sidenav__menulink">
          <span className="sidenav__menulink--icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="feather feather-clock undefined"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </span>
          Load times
        </a>
        <div className="sidenav__menuheading">Webs</div>
        <a className="sidenav__menulink" href="/sites">
          <span className="sidenav__menulink--icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="feather feather-folder undefined"
            >
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </span>
          Sites
          <span className="sidenav__menulink--arrow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="feather feather-chevron-right undefined"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </span>
        </a>
        <a className="sidenav__menulink">
          <span className="sidenav__menulink--icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="feather feather-layout undefined"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="3" y1="9" x2="21" y2="9"></line>
              <line x1="9" y1="21" x2="9" y2="9"></line>
            </svg>
          </span>
          Pages
          <span className="sidenav__menulink--arrow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="feather feather-chevron-right undefined"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </span>
        </a>
        <a className="sidenav__menulink" href="/clients/">
          <span className="sidenav__menulink--icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="feather feather-briefcase undefined"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
          </span>
          Clients
          <span className="sidenav__menulink--arrow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="feather feather-chevron-right undefined"
            >
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
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
