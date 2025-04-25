import { ReactNode } from 'react';
import Header from './Header';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 md:py-12">
        {children}
      </main>
      <footer className="bg-white shadow-sm py-8 mt-12 border-t border-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-bold text-gray-800 mb-4">French Tutor AI</h3>
              <p className="text-gray-600 mb-4">Your personal assistant for learning French from beginner to advanced levels.</p>
              <p className="text-gray-500 text-sm">© {new Date().getFullYear()} French Tutor AI. All rights reserved.</p>
            </div>
            <div>
              <h4 className="text-gray-800 font-semibold mb-3">Learn</h4>
              <ul className="space-y-2">
                <li><a href="/lessons" className="text-gray-600 hover:text-primary-600 transition-colors">Lessons</a></li>
                <li><a href="/vocabulary" className="text-gray-600 hover:text-primary-600 transition-colors">Vocabulary</a></li>
                <li><a href="/practice" className="text-gray-600 hover:text-primary-600 transition-colors">Practice</a></li>
                <li><a href="/exam-practice" className="text-gray-600 hover:text-primary-600 transition-colors">Exam Prep</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-gray-800 font-semibold mb-3">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 hover:text-primary-600 transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;