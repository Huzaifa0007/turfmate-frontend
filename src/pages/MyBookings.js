import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col, Spinner, Alert } from "react-bootstrap";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await API.get("/bookings/mybookings", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setBookings(data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo) fetchBookings();
  }, [userInfo]);

  if (loading)
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );

  // ✅ Filter out bookings for deleted turfs
  const validBookings = bookings.filter((b) => b.turf);
  const hasPendingBooking = validBookings.some(
    (booking) => booking.status === "Pending",
  );

  return (
    <Container className="page-container">
      <h2 className="text-center mb-4">My Bookings</h2>
      {hasPendingBooking && (
        <Alert variant="info" className="text-center">
          ⏳ <strong>Booking under review</strong>
          <br />
          Some of your bookings are currently <b>Pending</b>. Once the turf
          owner approves them, the status will change to <b>Confirmed</b>.
        </Alert>
      )}
      {validBookings.length === 0 ? (
        <p className="text-center">You have no bookings yet.</p>
      ) : (
        <Row>
          {validBookings.map((booking) => (
            <Col md={4} key={booking._id} className="mb-4">
              <Card className="shadow-sm">
                {booking.turf?.images && booking.turf.images.length > 0 && (
                  <Card.Img
                    variant="top"
                    src={booking.turf.images[0]}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body>
                  <Card.Title>{booking.turf?.name}</Card.Title>
                  <Card.Text>
                    <strong>📍 Location:</strong> {booking.turf?.location},{" "}
                    {booking.turf?.city}
                    <br />
                    <strong>📅 Date:</strong> {booking.date}
                    <br />
                    <strong>⏰ Time Slot:</strong> {booking.timeSlot}
                    <br />
                    <strong>💰 Price/hour:</strong> ₹
                    {booking.turf?.pricePerHour}
                    <br />
                    <strong>Status:</strong>{" "}
                    <span
                      className={
                        booking.status === "Confirmed"
                          ? "text-success"
                          : booking.status === "Cancelled"
                            ? "text-danger"
                            : "text-warning"
                      }
                    >
                      {booking.status}
                    </span>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default MyBookings;
