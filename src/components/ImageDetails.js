import React, { useContext, useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import { BookmarkHeart, BookmarkHeartFill } from "react-bootstrap-icons";
import "./ImageDetails.css";
import {
  collection,
  doc,
  setDoc,
  getFirestore,
  arrayUnion,
  arrayRemove,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { UserContext } from "../customHooks/UserContext";
import { CloseButton, Form } from "react-bootstrap";

function ImageDetails({ srcImage, show, onHide }) {
  const { user } = useContext(UserContext);
  const [isSaved, setIsSaved] = useState(false);
  useEffect(() => {
    // Check if the image is already saved when the component mounts
    const checkSavedStatus = async () => {
      try {
        const db = getFirestore();
        const userId = user.uid;
        const imagesRef = doc(collection(db, "images"), userId);
        const docSnapshot = await getDoc(imagesRef);

        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          if (data.saved && data.saved.includes(srcImage)) {
            console.log("checkSavedStatus: Image is already saved");
            setIsSaved(true);
          }
        }
      } catch (error) {
        console.log("Error checking saved status", error);
      }
    };

    checkSavedStatus();
  }, [srcImage]);
  const toggleSave = async () => {
    console.log("Toggle save");
    try {
      const db = getFirestore();
      const userId = user.uid;
      const imagesRef = collection(db, "images");

      if (isSaved) {
        // Remove the image URL from "saved" category
        console.log("Removing image from saved", srcImage);
        await updateDoc(doc(imagesRef, userId), {
          saved: arrayRemove(srcImage),
        });
        setIsSaved(false);
      } else {
        // Add the image URL to "saved" category
        await setDoc(
          doc(imagesRef, userId),
          { saved: arrayUnion(srcImage) },
          { merge: true }
        );
        setIsSaved(true);
      }
    } catch (error) {
      console.log("Error toggling save", error);
    }
  };
  return (
    <>
      <Modal
        size="lg"
        show={show}
        onHide={onHide}
        aria-labelledby="contained-modal-title-vcenter"
        centered
        className="w-100 h-100"
      >
        <Modal.Body className="grid-example">
          <Container>
            <CloseButton className="ml-4 mb-3" onClick={onHide} />

            <Row className="w-100">
              <Col xs={9}>
                {srcImage ? (
                  <div className="image-wrapper-selected mb-3">
                    <img
                      src={srcImage}
                      alt={`Imagen`}
                      className="image-selected w-100"
                      download="image.jpg" // Add this line
                    />
                  </div>
                ) : (
                  "cargando imagen "
                )}
              </Col>

              <Col xs={3}>
                {isSaved ? (
                  <BookmarkHeartFill onClick={toggleSave} className="red h2" />
                ) : (
                  <BookmarkHeart onClick={toggleSave} className="h2" />
                )}
                <Form.Select aria-label="Default select example">
                  <option>Add to library</option>
                  <option value="1">s</option>
                </Form.Select>{" "}
              </Col>
            </Row>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default ImageDetails;
