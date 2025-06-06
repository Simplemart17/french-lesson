import { ReactNode } from 'react';
import Link from 'next/link';
import Header from './Header';

type LayoutProps = {
  children: ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="container flex-grow px-4 py-8 mx-auto md:px-6 md:py-12">
        {children}
      </main>
      <footer className="py-8 mt-12 bg-white border-t border-gray-100 shadow-sm">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <h3 className="mb-4 text-xl font-bold text-gray-800">French Tutor AI</h3>
              <p className="mb-4 text-gray-600">Your personal assistant for learning French from beginner to advanced levels.</p>
              <p className="text-sm text-gray-500">© {new Date().getFullYear()} French Tutor AI. All rights reserved.</p>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-gray-800">Learn</h4>
              <ul className="space-y-2">
                <li><Link href="/lessons" className="text-gray-600 transition-colors hover:text-primary-600">Lessons</Link></li>
                <li><Link href="/vocabulary" className="text-gray-600 transition-colors hover:text-primary-600">Vocabulary</Link></li>
                <li><Link href="/practice" className="text-gray-600 transition-colors hover:text-primary-600">Practice</Link></li>
                <li><Link href="/exam-practice" className="text-gray-600 transition-colors hover:text-primary-600">Exam Prep</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold text-gray-800">Company</h4>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-600 transition-colors hover:text-primary-600">About Us</Link></li>
                <li><Link href="/privacy" className="text-gray-600 transition-colors hover:text-primary-600">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-600 transition-colors hover:text-primary-600">Terms of Service</Link></li>
                <li><Link href="/contact" className="text-gray-600 transition-colors hover:text-primary-600">Contact</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;