import React, { useState, useEffect } from "react";
import { Image, Input, Button, Avatar } from "antd";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useHistory } from "react-router-dom";
import "./styles.css";
import Form from "antd/lib/form/Form";
import FormItem from "antd/lib/form/FormItem";

const Profile = () => {
  const token = localStorage.getItem("token");
  const decodedToken = jwt_decode(token);
  const [image, setImage] = useState("");
  const [imageURL, setImageURL] = useState("");
  const history = useHistory();

  const onSubmit = async () => {
    const body = new FormData();
    body.append("image", image);
    await axios.patch("http://localhost:5000/profile", body, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    loadProfile();
  };

  const loadProfile = async () => {
    try {
      const res = await axios.get("http://localhost:5000/profile", {
        headers: {
          authorization: `Bearer ${token}`,
        },
      });
      setImageURL(res.data.image);
    } catch (err) {
      alert("User not found");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    if (!token) {
      history.push("/login");
    }
  }, []);

  return (
    <div className="profile">
      <Avatar
        src={`http://localhost:5000/${imageURL}`}
        shape="circle"
        size={120}
      ></Avatar>
      <p className="text">{decodedToken.username}</p>
      <Form onFinish={onSubmit}>
        <FormItem>
          <Input
            onChange={(event) => {
              setImage(event.target.files[0]);
            }}
            type="file"
            accept="image/png,image/jpeg"
          />
        </FormItem>
        <FormItem>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </FormItem>
      </Form>
    </div>
  );
};

export default Profile;
