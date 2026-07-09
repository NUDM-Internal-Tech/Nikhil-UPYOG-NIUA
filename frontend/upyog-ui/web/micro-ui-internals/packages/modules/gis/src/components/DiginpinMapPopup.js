import React, { useEffect, useRef } from "react";

/**
 * DiginpinMapPopup
 * A small, self-contained Leaflet map popup centered on the screen.
 * Accepts lat/lng directly (no coordinate conversion needed) and displays
 * the DIGIPIN code in a marker popup.
 *
 * Props:
 *  - lat: number
 *  - lng: number
 *  - digipin: string
 *  - onClose: function
 */
const DiginpinMapPopup = ({ lat, lng, digipin, onClose }) => {
  // Ref to the DOM element Leaflet will mount into
  const mapRef = useRef(null);
  // Keeps the Leaflet map instance so it can be destroyed on re-render or unmount
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    const init = () => {
      // Delay ensures the DOM element is fully painted before Leaflet tries to measure it
      setTimeout(() => {
        const el = mapRef.current;
        if (!el) return;

        // Destroy any existing map instance to avoid "map already initialised" errors on re-render
        if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
        // Clear leftover Leaflet internal state on the DOM node
        if (el._leaflet_id) { el._leaflet_id = null; el.innerHTML = ""; }

        // Initialise Leaflet map centred on the provided coordinates at zoom 16
        const map = window.L.map(el).setView([lat, lng], 16);
        mapInstanceRef.current = map;

        // Use OpenStreetMap tiles as the base layer
        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
        }).addTo(map);

        // Drop a marker at the location and open a popup showing the DIGIPIN code
        window.L.marker([lat, lng]).addTo(map)
          .bindPopup(`<b>DIGIPIN:</b> ${digipin}`)
          .openPopup();

        // Force Leaflet to recalculate container size (needed inside flex/modal layouts)
        map.invalidateSize();
      }, 100);
    };

    if (!window.L) {
      // Leaflet not yet loaded — inject CSS and JS from CDN, then initialise once the script loads
      const link = document.createElement("link");
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.rel = "stylesheet";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = init;
      document.head.appendChild(script);
    } else {
      // Leaflet already available — initialise immediately
      init();
    }

    // Cleanup: destroy the map instance when the component unmounts or deps change
    return () => {
      if (mapInstanceRef.current) { mapInstanceRef.current.remove(); mapInstanceRef.current = null; }
    };
  }, [lat, lng, digipin]); // Re-run whenever coordinates or digipin value change

  return (
    // Full-screen semi-transparent overlay
    <div style={{
      position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {/* Modal card containing the header bar and the map */}
      <div style={{ width: "420px", borderRadius: "8px", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" }}>
        {/* Header bar: shows the DIGIPIN value and a close button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 16px", background: "#a82227" }}>
          <span style={{ color: "#fff", fontWeight: "bold", fontSize: "14px" }}>DIGIPIN: {digipin}</span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#fff", fontSize: "18px", cursor: "pointer", lineHeight: 1 }}>✕</button>
        </div>
        {/* Map container — Leaflet mounts into this div via mapRef */}
        <div ref={mapRef} style={{ height: "300px", width: "100%" }} />
      </div>
    </div>
  );
};

export default DiginpinMapPopup;
