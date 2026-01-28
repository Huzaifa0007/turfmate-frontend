// src/pages/OwnerDashboard.js
import React, { useEffect, useState } from "react";
import API from "../utils/api";
import {
  Container,
  Table,
  Spinner,
  Alert,
  Tabs,
  Tab,
  Button,
  Badge,
} from "react-bootstrap";

const OwnerDashboard = () => {
  const [turfs, setTurfs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOwnerData = async () => {
      try {
        const [turfsRes, bookingsRes] = await Promise.all([
          API.get("/turfs/my/own"),
          API.get("/bookings/owner"),
        ]);
        setTurfs(turfsRes.data || []);
        setBookings(bookingsRes.data || []);
      } catch (err) {
        console.error("Error loading owner data:", err);
        setError(
          "Failed to load data. Make sure you are logged in as an owner.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerData();
  }, []);

  // ✅ Owner updates booking status (Confirm or Cancel)
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

  if (loading)
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ height: "70vh" }}
      >
        <Spinner animation="border" />
      </Container>
    );

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Owner Dashboard</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Tabs defaultActiveKey="turfs" className="mb-4">
        {/* 🟩 My Turfs Tab */}
        <Tab eventKey="turfs" title={`My Turfs (${turfs.length})`}>
          {turfs.length === 0 ? (
            <p className="text-center mt-3">No turfs added yet.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Turf Name</th>
                  <th>City</th>
                  <th>Price/hr</th>
                  <th>Available Slots</th>
                </tr>
              </thead>
              <tbody>
                {turfs.map((t, i) => (
                  <tr key={t._id}>
                    <td>{i + 1}</td>
                    <td>{t.name}</td>
                    <td>{t.city}</td>
                    <td>₹{t.pricePerHour}</td>
                    <td>{t.availableSlots?.map((s) => s.time).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        {/* 🟦 Bookings for My Turfs Tab */}
        <Tab
          eventKey="bookings"
          title={`Bookings for My Turfs (${bookings.length})`}
        >
          {bookings.length === 0 ? (
            <p className="text-center mt-3">No bookings yet.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Turf</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={b._id}>
                    <td>{i + 1}</td>
                    <td>{b.turf?.name}</td>
                    <td>{b.user?.name}</td>
                    <td>{b.user?.email}</td>
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
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Tab>

        {/* 🟥 Manage Bookings Tab (Owner Actions) */}
        <Tab eventKey="manage" title="Manage Bookings">
          {bookings.length === 0 ? (
            <p className="text-center mt-3">No bookings to manage yet.</p>
          ) : (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Turf</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Date</th>
                  <th>Time Slot</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr key={b._id}>
                    <td>{i + 1}</td>
                    <td>{b.turf?.name}</td>
                    <td>{b.user?.name}</td>
                    <td>{b.user?.email}</td>
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
                            onClick={() =>
                              handleStatusChange(b._id, "Confirmed")
                            }
                            className="me-2"
                          >
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() =>
                              handleStatusChange(b._id, "Cancelled")
                            }
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
          )}
        </Tab>
      </Tabs>
    </Container>
  );
};

export default OwnerDashboard;
