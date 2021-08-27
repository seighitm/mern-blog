import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { Container } from "react-bootstrap";
import Home from "../views/Home";
import ProtectedRoute from "../auth/ProtectedRoute";
import PostsList from "../views/PostList";
import AddPost from "../views/AddPost";
import Post from "../views/Post";
import Profile from "../views/Profile";

const protectedRoutes = [
  { path: "/posts", component: PostsList },
  { path: "/addPost", component: AddPost },
  { path: "/posts/:id", component: Post },
  { path: "/profile", component: Profile },
];

const AppRouter = () => (
  <Container>
    <Switch>
      <Route path="/" exact component={Home} />
      {protectedRoutes.map((route) => (
        <ProtectedRoute
          key={route.path}
          path={route.path}
          exact
          component={route.component}
        />
      ))}
      <Redirect to="/" />
    </Switch>
  </Container>
);

export default AppRouter;
