import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const contenedor = document.getElementById("main-scroll");
    contenedor?.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}
