import React, { useState } from "react";
import "./reviewModal.css";
import { Modal, Button, Form } from "react-bootstrap";
import { FaStar } from "react-icons/fa";

const ReviewModal = ({ showModal, handleClose, handleSubmit }) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState("1");

  const handleReviewTextChange = (e) => {
    setReviewText(e.target.value);
  };
  const submitReview = () => {
    if (reviewText && rating) {
      handleSubmit(reviewText, rating);
      handleClose();
    } else {
      alert("Vui lòng nhập đầy đủ thông tin.");
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      size="lg"
      // dialogClassName="modal-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center p-1 p-sm-3 fs-res-1 fw-bold">
          Đánh giá sản phẩm
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="reviewText" className="p-1 p-sm-3">
            <Form.Label className="text-center pb-1 pb-sm-3 fw-bold fs-res">
              Nhận xét:
            </Form.Label>
            <Form.Control
              className="fs-res"
              as="textarea"
              rows={4}
              value={reviewText}
              onChange={handleReviewTextChange}
              placeholder="Viết đánh giá của bạn..."
            />
          </Form.Group>
          <Form.Group controlId="rating">
            <div className="d-flex flex-row p-1 p-sm-3 gap-3 gap-sm-5">
              <Form.Label className="text-center fs-res fw-bold">
                Đánh giá:
              </Form.Label>
              <div>
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className="star-icon"
                    style={{ cursor: "pointer", marginRight: 5 }}
                    color={star <= parseInt(rating) ? "#ffc107" : "#e4e5e9"}
                    onClick={() => setRating(star.toString())}
                  />
                ))}
              </div>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          size="lg"
          className="responsive-btn"
          onClick={handleClose}
        >
          Đóng
        </Button>
        <Button
          variant="primary"
          size="lg"
          className="responsive-btn"
          onClick={submitReview}
        >
          Gửi đánh giá
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ReviewModal;
