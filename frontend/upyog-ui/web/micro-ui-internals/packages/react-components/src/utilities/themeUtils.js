/**
 * ==============================================================================
 * THEME UTILITIES (UPYOG Design System & Token Helpers)
 * ==============================================================================
 *
 * Provides universal utilities for resolving design tokens from tailwind.theme.json
 * or MDMS Theme API to standard CSS variables and interpolating template strings.
 */

/**
 * Converts camelCase or PascalCase strings into kebab-case
 * Example: 'borderRadius' -> 'border-radius', 'fontWeight' -> 'font-weight'
 */
const toKebab = (str) =>
  str ? str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2").toLowerCase() : "";

/**
 * Converts any design token path (e.g. "colors.primary.main", "spacing.md", "fontWeight.bold")
 * into its corresponding CSS variable string.
 * Example: tokenToVariable("colors.primary.main") -> "var(--primary-main)"
 *
 * @param {string} tokenStr - Token dot path
 * @returns {string} CSS variable expression
 */
export const tokenToVariable = (tokenStr) => {
  if (!tokenStr || typeof tokenStr !== "string") return tokenStr;

  const trimmed = tokenStr.trim();
  const parts = trimmed.split(".");
  if (parts.length < 2) return tokenStr;

  const [category, ...subParts] = parts;
  const kebabSub = subParts.map(toKebab).join("-");
  const kebabCat = toKebab(category);

  if (kebabCat === "colors" || kebabCat === "color") {
    return `var(--${kebabSub})`;
  } else if (kebabCat === "font-weight") {
    return `var(--weight-${kebabSub})`;
  }

  return `var(--${kebabCat}-${kebabSub})`;
};

/**
 * Converts any CSS property value string that contains token paths to CSS variables.
 * Example: tokenToStyleValue("1px solid colors.border") -> "1px solid var(--border)"
 *
 * @param {string} val - Single CSS value or compound shorthand
 * @returns {string} Evaluated CSS string
 */
export const tokenToStyleValue = (val) => {
  if (val === null || val === undefined) return undefined;
  if (typeof val !== "string") return val;

  const dynamicTokenRegex = /\b[a-zA-Z][a-zA-Z0-9]*\.[a-zA-Z0-9_.-]+\b/g;

  return val.replace(dynamicTokenRegex, (match) => {
    if (!isNaN(match) || /^\d+\.\d+/.test(match)) {
      return match;
    }
    return tokenToVariable(match);
  });
};

/**
 * Converts an entire style object with token values into valid inline React styles.
 * Example: tokensToStyles({ background: "colors.primary.main", padding: "spacing.md" })
 *       -> { background: "var(--primary-main)", padding: "var(--spacing-md)" }
 *
 * @param {Object} styleObj - JavaScript style object with token paths
 * @returns {Object} Valid inline React style object
 */
export const tokensToStyles = (styleObj) => {
  if (!styleObj || typeof styleObj !== "object") return {};

  const resolved = {};
  for (const [key, value] of Object.entries(styleObj)) {
    resolved[key] = tokenToStyleValue(value);
  }
  return resolved;
};

/**
 * Resolves deep/nested object properties dynamically
 */
const getNestedValue = (obj, path) => {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj);
};

/**
 * Interpolates template variables in strings like "{{state_name}}" or "{{user.name}}"
 * with values from the runtime data context or localization.
 *
 * @param {string} templateStr - e.g. "Government of {{state_name}}"
 * @param {Object} context - Data context object
 * @param {Function} [t] - Optional translation function
 * @returns {string}
 */
export const interpolateTemplate = (templateStr, context = {}, t = (s) => s) => {
  if (!templateStr || typeof templateStr !== "string") return templateStr || "";

  return templateStr.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (match, key) => {
    if (context[key] !== undefined && context[key] !== null) {
      return context[key];
    }
    const nestedVal = getNestedValue(context, key);
    if (nestedVal !== undefined && nestedVal !== null) {
      return nestedVal;
    }
    const translated = t(key);
    if (translated && translated !== key) {
      return translated;
    }
    return match;
  });
};

export default {
  tokenToVariable,
  tokenToStyleValue,
  tokensToStyles,
  interpolateTemplate,
};
