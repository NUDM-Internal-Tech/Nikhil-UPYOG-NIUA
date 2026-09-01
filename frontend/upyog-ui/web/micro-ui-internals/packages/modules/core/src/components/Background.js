import React from "react";
import { useTranslation } from "react-i18next";

const Background = ({ children }) => {
  const { t } = useTranslation();
  const baseUrl = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
  const bgUrl = `${baseUrl}/login-bg.png`;
  const { data: { languages, stateInfo } = {} } = Digit.Hooks.useStore.getInitData();
  const selectedLanguage = Digit.StoreData.getCurrentLanguage();
  const [showDropdown, setShowDropdown] = React.useState(false);

  return (
    <div className="login-page-wrapper">
      {/* Top Government Header Bar */}
      <header className="login-top-govt-header">
        <div className="top-govt-brand">
          <img 
            src={`${baseUrl}/upyog-logo.png`} 
            alt="UPYOG Logo" 
            className="top-govt-upyog-logo" 
          />
        </div>

        <div className="top-govt-center">
          <img 
            src={`${baseUrl}/up-seal.svg`} 
            alt="UP Seal" 
            className="top-govt-seal" 
            onError={(e) => { e.currentTarget.src = `${baseUrl}/up-seal.png`; }}
          />
          <div className="top-govt-state-name">
            <span className="top-govt-hindi">उत्तर प्रदेश सरकार</span>
            <span className="top-govt-english">Government of Uttar Pradesh</span>
          </div>
        </div>

        <div className="top-govt-leaders">
          <div className="top-govt-leader-item">
            <img 
              src={`${baseUrl}/yogi-header.png`} 
              alt="Yogi Adityanath" 
              className="top-govt-leader-photo" 
            />
            <div className="top-govt-leader-info">
              <span className="top-govt-leader-name">Yogi Adityanath</span>
              <span className="top-govt-leader-title">Hon'ble Chief Minister</span>
              <span className="top-govt-leader-subtitle">Uttar Pradesh</span>
            </div>
          </div>

          <div className="top-govt-leader-item">
            <img 
              src={`${baseUrl}/modi-header.png`} 
              alt="Narendra Modi" 
              className="top-govt-leader-photo" 
            />
            <div className="top-govt-leader-info">
              <span className="top-govt-leader-name">Narendra Modi</span>
              <span className="top-govt-leader-title">Hon'ble Prime Minister</span>
              <span className="top-govt-leader-subtitle">Government of India</span>
            </div>
          </div>
        </div>
      </header>

      <div className="login-split-container" style={{ zIndex: "2", position: "relative" }}>
        {/* Page background picture */}
        <picture className="login-bg-picture">
          <source media="(min-width: 950px)" srcSet={bgUrl} />
          <source media="(min-width: 250px)" srcSet={bgUrl} />
          <img src={bgUrl} alt="background" className="login-bg-img" />
        </picture>

        {/* Left Branding Column */}
        <div className="login-left-section">
          <div className="login-left-content">
            <div className="login-left-main-flow">
              <h1 className="login-heading">
                {t("CORE_LOGIN_ONE_PLATFORM", "One Platform,")}<br />
                {t("CORE_LOGIN_MANY_SERVICES", "Many Services")}
              </h1>
              <p className="login-subheading-tagline">
                Smart City &bull; Better Services &bull; Digital Tomorrow
              </p>

            {/* Unified White Features Card */}
            <div className="login-features-list-card">
              <div className="feature-list-row-item">
                <div className="feature-row-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <div className="feature-row-text">
                  <h4>Apply for Services</h4>
                  <p>Access a wide range of citizen services</p>
                </div>
              </div>

              <div className="feature-list-row-item">
                <div className="feature-row-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                </div>
                <div className="feature-row-text">
                  <h4>Track Your Requests</h4>
                  <p>Track the status of your applications</p>
                </div>
              </div>

              <div className="feature-list-row-item">
                <div className="feature-row-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                </div>
                <div className="feature-row-text">
                  <h4>Get Instant Notifications</h4>
                  <p>Stay updated with real-time alerts</p>
                </div>
              </div>

              <div className="feature-list-row-item">
                <div className="feature-row-icon-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                </div>
                <div className="feature-row-text">
                  <h4>Secure & Trusted</h4>
                  <p>Your data is safe with us</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column (Solid White panel) */}
      <div className="login-right-section" style={{ background: "#ffffff" }}>
        {/* Top Header Controls (Language & Help) */}
        <div className="login-top-header-controls">
          <div 
            className="control-item language-selector" 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ position: "relative" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              <path d="M2 12h20" />
            </svg>
            <span>{languages?.find((l) => l.value === selectedLanguage)?.label || "English"}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="m6 9 6 6 6-6" />
            </svg>

            {showDropdown && languages && (
              <div className="language-dropdown-menu">
                {languages.map((lang) => (
                  <div 
                    key={lang.value} 
                    className={`dropdown-menu-item ${lang.value === selectedLanguage ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      Digit.LocalizationService.changeLanguage(lang.value, stateInfo.code);
                      setShowDropdown(false);
                    }}
                  >
                    {lang.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          <a 
            className="control-item help-link" 
            href="https://upyog.niua.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <path d="M12 17h.01" />
            </svg>
            <span>Help</span>
          </a>
        </div>

        <div className="login-mockup-solid-content">
          {/* Card Header Illustration & Title */}
          <div className="mockup-card-header">
            <div className="mockup-mobile-icon-badge">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                <line x1="12" y1="18" x2="12.01" y2="18" />
              </svg>
            </div>
            <h2>Login to UPYOG</h2>
            <p>Access urban services with ease</p>
          </div>

          {/* Form Content */}
          <div className="mockup-card-body">
            {children}
          </div>

          {/* Solid Panel Trust Row (Secure, Reliable, Easy) */}
          <div className="solid-panel-trust-row">
            <div className="trust-column-item">
              <div className="trust-column-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div className="trust-column-text">
                <strong>Secure</strong>
                <span>Encrypted Platform</span>
              </div>
            </div>

            <div className="trust-column-item">
              <div className="trust-column-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="trust-column-text">
                <strong>Reliable</strong>
                <span>24x7 Availability</span>
              </div>
            </div>

            <div className="trust-column-item">
              <div className="trust-column-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <div className="trust-column-text">
                <strong>Easy</strong>
                <span>Simple & Quick Access</span>
              </div>
            </div>
          </div>

          {/* Floating Copyright Footer */}
          <div className="login-mockup-copyright">
            &copy; 2024 UPYOG | Urban Platform for Online Governance | All Rights Reserved
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default Background;
