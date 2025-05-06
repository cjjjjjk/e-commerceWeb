const express = require("express");
const multer = require("multer");
const FormData = require("form-data");
const axios = require("axios");

const router = express.Router();
const upload = multer(); 

const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID;

router.post("", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No image file uploaded" });
    }

    const form = new FormData();
    form.append("image", req.file.buffer.toString("base64"));

    const response = await axios.post("https://api.imgur.com/3/image", form, {
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
        ...form.getHeaders(),
      },
    });

    res.status(200).json(response.data.data);
  } catch (error) {
    console.error("Imgur upload error:", error.message);
    res.status(500).json({ error: "Failed to upload image to Imgur" });
  }
});

router.delete("/:deleteHash", async (req, res) => {
  const { deleteHash } = req.params;

  try {
    await axios.delete(`https://api.imgur.com/3/image/${deleteHash}`, {
      headers: {
        Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
      },
    });

    res.status(200).json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.error("Imgur delete error:", error.message);
    res.status(500).json({ error: "Failed to delete image from Imgur" });
  }
});


module.exports = router;
