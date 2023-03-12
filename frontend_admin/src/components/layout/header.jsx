import FeatherIcon from 'feather-icons-react';

export default function Header() {
  return (
    <header className="header shadow">
      <button className="btn btn-icon">
        <FeatherIcon icon="menu" size="24" />
      </button>
      <a href="./index.html">
        <h1 className="header__title">WPCare</h1>
      </a>
      <form action="#">
        <div className="inputgroup null">
          <input
            className="inputgroup--input"
            type="text"
            name=""
            id=""
            value=""
          />
          <FeatherIcon icon="search" size="16" />
        </div>
      </form>
    </header>
  );
}
