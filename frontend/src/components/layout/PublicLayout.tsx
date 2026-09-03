import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

/** Chrome shared by every public page: navbar, page content, footer. */
export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-surface-950">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
