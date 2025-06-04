// server.mjs
import { createServer } from "node:http";

let users = [
  { id: 1, name: "Juan" },
  { id: 2, name: "María" },
];

const server = createServer((req, res) => {
  if (req.method === "GET" && req.url === "/users") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(users));
  }

  if (req.method === "POST" && req.url === "/users") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const newUser = JSON.parse(body);
      newUser.id = users.length + 1;
      users.push(newUser);
      res.writeHead(201, { "Content-Type": "application/json" });
      res.end(JSON.stringify(newUser));
    });
  }

  if (req.method === "PUT" && req.url === "/users") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      const updatedUser = JSON.parse(body);
      const index = users.findIndex((user) => user.id === updatedUser.id);
      if (index !== -1) {
        users[index] = updatedUser;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(updatedUser));
      } else {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "User not found" }));
      }
    });
  }

  if (req.method === "DELETE" && req.url.startsWith("/users/")) {
    const arrayUrl = req.url.split("/");
    console.log(`arrayUrl: ${arrayUrl}`);
    
    const userId = parseInt(arrayUrl[2]);
    const index = users.findIndex((user) => user.id === userId);
    if (index !== -1) {
      users.splice(index, 1);
      res.writeHead(204);
      res.end();
    } else {
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "User not found" }));
    }
  }
  
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello World!\n");
  }
});

// starts a simple http server locally on port 3000
server.listen(3000, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1:3000");
});

// run with `node server.mjs`
