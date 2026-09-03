const plugin = require("tailwindcss/plugin");
const semanticPlugin = require("./tailwind.semantic");
const themeConfig = require("./tailwind.theme.json");

const theme = themeConfig.config.theme;
const extend = theme.extend || {};
const pageContainer = extend.pageContainer || {};
const pageLayouts = pageContainer.layouts || [];

extend.gridTemplateColumns = {
    ...(extend.gridTemplateColumns || {}),
    ...Object.fromEntries(pageLayouts.map((layout) => [layout.key, layout.template])),
};
extend.gap = {
    ...(extend.gap || {}),
    "page-container": pageContainer.gap || "16px",
};

// Mirror all theme colors to border colors to generate custom border color utilities
if (extend.colors) {
    extend.borderColor = extend.borderColor || {};
    const flattenColors = (obj, prefix = "") => {
        for (const [key, val] of Object.entries(obj)) {
            const newKey = prefix ? `${prefix}-${key}` : key;
            if (typeof val === "object" && val !== null) {
                flattenColors(val, newKey);
            } else {
                extend.borderColor[newKey] = val;
            }
        }
    };
    flattenColors(extend.colors);
}

// Custom plugin to inject CSS variables derived from JSON configuration
const variablesPlugin = plugin(function ({ addBase }) {
    addBase({
        ":root": {
            /* Colors */
            "--primary-light": extend.colors.primary.light,
            "--primary-main": extend.colors.primary.main,
            "--primary-dark": extend.colors.primary.dark,
            "--primary-darker": extend.colors.primary.darker,
            "--secondary": extend.colors.secondary,
            "--text-primary": extend.colors.text.primary,
            "--text-secondary": extend.colors.text.secondary,
            "--link-normal": extend.colors.link.normal,
            "--link-hover": extend.colors.link.hover,
            "--border": extend.colors.border,
            "--input-border": extend.colors["input-border"],
            "--focus": extend.colors.focus,
            "--error": extend.colors.error,
            "--success": extend.colors.success,
            "--black": extend.colors.black,
            "--purple": extend.colors.purple,
            "--white": extend.colors.white,
            "--grey-dark": extend.colors.grey.dark,
            "--grey-mid": extend.colors.grey.mid,
            "--grey-light": extend.colors.grey.light,
            "--grey-bg": extend.colors.grey.bg,

            /* Gradients */
            "--gradient-primary": extend.gradient.primary,
            "--gradient-secondary": extend.gradient.secondary,
            "--gradient-tertiary": extend.gradient.tertiary,
            "--gradient-quaternary": extend.gradient.quaternary,
            "--gradient-quinary": extend.gradient.quinary,
            "--gradient-senary": extend.gradient.senary,

            /* Spacing */
            "--spacing-xs": extend.spacing.xs,
            "--spacing-sm": extend.spacing.sm,
            "--spacing-md": extend.spacing.md,
            "--spacing-lg": extend.spacing.lg,
            "--spacing-xl": extend.spacing.xl,
            "--spacing-2xl": extend.spacing["2xl"],

            /* Font Sizes */
            "--font-size-xs": extend.fontSize.xs,
            "--font-size-sm": extend.fontSize.sm,
            "--font-size-md": extend.fontSize.md,
            "--font-size-lg": extend.fontSize.lg,
            "--font-size-xl": extend.fontSize.xl,
            "--font-size-2xl": extend.fontSize["2xl"],

            /* Font Weights */
            "--weight-regular": extend.fontWeight.regular,
            "--weight-medium": extend.fontWeight.medium,
            "--weight-bold": extend.fontWeight.bold,

            /* Border Radius */
            "--border-radius-sm": extend.borderRadius.sm,
            "--border-radius-md": extend.borderRadius.md,
            "--border-radius-lg": extend.borderRadius.lg,
            "--border-radius-xl": extend.borderRadius.xl,
            "--border-radius-2xl": extend.borderRadius["2xl"],

            /* Border Width */
            "--border-width-sm": extend.borderWidth.sm,
            "--border-width-md": extend.borderWidth.md,
            "--border-width-lg": extend.borderWidth.lg,
            "--border-width-xl": extend.borderWidth.xl,
            "--border-width-2xl": extend.borderWidth["2xl"],

            /* Border Color */
            "--border-color-primary": extend.borderColor.primary,
            "--border-color-secondary": extend.borderColor.secondary,
            "--border-color-tertiary": extend.borderColor.tertiary,
            "--border-color-quaternary": extend.borderColor.quaternary,
            "--border-color-quinary": extend.borderColor.quinary,
            "--border-color-senary": extend.borderColor.senary,

            /* Box Shadow */
            "--box-shadow-sm": extend.boxShadow.sm,
            "--box-shadow-md": extend.boxShadow.md,
            "--box-shadow-lg": extend.boxShadow.lg,
            "--box-shadow-xl": extend.boxShadow.xl,
            "--box-shadow-2xl": extend.boxShadow["2xl"],

            /* Box Shadow Color */
            "--box-shadow-color-primary": extend.boxShadowColor.primary,
            "--box-shadow-color-secondary": extend.boxShadowColor.secondary,
            "--box-shadow-color-tertiary": extend.boxShadowColor.tertiary,
            "--box-shadow-color-quaternary": extend.boxShadowColor.quaternary,
            "--box-shadow-color-quinary": extend.boxShadowColor.quinary,
            "--box-shadow-color-senary": extend.boxShadowColor.senary,

            /* Box Shadow Opacity */
            "--box-shadow-opacity-sm": extend.boxShadowOpacity.sm,
            "--box-shadow-opacity-md": extend.boxShadowOpacity.md,
            "--box-shadow-opacity-lg": extend.boxShadowOpacity.lg,
            "--box-shadow-opacity-xl": extend.boxShadowOpacity.xl,
            "--box-shadow-opacity-2xl": extend.boxShadowOpacity["2xl"],

            /* Buttons */
            "--button-primary-background": extend.button.primary.background,
            "--button-primary-color": extend.button.primary.color,
            "--button-secondary-background": extend.button.secondary.background,
            "--button-secondary-color": extend.button.secondary.color,
            "--button-tertiary-background": extend.button.tertiary.background,
            "--button-tertiary-color": extend.button.tertiary.color,
            "--button-inverse-background": extend.button.inverse.background,
            "--button-inverse-color": extend.button.inverse.color,

            /* Page Container */
            "--page-container-gap": extend.pageContainer.gap,
        },
    });
});

module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
        "./micro-ui-internals/packages/css/src/**/*.{scss,css}",
        "./micro-ui-internals/packages/react-components/src/**/*.{js,jsx,ts,tsx}",
        "./micro-ui-internals/packages/modules/**/src/**/*.{js,jsx,ts,tsx}",
    ],

    theme,

    plugins: [semanticPlugin, variablesPlugin],
};