import React from "react";
import { Card } from "react-bootstrap";
import "./SkeletonCard.css";

const SkeletonCard = () => {
  return (
    <Card className="h-100 skeleton-card">
      <div className="skeleton-img" />
      <Card.Body>
        <div className="skeleton-title" />
        <div className="skeleton-text" />
        <div className="skeleton-btn" />
      </Card.Body>
    </Card>
  );
};

export default SkeletonCard;
