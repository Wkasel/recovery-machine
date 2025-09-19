'use client';

import { useEffect, useRef } from 'react';
import { Instagram } from 'lucide-react';

interface BeholdInstagramWidgetProps {
  widgetId?: string;
  className?: string;
  fallback?: boolean;
}

export function BeholdInstagramWidget({ 
  widgetId = 'your-widget-id', 
  className = '',
  fallback = true 
}: BeholdInstagramWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    // Only load script once
    if (scriptLoadedRef.current) return;

    const loadBeholdScript = () => {
      // Check if script already exists
      if (document.querySelector('script[src="https://w.behold.so/widget.js"]')) {
        initializeWidget();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://w.behold.so/widget.js';
      script.type = 'module';
      script.async = true;
      
      script.onload = () => {
        scriptLoadedRef.current = true;
        initializeWidget();
      };

      script.onerror = () => {
        console.warn('Failed to load Behold.so script, showing fallback');
        showFallback();
      };

      document.head.appendChild(script);
    };

    const initializeWidget = () => {
      if (containerRef.current && (window as any).BeholdWidget) {
        try {
          (window as any).BeholdWidget.render({
            widgetId: widgetId,
            container: containerRef.current
          });
        } catch (error) {
          console.warn('Failed to initialize Behold widget:', error);
          if (fallback) showFallback();
        }
      }
    };

    const showFallback = () => {
      if (containerRef.current && fallback) {
        containerRef.current.innerHTML = `
          <div style="
            min-height: 400px; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
            background: linear-gradient(45deg, #f3f4f6 0%, #e5e7eb 100%); 
            border-radius: 8px;
            text-align: center;
            color: #6b7280;
            padding: 2rem;
          ">
            <div>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" style="margin: 0 auto 16px;">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <p style="font-weight: 600; margin-bottom: 8px;">Instagram Feed Unavailable</p>
              <p style="font-size: 14px;">Visit our Instagram for the latest updates</p>
            </div>
          </div>
        `;
      }
    };

    // Add a small delay to ensure DOM is ready
    setTimeout(loadBeholdScript, 100);

    return () => {
      // Cleanup script on unmount
      scriptLoadedRef.current = false;
    };
  }, [widgetId, fallback]);

  return (
    <div className={className}>
      <div 
        ref={containerRef}
        id={`behold-container-${widgetId}`}
        className="min-h-[400px] rounded-lg overflow-hidden"
      >
        {/* Loading state */}
        <div className="min-h-[400px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg">
          <div className="text-center text-gray-500">
            <Instagram className="h-12 w-12 mx-auto mb-4 animate-pulse" />
            <p className="font-semibold mb-2">Loading Instagram Feed...</p>
            <p className="text-sm">Powered by Behold.so</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Fallback component for when Behold.so isn't available
export function InstagramFallback({ className = '' }: { className?: string }) {
  const mockPosts = [
    { id: 1, gradient: 'from-blue-400 to-purple-500', caption: 'Cold plunge recovery ❄️' },
    { id: 2, gradient: 'from-red-400 to-orange-500', caption: 'Infrared sauna session 🔥' },
    { id: 3, gradient: 'from-green-400 to-blue-500', caption: 'Mobile setup complete 🚐' },
    { id: 4, gradient: 'from-purple-400 to-pink-500', caption: 'Contrast therapy ⚡' },
    { id: 5, gradient: 'from-yellow-400 to-red-500', caption: 'Peak performance 💪' },
    { id: 6, gradient: 'from-indigo-400 to-purple-500', caption: 'Recovery revolution 🌟' }
  ];

  return (
    <div className={className}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {mockPosts.map((post) => (
          <div 
            key={post.id}
            className="aspect-square rounded-lg overflow-hidden group cursor-pointer relative"
          >
            <div className={`w-full h-full bg-gradient-to-br ${post.gradient}`} />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Instagram className="h-8 w-8 text-white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}