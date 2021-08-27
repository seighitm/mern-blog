import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Button, Image, Modal } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import {
  updatePost,
  deletePost,
  retrievePosts,
} from "../store/actions/postActions";
import { ReactComponent as CloseIcon } from "../assets/close.svg";
import AddEditForm from "../components/AddEditForm";

const Post = (props) => {
  const dispatch = useDispatch();
  const { getIdTokenClaims } = useAuth0();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [currentPost, setCurrentPost] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);

  const handleChangeIsEdit = () => {
    setIsEditMode(!isEditMode);
  };

  const getToken = async () => {
    token = await getIdTokenClaims();
  };
  let token = getToken();

  useEffect(() => {
    setCurrentPost(props.post);
  }, [props.post]);

  const updateContent = async () => {
    const formData = new FormData();
    formData.append("title", currentPost.title);
    formData.append("description", currentPost.description);
    formData.append("token", token.__raw);
    formData.append("currentImg", currentPost.image);
    formData.append("img", file);

    dispatch(updatePost({ id: currentPost.id, data: formData }))
      .then((response) => {
        dispatch(retrievePosts());
        props.onHide();
        setMessage("The post was updated successfully!");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const removePost = ({ id, token }) => {
    dispatch(deletePost({ id, token }))
      .then(() => {
        props.onHide();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          {props.post.title}
        </Modal.Title>
        <CloseIcon className="icon" onClick={props.onHide} />
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="edit-form">
            {props.post.image && (
              <Image
                src={`http://localhost:8000/${props.post.image}`}
                className="img-fluid"
              />
            )}
            {props.post.creator === props.creator && isEditMode ? (
              <>
                <AddEditForm post={currentPost} setPost={setCurrentPost} setFile={setFile}/>
                <Button
                  className="me-3 mt-2 btn btn-sm"
                  variant="danger"
                  onClick={() =>
                    removePost({ id: currentPost.id, token: token.__raw })
                  }
                >
                  Delete
                </Button>
                <Button
                  type="submit"
                  variant="warning"
                  className="mt-2 btn btn-sm"
                  onClick={updateContent}
                >
                  Update
                </Button>
                <p>{message}</p>
              </>
            ) : (
              <>
                <div>
                  <label>
                    <strong>Description:</strong>
                  </label>{" "}
                  {props.post.description}
                </div>
                <div>
                  <label>
                    <strong>User:</strong>
                  </label>{" "}
                  {props.post.creator.split("@")[0]}
                </div>
                {props.post.creator === props.creator &&
                <Button
                    className="me-3 mt-2 btn btn-sm"
                    onClick={handleChangeIsEdit}
                >
                  EDIT
                </Button>}
              </>
            )}
          </div>
        </div>
      </Modal.Body>
    </>
  );
};

export default Post;
