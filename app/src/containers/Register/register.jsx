import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import "./styles.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const onSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/register", {
        username,
        password,
      });
      history.push("/login");
    } catch (err) {
      alert("User already exists");
    }
  };

  return (
    <div className="form">
      <Form name="RegisterForm" onFinish={onSubmit}>
        <Form.Item label="Username">
          <Input
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item label="Password">
          <Input.Password
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register
          </Button>
        </Form.Item>
      </Form>
      <Link to="/login">
        <Button type="link">Already have an account</Button>
      </Link>
    </div>
  );
};

export default Register;
