import type { Metadata } from 'next';
import './globals.css';
import LiquidEther from '@/components/LiquidEther';
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'CMT — Conference Management Tool | IEEE LJ University',
  description: 'Centralized conference management for LJ University'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ position: 'fixed', inset: 0, zIndex: -1 }}>
          <LiquidEther
            colors={['#D4AF37', '#FFFFFF', '#1a1a1a']}
            resolution={0.3}
            iterationsPoisson={16}
            iterationsViscous={16}
            mouseForce={20}
            cursorSize={100}
            autoDemo={true}
            autoSpeed={0.4}
            autoIntensity={2}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>
        <Navbar />
        <main className="relative z-10 max-w-7xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
