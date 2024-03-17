export interface ResponseithCodeCaseContents<ContentsShape> {
  code: number;
  case: string;
  contents: ContentsShape;
}

export interface ErrorWithCodeCaseReasons<ErrorReasons> {
  code: number;
  case: string;
  reasons: ErrorReasons;
}
