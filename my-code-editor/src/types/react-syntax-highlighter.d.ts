declare module "react-syntax-highlighter" {
  import { ComponentType } from "react";

  export const Prism: ComponentType<any>;
  export const Light: ComponentType<any>;
  export const Dark: ComponentType<any>;

  export interface SyntaxHighlighterProps {
    language: string;
    style: any;
    children: React.ReactNode;
  }

  const SyntaxHighlighter: ComponentType<SyntaxHighlighterProps>;
  export default SyntaxHighlighter;
}
