import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { signUp } from "../api/TodoService";

const SignUpComponent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const onFinish = async (values) => {
    setLoading(true);
    try {
      console.log("Submitting values:", values);
      // Process empty values for optional fields
      const processedValues = {
        ...values,
        email: values.email?.trim() || null,
        phoneNum: values.phoneNum?.trim() || null,
      };
      const result = await signUp(processedValues);
      alert("Signup successful!"); // Alert success
      navigate("/login");
      console.log("Signup result:", result);
    } catch (error) {
      alert("Signup failed. Please try again."); // Alert failure
      console.error("Signup error:", error);
    }
    setLoading(false);
  };

  // Handle form submission failure
  const onFinishFailed = (errorInfo) => {
    const errorMessages = errorInfo.errorFields
      .map((field) => `${field.name[0]}: ${field.errors[0]}`)
      .join("\n");
    alert(
      `Validation failed! Please fix the following errors:\n${errorMessages}`
    ); // Alert validation errors
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h1>Signup</h1>
      <Form
        layout="vertical"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          username: "",
          email: "",
          password: "",
          phoneNum: "",
        }}
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: "Username is required!" }]}
        >
          <Input placeholder="Enter your username" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required!" },
            { type: "email", message: "Email is invalid!" },
          ]}
        >
          <Input placeholder="Enter your email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Password is required!" },
            { min: 4, message: "Password must be at least 4 characters!" },
          ]}
        >
          <Input.Password placeholder="Enter your password" />
        </Form.Item>

        <Form.Item label="Phone Number" name="phoneNum">
          <Input placeholder="Enter your phone number (optional)" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ marginRight: "10px" }}
          >
            Register
          </Button>
          <Button htmlType="reset">Reset</Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default SignUpComponent;
