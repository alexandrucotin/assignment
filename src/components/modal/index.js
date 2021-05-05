import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

export default function CustomModal({ handleModal, anagrafica, modalOpen }) {
  return (
    <Modal show={modalOpen}>
      <Modal.Header closeButton>
        <Modal.Title>
          Ciao {anagrafica.name} {anagrafica.lastName}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>Vuoi vedere la tua posizione attuale?</div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="danger"
          onClick={() => {
            handleModal({ choice: false });
          }}
        >
          Annulla
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            handleModal({ choice: true });
          }}
        >
          Continua
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
