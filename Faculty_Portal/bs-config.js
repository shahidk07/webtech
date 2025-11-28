// bs-config.js
module.exports = {
    // Proxy your running Express server (on port 4000)
    proxy: "http://localhost:4000",
    // Watch these files for changes to trigger a browser reload
    files: ["./frontend/*.html", "./public/**/*.css", "./public/**/*.js"],
    // Optionally, prevent it from automatically opening a browser window
    open: false 
};