import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const main = document.querySelector('main'); // tu contenedor con scroll
    if (main) {
      main.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [pathname]);

  return null;
}

export default ScrollToTop;
