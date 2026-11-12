export const DEFAULT_FONT_SIZE = 16;

const tailwindTextSizes = {
  xs: 0.75,
  sm: 0.875,
  base: 1,
  lg: 1.125,
  xl: 1.25,
  '2xl': 1.5,
};

export function textSizeVariables(fontSize) {
  const scale = fontSize / DEFAULT_FONT_SIZE;
  return Object.fromEntries(
    Object.entries(tailwindTextSizes).map(([name, rem]) => [`--text-${name}`, `${rem * scale}rem`]),
  );
}
