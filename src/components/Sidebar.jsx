import styles from './Sidebar.module.css';
import Logo from './Logo';
import AppNav from './AppNav';
import { Outlet } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />

      {/* An <Outlet> should be used in parent route elements to render their child route elements. This allows nested UI to show up when child routes are rendered. */}
      <Outlet />

      <footer className={styles.footer}>
        <p className={styles.copyright}>
          Copyright {new Date().getFullYear()} by Arkides Holdings
        </p>
      </footer>
    </div>
  );
};

export default Sidebar;
