import React from "react";

export const hex2rgba = (hex, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g).map(x => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

export const navDelay = 1000;
export const loaderDelay = 2000;

export const KEY_CODES = {
  ARROW_LEFT: 'ArrowLeft',
  ARROW_LEFT_IE11: 'Left',
  ARROW_RIGHT: 'ArrowRight',
  ARROW_RIGHT_IE11: 'Right',
  ARROW_UP: 'ArrowUp',
  ARROW_UP_IE11: 'Up',
  ARROW_DOWN: 'ArrowDown',
  ARROW_DOWN_IE11: 'Down',
  ESCAPE: 'Escape',
  ESCAPE_IE11: 'Esc',
  TAB: 'Tab',
  SPACE: ' ',
  SPACE_IE11: 'Spacebar',
  ENTER: 'Enter',
};

export function getIconSvg(tech, style = { width: "20px", height: "20px", marginRight: "8px" }) {
  const baseUrl = "https://icons-theta.vercel.app/icon";
  const encodedTech = encodeURIComponent(tech.toLowerCase().replace("-", ""));
  const iconUrl = `${baseUrl}?i=${encodedTech}`;

  return (
      <img
          src={iconUrl}
          alt={`${tech} icon`}
          style={style}
      />
  );
}