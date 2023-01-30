import { addSheet } from "sheetly";
import { sheet } from "./style.css.js";

const container = document.createElement("div");
const shadow = container.attachShadow({
  mode: "open",
});
addSheet(sheet, shadow);
shadow.innerHTML = `
  <p>Edit <code>src/style.css</code> to explore stylesheet HMR.</p>
`;
document.body.appendChild(container);
