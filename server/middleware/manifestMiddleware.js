// Serve the manifest file
app.get("/images/site.webmanifest", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.sendFile(path.join(__dirname, "../client/images/site.webmanifest"));
  });