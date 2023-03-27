const express = require("express");
const https = require("https");
const app = express();
const port = 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization,X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PATCH, PUT, DELETE"
  );
  res.header("Allow", "GET, POST, PATCH, OPTIONS, PUT, DELETE");
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});


app.get("/tableData", async (req, res) => {
  https
    .get(
      "https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json",
      (result) => {
        let list = [];
        result.on("data", (chunk) => {
          list.push(chunk);
        });
        result.on("end", () => {
          const data = JSON.parse(Buffer.concat(list).toString());
          res.send(data);
        });
      }
    )
    .on("error", (err) => {
      res.send(err.message);
    });
});

function getThumbnailsUrl(id) {
  let ThumbnailsUrl = `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/thumbnails/`;
  if (id < 10) ThumbnailsUrl += `00${id}.png`;
  else if (id < 100) ThumbnailsUrl += `0${id}.png`;
  return ThumbnailsUrl;
}
function getImageUrl(id) {
  let url = `https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/`;
  if (id < 10) url += `00${id}.png`;
  else if (id < 100) url += `0${id}.png`;
  return url;
}

app.get("/images", (req, res) => {
  let data = [];
  for (let index = 1; index < 809; index++) {
    data.push(getImageUrl(index));
  }
  res.send(data);
});
app.get("/thumbnails", (req, res) => {
  let data = [];
  for (let index = 1; index < 809; index++) {
    data.push(getThumbnailsUrl(index));
  }
  res.send(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
