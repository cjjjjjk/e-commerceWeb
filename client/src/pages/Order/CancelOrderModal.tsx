import React from "react";
import "./cancelModal.css";
import { Modal, Button } from "react-bootstrap";

interface CancelOrderModalProps {
  show: boolean;
  handleClose: () => void;
  handleConfirm: () => void;
}

const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  show,
  handleClose,
  handleConfirm,
}) => {
  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
      dialogClassName="modal-lg"
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-center p-1 p-sm-3 fs-res-1 fw-bold">
          Xác nhận hủy đơn
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="p-1 p-sm-3 fs-res fw-semibold">
          Bạn có chắc muốn hủy đơn hàng không?
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          size="lg"
          className="responsive-btn"
          onClick={handleClose}
        >
          Không
        </Button>
        <Button
          variant="danger"
          size="lg"
          className="responsive-btn"
          onClick={handleConfirm}
        >
          Có, hủy đơn
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CancelOrderModal;
