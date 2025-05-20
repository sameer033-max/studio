
"use client";

import React, { useEffect, useRef, useCallback } from 'react';

interface AdMobBannerProps {
  adUnitId: string;
  publisherId: string;
}

const AdMobBanner: React.FC<AdMobBannerProps> = ({ adUnitId, publisherId }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adLoadedRef = useRef(false);

  const loadAd = useCallback(() => {
    if (!adContainerRef.current || adLoadedRef.current) {
      return;
    }
    try {
      // Check if an ad is already there (e.g. iframe or filled ins) to prevent multiple pushes
      if (adContainerRef.current.querySelector('iframe, ins.adsbygoogle[data-ad-status="filled"]')) {
        adLoadedRef.current = true;
        console.log('AdMobBanner: Ad already detected in container.');
        return;
      }
      
      adContainerRef.current.innerHTML = ''; // Clear previous ad if any

      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.style.width = '100%'; // Explicitly set width for the ad slot
      // ins.style.height = 'auto'; // AdSense will determine height for format=auto
      ins.setAttribute('data-ad-client', publisherId);
      ins.setAttribute('data-ad-slot', adUnitId.split('/')[1]); // Extract slot ID
      ins.setAttribute('data-ad-format', 'auto'); // For responsive ads

      adContainerRef.current.appendChild(ins);

      // Push the ad request
      // This runs after the component is mounted and the script is loaded.
      if (document.body.contains(ins) && adContainerRef.current) {
        console.log('AdMobBanner: Container offsetWidth before push:', adContainerRef.current.offsetWidth);
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        adLoadedRef.current = true; 
      } else {
        console.warn("AdMobBanner: AdSense <ins> element was detached or container ref missing before ad push call.");
      }
    } catch (e) {
      console.error('AdMobBanner: Error preparing/pushing AdMob ad:', e);
    }
  }, [adUnitId, publisherId]);

  useEffect(() => {
    if (adLoadedRef.current || !adContainerRef.current) {
      return;
    }

    const SCRIPT_ID = 'adsbygoogle-script';
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement;

    const scriptLoadHandler = () => {
        if ((window as any).adsbygoogle) {
          loadAd();
        } else {
          console.warn("AdMobBanner: adsbygoogle.js not ready after script load.");
        }
    };

    if (script) { 
      if ((window as any).adsbygoogle) { 
        loadAd();
      } else if (!script.onload) { 
        script.onload = scriptLoadHandler;
        script.onerror = () => {
          console.error("AdMobBanner: Adsense script (already in DOM) failed to load.");
        };
      }
    } else { 
      script = document.createElement('script');
      script.id = SCRIPT_ID;
      script.async = true;
      script.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js";
      script.crossOrigin = "anonymous";
      script.onload = scriptLoadHandler;
      script.onerror = () => {
        console.error("AdMobBanner: Adsense script (newly created) failed to load.");
      };
      document.head.appendChild(script);
    }
  }, [adUnitId, publisherId, loadAd]); // loadAd is now a dependency

  return (
    <div 
      ref={adContainerRef} 
      className="admob-banner-container w-full my-4 min-h-[50px]" // Simplified styling
      aria-label="Advertisement"
    >
      {/* Ad content will be injected here by Google's script */}
      {/* Optional: Add a visible placeholder style if ads don't load */}
      {/* <div className="w-full h-[50px] bg-muted/10 flex items-center justify-center text-muted-foreground text-xs">Ad placeholder</div> */}
    </div>
  );
};

export default AdMobBanner;
