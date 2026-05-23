/// <reference types="vite/client" />

// Allow importing SVGs as React components if you enable the plugin
declare module "*.svg" {
  import * as React from "react";
  const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement> & { title?: string }>;
  export default ReactComponent;
}
