// types/model-viewer.d.ts
// Coloca este archivo en la carpeta types/ de tu proyecto
// para que TypeScript reconozca <model-viewer> como elemento JSX válido.

declare namespace JSX {
  interface IntrinsicElements {
    'model-viewer': React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        alt?: string;
        'auto-rotate'?: boolean | string;
        'camera-controls'?: boolean | string;
        'shadow-intensity'?: string;
        loading?: string;
        poster?: string;
        ar?: boolean | string;
        'ar-modes'?: string;
        style?: React.CSSProperties;
      },
      HTMLElement
    >;
  }
}
