var express = require('express');

const app = express()

var port = 3001

const routedata = require('./route/route.js')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  express.urlencoded({
    extended: true
  })
  next();
});

app.use(express.json())

app.post('/', (req, res) => {
	console.log(req)
})

app.get('/api/checkUser', routedata.checkUser);

app.get('/api/addBuildServer', routedata.addBuildServer);

app.get('/api/checkServerName', routedata.checkServerName);

app.get('/api/getBuildServers', routedata.getBuildServers);

app.get('/api/getPipelines', routedata.getPipelines);

app.get('/api/getPipelineLogs/:pipelineName', routedata.getPipelineLogs);

app.get('/api/getPipelineDetails', routedata.getPipelineDetails);

app.post('/api/addPipelineDetails', routedata.addPipelineDetails);

app.get('/hotels', routedata.getHotels);

app.delete('/api/deleteBuildServer/:name', routedata.deleteBuildServer)

app.delete('/api/deletePipeline/:name', routedata.deletePipeline)

app.get('/api/triggerPipeline/:name', routedata.triggerPipeline)

app.get('/monument', (req, res) => {
	console.log('Api monument')
	res.end(process.env.USERNAME)
})

app.listen(port, () => {
	console.log('Listening on the port ' +port)
})