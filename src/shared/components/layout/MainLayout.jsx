import { Navbar } from './Navbar';

export const MainLayout = ({ children }) => (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="pt-4 md:pt-6">{children}</main>
    </div>
  );

export const MainLayoutNoFooter = ({ children }) => (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="pt-4 md:pt-6">{children}</main>
    </div>
  );
