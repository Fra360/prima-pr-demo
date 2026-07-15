import type React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          poster?: string;
          ar?: boolean;
          "ar-modes"?: string;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          "auto-rotate-delay"?: number | string;
          "rotation-per-second"?: string;
          "shadow-intensity"?: number | string;
          "shadow-softness"?: number | string;
          exposure?: number | string;
          "environment-image"?: string;
          "camera-orbit"?: string;
          "field-of-view"?: string;
          "touch-action"?: string;
          "ios-src"?: string;
        },
        HTMLElement
      >;
    }
  }
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          poster?: string;
          ar?: boolean;
          "ar-modes"?: string;
          "camera-controls"?: boolean;
          "auto-rotate"?: boolean;
          "auto-rotate-delay"?: number | string;
          "rotation-per-second"?: string;
          "shadow-intensity"?: number | string;
          "shadow-softness"?: number | string;
          exposure?: number | string;
          "environment-image"?: string;
          "camera-orbit"?: string;
          "field-of-view"?: string;
          "touch-action"?: string;
          "ios-src"?: string;
        },
        HTMLElement
      >;
    }
  }
}

export {};
