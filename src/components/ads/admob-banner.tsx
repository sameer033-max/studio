
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
        return;
      }
      
      adContainerRef.current.innerHTML = ''; // Clear previous ad if any

      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block';
      ins.setAttribute('data-ad-client', publisherId);
      ins.setAttribute('data-ad-slot', adUnitId.split('/')[1]); // Extract slot ID
      ins.setAttribute('data-ad-format', 'auto');
      ins.setAttribute('data-full-width-responsive', 'true');
      
      adContainerRef.current.appendChild(ins);

      // Defer the push call to ensure the container has dimensions
      setTimeout(() => {
        requestAnimationFrame(() => {
          try {
            if (document.body.contains(ins) && adContainerRef.current) {
              console.log('AdMobBanner: Container offsetWidth before push:', adContainerRef.current.offsetWidth);
              ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
              adLoadedRef.current = true; 
            } else {
              console.warn("AdMobBanner: AdSense <ins> element was detached or container ref missing before ad push call.");
            }
          } catch (e) {
            console.error('AdMobBanner: adsbygoogle.push() error (rAF deferred):', e);
          }
        });
      }, 50); // Slightly increased delay 
    } catch (e) {
      console.error('AdMobBanner: Error preparing AdMob ad:', e);
    }
  }, [adUnitId, publisherId]);

  useEffect(() => {
    if (adLoadedRef.current || !adContainerRef.current) {
      return;
    }

    const SCRIPT_ID = 'adsbygoogle-script';
    let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement;

    const scriptLoadHandler = () => {
        // Ensure adsbygoogle is available before calling loadAd
        if ((window as any).adsbygoogle) {
          loadAd();
        } else {
          console.warn("AdMobBanner: adsbygoogle.js not ready after script load.");
        }
    };

    if (script) { // Script tag exists
      if ((window as any).adsbygoogle) { // And library is loaded
        loadAd();
      } else if (!script.onload) { // Script tag exists, but library not loaded, and no onload attached yet
        //This case means the script is in the DOM but hasn't finished loading.
        //We attach our handler. If it loads, our handler runs.
        script.onload = scriptLoadHandler;
        script.onerror = () => {
          console.error("AdMobBanner: Adsense script (already in DOM) failed to load.");
        };
      }
      // If script.onload is already set, we assume it will eventually call loadAd or similar
      // or it has already loaded and window.adsbygoogle would be set.
    } else { // Script tag does not exist
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
  }, [adUnitId, publisherId, loadAd]);

  return (
    <div 
      ref={adContainerRef} 
      className="admob-banner-container w-full my-4 flex justify-center items-center min-h-[50px] bg-muted/20 border border-dashed rounded-md"
      aria-label="Advertisement"
    >
      {/* Ad content will be injected here by Google's script */}
    </div>
  );
};

export default AdMobBanner;
