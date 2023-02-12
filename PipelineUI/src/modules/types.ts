export interface FormRule {
  type:
    | "isRequired"
    | "isGreaterThan"
    | "isLessThan"
    | "isEqualsTo"
    | "isGreaterThanOrEqualsTo"
    | "isLessThanOrEqualsTo"
    | "isRegex"
    | "isCondition";
  value: any | undefined;
  errorMessage: string | undefined;
}

export interface SelectOption {
  key: any;
  value: string;
  extras?: string;
  hasIcon?: boolean;
  isImage?: boolean;
  isForm?: boolean;
  useSlot?: boolean;
  formField?: {
    type: "text" | "tel" | "select";
    placeholder: string;
    value: string;
    validations: FormRule[];
    customClass: string;
    label: string;
    name: string;
    contentRule?: FormContentRule;
    selectOption?: SelectOption[];
  }[];
}

export interface FormContentRule {
  max: number;
  characterToAdd: string;
  addAfterCount: number;
}

export interface LoaderSetup {
  show: boolean;
  useModal: boolean;
  loading: boolean;
  hasError?: boolean;
  message?: string;
  ctaText?: string;
  ctaFunction?: any;
  icon?: "success" | "error";
  title?: string;
  preventRedirect?: boolean;
}

export interface FetchRule {
  domain: string;
  property: string;
  method: string;
  params: any[];
  requireAuth: boolean;
  // eslint-disable-next-line @typescript-eslint/ban-types
  ignoreProperty: boolean | Function;
  useRouteId: boolean;
  useRouteQuery?: boolean;
  queries?: string[];
}

export interface RouteMiddleware {
  fetchRules: FetchRule[];
}

export interface Pipeline {
  name: string;
  lastActive: string;
  lang: string;
  branches: string;
  status: string;
  color: string;
  uuid: string
}

export interface Build {
  title: string;
  duration: string;
  status: string;
  percentage: string;
  branch: string;
  color: string;
}
