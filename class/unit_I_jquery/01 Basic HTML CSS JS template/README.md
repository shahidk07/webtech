# code explaination and file structure
we create three files
index.html, script.js, and style.css

## index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <script src="./jquery-3.7.1.min.js"></script>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <section id="main">
        <div class="container">
            <h1 id="heading">Hello World</h1>
            <button id="btn">Click Me</button>
            <p id="demo">This is a paragraph.</p>
        </div>
    </section>

    <script src="script.js"></script>
</body>
</html>
```

## script.js
```javascript
console.clear();
console.log("Hello World! from script.js");
```

## style.css
```css
*{
    color:white;
    background-color:black;
    padding:1em;
}

```

## Dev environment
Softwares required
- firefox
- vscode or vscodium
- vscode extension, live server

> For easy development and testing we will use firefox and vscode/vscodium, you can install these softwares.

> You also need to install `liveserver` extension in vscode
