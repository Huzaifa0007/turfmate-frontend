import React, { useEffect, useState } from "react";
import API from "../utils/api";
import TurfCard from "../components/TurfCard";
import { Row, Col, Form, Container, Button } from "react-bootstrap";
import SkeletonCard from "../components/SkeletonCard";

const ITEMS_PER_LOAD = 6;

const Home = () => {
  const [turfs, setTurfs] = useState([]);
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_LOAD);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [loading, setLoading] = useState(true);

  const cities = [...new Set(turfs.map((t) => t.city))];

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        setLoading(true);
        const res = await API.get("/turfs");
        setTurfs(res.data);
      } catch (error) {
        console.error("Error fetching turfs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTurfs();
  }, []);

  // Reset visible count when filters/search change
  useEffect(() => {
    setVisibleCount(ITEMS_PER_LOAD);
  }, [searchTerm, selectedCity, priceRange]);

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

  const visibleTurfs = filteredTurfs.slice(0, visibleCount);

  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Available Turfs</h2>

      {/* Filters */}
      <Form className="mb-4">
        <Row className="g-3 align-items-end">
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
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Col md={4} key={i} className="mb-4">
              <SkeletonCard />
            </Col>
          ))
        ) : visibleTurfs.length > 0 ? (
          visibleTurfs.map((turf) => (
            <Col md={4} key={turf._id} className="mb-4">
              <TurfCard turf={turf} />
            </Col>
          ))
        ) : (
          <p className="text-center">No turfs found.</p>
        )}
      </Row>

      {/* Load More */}
      {visibleCount < filteredTurfs.length && (
        <div className="text-center mt-4">
          <Button
            variant="outline-primary"
            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_LOAD)}
          >
            Load More
          </Button>
        </div>
      )}
    </Container>
  );
};

export default Home;
