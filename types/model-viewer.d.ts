import type * as React from "react";

declare global {
  namespace React.JSX {
    interface IntrinsicElements {
      "model-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string;
          alt?: string;
          "auto-rotate"?: boolean | string;
          "camera-controls"?: boolean | string;
          "camera-target"?: string;
          "camera-orbit"?: string;
          "touch-action"?: string;
          "shadow-intensity"?: string | number;
          exposure?: string | number;
          "interaction-prompt"?: string;
          loading?: string;
        },
        HTMLElement
      >;
    }
  }
}
