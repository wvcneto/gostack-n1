const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// Middlewares

function checkProjectId(request, response, next) {
  const projectId = request.params.id;

  if(!isUuid(projectId)) {
    return response.status(400).json({ error: 'Invalid Project ID.' });
  }

  return next();
}

app.use('/repositories/:id', checkProjectId);

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs} = request.body;

  const project = {id: uuid(), title, url, techs, likes: 0};

  repositories.push(project);

  return response.status(201).json(project);

});

app.put("/repositories/:id", checkProjectId, (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0){
    return response.status(400).json({error: 'Project Not Found!'});
  }

  const project = { id, title, url, techs, likes: repositories[projectIndex].likes };

  repositories[projectIndex] = project;

  return response.status(200).json(project);

});

app.delete("/repositories/:id", checkProjectId, (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0){
    return response.status(400).json({error: 'Project Not Found!'});
  }

  repositories.splice(projectIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", checkProjectId, (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(project => project.id === id);

  if (projectIndex < 0){
    return response.status(400).json({error: 'Project Not Found!'});
  }
  
  repositories[projectIndex].likes++;

  return response.status(200).json(repositories[projectIndex]);
});

module.exports = app;
