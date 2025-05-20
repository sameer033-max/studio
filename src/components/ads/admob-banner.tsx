
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
            requestAnimationFrame(() => { // Wrap in requestAnimationFrame
              try {
                // Ensure ins element is still part of the DOM
                if (document.body.contains(ins) && adContainerRef.current) {
                  ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
                  adLoadedRef.current = true; 
                } else {
                  console.warn("AdSense <ins> element was detached or container ref missing before ad push call.");
                }
              } catch (e) {
                console.error('adsbygoogle.push() error (rAF deferred):', e);
              }
            });
          }, 0); 
        }
      } catch (e) {
        console.error('Error preparing AdMob ad:', e);
      }
    };

    if ((window as any).adsbygoogle) { 
        loadAd();
    } else if (script.onload === null) { 
      script.onload = loadAd;
      script.onerror = () => {
        console.error("Adsense script failed to load.");
      };
    } else if (script.readyState === 'loaded' || script.readyState === 'complete') { // For IE, or if script was loaded by other means
      loadAd();
    }


    return () => {
      // Basic cleanup, actual ad removal might be more complex depending on Google's script
      // if (adContainerRef.current) {
      // adContainerRef.current.innerHTML = ''; 
      // }
    };
  }, [adUnitId, publisherId]);

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
