export interface ElementNode {
    id: string;
    tag: string;
    children: ElementNode[];
    styles?: Record<string, string>;
  }
  