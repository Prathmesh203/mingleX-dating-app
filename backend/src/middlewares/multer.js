import multer from "multer";

// ✅ Store files in memory instead of disk
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // max 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only .jpeg, .jpg, .png, .webp files are allowed"));
    }
    cb(null, true);
  },
});

export default upload;
