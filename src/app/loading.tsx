import React from 'react';
import { Aperture } from 'lucide-react';

export default function Loading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 space-y-4">
      <div className="relative w-12 h-12 flex items-center justify-center">
        <div className="absolute inset-0 rounded-2xl bg-primary/20 animate-ping" />
        <div className="relative w-12 h-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
          <Aperture className="w-6 h-6 animate-spin duration-3000" />
        </div>
      </div>
      <div className="text-center space-y-1">
        <p className="text-sm font-bold text-foreground tracking-wide">
          Studio<span className="text-muted-foreground">Space</span>
        </p>
        <p className="text-xs text-muted-foreground animate-pulse">
          Loading creative workspaces...
        </p>
      </div>
    </div>
  );
}

