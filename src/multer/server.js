/*
* 将上传的图片存储到后端服务
* 1.npm install express multer
* 2.npm install cors
* 3.配置 server.js
* 4.图片保存的位置path.join('src', 'image')
* */
const express = require('express');
const cors = require('cors')
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = 3000;

// 配置 multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join('src', 'image')); // 指定存储目录
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // 使用原文件名
    }
});
const upload = multer({ storage: storage });

app.use(cors({
    origin: 'http://localhost:8080' // Allow this origin to access the server
}));

// 文件上传路由
app.post('/upload', upload.single('file'), (req, res) => {
    res.json({ message: 'File uploaded successfully', file: req.file });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
