/// <reference types="vite/client" />

namespace JSX {
  interface IntrinsicElements {
    webview: React.DetailedHTMLProps<
      React.HTMLAttributes<import('electron').WebviewTag>,
      import('electron').WebviewTag
    > & {
      src?: string;
    };
  }
}
