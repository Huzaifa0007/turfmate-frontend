import React, { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BookingModal from "./BookingModal";
import "./TurfCard.css";

const TurfCard = ({ turf }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Card
        className="turf-card h-100"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/turfs/${turf._id}`)}
      >
        {/* Turf Image */}
        {turf.images?.length > 0 && (
          <Card.Img
            variant="top"
            src={turf.images[0]}
            style={{ height: "200px", objectFit: "cover" }}
          />
        )}

        <Card.Body className="d-flex flex-column">
          {/* Turf Name */}
          <Card.Title className="fw-bold">{turf.name}</Card.Title>

          {/* City + Rating */}
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted">📍 {turf.city}</span>
            <Badge bg="warning" text="dark">
              ⭐ {turf.ratings?.toFixed(1)}
            </Badge>
          </div>

          {/* Price */}
          <Card.Text className="mb-3">
            <strong>₹{turf.pricePerHour}</strong> / hour
          </Card.Text>

          {/* CTA */}
          <Button
            variant="success"
            className="mt-auto"
            onClick={(e) => {
              e.stopPropagation(); // ✅ VERY IMPORTANT
              setShowModal(true);
            }}
          >
            Book Turf
          </Button>
        </Card.Body>
      </Card>

      {/* Booking Modal */}
      <BookingModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        turf={turf}
      />
    </>
  );
};

export default TurfCard;
