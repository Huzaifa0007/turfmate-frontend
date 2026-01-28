import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Contact = () => {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="mb-4 text-center">Contact Us</h2>

          <p className="text-center">
            Have questions, feedback, or partnership ideas? We’d love to hear
            from you.
          </p>

          <div className="mt-4">
            <p>
              <strong>Email:</strong> support@turfmate.com
            </p>
            <p>
              <strong>Location:</strong> Mumbai, India
            </p>
            <p>
              <strong>Support Hours:</strong> 9 AM – 9 PM (Mon–Sat)
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;
