import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaLinkedinIn } from "react-icons/fa";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="py-5">
          {/* Brand */}
          <Col md={4}>
            <h4 className="footer-brand">TurfMate</h4>
            <p className="footer-desc">
              Book sports turfs instantly with real-time availability,
              transparent pricing, and zero hassle.
            </p>

            <div className="social-icons">
              <FaInstagram />
              <FaFacebookF />
              <FaLinkedinIn />
            </div>

            <div className="app-buttons">
              <a target="_blank" rel="noopener noreferrer">
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt="App Store"
                  className="store-badge"
                />
              </a>

              <a target="_blank" rel="noopener noreferrer">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt="Google Play"
                  className="store-badge"
                />
              </a>
            </div>
          </Col>

          {/* Links */}
          <Col md={4}>
            <h6 className="footer-title">Quick Links</h6>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </Col>

          {/* Contact */}
          <Col md={4}>
            <h6 className="footer-title">Support</h6>
            <p>Mumbai, India</p>
            <p>support@turfmate.com</p>
            <p>Mon – Sat | 9 AM – 9 PM</p>
          </Col>
        </Row>

        <Row className="footer-bottom text-center">
          <Col>
            <strong>© 2026 TurfMate.</strong> All rights reserved.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
