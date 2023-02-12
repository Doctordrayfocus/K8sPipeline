import { FormRule } from "@/modules/types";

export default class Form {
  constructor() {
    // initiate things here
  }

  public RequiredRule: FormRule = {
    type: "isRequired",
    errorMessage: "",
    value: 0,
  };

  public EmailRule: FormRule = {
    type: "isRegex",
    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    errorMessage: "Email must be valid",
  };

  public PasswordRule: FormRule = {
    type: "isRegex",
    value: /^(?=.*\d)(?=.*[a-z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,30}$/,
    errorMessage:
      "Password must contain at least 8 characters that includes alphabets, symbols and numbers",
  };

  public handleConfirmPassword = (
    password: string,
    comfirm_password: string
  ) => {
    const rule: FormRule = {
      type: "isCondition",
      value: password == comfirm_password,
      errorMessage: "Do not match password",
    };
    return rule;
  };

  public handleIsNumber = (value: string) => {
    const rule: FormRule = {
      type: "isCondition",
      value: !isNaN(parseInt(value)),
      errorMessage: "Must be a number",
    };

    return rule;
  };

  public customValidator = (condition: boolean, errorMessage: string) => {
    const rule: FormRule = {
      type: "isCondition",
      value: condition,
      errorMessage,
    };

    return rule;
  };

  public getPhoneNumber = (phoneCode: string, phoneInput: string) => {
    let realPhone = phoneInput.trim();

    if (realPhone.charAt(0) == "0") {
      realPhone = realPhone.substring(1);
    }
    const stringWithoutCharacter = (phoneCode + realPhone).replace(
      /[^\d.-]/g,
      ""
    );
    return stringWithoutCharacter;
  };
}
