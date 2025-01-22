declare module 'xml2js' {
  export interface ParserOptions {
    async?: boolean;
    attrkey?: string;
    charkey?: string;
    explicitArray?: boolean;
    normalizeTags?: boolean;
    normalize?: boolean;
    explicitRoot?: boolean;
    emptyTag?: any;
    explicitCharkey?: boolean;
    trim?: boolean;
    attrNameProcessors?: Array<(name: string) => string>;
    attrValueProcessors?: Array<(value: string, name: string) => any>;
    tagNameProcessors?: Array<(name: string) => string>;
    valueProcessors?: Array<(value: string, name: string) => any>;
    charsAsChildren?: boolean;
  }

  export function parseString(
    str: string,
    callback: (err: Error | null, result: any) => void
  ): void;
  export function parseString(
    str: string,
    options: ParserOptions,
    callback: (err: Error | null, result: any) => void
  ): void;
}
