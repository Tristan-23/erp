const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const createFileIfNotExists = (filePath, content) => {
  if (!fs.existsSync(filePath)) {
    console.log(`I have created a new file here: ${filePath}`);
    fs.writeFileSync(filePath, content, { encoding: "utf8", flag: "wx" });
  }
};

const createFilesForPage = (pageBaseName) => {
  const htmlFileName = `${pageBaseName}.html`;
  const cssFileName = `${pageBaseName}.css`;
  const jsFileName = `cl_${pageBaseName}.js`;

  const publicPath = path.join(__dirname, "../../public");
  const htmlFilePath = path.join(publicPath, "html", htmlFileName);
  const cssFilePath = path.join(publicPath, "css", cssFileName);
  const jsFilePath = path.join(publicPath, "js", jsFileName);

  createFileIfNotExists(
    htmlFilePath,
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="css/${cssFileName}">
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
      />
      <title>${pageBaseName}</title>
      <link rel="icon" href="../images/${pageBaseName}.png" type="image/png" />
    </head>
    <body>
      <h1>Welcome to ${pageBaseName}</h1>
      <p>This is a generated page</p>
      <script src="js/${jsFileName}"></script>
    </body>
    </html>
  `
  );

  createFileIfNotExists(
    cssFilePath,
    `
    * {
      margin: 0;
      padding: 0;
      border: 0;
      outline: 0;
      list-style: none;
      font-family: "Maax-Regular";
      text-decoration: none;
      color: black;
      cursor: auto;
    }

    @font-face {
      font-family: "Maax-Regular";
      src: url(../fonts/maax-regular.woff2);
    }
    @font-face {
      font-family: "Maax-Medium";
      src: url(../fonts/maax-medium.woff2);
    }
    @font-face {
      font-family: "Maax-Bold";
      src: url(../fonts/maax-bold.woff2);
    }

    body {
      width: 100%;
      height: 100vh;
    }
  `
  );

  createFileIfNotExists(
    jsFilePath,
    `
    const baseUrl = "http://127.0.0.1:5000";
    const advancedUrl = baseUrl + "/${pageBaseName}/";

    document.addEventListener('DOMContentLoaded', function() {
      console.log('${pageBaseName} loaded');
      console.log(advancedUrl)
    });
  `
  );
};

rl.question("Enter the base name for the page: ", (pageBaseName) => {
  createFilesForPage(pageBaseName);
  rl.close();
});
