import React, { useState } from "react";
import { Card, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import BookingModal from "./BookingModal";
import "./TurfCard.css";

const TurfCard = ({ turf }) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // ✅ Cloudinary optimized image
  const imageUrl =
    turf.images?.length > 0
      ? turf.images[0].replace(
          "/upload/",
          "/upload/w_400,h_250,c_fill,q_auto,f_auto/",
        )
      : "https://via.placeholder.com/400x250?text=Turf";

  return (
    <>
      <Card
        className="turf-card h-100"
        style={{ cursor: "pointer" }}
        onClick={() => navigate(`/turfs/${turf._id}`)}
      >
        {/* Turf Image */}
        <Card.Img
          variant="top"
          src={imageUrl}
          loading="lazy" // ✅ LAZY LOAD
          style={{ height: "200px", objectFit: "cover" }}
          alt={turf.name}
        />

        <Card.Body className="d-flex flex-column">
          <Card.Title className="fw-bold">{turf.name}</Card.Title>

          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted">📍 {turf.city}</span>
            <Badge bg="warning" text="dark">
              ⭐ {turf.ratings?.toFixed(1) || "4.0"}
            </Badge>
          </div>

          <Card.Text className="mb-3">
            <strong>₹{turf.pricePerHour}</strong> / hour
          </Card.Text>

          <Button
            variant="success"
            className="mt-auto"
            onClick={(e) => {
              e.stopPropagation();
              setShowModal(true);
            }}
          >
            Book Turf
          </Button>
        </Card.Body>
      </Card>

      <BookingModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        turf={turf}
      />
    </>
  );
};

export default TurfCard;
