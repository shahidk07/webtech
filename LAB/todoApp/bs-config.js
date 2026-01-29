// Configure browser-sync to work with nodemon and proxy the server
module.exports = {
    // 1. Proxy your existing Node.js server running on port 5000 (from terminal output)
    proxy: "http://localhost:5000",
    
    // 2. Browser-Sync will run on port 3001
    port: 3001, 

    // 3. Files to watch for changes (live reload)
    files: [
        // Watch your HTML files
        "./frontend/**/*.html", 
        // Watch your CSS files (in the TODO_LIST static path)
        "./frontend/TODO_LIST/**/*.css", 
        // Watch your JavaScript files (in the TODO_LIST static path)
        "./frontend/TODO_LIST/**/*.js"
    ],

    // 4. Configuration for how browser-sync should interact with the proxy
    // This ensures the live-reload script is injected into the HTML.
    snippetOptions: {
        rule: {
            match: /<\/body>/i,
            fn: function (snippet, match) {
                return snippet + match;
            }
        }
    },

    // 5. Open a new browser window automatically on start
    open: true, 

    // 6. Suppress logging for cleaner terminal output
    logFileChanges: true
};