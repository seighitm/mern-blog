import http from "../api/config";

const headers = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

class PostDataService {
  getAll() {
    return http.get("/posts");
  }

  get(id) {
    return http.get(`/posts/${id}`);
  }

  create(data) {
    return http.post("/posts", data, headers(data.get("token")));
  }

  update({ id, data }) {
    return http.put(`/posts/${id}`, data, headers(data.get("token")));
  }

  delete({ id, token }) {
    return http.delete(`/posts/${id}`, headers(token));
  }

  deleteAll(token) {
    return http.delete("/posts", headers(token));
  }

  findByTitle(title) {
    return http.get(`/posts?title=${title}`);
  }

  like(data) {
    return http.patch(`/posts/${data.id}/likePost`, {}, headers(data.token));
  }
}

export default new PostDataService();
