import React, { useEffect, useState } from "react";
import API from "../utils/api";
import TurfCard from "../components/TurfCard";
import { Row, Col, Form, Container } from "react-bootstrap";

const Home = () => {
  const [turfs, setTurfs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const cities = [...new Set(turfs.map((t) => t.city))];

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const res = await API.get("/turfs");
        setTurfs(res.data);
      } catch (error) {
        console.error("Error fetching turfs:", error);
      }
    };
    fetchTurfs();
  }, []);

  // ✅ Filter by name, location, or city
  const filteredTurfs = turfs.filter((turf) => {
    const matchesSearch = `${turf.name} ${turf.location} ${turf.city}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesCity = selectedCity === "" || turf.city === selectedCity;

    const matchesPrice =
      priceRange === "" ||
      (priceRange === "below500" && turf.pricePerHour < 500) ||
      (priceRange === "500-1000" &&
        turf.pricePerHour >= 500 &&
        turf.pricePerHour <= 1000) ||
      (priceRange === "1000-1500" &&
        turf.pricePerHour > 1000 &&
        turf.pricePerHour <= 1500) ||
      (priceRange === "1500-2000" &&
        turf.pricePerHour > 1500 &&
        turf.pricePerHour <= 2000) ||
      (priceRange === "2000-2500" &&
        turf.pricePerHour > 2000 &&
        turf.pricePerHour <= 2500) ||
      (priceRange === "above2500" && turf.pricePerHour > 2500);

    return matchesSearch && matchesCity && matchesPrice;
  });

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Available Turfs</h2>

      {/* 🔍 Search Bar */}
      {/* 🔍 Search & Filters */}
      <Form className="mb-4">
        <Row className="g-3 align-items-end">
          {/* Search */}
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-semibold">Search Turf</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by turf name, location, or city"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>

          {/* City Filter */}
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-semibold">City</Form.Label>
              <Form.Select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">All Cities</option>
                {cities.map((city, i) => (
                  <option key={i} value={city}>
                    {city}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          {/* Price Filter */}
          <Col md={3}>
            <Form.Group>
              <Form.Label className="fw-semibold">
                Price Range (per hour)
              </Form.Label>
              <Form.Select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                <option value="">All Prices</option>
                <option value="below500">Below ₹500</option>
                <option value="500-1000">₹500 - ₹1000</option>
                <option value="1000-1500">₹1000 - ₹1500</option>
                <option value="1500-2000">₹1500 - ₹2000</option>
                <option value="2000-2500">₹2000 - ₹2500</option>
                <option value="above2500">Above ₹2500</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Form>

      <Row>
        {filteredTurfs.length > 0 ? (
          filteredTurfs.map((turf) => (
            <Col md={4} key={turf._id} className="mb-4">
              <TurfCard turf={turf} />
            </Col>
          ))
        ) : (
          <p className="text-center">No turfs found.</p>
        )}
      </Row>
    </Container>
  );
};

export default Home;
