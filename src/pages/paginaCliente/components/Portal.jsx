// components/Portal.jsx
import { createPortal } from "react-dom";

const Portal = ({ children }) => {
  const portalContainer = document.getElementById("portal-root");
  if (!portalContainer) return null;
  return createPortal(children, portalContainer);
};

export default Portal;
