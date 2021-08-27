import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Modal } from "react-bootstrap";
import { createPost } from "../store/actions/postActions";
import { ReactComponent as CloseIcon } from "../assets/close.svg";
import AddEditForm from "../components/AddEditForm";

const AddPost = ({ onHide }) => {
  const { getIdTokenClaims } = useAuth0();
  const dispatch = useDispatch();
  const [file, setFile] = useState(null);

  const initialPostState = {
    title: "",
    description: "",
  };

  const [submitted, setSubmitted] = useState(false);
  const [post, setPost] = useState(initialPostState);

  const newPost = () => {
    setPost(initialPostState);
    setSubmitted(false);
  };

  const savePost = async () => {
    const { title, description } = post;
    const token = await getIdTokenClaims();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("token", token.__raw);
    formData.append("img", file);

    dispatch(createPost(formData))
      .then((data) => {
        setSubmitted(true);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          Add new post
        </Modal.Title>
        <CloseIcon className="icon" onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <div className="submit-form">
          {submitted ? (
            <div>
              <h4>You submitted successfully!</h4>
              <Button className="me-3 mt-2 btn btn-sm" onClick={newPost}>
                Add
              </Button>
            </div>
          ) : (
            <div>
              <AddEditForm post={post} setPost={setPost} setFile={setFile}/>
              <Button onClick={savePost} className="me-3 mt-2 btn btn-sm">
                Submit
              </Button>
            </div>
          )}
        </div>
      </Modal.Body>
    </>
  );
};

export default AddPost;
