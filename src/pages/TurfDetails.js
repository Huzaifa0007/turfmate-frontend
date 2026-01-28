import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../utils/api";
import { Container, Row, Col, Button, Badge, Carousel } from "react-bootstrap";
import TurfCard from "../components/TurfCard";
import "./TurfDetails.css";
import BookingModal from "../components/BookingModal";

const TurfDetails = () => {
  const { id } = useParams();
  const [turf, setTurf] = useState(null);
  const [relatedTurfs, setRelatedTurfs] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTurf = async () => {
      const res = await API.get(`/turfs/${id}`);
      setTurf(res.data);

      const related = await API.get(`/turfs?city=${res.data.city}`);
      setRelatedTurfs(
        related.data.filter((t) => t._id !== res.data._id).slice(0, 4),
      );
    };

    fetchTurf();
  }, [id]);

  if (!turf) return <p className="text-center mt-5">Loading...</p>;

  return (
    <>
      <Container className="mt-4">
        <Row>
          {/* IMAGE CAROUSEL */}
          <Col md={6}>
            <Carousel className="turf-carousel">
              {turf.images?.map((img, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={img}
                    alt={`turf-${index}`}
                    className="d-block w-100 turf-detail-img h-50"
                  />
                </Carousel.Item>
              ))}
            </Carousel>
            {/* <Carousel>
              {turf.images?.map((img, index) => (
                <Carousel.Item key={index}>
                  <img
                    src={img}
                    alt={`turf-${index}`}
                    className="d-block w-100 turf-detail-img"
                  />
                </Carousel.Item>
              ))}
            </Carousel> */}
          </Col>

          {/* DETAILS */}
          <Col md={6}>
            <h2 className="fw-bold">{turf.name}</h2>

            <Badge bg="warning" text="dark" className="mb-2">
              ⭐ {turf.ratings?.toFixed(1)}
            </Badge>

            <p className="text-muted">
              📍 {turf.location}, {turf.city}
            </p>

            <h4 className="text-success mb-3">₹{turf.pricePerHour} / hour</h4>

            <Button
              variant="success"
              size="lg"
              onClick={() => setShowModal(true)}
            >
              Book Turf
            </Button>

            {/* AMENITIES */}
            <div className="mt-4">
              <h5>Amenities</h5>
              {turf.amenities.map((a, i) => (
                <Badge key={i} bg="secondary" className="me-2 mb-2">
                  {a}
                </Badge>
              ))}
            </div>

            {/* SLOTS */}
            <div className="mt-4">
              <h5>Available Slots</h5>
              {turf.availableSlots.map((slot, i) => (
                <Badge key={i} bg="info" className="me-2 mb-2">
                  {slot.time}
                </Badge>
              ))}
            </div>
          </Col>
        </Row>

        {/* RELATED TURFS */}
        <div className="mt-5">
          <h4>Similar Turfs in {turf.city}</h4>
          <Row className="mt-3">
            {relatedTurfs.map((t) => (
              <Col md={3} key={t._id}>
                <TurfCard turf={t} />
              </Col>
            ))}
          </Row>
        </div>
      </Container>
      {/* BOOKING MODAL */}
      <BookingModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        turf={turf}
      />
    </>
  );
};

export default TurfDetails;
