/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

const str = `
       d8888                                               .d8888b.                                         888 
      d88888                                              d88P  Y88b                                        888 
     d88P888                                              888    888                                        888 
    d88P 888 888d888 88888b.d88b.   8888b.  88888b.       888        888d888 .d88b.  888  888  888  8888b.  888 
   d88P  888 888P"   888 "888 "88b     "88b 888 "88b      888  88888 888P"  d8P  Y8b 888  888  888     "88b 888 
  d88P   888 888     888  888  888 .d888888 888  888      888    888 888    88888888 888  888  888 .d888888 888 
 d8888888888 888     888  888  888 888  888 888  888      Y88b  d88P 888    Y8b.     Y88b 888 d88P 888  888 888 
d88P     888 888     888  888  888 "Y888888 888  888       "Y8888P88 888     "Y8888   "Y8888888P"  "Y888888 888 
`;

export const onClientEntry = () => {
  // Print the ASCII art in red color in the console
  console.log("%c" + str, "color: #64ffda; font-family: monospace; font-weight: bold;");
};


