
"use client";

import React, { useEffect, useRef } from 'react';

interface AdMobBannerProps {
  adUnitId: string;
  publisherId: string;
}

const AdMobBanner: React.FC<AdMobBannerProps> = ({ adUnitId, publisherId }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adLoadedRef = useRef(false);

  useEffect(() => {
    if (adLoadedRef.current || !adContainerRef.current) {
      return;
    }

    // Ensure the adsbygoogle.js script is loaded only once
    let script = document.getElementById('adsbygoogle-script') as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = 'adsbygoogle-script';
      script.async = true;
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    }

    const loadAd = () => {
      try {
        if (adContainerRef.current) {
          adContainerRef.current.innerHTML = ''; // Clear previous ad if any

          const ins = document.createElement('ins');
          ins.className = 'adsbygoogle';
          ins.style.display = 'block';
          ins.setAttribute('data-ad-client', publisherId);
          ins.setAttribute('data-ad-slot', adUnitId.split('/')[1]); // Extract slot ID
          ins.setAttribute('data-ad-format', 'auto');
          ins.setAttribute('data-full-width-responsive', 'true');
          
          adContainerRef.current.appendChild(ins);

          // Initialize the ad slot
          ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
          adLoadedRef.current = true;
        }
      } catch (e) {
        console.error('Error loading AdMob ad:', e);
      }
    };

    // If script is already loaded, load ad. Otherwise, wait for script to load.
    if (script.onload === null) { // Check if onload has been set
      script.onload = loadAd;
    } else if (document.readyState === 'complete' || (window as any).adsbygoogle) {
      // If script was loaded by another instance or page is already complete
      loadAd();
    }


    // Cleanup function to remove the ad element if component unmounts,
    // though ads might persist if not handled carefully by adsbygoogle script.
    return () => {
      // Basic cleanup, actual ad removal might be more complex depending on Google's script
      if (adContainerRef.current) {
        // adContainerRef.current.innerHTML = '';
      }
    };
  }, [adUnitId, publisherId]);

  return (
    <div 
      ref={adContainerRef} 
      className="admob-banner-container w-full my-4 flex justify-center items-center min-h-[50px] bg-muted/20 border border-dashed rounded-md"
      aria-label="Advertisement"
    >
      {/* Ad content will be injected here by Google's script */}
      {/* Fallback content if ad doesn't load, though Google often handles this */}
       {/* <p className="text-xs text-muted-foreground">Advertisement</p> */}
    </div>
  );
};

export default AdMobBanner;
