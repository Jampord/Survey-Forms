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
    password: yup
      .string()
      .required("Password is required.")
      .min(8, "Password must be at least 8 characters.")
      .max(20, "Password must be at most 20 characters.")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]+$/,
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
      ),
    roleId: yup.object().required("Please choose role."),
    departmentId: yup.object().required("Please choose role."),
  }),
  defaultValues: {
    fullName: "",
    userName: "",
    password: "",
    roleId: null,
    departmentId: null,
  },
};

export const rolesYup = {
  schema: yup.object({
    roleName: yup
      .string()
      .required("Enter role name.")
      .max(15, "Max characters exceeded."),
  }),
  defaultValues: { roleName: "" },
};

export const departmentsYup = {
  schema: yup.object({
    departmentName: yup
      .string()
      .required("Enter department name.")
      .max(30, "Max characters exceeded."),
  }),
  defaultValues: { departmentName: "" },
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
  }),
  defaultValues: { groupName: "" },
};

export const categoriesYup = {
  schema: yup.object({
    categoryName: yup
      .string()
      .required("Enter category name.")
      .max(30, "Max characters exceeded."),

    categoryPercentage: yup
      .number("Only input numbers")
      .required("Enter category percentage")
      .max(100, "Max input exceeded."),
  }),
  defaultValues: { categoryName: "", categoryPercentage: "" },
};
