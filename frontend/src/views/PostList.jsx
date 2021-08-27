import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Container, Row, Col, Modal, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import {
  retrievePosts,
  findPostsByTitle,
  deleteAllPosts,
  likePost,
  deletePost,
} from "../store/actions/postActions";
import { ReactComponent as DeleteIcon } from "../assets/delete.svg";
import { ReactComponent as LikeIcon } from "../assets/like.svg";
import Post from "./Post";
import AddPost from "./AddPost";

const PostsList = (props) => {
  const dispatch = useDispatch();

  const posts = useSelector((state) => state.posts);

  const [searchTitle, setSearchTitle] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [currentPost, setCurrentPost] = useState({});
  const [typeModal, setTypeModal] = useState("0");

  const { user, getIdTokenClaims } = useAuth0();

  const getToken = async () => {
    token = await getIdTokenClaims();
  };
  let token = getToken();

  const onChangeSearchTitle = (e) => {
    const searchTitle = e.target.value;
    setSearchTitle(searchTitle);
  };

  const findByTitle = () => {
    dispatch(findPostsByTitle(searchTitle));
  };

  const handleLike = ({ id, token }) => {
    dispatch(likePost({ id, token }));
  };

  useEffect(() => {
    dispatch(retrievePosts());
  }, [dispatch]);

  const removeAllPosts = (token) => {
    dispatch(deleteAllPosts(token))
      .then((response) => {
        dispatch(retrievePosts());
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const removePost = ({ id, token }) => {
    dispatch(deletePost({ id, token }))
      .then(() => {
        props.history.push("/posts");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleOpenModal = (post, type) => {
    setModalShow(true);
    setCurrentPost(post);
    setTypeModal(type);
  };

  const handleCloseModal = () => {
    setModalShow(false);
  };

  return (
    <div className="list row d-flex align-items-center">
      <div className="col-md-12">
        <Container>
          <Row>
            <Col xs={6} className="d-flex align-items-center">
              <input
                type="text"
                className="form-control"
                placeholder="Search by title"
                value={searchTitle}
                onChange={onChangeSearchTitle}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={findByTitle}
                >
                  Search
                </button>
              </div>
            </Col>
            <Col
              xs={6}
              className="d-flex align-items-center justify-content-center"
            >
              <Button
                variant="primary"
                className="m-3 btn btn-sm"
                onClick={() => removeAllPosts(token.__raw)}
              >
                Remove all my posts
              </Button>
              <Button
                variant="warning"
                className="m-3 btn btn-sm"
                onClick={() => handleOpenModal({}, "add")}
              >
                Add new post
              </Button>
            </Col>
          </Row>
          <Row>
            {posts &&
              posts.map((post) => (
                <Col
                  className="mt-2"
                  key={post.title}
                  xs={12}
                  sm={12}
                  md={6}
                  lg={3}
                >
                  <Card style={{ width: "17rem" }}>
                    {post.image && (
                      <div
                        onClick={() => handleOpenModal(post, "edit")}
                        className="img-hover-zoom"
                      >
                        <Card.Img
                          variant="top"
                          src={`http://localhost:8000/${post.image}`}
                        />
                      </div>
                    )}
                    <Card.Body>
                      <Card.Title>{post.title}</Card.Title>
                      <hr />
                      <div>
                        <div>
                          <label>
                            <strong>Description:</strong>
                          </label>{" "}
                          {post.description}
                        </div>
                        <div>
                          <label>
                            <strong>User:</strong>
                          </label>{" "}
                          {post.creator && post.creator.split("@")[0]}
                        </div>
                      </div>
                      <div className="d-flex justify-content-between mt-2">
                        <div>
                          <LikeIcon
                            onClick={() =>
                              handleLike({ id: post.id, token: token.__raw })
                            }
                            className={
                              post.likes.includes(user.email)
                                ? "icon redIcon"
                                : "icon greyIcon"
                            }
                          />
                          {post.likes.length !== 0 && (
                            <div className="heartIcon">{post.likes.length}</div>
                          )}
                        </div>
                        {post.creator === user.email && (
                          <DeleteIcon
                            className="icon deleteIcon"
                            onClick={() =>
                              removePost({ id: post.id, token: token.__raw })
                            }
                          />
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
          </Row>
        </Container>
        <Modal
          show={modalShow}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
          onHide={handleCloseModal}
        >
          {typeModal === "edit" ? (
            <Post
              creator={user.email}
              onHide={handleCloseModal}
              post={currentPost}
            />
          ) : typeModal === "add" ? (
            <AddPost onHide={handleCloseModal} />
          ) : (
            ""
          )}
        </Modal>
      </div>
    </div>
  );
};

export default PostsList;
