'use client';

import { ReactNode, useState } from 'react';
import DashboardSearch from './DashboardSearch';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar onOpenSearch={() => setIsSearchOpen(true)} />
      <main className="relative flex-1 overflow-auto bg-black">
        {children}
        {isSearchOpen && (
          <DashboardSearch onClose={() => setIsSearchOpen(false)} />
        )}
      </main>
    </div>
  );
}
