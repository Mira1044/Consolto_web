import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="pt-16 md:pt-20">{children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export const MainLayoutNoFooter = ({ children }) => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      <Navbar />
      <main className="pt-16 md:pt-20">{children}</main>
    </div>
  );
};
