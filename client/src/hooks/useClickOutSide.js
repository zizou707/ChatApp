import { useEffect, useRef } from "react";

export function useClickOutSide(handler) {
  const domElement = useRef();

  useEffect(() => {
    let maybeHandler = (event) => {
      if (!domElement?.current?.contains(event.target)) {
        handler();
      }
    };

    document.addEventListener("mousedown", maybeHandler);

    return () => {
      document.removeEventListener("mousedown", maybeHandler);
    };
  });

  return domElement;
}
