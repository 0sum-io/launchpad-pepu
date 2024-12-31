import { useCallbackRef } from "@boxfoxs/core-hooks";
import { isIOS } from "@boxfoxs/next";
import { useEffect } from "react";

export function useWindowResizeEvent(
  handler: EventListener,
  options?: EventListenerOptions
) {
  useWindowEvent("resize", handler, options);
}

export function useWindowScrollEvent(
  handler: EventListener,
  options?: EventListenerOptions
) {
  useWindowEvent("scroll", handler, options);
}

export function useWindowEvent(
  eventName: string,
  handler: EventListener,
  options?: EventListenerOptions
) {
  const preservedHandler = useCallbackRef(handler);

  useEffect(() => {
    const target = isIOS() ? window.visualViewport : window;
    target?.addEventListener(eventName, preservedHandler, options);
    return () => {
      target?.removeEventListener(eventName, preservedHandler, options);
    };
  }, [eventName, preservedHandler]);
}
