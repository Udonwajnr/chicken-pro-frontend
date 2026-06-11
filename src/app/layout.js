import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title:       'ChickenPro — Farm Smarter',
  description: 'Poultry farm management and marketplace for Nigerian farmers',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#162B1C',
                color:      '#F0EBE0',
                border:     '1px solid #234D2E',
                fontFamily: 'Inter, sans-serif',
                fontSize:   '13px',
              },
              success: {
                iconTheme: { primary: '#6FCF7F', secondary: '#0F1F14' },
              },
              error: {
                iconTheme: { primary: '#E74C3C', secondary: '#0F1F14' },
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}