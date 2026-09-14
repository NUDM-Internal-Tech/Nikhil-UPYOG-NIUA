import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { tokenToStyleValue, tokensToStyles, interpolateTemplate } from "../utilities/themeUtils";
import SubmitBar from "../atoms/SubmitBar";
import Button from "../atoms/Button";
import Card from "../atoms/Card";
import CheckBox from "../atoms/CheckBox";
import MobileNumber from "../atoms/MobileNumber";
import BreakLine from "../atoms/BreakLine";
import * as SvgIcons from "../atoms/svgindex";



/**
 * Generic State Emblem Component for authentic government branding
 */
export const StateEmblem = ({ size = 46, src }) => {
  const storeData = typeof Digit !== "undefined" && Digit.Hooks?.useStore?.getInitData ? Digit.Hooks.useStore.getInitData()?.data : null;
  const { stateInfo } = storeData || {};
  const emblemUrl = src || stateInfo?.emblemUrl || stateInfo?.logoUrl;

  if (!emblemUrl) return null;

  return (
    <div className="configurable-emblem-wrapper" style={{ width: `${size}px`, height: `${size}px` }}>
      <img
        src={emblemUrl}
        alt="State Emblem"
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    </div>
  );
};

export const BrandLogo = ({ height = 38, src }) => {
  const storeData = typeof Digit !== "undefined" && Digit.Hooks?.useStore?.getInitData ? Digit.Hooks.useStore.getInitData()?.data : null;
  const { stateInfo } = storeData || {};
  const logoUrl = src || stateInfo?.logoUrl || stateInfo?.logoUrlWhite;

  if (!logoUrl) return null;

  return (
    <div className="configurable-brand-logo">
      <img
        src={logoUrl}
        alt="Brand Logo"
        style={{ height: `${height}px` }}
        onError={(e) => {
          e.target.style.display = "none";
        }}
      />
    </div>
  );
};

