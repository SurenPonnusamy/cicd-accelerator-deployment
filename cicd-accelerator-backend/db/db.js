var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',//'172.18.0.2',
  user     : 'root',//process.env.USERNAME,
  password : 'admin@123',//process.env.PASSWORD,
  database : 'cicd_accelerator'
});

module.exports = {
	
	checkUser: function(username, password, callback) {
		var buff = new Buffer.from(password)
		var encryptedPassword = buff.toString('base64');
		connection.query('select * from userAuthorization where username = "'+username+'" and password = "'+encryptedPassword+'"', function(err, stdout) {
			if(err) {
				console.log(err)
			}
			else {
				if(stdout.length == 1) {					
					//console.log('In db.js')
					callback("Authorized", null)
				}
				else {
					callback(null, "Unauthorized")
				}
			}
		})
		
	},
	addBuildServer:  function(username, password, serverName, serverURL, callback) {
		connection.query('insert into buildServer(username, password, serverName, serverURL) values ("'+username+'", "'+password+'", "'+serverName+'", "'+serverURL+'")', function(err, stdout) {
			if(err) {
				console.log(err)
				callback(null, err)
			}
			else {
				console.log('Inserted into the table')
				var out = serverName + " has been inserted into the table"
				callback(out, null)
				
			}
		})
	},
	checkServerName: function(checkDuplicateServerName, callback) {
		connection.query('select count(*) as count from  buildServer where serverName = "'+checkDuplicateServerName+'"', function(err, stdout) {
			if(err) {
				console.log(err)
				callback(null, err)
			}
			else {
  				if(stdout[0].count > 0) {
					var out = "ServerName "+checkDuplicateServerName+" already existing";
					callback("Exist", null)
				}
				else {
					var out = "ServerName "+checkDuplicateServerName+" does not exist"
					callback("Don't Exist", null)
				}
			}
		})
	},
	
	getBuildServers: function(callback) {
		var servers = []
		var obj = {}
		connection.query('select * from buildServer', function(err, stdout) {
			if(err) {
				console.log(err)
				callback(err, null)
			}
			else {
				//console.log(stdout)
 				for(var i=0;i<stdout.length;i++) {								
					obj = {
						"name": stdout[i].serverName,
						"key": stdout[i].SNo
					}
					servers.push(obj)
				}
				console.log(servers)
				callback((servers), null)
			}
		})
	},
	addPipelineDetails: function(pipelineName, buildServerName, pipelineInputs, callback) {
		//console.log((pipelineInputs.data.pipelineInputs))
 		connection.query("insert into pipelineDetails (buildServer, pipelineName, pipelineInputs) values ('"+buildServerName+"', '"+pipelineName+"', '"+JSON.stringify(pipelineInputs.data.pipelineInputs)+"')", function(err, stdout) {
			if(err) {
				console.log(err)
				callback(null, err)
			}
			else {
				console.log(pipelineName+" has been inserted into pipelineDetails")
				connection.query("select a.username, a.password, a.serverURL from buildServer a, pipelineDetails b where a.serverName = b.buildServer and a.serverName ='"+buildServerName+"'", function(sererr, serout) {
					if(sererr) {
						console.log(sererr)
					}
					else {
						console.log(serout)
						var ser_obj = {
							"buildServerURL": serout[0].serverURL,
							"buildServerUsername": serout[0].username,
							"buildServerPassword": serout[0].password
						}						
						callback(ser_obj, null)
					}
				})
			}
		})
	},
	deleteBuildServer: function(buildServerName, callback) {
 		connection.query("delete from buildServer where serverName='"+buildServerName+"'", function(err, stdout) {
			if(err) {
				console.log(err)
				callback(null, err)
			}
			else {
				console.log(buildServerName+" has been deleted from database")
				callback("Deleted", null)
			}
		})
	},
	deletePipeline: function(pipelineName, callback) {
 		connection.query("delete from pipelineDetails where pipelineName='"+pipelineName+"'", function(err, stdout) {
			if(err) {
				console.log(err)
				callback(null, err)
			}
			else {
				console.log(pipelineName+" has been deleted from database")
				callback("Deleted", null)
			}
		})
	},
	getPipelineInfo: function(pipelineName, callback) {
		console.log('In getPipelineInfo method')
		var pipelineDetails = []
		var obj = {}
		connection.query('select buildServer from pipelineDetails where pipelineName = "'+pipelineName+'"', function(err, data) {
			if(err) {
				console.log(err)
			}
			else {
				var buildServer = data[0].buildServer
				connection.query('select * from buildServer where serverName = "'+buildServer+'"', function(ser_err, ser_data) {
					if(ser_err) {
						console.log(ser_err)
						callback(null, ser_err)
					}
					else {						
						obj = {
							"buildServerUsername": ser_data[0].username,
							"buildServerPassword": ser_data[0].password,
							"buildServerURL": ser_data[0].serverURL,
							"pipelineName": pipelineName
						}						
						callback(obj, err)
					}
				})
			}
		})
	},
	getPipelines: function(callback) {
		var pipelines = []
		var obj = {}
		connection.query('select * from pipelineDetails', function(err, stdout) {
			if(err) {
				console.log(err)
				callback(err, null)
			}
			else {
				console.log(stdout)
 				for(var i=0;i<stdout.length;i++) {								
					obj = {
						"buildServer": stdout[i].buildServer,
						"name": stdout[i].pipelineName,
						"isSuccess": stdout[i].isSuccess,
						"id": stdout[i].SNo
					}
					pipelines.push(obj)
				}
				console.log(pipelines)
				callback((pipelines), null)
			}
		})		
	},
	getPipelineLogs: function(pipelineName, callback) {
		var obj = {}
		//console.log('select * from pipelineDetails where pipelineName = "'+pipelineName+'"')
		connection.query('select * from pipelineDetails where pipelineName = "'+pipelineName+'"', function(err, stdout) {
			if(err) {
				console.log(err)
				callback(err, null)
			}
			else {
				console.log(stdout)
 				var buildServer = stdout[0].buildServer				
				connection.query('select * from buildServer where serverName ="'+buildServer+'"', function(sererr, serout) {
					if(sererr) {
						console.log(sererr)
						callback(sererr, null)
					}
					else {
						var buildServerURL = serout[0].serverURL
						var buildServerUsername = serout[0].username
						var buildServerPassword = serout[0].password
						obj = {
							"buildSeverURL": buildServerURL,
							"pipelineName": pipelineName,
							"buildServerUsername": buildServerUsername,
							"buildServerPassword": buildServerPassword							
						}
						//console.log("Inside db.js", obj);
						callback(obj, null)
					}
				})
			}
		})		
	},
	triggerPipeline: function(pipelineName, callback) {
		var obj = {}
		//console.log('select * from pipelineDetails where pipelineName = "'+pipelineName+'"')
		connection.query('select * from pipelineDetails where pipelineName = "'+pipelineName+'"', function(err, stdout) {
			if(err) {
				console.log(err)
				callback(err, null)
			}
			else {
				//console.log(stdout)
 				var buildServer = stdout[0].buildServer
				var pipelineInputs = stdout[0].pipelineInputs
				connection.query('select * from buildServer where serverName ="'+buildServer+'"', function(sererr, serout) {
					if(sererr) {
						console.log(sererr)
						callback(sererr, null)
					}
					else {
						var buildServerURL = serout[0].serverURL
						var buildServerUsername = serout[0].username
						var buildServerPassword = serout[0].password
						obj = {
							"buildSeverURL": buildServerURL,
							"pipelineName": pipelineName,
							"buildServerUsername": buildServerUsername,
							"buildServerPassword": buildServerPassword,
							"pipelineInputs": JSON.parse(pipelineInputs)
						}
						//console.log(obj);
						callback(obj, null)
					}
				})
			}
		})		
	}
	
}