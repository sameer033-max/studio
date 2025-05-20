
"use client";

import React, { useEffect, useRef, useCallback } from 'react';

interface AdMobNativeAdvancedProps {
  adUnitId: string;
  publisherId: string;
}

const AdMobNativeAdvanced: React.FC<AdMobNativeAdvancedProps> = ({ adUnitId, publisherId }) => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adLoadedRef = useRef(false);

  const loadAd = useCallback(() => {
    if (!adContainerRef.current || adLoadedRef.current) {
      return;
    }
    try {
      if (adContainerRef.current.querySelector('iframe, ins.adsbygoogle[data-ad-status="filled"]')) {
        adLoadedRef.current = true;
        console.log('AdMobNativeAdvanced: Ad already detected in container.');
        return;
      }
      
      adContainerRef.current.innerHTML = ''; 

      const ins = document.createElement('ins');
      ins.className = 'adsbygoogle';
      ins.style.display = 'block'; // Native ads often need specific sizing based on your custom layout
      ins.style.width = '100%'; 
      ins.style.minHeight = '100px'; // Example min-height, adjust based on your native ad design
      ins.setAttribute('data-ad-client', publisherId);
      ins.setAttribute('data-ad-slot', adUnitId.split('/')[1]); // Extract slot ID
      ins.setAttribute('data-ad-format', 'auto'); // For responsive ads, 'native' might also be applicable but 'auto' is safer for web.
      // For native ads, you'd typically define custom styles or use a template.
      // This basic setup will request the ad; rendering its assets is a custom UI task.
      // ins.setAttribute('data-native-ad-template-id', 'YOUR_TEMPLATE_ID'); // If using a predefined template

      adContainerRef.current.appendChild(ins);

      if (document.body.contains(ins) && adContainerRef.current) {
        console.log('AdMobNativeAdvanced: Container offsetWidth before push:', adContainerRef.current.offsetWidth);
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
        adLoadedRef.current = true; 
      } else {
        console.warn("AdMobNativeAdvanced: AdSense <ins> element was detached or container ref missing before ad push call.");
      }
    } catch (e) {
      console.error('AdMobNativeAdvanced: Error preparing/pushing AdMob native ad:', e);
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
          console.warn("AdMobNativeAdvanced: adsbygoogle.js not ready after script load.");
        }
    };

    if (script) { 
      if ((window as any).adsbygoogle) { 
        loadAd();
      } else if (!script.onload) { 
        script.onload = scriptLoadHandler;
        script.onerror = () => {
          console.error("AdMobNativeAdvanced: Adsense script (already in DOM) failed to load.");
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
        console.error("AdMobNativeAdvanced: Adsense script (newly created) failed to load.");
      };
      document.head.appendChild(script);
    }
  }, [adUnitId, publisherId, loadAd]);

  return (
    <div 
      ref={adContainerRef} 
      className="admob-native-advanced-container w-full my-4 p-4 border border-dashed border-muted-foreground rounded-lg bg-muted/20"
      aria-label="Advertisement Area for Native Ad"
    >
      <p className="text-center text-sm text-muted-foreground">
        Native Ad Placeholder. Custom rendering of ad assets (image, headline, CTA, etc.) is required here to match your app's UI.
      </p>
    </div>
  );
};

export default AdMobNativeAdvanced;
