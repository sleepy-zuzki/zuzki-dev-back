export interface EditorJsBlock {
  id?: string;
  type: string;
  data: Record<string, unknown>;
}

export interface EditorJsContent {
  time?: number;
  blocks: EditorJsBlock[];
  version?: string;
}
