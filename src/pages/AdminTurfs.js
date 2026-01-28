import React, { useState, useEffect } from "react";
import API from "../utils/api";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Alert,
  Table,
  Spinner,
} from "react-bootstrap";

const AdminTurfs = () => {
  const [turfs, setTurfs] = useState([]);
  const [owners, setOwners] = useState([]);
  const [ownerId, setOwnerId] = useState("");
  const [editingTurf, setEditingTurf] = useState(null);

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [amenities, setAmenities] = useState("");
  const [availableSlots, setAvailableSlots] = useState("");
  const [images, setImages] = useState([]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTurfs();
    fetchOwners();
  }, []);

  useEffect(() => {
    if (!editingTurf) return;

    setName(editingTurf.name);
    setLocation(editingTurf.location);
    setCity(editingTurf.city);
    setPricePerHour(editingTurf.pricePerHour);
    setAmenities(editingTurf.amenities.join(", "));
    setAvailableSlots(editingTurf.availableSlots.map((s) => s.time).join(", "));
    setOwnerId(editingTurf.owner?._id || "");
    setImages([]); // important
  }, [editingTurf]);

  const resetForm = () => {
    setName("");
    setLocation("");
    setCity("");
    setPricePerHour("");
    setAmenities("");
    setAvailableSlots("");
    setImages([]);
    setOwnerId("");
    setEditingTurf(null);
  };

  const fetchTurfs = async () => {
    const res = await API.get("/turfs");
    setTurfs(res.data);
  };

  const fetchOwners = async () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const res = await API.get("/users", {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });
    setOwners(res.data);
  };

  // ✅ MULTIPLE FILE HANDLING (FIXED)
  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("name", name);
    fd.append("location", location);
    fd.append("city", city);
    fd.append("pricePerHour", pricePerHour);
    fd.append("amenities", amenities);
    fd.append("availableSlots", availableSlots);
    fd.append("ownerId", ownerId);

    images.forEach((file) => {
      fd.append("images", file); // VERY IMPORTANT
    });

    return fd;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const formData = buildFormData();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const res = editingTurf
        ? await API.put(`/turfs/${editingTurf._id}`, formData, config)
        : await API.post("/turfs", formData, config);

      if (editingTurf) {
        setTurfs((prev) =>
          prev.map((t) => (t._id === res.data.turf._id ? res.data.turf : t)),
        );
        setMessage("Turf updated successfully");
      } else {
        setTurfs((prev) => [...prev, res.data.turf]);
        setMessage("Turf added successfully");
      }

      resetForm();
    } catch (err) {
      console.error(err);
      setMessage("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTurf = async (id) => {
    if (!window.confirm("Delete this turf?")) return;

    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    await API.delete(`/turfs/${id}`, {
      headers: { Authorization: `Bearer ${userInfo.token}` },
    });

    setTurfs((prev) => prev.filter((t) => t._id !== id));
    setMessage("Turf deleted");
  };

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Admin — Manage Turfs</h2>
      {message && <Alert variant="info">{message}</Alert>}

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Turf Name</Form.Label>
              <Form.Control
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Assign Owner</Form.Label>
              <Form.Select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                required
              >
                <option value="">Select Owner</option>
                {owners.map((o) => (
                  <option key={o._id} value={o._id}>
                    {o.name} ({o.email})
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Price / Hour</Form.Label>
              <Form.Control
                type="number"
                value={pricePerHour}
                onChange={(e) => setPricePerHour(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Amenities</Form.Label>
              <Form.Control
                value={amenities}
                onChange={(e) => setAmenities(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Available Slots</Form.Label>
              <Form.Control
                value={availableSlots}
                onChange={(e) => setAvailableSlots(e.target.value)}
              />
            </Form.Group>

            {/* ✅ MULTIPLE IMAGE INPUT */}
            <Form.Group className="mb-3">
              <Form.Label>Upload Images (Multiple)</Form.Label>
              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit" disabled={loading}>
          {loading ? (
            <Spinner size="sm" />
          ) : editingTurf ? (
            "Update Turf"
          ) : (
            "Add Turf"
          )}
        </Button>

        {editingTurf && (
          <Button variant="secondary" className="ms-2" onClick={resetForm}>
            Cancel
          </Button>
        )}
      </Form>

      <h4 className="mt-5">Existing Turfs</h4>
      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>City</th>
            <th>Price</th>
            <th>Images</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {turfs.map((t, i) => (
            <tr key={t._id}>
              <td>{i + 1}</td>
              <td>{t.name}</td>
              <td>{t.city}</td>
              <td>₹{t.pricePerHour}</td>
              <td>
                {t.images?.length > 0 &&
                  t.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt=""
                      style={{ width: 40, height: 30, marginRight: 5 }}
                    />
                  ))}
              </td>
              <td>
                <Button
                  size="sm"
                  variant="warning"
                  onClick={() => setEditingTurf(t)}
                >
                  Edit
                </Button>{" "}
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleDeleteTurf(t._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminTurfs;