export const OfficialPortrait = ({ name, title, caption, src, size = 44, shape = "circle" }) => {
  const shapeClass = shape === "circle" ? "rounded-full" : shape === "rounded" ? "rounded-lg" : "rounded-sm";

  return (
    <div className="configurable-official-portrait">
      <div
        className={`portrait-avatar ${shapeClass}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        {src ? (
          <img
            src={src}
            alt={name || ""}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        ) : (
          <ConfigurableIcon name="user" size="20px" color="colors.text.secondary" />
        )}
      </div>
      {(name || title || caption) && (
        <div className="flex flex-col text-left">
          {name && <span className="portrait-name">{name}</span>}
          {title && <span className="portrait-title">{title}</span>}
          {caption && <span className="portrait-caption">{caption}</span>}
        </div>
      )}
    </div>
  );
};

/**
 * In-place Language Selector Dropdown Component
 */
export const HeaderLanguageSelector = ({ context, t, onAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const storeData = typeof Digit !== "undefined" && Digit.Hooks?.useStore?.getInitData ? Digit.Hooks.useStore.getInitData()?.data : null;
  const { languages: storeLanguages, stateInfo } = storeData || {};

  const languageList = (context?.languages && context.languages.length > 0)
    ? context.languages
    : (storeLanguages && storeLanguages.length > 0)
    ? storeLanguages
    : (stateInfo?.languages && stateInfo.languages.length > 0)
    ? stateInfo.languages
    : [];

  const currentLangCode = typeof Digit !== "undefined" && Digit.StoreData?.getCurrentLanguage
    ? Digit.StoreData.getCurrentLanguage()
    : (typeof Digit !== "undefined" && Digit.SessionStorage?.get ? Digit.SessionStorage.get("locale") : null) || languageList[0]?.value || "en_IN";

  const [selectedLang, setSelectedLang] = useState(currentLangCode);

  useEffect(() => {
    if (currentLangCode) {
      setSelectedLang(currentLangCode);
    }
  }, [currentLangCode]);

  if (!languageList || languageList.length === 0) {
    return null;
  }

  const activeLangObj = languageList.find((l) => l.value === selectedLang) || languageList[0];

  const handleSelect = (lang) => {
    setSelectedLang(lang.value);
    setIsOpen(false);
    if (typeof Digit !== "undefined" && Digit.LocalizationService?.changeLanguage) {
      Digit.LocalizationService.changeLanguage(lang.value, stateInfo?.code || "default");
    }
    if (onAction) {
      onAction("changeLanguage", lang);
    }
  };

  return (
    <div className="configurable-lang-dropdown">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="lang-trigger-btn"
      >
        <ConfigurableIcon name="globe" size="16px" color="colors.text.secondary" />
        <span>{activeLangObj?.label || "ENGLISH"}</span>
        <ConfigurableIcon
          name="chevron-down"
          size="12px"
          color="colors.text.secondary"
          className={isOpen ? "transform rotate-180" : ""}
        />
      </div>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="lang-menu-panel">
            {languageList.map((lang) => {
              const isSelected = lang.value === selectedLang;
              return (
                <div
                  key={lang.value}
                  onClick={() => handleSelect(lang)}
                  className={`lang-menu-item ${isSelected ? "active" : ""}`}
                >
                  <span>{lang.label}</span>
                  {isSelected && <span style={{ color: "var(--primary-main, #a82227)", fontSize: "14px" }}>✓</span>}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * Universal SVG Icon Renderer with automatic lookup from atoms/svgindex
 */
export const ConfigurableIcon = ({ name, size = "20px", color = "currentColor", className = "", style = {} }) => {
  const iconSize = typeof size === "number" ? `${size}px` : size;
  const resolvedColor = tokenToStyleValue(color) || "currentColor";
  const iconStyle = { width: iconSize, height: iconSize, display: "inline-block", flexShrink: 0, ...style };

  const pascalName = name
    ? name
        .split("-")
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join("")
    : "";

  const IconComponent =
    SvgIcons[name] ||
    SvgIcons[pascalName] ||
    SvgIcons[`${pascalName}Icon`] ||
    SvgIcons[`${name}Icon`];

  if (IconComponent) {
    return <IconComponent className={className} styles={iconStyle} style={iconStyle} fillcolor={resolvedColor} fill={resolvedColor} />;
  }

  return null;
};

/**
 * Renders an Icon/Photo group item
 */
const WidgetIconPhotoGroup = ({ props = {}, style = {}, context = {}, t, onAction }) => {
  const { align = "left", gap = "spacing.md", items = [] } = props;
  const resolvedGap = tokenToStyleValue(gap) || "16px";

  const sortedItems = [...items].sort((a, b) => {
    const orderA = a.position?.order ?? a.order ?? 0;
    const orderB = b.position?.order ?? b.order ?? 0;
    return orderA - orderB;
  });

  return (
    <div
      className="flex items-center"
      style={{
        gap: resolvedGap,
        flexWrap: props.flexWrap || style.flexWrap || "wrap",
        justifyContent: align === "right" ? "flex-end" : align === "center" ? "center" : "flex-start",
        ...tokensToStyles(style),
      }}
    >
      {sortedItems.map((item, index) => {
        const itemLabel = interpolateTemplate(item.label, context, t);
        const itemSublabel = interpolateTemplate(item.sublabel, context, t);
        const itemCaption = interpolateTemplate(item.caption, context, t);

        if (item.kind === "photo") {
          return (
            <div key={item.itemId || index} className="flex items-center" style={{ gap: "10px" }}>
              {item.showDivider && (
                <div style={{ height: "28px", width: "1px", background: "#CBD5E1", margin: "0 4px" }} />
              )}
              <OfficialPortrait
                name={itemLabel}
                title={itemSublabel}
                caption={itemCaption}
                src={item.src}
                size={item.size ? parseInt(item.size, 10) : 44}
                shape={item.shape || "circle"}
              />
            </div>
          );
        }

        if (item.kind === "icon") {
          return (
            <div
              key={item.itemId || index}
              onClick={() => {
                if (item.action && onAction) onAction(item.action);
                else if (item.href) window.location.href = item.href;
              }}
              className={`flex items-center ${item.action || item.href ? "cursor-pointer hover:opacity-80 transition-opacity" : ""}`}
              style={{ gap: "6px" }}
            >
              {item.icon && (
                <ConfigurableIcon
                  name={item.icon}
                  size={item.size || "18px"}
                  color={item.color || "colors.text.secondary"}
                />
              )}
              {(itemLabel || itemSublabel) && (
                <div className="flex flex-col text-left">
                  {itemLabel && (
                    <span className="font-medium text-xs text-text-primary flex items-center" style={{ gap: "4px" }}>
                      {itemLabel}
                      {item.action === "openLanguageMenu" && <ConfigurableIcon name="chevron-down" size="12px" color="colors.text.secondary" />}
                    </span>
                  )}
                  {itemSublabel && <span className="text-text-secondary text-xs leading-tight">{itemSublabel}</span>}
                </div>
              )}
            </div>
          );
        }

        if (item.kind === "text") {
          return (
            <div key={item.itemId || index} className="flex flex-col text-left">
              {itemLabel && <span className="font-bold text-sm text-text-primary">{itemLabel}</span>}
              {itemSublabel && <span className="text-xs text-text-secondary">{itemSublabel}</span>}
            </div>
          );
        }

        if (item.kind === "logo" || item.kind === "brandLogo" || item.kind === "image") {
          return (
            <div key={item.itemId || index} className="flex items-center" style={{ gap: "10px" }}>
              {item.showDivider && (
                <div style={{ height: "28px", width: "1px", background: "#CBD5E1", margin: "0 4px" }} />
              )}
              <img
                src={item.src || "https://in-egov-assets.s3.ap-south-1.amazonaws.com/images/Upyog-logo.png"}
                alt={itemLabel || "Brand Logo"}
                style={{
                  height: item.height || `${item.size ? parseInt(item.size, 10) : 34}px`,
                  width: item.width || "auto",
                  objectFit: "contain",
                  display: "block",
                }}
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
};

/**
 * Feature highlights card (glassmorphic / solid)
 */
const WidgetFeatureCard = ({ widget, context, t }) => {
  const { props = {}, style = {} } = widget;
  const { items = [], gap = "spacing.md" } = props;
  const resolvedGap = tokenToStyleValue(gap) || "14px";

  return (
    <div
      className="configurable-feature-card-wrapper"
      style={{
        gap: resolvedGap,
        ...tokensToStyles(style),
      }}
    >
      {items.map((item, idx) => (
        <div key={item.itemId || idx} className="flex items-center" style={{ gap: "14px" }}>
          <div className="feature-item-icon-box">
            <ConfigurableIcon name={item.icon} size="20px" color={item.color || "colors.primary.main"} />
          </div>
          <div className="flex flex-col text-left">
            <span className="feature-item-label">
              {interpolateTemplate(item.label, context, t)}
            </span>
            <span className="feature-item-sublabel">
              {interpolateTemplate(item.sublabel, context, t)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Auto-rotating Carousel for Hero Background Images
 */
const HeroBackgroundCarousel = ({ bgWidget, intervalMs = 5000 }) => {
  const images = [];

  if (bgWidget?.props?.images && Array.isArray(bgWidget.props.images)) {
    bgWidget.props.images.forEach((img) => {
      const src = typeof img === "string" ? img : img.src;
      if (src) images.push(src);
    });
  } else if (bgWidget?.props?.src) {
    if (Array.isArray(bgWidget.props.src)) {
      images.push(...bgWidget.props.src);
    } else {
      images.push(bgWidget.props.src);
    }
  }

  const storeData = typeof Digit !== "undefined" && Digit.Hooks?.useStore?.getInitData ? Digit.Hooks.useStore.getInitData()?.data : null;
  const { stateInfo } = storeData || {};
  const defaultImages = stateInfo?.bannerUrl ? [stateInfo.bannerUrl] : [];
  const imageList = images.length > 0 ? images : defaultImages;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imageList.length <= 1) return;
    const intervalTime = bgWidget?.props?.interval || intervalMs;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageList.length);
    }, intervalTime);
    return () => clearInterval(timer);
  }, [imageList.length, bgWidget?.props?.interval, intervalMs]);

  return (
    <div className="configurable-carousel-container">
      {imageList.map((src, idx) => (
        <div
          key={idx}
          className="carousel-slide"
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: bgWidget?.props?.fit || "cover",
            opacity: idx === currentIndex ? 1 : 0,
          }}
        />
      ))}

      {imageList.length > 1 && (
        <div className="carousel-dots">
          {images.map((_, dotIdx) => (
            <div
              key={dotIdx}
              onClick={() => setCurrentIndex(dotIdx)}
              className={`carousel-dot ${dotIdx === currentIndex ? "active" : ""}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Universal Configurable Widget Engine
 */
const ConfigurableWidget = ({ widget, context, t, slots, onAction }) => {
  if (!widget) return null;
  const { id, type, props = {}, style: wStyle = {}, position = {}, children = [] } = widget;
  const resolvedWStyle = tokensToStyles(wStyle);

  const hasAbsolutePos = position.x !== undefined || position.y !== undefined || position.top !== undefined || position.left !== undefined;
  const posStyle = hasAbsolutePos
    ? {
        position: "absolute",
        left: position.x || position.left,
        top: position.y || position.top,
        right: position.right,
        bottom: position.bottom,
        width: position.width,
        height: position.height,
        zIndex: position.zIndex || 10,
      }
    : {};

  const widgetContent = (() => {
    switch (type) {
      case "backgroundImage":
        return <HeroBackgroundCarousel bgWidget={widget} intervalMs={props.interval || 5000} />;

      case "overlay":
        return (
          <div
            id={id}
            style={{
              position: "absolute",
              inset: 0,
              background: props.gradient || props.background || "linear-gradient(135deg, rgba(15, 23, 42, 0.45) 0%, rgba(15, 23, 42, 0.15) 50%, rgba(0,0,0,0.35) 100%)",
              pointerEvents: "none",
              zIndex: position.zIndex || 2,
              ...resolvedWStyle,
            }}
          />
        );

      case "icon": {
        const shapeClass = props.shape === "circle" ? "circle" : props.shape === "square" ? "square" : "";
        const isFullScreen = props.size === "full" || props.size === "100%";
        const containerSize = props.containerSize || (isFullScreen ? "100%" : (props.size || "48px"));
        const customBadgeStyle = {
          width: isFullScreen ? "100%" : containerSize,
          height: isFullScreen ? "100%" : containerSize,
          background: props.background ? tokenToStyleValue(props.background) : undefined,
          border: props.border ? tokenToStyleValue(props.border) : undefined,
          borderRadius: props.shape === "circle" ? "50%" : props.shape === "square" ? "0px" : undefined,
          ...resolvedWStyle,
        };
        return (
          <div
            id={id}
            className={`configurable-icon-badge ${shapeClass} ${isFullScreen ? "fullscreen" : ""}`}
            style={customBadgeStyle}
          >
            <ConfigurableIcon
              name={props.name || "user"}
              size={isFullScreen ? (props.iconSize || "120px") : (props.size || "24px")}
              color={props.color || (props.background ? "#FFFFFF" : "colors.primary.main")}
            />
          </div>
        );
      }

      case "heading":
        return (
          <h2
            id={id}
            className="configurable-widget-heading"
            style={{
              fontSize: tokenToStyleValue(props.fontSize) || "24px",
              fontWeight: tokenToStyleValue(props.fontWeight) || "700",
              color: tokenToStyleValue(props.color) || "var(--text-primary, #0B0C0C)",
              textAlign: props.align || "inherit",
              ...resolvedWStyle,
            }}
          >
            {interpolateTemplate(props.text, context, t)}
          </h2>
        );

      case "text":
        return (
          <p
            id={id}
            className="configurable-widget-text"
            style={{
              fontSize: tokenToStyleValue(props.fontSize) || "14px",
              color: tokenToStyleValue(props.color) || "var(--text-secondary, #505A5F)",
              textAlign: props.align || "inherit",
              ...resolvedWStyle,
            }}
          >
            {interpolateTemplate(props.text, context, t)}
          </p>
        );

      case "image":
        return (
          <img
            id={id}
            src={props.src}
            alt={props.alt || ""}
            style={{
              width: props.width || "auto",
              height: props.height || "auto",
              objectFit: props.fit || "contain",
              ...resolvedWStyle,
            }}
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
        );

      case "customSlot":
        return (
          <div id={id} className="w-full my-1" style={resolvedWStyle}>
            {slots[props.slotName] || null}
          </div>
        );

      case "iconPhotoGroup":
        return (
          <WidgetIconPhotoGroup
            props={props}
            style={wStyle}
            context={context}
            t={t}
            onAction={onAction}
          />
        );

      case "featureCard":
        return <WidgetFeatureCard widget={widget} context={context} t={t} />;

      case "languageSelector":
        return <HeaderLanguageSelector context={context} t={t} onAction={onAction} />;

      case "helpLink":
        return (
          <div
            onClick={() => onAction && onAction("help")}
            className="configurable-help-link"
            style={resolvedWStyle}
          >
            <ConfigurableIcon name="help-circle" size="16px" color="colors.text.secondary" />
            <span>{interpolateTemplate(props.label || "Help", context, t)}</span>
          </div>
        );

      case "divider":
        return (
          <div id={id} className="w-full my-1" style={resolvedWStyle}>
            <BreakLine />
          </div>
        );

      case "phoneInput":
        return (
          <div key={id} className="flex flex-col text-left w-full" style={{ gap: "6px", ...resolvedWStyle }}>
            <label className="text-xs font-bold text-text-primary">
              {interpolateTemplate(props.label, context, t)}
            </label>
            <MobileNumber
              placeholder={props.placeholder || "Enter mobile number"}
              onChange={(val) => onAction && onAction("mobileChange", val)}
              value={props.value}
              className="w-full"
            />
          </div>
        );

      case "checkbox":
        return (
          <div key={id} className="text-left" style={resolvedWStyle}>
            <CheckBox
              label={interpolateTemplate(props.label, context, t)}
              onChange={(e) => onAction && onAction("consentChange", e.target.checked)}
              checked={props.checked !== undefined ? props.checked : true}
            />
          </div>
        );

      case "button": {
        const isInverse = props.variant === "inverse";
        if (!isInverse && !props.icon) {
          return (
            <SubmitBar
              key={id}
              submit={props.action === "submit"}
              onSubmit={() => onAction && onAction(props.action)}
              label={interpolateTemplate(props.label, context, t)}
              className="w-full"
              style={resolvedWStyle}
            />
          );
        }

        return (
          <Button
            key={id}
            label={interpolateTemplate(props.label, context, t)}
            variation={isInverse ? "secondary" : "primary"}
            icon={props.icon ? <ConfigurableIcon name={props.icon} size="18px" color={isInverse ? "colors.primary.main" : "#FFFFFF"} /> : null}
            onButtonClick={() => onAction && onAction(props.action)}
            className="w-full"
            style={resolvedWStyle}
          />
        );
      }

      case "badge":
      case "tag":
        return (
          <div
            id={id}
            className="configurable-widget-badge"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 12px",
              borderRadius: "20px",
              background: tokenToStyleValue(props.background) || "rgba(255, 255, 255, 0.15)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: props.border ? tokenToStyleValue(props.border) : "1px solid rgba(255, 255, 255, 0.25)",
              color: tokenToStyleValue(props.color) || "#FFFFFF",
              fontSize: props.fontSize || "11px",
              fontWeight: props.fontWeight || "700",
              letterSpacing: props.letterSpacing || "0.6px",
              textTransform: props.textTransform || "uppercase",
              ...resolvedWStyle,
            }}
          >
            {props.icon && <ConfigurableIcon name={props.icon} size="14px" color={props.color || "#FFFFFF"} />}
            <span>{interpolateTemplate(props.text || props.label, context, t)}</span>
          </div>
        );

      case "card":
      case "container": {
        const childWidgets = (props.widgets || children || []).sort(
          (a, b) => (a.position?.order ?? a.order ?? 0) - (b.position?.order ?? b.order ?? 0)
        );
        return (
          <div
            id={id}
            className={`configurable-card-container ${props.layoutMode === "flex-row" ? "flex-row" : "flex-column"}`}
            style={resolvedWStyle}
          >
            {childWidgets.map((cw, cidx) => (
              <ConfigurableWidget
                key={cw.id || cidx}
                widget={cw}
                context={context}
                t={t}
                slots={slots}
                onAction={onAction}
              />
            ))}
          </div>
        );
      }

      default:
        return null;
    }
  })();

  if (hasAbsolutePos) {
    return <div style={posStyle}>{widgetContent}</div>;
  }

  return widgetContent;
};

/**
 * Universal Configurable Section Renderer
 */
const ConfigurableSection = ({ section, context, t, slots, onAction }) => {
  const { id, layoutMode = "flex-column", widthPercent, style = {}, widgets = [] } = section;
  const resolvedStyles = tokensToStyles(style);

  const sortedWidgets = [...widgets].sort((a, b) => {
    const orderA = a.position?.order ?? a.order ?? 0;
    const orderB = b.position?.order ?? b.order ?? 0;
    return orderA - orderB;
  });

  // 1. Header Section
  if (id === "header") {
    return (
      <header
        id={id}
        className="configurable-header-bar"
        style={resolvedStyles}
      >
        {sortedWidgets.map((widget, idx) => (
          <div
            key={widget.id || idx}
            className="flex items-center"
            style={{
              gap: "18px",
              justifyContent: widget.props?.align === "right" ? "flex-end" : widget.props?.align === "center" ? "center" : "flex-start",
            }}
          >
            <ConfigurableWidget
              widget={widget}
              context={context}
              t={t}
              slots={slots}
              onAction={onAction}
            />
          </div>
        ))}
      </header>
    );
  }

  // 2. Absolute Canvas Layout (e.g. Hero Panel / Animated Artboards)
  if (layoutMode === "absolute") {
    const bgWidgets = sortedWidgets.filter((w) => w.type === "backgroundImage" || w.type === "overlay");
    const contentWidgets = sortedWidgets.filter((w) => w.type !== "backgroundImage" && w.type !== "overlay");

    return (
      <div
        id={id}
        className="configurable-canvas-section"
        style={{
          flex: `0 0 ${widthPercent !== undefined ? widthPercent : 100}%`,
          width: `${widthPercent !== undefined ? widthPercent : 100}%`,
          ...resolvedStyles,
        }}
      >
        {bgWidgets.map((widget, idx) => (
          <ConfigurableWidget
            key={widget.id || idx}
            widget={widget}
            context={context}
            t={t}
            slots={slots}
            onAction={onAction}
          />
        ))}

        {contentWidgets.length > 0 && (
          <div className="configurable-canvas-content">
            {contentWidgets.map((widget, idx) => (
              <ConfigurableWidget
                key={widget.id || idx}
                widget={widget}
                context={context}
                t={t}
                slots={slots}
                onAction={onAction}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // 3. Center Layout (Full-Screen Login / Centered Modal Card)
  if (layoutMode === "center" || layoutMode === "center-card" || layoutMode === "full-center") {
    const bgWidgets = sortedWidgets.filter((w) => w.type === "backgroundImage" || w.type === "overlay");
    const contentWidgets = sortedWidgets.filter((w) => w.type !== "backgroundImage" && w.type !== "overlay");

    return (
      <div
        id={id}
        className="configurable-center-section"
        style={{
          flex: `0 0 ${widthPercent !== undefined ? widthPercent : 100}%`,
          width: `${widthPercent !== undefined ? widthPercent : 100}%`,
          ...resolvedStyles,
        }}
      >
        {bgWidgets.map((widget, idx) => (
          <ConfigurableWidget
            key={widget.id || idx}
            widget={widget}
            context={context}
            t={t}
            slots={slots}
            onAction={onAction}
          />
        ))}

        <div
          className="configurable-center-card"
          style={tokensToStyles(section.cardStyle)}
        >
          {contentWidgets.map((widget, idx) => (
            <ConfigurableWidget
              key={widget.id || idx}
              widget={widget}
              context={context}
              t={t}
              slots={slots}
              onAction={onAction}
            />
          ))}
        </div>
      </div>
    );
  }

  // 4. Flex Column / Row Layout (Split Screen Login Panel / Custom Section)
  return (
    <div
      id={id}
      className="configurable-split-section"
      style={{
        flex: `0 0 ${widthPercent !== undefined ? widthPercent : 100}%`,
        width: `${widthPercent !== undefined ? widthPercent : 100}%`,
        flexDirection: layoutMode === "flex-row" ? "row" : "column",
        ...resolvedStyles,
      }}
    >
      <div className="configurable-split-body">
        {sortedWidgets.map((widget, idx) => (
          <ConfigurableWidget
            key={widget.id || idx}
            widget={widget}
            context={context}
            t={t}
            slots={slots}
            onAction={onAction}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Master Configurable Login Page Engine
 */
export const ConfigurableLoginPage = ({
  pageConfig,
  context = {},
  slots = {},
  t = (s) => s,
  onAction = () => {},
}) => {
  if (!pageConfig || !Array.isArray(pageConfig.sections)) {
    return null;
  }

  const storeData = typeof Digit !== "undefined" && Digit.Hooks?.useStore?.getInitData ? Digit.Hooks.useStore.getInitData()?.data : null;
  const { stateInfo } = storeData || {};

  const dynamicDefaults = {
    brand_name: stateInfo?.name || "",
    state_name: stateInfo?.name || "",
    state_name_local: stateInfo?.nameLocal || stateInfo?.name || "",
  };

  const mergedContext = {
    ...dynamicDefaults,
    ...(pageConfig.context || {}),
    ...context,
  };

  const sortedSections = [...pageConfig.sections].sort(
    (a, b) => (a.order || 0) - (b.order || 0)
  );

  const headerSection = sortedSections.find((s) => s.id === "header");
  const bodySections = sortedSections.filter((s) => s.id !== "header");

  return (
    <div className="configurable-login-container">
      {headerSection && (
        <ConfigurableSection
          key={headerSection.id}
          section={headerSection}
          context={mergedContext}
          t={t}
          slots={slots}
          onAction={onAction}
        />
      )}

      <div className="configurable-body-container">
        {bodySections.map((sec) => (
          <ConfigurableSection
            key={sec.id}
            section={sec}
            context={mergedContext}
            t={t}
            slots={slots}
            onAction={onAction}
          />
        ))}
      </div>
    </div>
  );
};

ConfigurableLoginPage.propTypes = {
  pageConfig: PropTypes.object.isRequired,
  context: PropTypes.object,
  slots: PropTypes.object,
  t: PropTypes.func,
  onAction: PropTypes.func,
};

export const ConfigurablePage = ConfigurableLoginPage;

export default ConfigurableLoginPage;
