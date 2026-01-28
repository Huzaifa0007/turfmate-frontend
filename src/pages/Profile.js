import React, { useEffect, useState } from "react";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Spinner,
} from "react-bootstrap";
import API from "../utils/api";

const Profile = () => {
  // ✅ initialize from localStorage only once
  const [userInfo, setUserInfo] = useState(() =>
    JSON.parse(localStorage.getItem("userInfo")),
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ fetch profile only if logged in
  useEffect(() => {
    if (!userInfo || !userInfo.token) return;

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await API.get("/users/profile", {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        });
        setName(data.name || "");
        setEmail(data.email || "");
      } catch (error) {
        console.error("Profile fetch failed:", error);
        setMessage("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userInfo]);

  // ✅ handle profile update
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!userInfo || !userInfo.token) {
      setMessage("User not authenticated");
      return;
    }

    try {
      setLoading(true);
      const { data } = await API.put(
        "/users/profile",
        { name, email, password },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      // ✅ update localStorage and state
      localStorage.setItem("userInfo", JSON.stringify(data));
      setUserInfo(data);

      setMessage("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      setMessage("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // ✅ simple loading spinner
  if (loading)
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );

  // ✅ redirect hint (optional)
  if (!userInfo) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Alert variant="warning">
          You are not logged in. Please sign in to access your profile.
        </Alert>
      </Container>
    );
  }

  return (
    <div className="page-wrapper">
      <Container className="mt-4 mb-5">
        <Row className="justify-content-md-center">
          <Col md={6}>
            <h2 className="text-center mb-4">My Profile</h2>

            {message && <Alert variant="info">{message}</Alert>}

            <Form onSubmit={handleUpdate}>
              <Form.Group controlId="name" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId="password" className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  placeholder="Leave blank to keep current password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              <Button type="submit" variant="primary" className="w-100">
                Update Profile
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
