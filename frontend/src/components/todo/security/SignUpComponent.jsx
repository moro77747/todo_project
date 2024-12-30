import React from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { signUp } from "../api/TodoService";

const SignUpComponent = () => {
  const navigate = useNavigate();
  const validate = Yup.object({
    username: Yup.string().required("username Required!"),

    email: Yup.string().email("Email is invalid!").required("Email Required!"),
    password: Yup.string()
      .min(4, "Password must be minimum 4 digits!")
      .required("Password Required!"),
  });

  return (
    <div>
      <Formik
        initialValues={{
          username: "",
          email: "",
          password: "",
          phoneNum: "",
          roles: "user",
        }}
        validationSchema={validate}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            console.log("Submitting values:", values);
            // consider the empty value
            const processedValues = {
              ...values,
              email: values.email.trim() === "" ? null : values.email,
              phoneNum: values.phoneNum.trim() === "" ? null : values.phoneNum,
            };
            const result = await signUp(processedValues);
            // Show success alert
            alert("Signup successful!");
            navigate("/login");
            console.log("Signup result:", result);
          } catch (error) {
            // Show error message
            alert("Signup failed. Please try again.");
            console.error("Signup error:", error);
          }
          setSubmitting(false);
        }}
      >
        {() => (
          <div>
            <h1 className="">Signup</h1>
            <Form
              className="form p-3"
              // onSubmit={(values) => {
              //   values.preventDefault();
              //   console.log(values.email);
              //   signUp(
              //     values.username,
              //     values.email,
              //     values.password,
              //     values.phoneNum
              //   );
              // }}
            >
              {/* <fieldset className="form-group"> */}
              <label>username</label>
              <Field className="form-control" type="text" name="username" />
              {/* </fieldset> */}
              {/* <fieldset className="form-group"> */}
              <label>email</label>
              <Field className="form-control" type="text" name="email" />
              {/* </fieldset> */}
              {/* <fieldset className="form-group"> */}
              <label>password</label>
              <Field className="form-control" type="password" name="password" />
              {/* </fieldset> */}
              {/* <fieldset className="form-group"> */}
              <label>phoneNumber</label>
              <Field className="form-control" type="text" name="phoneNum" />
              {/* </fieldset> */}

              <button className="btn btn-dark m-3" type="submit">
                Register
              </button>
              <button className="btn btn-primary m-3" type="reset">
                Reset
              </button>
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
};

export default SignUpComponent;
