let fs = require("fs");
const http = require("http");
const url = require("url");

// 👇👇👇👇👇👇👇 file :
//  reading synchronous
// const text = fs.readFileSync("./txt/input.txt", "utf-8"); // for better understanding see the nodejs docs
// // console.log(text);

// const textOut = `This is avocado (copy) :${text}`;
// // console.log(textOut);
// fs.writeFileSync("./txt/output.txt", textOut);

//  asynchronous way or non-blockinng

// fs.readFile("./txt/starttttt.txt", "utf-8", (err, data) => {
//   if (err) return console.log("ERROR 💥"); // If any error have found then the function execution will be end here
//   fs.readFile(`./txt/${data}.txt`, "utf-8", (err, data2) => {
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       fs.writeFile("./txt/final.txt", `${data2}\n ${data3}`, "utf-8", (err) => {
//         console.log("Your file has been written 😃");
//       });
//     });
//   });
// });

// 👇👇👇👇👇👇👇 server :

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const perseData = JSON.parse(data);

// In order to build a server we have to do two things

// (1) we create a server than
const server = http.createServer((req, res) => {
  // console.log(req); // it will be printed the option
  // res.end("Hello from the server");

  // Routing:
  const pathName = req.url;

  switch (pathName) {
    case "/":
      res.end("overview");
      break;
    case "/overview":
      res.end("This is overview");
      break;

    case "/product":
      res.end("This is product page");
      break;

    case "/api":
      res.writeHead(200, { "contetn-type": "application/json" });
      res.end(data); // this code will send the json file to the screen
      break;

    default:
      res.writeHead(404, {
        "Content-type": "text/html",
        "my-own-header": "hello world",
      });

      res.end("<h1>Page not found</h1>");
      break;
  }
});
// (2)we start a server
server.listen(8000, "127.0.0.1", () => {
  console.log("server open on 8000:");
});
