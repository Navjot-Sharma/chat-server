const express = require('express');
const path = require('path');

const router = express();

router.get("", (req, res) => {
  res.status(200).sendFile(path.resolve('./views/index.html'));
});

module.exports = router;