// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import API from "../utils/api"; // ✅ use the configured axios instance
import { Table, Button, Badge, Container } from "react-bootstrap";

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Use API instead of axios directly
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/bookings");
        setBookings(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // ✅ Update Booking Status
  const handleStatusChange = async (id, newStatus) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const res = await API.put(`/bookings/${id}/status`, {
        status: newStatus,
      });
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)),
      );
      alert(`Booking ${newStatus} successfully!`);
    } catch (error) {
      console.error("Error updating status:", error);
      alert("Failed to update booking status.");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center">Admin Dashboard — Manage Bookings</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Turf</th>
            <th>Date</th>
            <th>Time Slot</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b, index) => (
            <tr key={b._id}>
              <td>{index + 1}</td>
              <td>{b.user?.name || "N/A"}</td>
              <td>{b.turf?.name || "N/A"}</td>
              <td>{b.date}</td>
              <td>{b.timeSlot}</td>
              <td>
                <Badge
                  bg={
                    b.status === "Confirmed"
                      ? "success"
                      : b.status === "Cancelled"
                        ? "danger"
                        : "warning"
                  }
                >
                  {b.status}
                </Badge>
              </td>
              <td>
                {b.status === "Pending" ? (
                  <>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleStatusChange(b._id, "Confirmed")}
                      className="me-2"
                    >
                      Confirm
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleStatusChange(b._id, "Cancelled")}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <span className="text-muted">No Action</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminDashboard;
