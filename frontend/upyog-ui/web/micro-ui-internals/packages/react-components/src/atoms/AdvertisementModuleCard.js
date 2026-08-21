import React, { useEffect } from 'react';
// this code shows the image and the detail of the advertisement

const AdvertisementModuleCard = ({ imageSrc, title, location, poleNo, price, path, light,adType,faceArea }) => {
  const [params, setParams,clearParams] = Digit.Hooks.useSessionStorage("ADS_CREATE", {});
  const handleViewAvailability = () => {
    setParams({
      faceArea:{code:faceArea,value:faceArea,i18nKey:faceArea},
      adType:{code:adType,value:adType,i18nKey:adType},
      location:{code:location,value:location,i18nKey:location},
      fromDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
      toDate: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split("T")[0], // 3 months later
      nightLight:{
        i18nKey: "Yes",
        code: "Yes",
        value: "true",
      }
    });
    window.location.href = `${path}bookad/searchads`;
  };
  useEffect(() => {
    clearParams();
  }, []); 
  const handleBookNow = () => {
    setParams({
      faceArea:{code:faceArea,value:faceArea,i18nKey:faceArea},
      adType:{code:adType,value:adType,i18nKey:adType},
      location:{code:location,value:location,i18nKey:location},
      nightLight:{
        i18nKey: "Yes",
        code: "Yes",
        value: "true",
      }
    });
    window.location.href = `${path}bookad/searchads`;
  };
  return (
    <div
      style={{
        border: "1px solid #ccc",
        backgroundColor: "white",
        borderRadius: "8px",
        overflow: "hidden",
        maxWidth: "30%",
        margin: "10px auto",
        minWidth: "24%",
      }}
    >
      <div style={{ width: "100%", height: "200px", position: "relative",padding: "10px"}}>
        <img
          src={imageSrc}
          alt="Advertisement"
          style={{
            width: "100%",
            height: "100%",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            minWidth: "0",
          }}
        />
      </div>
      <div style={{ padding: "var(--spacing-10px)" }}>
        <p style={{ margin: "0", color: "var(--primary-main)" }}>{light}</p>
        <h3 style={{ margin: "var(--spacing-5px) 0", fontWeight: "var(--weight-bold)" }}>{title}</h3>
        <p>
          {location} (
          <button type="button" style={{ marginLeft: "var(--spacing-5px)", color: "var(--primary-main)" }}>
            View Map
          </button>
          )
        </p>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>Pole No: {poleNo}</p>
          <p>₹ {price}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <button
            type="button"
            onClick={handleViewAvailability}
            style={{ backgroundColor: "var(--success)", color: "var(--white)", border: "var(--border-width-sm) solid var(--border)", padding: "var(--spacing-5px) var(--spacing-10px)", borderRadius: "var(--border-radius-sm)" }}
          >
            View Availability
          </button>
          <button
            type="button"
            onClick={handleBookNow}
            style={{ backgroundColor: "var(--primary-main)", color: "var(--white)", border: "var(--border-width-sm) solid var(--border)", padding: "var(--spacing-5px) var(--spacing-10px)", borderRadius: "var(--border-radius-sm)" }}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};
export { AdvertisementModuleCard };