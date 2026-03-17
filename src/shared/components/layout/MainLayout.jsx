import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};
