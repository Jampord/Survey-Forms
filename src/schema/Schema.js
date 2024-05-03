import * as yup from "yup";

export const usersYup = {
  schema: yup.object({
    fullName: yup
      .string()
      .required("Please enter full name.")
      .max(50, "Max characters exceeded."),
    userName: yup
      .string()
      .required("Please enter username.")
      .min(2)
      .max(30, "Max characters exceeded."),
    // password: yup
    //   .string()
    //   .required("Password is required.")
    //   .min(8, "Password must be at least 8 characters.")
    //   .max(20, "Password must be at most 20 characters.")
    //   .matches(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/,
    //     "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    //   ),

    roleId: yup.object().required("Please choose role."),

    departmentId: yup.object().required("Please choose department."),

    groupsId: yup.object().required("Please choose group."),
  }),
  defaultValues: {
    fullName: "",
    userName: "",
    password: "",
    roleId: null,
    departmentId: null,
    groupsId: null,
  },
};

export const usersEditYup = {
  schema: yup.object({
    fullName: yup
      .string()
      .required("Please enter full name.")
      .max(50, "Max characters exceeded."),
    userName: yup
      .string()
      .required("Please enter username.")
      .min(2)
      .max(30, "Max characters exceeded."),
    // password: yup
    //   .string()
    //   .required("Password is required.")
    //   .min(8, "Password must be at least 8 characters.")
    //   .max(20, "Password must be at most 20 characters.")
    //   .matches(
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/,
    //     "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    //   ),

    roleId: yup.object().required("Please choose role."),

    departmentId: yup.object().required("Please choose department."),
    groupsId: yup.object().required("Please choose group."),
  }),
  defaultValues: {
    fullName: "",
    userName: "",
    roleId: null,
    departmentId: null,
    groupsId: null,
  },
};

export const rolesYup = {
  schema: yup.object({
    roleName: yup
      .string()
      .required("Enter role name.")
      .max(15, "Max characters exceeded."),
    permission: yup.array(),
  }),
  defaultValues: { roleName: "", permission: [] },
};

export const departmentsYup = {
  schema: yup.object({
    departmentName: yup
      .string()
      .required("Enter department name.")
      .max(30, "Max characters exceeded."),
    departmentNo: yup
      .number()
      .typeError("Enter department no.")
      .required("Enter department number.")
      .max(99999, "Max number exceeded."),
  }),

  defaultValues: { departmentName: "", departmentNo: "" },
};

export const branchesYup = {
  schema: yup.object({
    branchName: yup
      .string()
      .required("Enter branch name.")
      .max(30, "Max characters exceeded."),
    branchCode: yup
      .string()
      .required("Enter branch code.")
      .max(30, "Max characters exceeded."),
  }),
  defaultValues: { branchName: "", branchCode: "" },
};

export const groupsYup = {
  schema: yup.object({
    groupName: yup
      .string()
      .required("Enter group name.")
      .max(30, "Max characters exceeded."),

    branchId: yup.object().required("Please choose branch."),
  }),
  defaultValues: { groupName: "", branchId: null },
};

export const categoriesYup = {
  schema: yup.object({
    categoryName: yup
      .string()
      .required("Enter category name.")
      .max(30, "Max characters exceeded."),

    categoryPercentage: yup
      .number()
      .typeError("Enter category percentage")
      .required("Enter category percentage")
      .max(100, "Max input exceeded.")
      .min(1, "Input should be greater than 0"),

    limit: yup
      .number()
      .typeError("Enter score limit")
      .required("Enter score limit.")
      .max(100, "Score limit is 100")
      .min(1, "Score limit should be greater than 0"),
  }),
  defaultValues: { categoryName: "", categoryPercentage: "", limit: 1 },
};

export const loginYup = {
  schema: yup.object({
    userName: yup.string().required("Enter username."),
    password: yup.string().required("Enter password."),
  }),
  defaultValues: { userName: "", password: "" },
};

export const changePasswordYup = {
  schema: yup.object({
    password: yup.string().required("Enter password"),
    newPassword: yup.string().required("Enter password"),
    confirmPassword: yup.string().required("Enter password"),
  }),
  defaultValues: { password: "", newPassword: "", confirmPassword: "" },
};

export const groupSurveyYup = {
  schema: yup.object({
    groupsId: yup.object().required("Please choose group."),
  }),
  defaultValues: { groupsId: null, score: null },
};
