import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import API from "../utils/api"; // adjust path if needed

const BookingModal = ({ show, handleClose, turf }) => {
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [bookedSlots, setBookedSlots] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch booked slots
  useEffect(() => {
    const fetchBookedSlots = async () => {
      if (!date) return;
      try {
        const { data } = await API.get(
          `/bookings?date=${date}&turfId=${turf._id}`,
        );
        setBookedSlots(data.map((b) => b.timeSlot));
      } catch (error) {
        console.error("Error fetching booked slots:", error);
      }
    };
    fetchBookedSlots();
  }, [date, turf._id]);

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!date || !timeSlot) {
      setMessage("Please select both date and time slot.");
      return;
    }

    if (isPastSlot(timeSlot)) {
      setMessage("This time slot has already passed.");
      return;
    }

    try {
      setLoading(true);

      await API.post("/bookings", {
        turfId: turf._id,
        date,
        timeSlot,
      });

      setMessage("Booking successful! Check My Bookings.");
      setTimeout(() => {
        setMessage("");
        handleClose();
      }, 2000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Booking failed. Try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isPastSlot = (slotTime) => {
    if (!date) return false;

    const now = new Date();
    const [year, month, day] = date.split("-").map(Number);
    const [startTime] = slotTime.split("-");

    let hours = 0;
    let minutes = 0;

    if (
      startTime.toLowerCase().includes("am") ||
      startTime.toLowerCase().includes("pm")
    ) {
      const isPM = startTime.toLowerCase().includes("pm");
      const num = parseInt(startTime);
      hours = isPM && num !== 12 ? num + 12 : num === 12 && !isPM ? 0 : num;
    } else {
      [hours, minutes] = startTime.split(":").map(Number);
    }

    const slotDateTime = new Date(year, month - 1, day, hours, minutes || 0);
    return slotDateTime <= now;
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Book {turf.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message && <Alert variant="info">{message}</Alert>}

        <Form onSubmit={handleBooking}>
          <Form.Group className="mb-3">
            <Form.Label>Select Date</Form.Label>
            <Form.Control
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Time Slot</Form.Label>
            <Form.Select
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              required
            >
              <option value="">-- Select Slot --</option>

              {turf.availableSlots.map((slot, index) => {
                const isBooked = bookedSlots.includes(slot.time);
                const isPast = isPastSlot(slot.time);

                return (
                  <option
                    key={index}
                    value={slot.time}
                    disabled={isBooked || isPast}
                  >
                    {slot.time}
                    {isBooked ? " (Booked)" : ""}
                    {isPast ? " (Time Passed)" : ""}
                  </option>
                );
              })}
            </Form.Select>
          </Form.Group>

          <Button
            type="submit"
            variant="primary"
            className="w-100"
            disabled={loading}
          >
            {loading ? "Booking..." : "Confirm Booking"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BookingModal;
