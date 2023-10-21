import { db } from "../db.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const q = req.query.cat
    ? "SELECT * FROM posts WHERE cat=?"
    : "SELECT * FROM posts";
  db.query(q, [req.query.cat], (err, data) => {
    if (err) return res.status(500).send(err);
    return res.status(200).json(data);
  });
};

export const getPost = (req, res) => {
  const q =
    "SELECT posts.id, users.username, posts.title, posts.desc, posts.img, posts.cat, posts.date FROM posts JOIN users ON users.id = posts.uid WHERE posts.id = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data[0]);
  });
};

export const addPost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");
  
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    
    const q =
      "INSERT INTO posts(`title`, `desc`, `img`, `cat`, `date`,`uid`) VALUES (?, ?, ?, ?, ?, ?)";
    
    const values = [
      req.body.title,
      req.body.desc,
      req.body.img, // Assuming img is the correct URL
      req.body.cat,
      req.body.date,
      userInfo.id,
    ];
    
    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been created.");
    });
  });
};

export const deletePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");
    const postId = req.params.id;
    const q = "DELETE FROM posts WHERE `id` = ? AND `uid` = ?";
    db.query(q, [postId, userInfo.id], (err, data) => {
      if (err) return res.status(403).json("You can delete only your post!");
      return res.json("Post has been deleted!");
    });
  });
};

export const updatePost = (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");
  jwt.verify(token, "jwtkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const postId = req.params.id;
    const { title, desc, img, cat, date } = req.body;

    let q;
    let values;

    if (img) {
      // If img is provided, update it along with other details
      q = "UPDATE posts SET `title`=?, `desc`=?, `img`=?, `cat`=?, `date`=? WHERE `id` = ? AND `uid` = ?";
      values = [title, desc, img, cat, date, postId, userInfo.id];
    } else {
      // If img is not provided, update other details but keep the existing img value
      q = "UPDATE posts SET `title`=?, `desc`=?, `cat`=?, `date`=? WHERE `id` = ? AND `uid` = ?";
      values = [title, desc, cat, date, postId, userInfo.id];
    }

    db.query(q, values, (err, data) => {
      if (err) return res.status(500).json(err);
      return res.json("Post has been updated.");
    });
  });
};