import { useEffect } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Logo from "../components/Logo";

export default function Favicon() {
  useEffect(() => {
    const svgString = encodeURIComponent(
      renderToStaticMarkup(<Logo fill="white" style={{ transform: "scaleX(-1)" }} />)
    );
    const dataUrl = `data:image/svg+xml,${svgString}`;

    const link = document.createElement("link");
    link.rel = "icon";
    link.type = "image/svg+xml";
    link.href = dataUrl;

    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return null;
}
