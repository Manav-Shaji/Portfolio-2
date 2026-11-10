import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

export default function PortfolioPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-4">Portfolio</h1>
        <p className="text-muted-foreground mb-8">
          Premium developer portfolio project
        </p>
        <div className="space-y-4">
          <Link href="/about" className="block py-2 hover:underline">
            About
          </Link>
          <Link href="/projects" className="block py-2 hover:underline">
            Projects
          </Link>
          <Link href="/contact" className="block py-2 hover:underline">
            Contact
          </Link>
        </div>
      </div>
    </main>
  );
}