import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const AboutUs = () => {
  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="mb-4 text-center">About TurfMate</h2>

          <p>
            TurfMate is a modern sports venue booking platform designed to make
            turf discovery and booking fast, simple, and reliable.
          </p>

          <p>
            Whether you're planning a casual game with friends or a competitive
            match, TurfMate helps you find the best turfs around you with
            transparent pricing and real-time availability.
          </p>

          <p>
            Our goal is to eliminate the hassle of phone calls and manual
            bookings by bringing everything online — so you can focus on the
            game, not the logistics.
          </p>

          <p className="fw-semibold">
            Play more. Stress less. That’s TurfMate.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutUs;
