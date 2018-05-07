# SKSOIL Documentation



### Running for development

`npm start`

### Building for production

`npm run build`

Everything will be in the `/dist` folder


## DreamFactory

URL: http://sksoils.usask.ca/dreamfactory/dist/index.html#/home

We will have the two types of access to the RESTful API.
 
1.    Read-only access for the guest accounts – in this case, you can use:

```X-DreamFactory-Api-Key=c88e24fad8856513273b98fb9751b3cbddd6f73d9e2ef24b92833c2d66587aa9```
 
2.    Normal access for logged on users

```X-DreamFactory-Api-Key= 49342593509fbebab474b225f2ac0237bd5d897d66a1995bd00b3b78b3b8c3e8```



## GeoServer
URL: https://sksoilgis1.usask.ca/geoserver/web/
### Updating Geoserver
1. Download the new GeoServer war (Web Archive) file from the GeoServer Official website
2. Backup (copy somewhere you can access maybe to the home folder) the current GeoServer web application folder and geoserver.war file; they should be under apache tomcat webapps folder
3. Delete current geoserver.war file and geoserver directory from webapps directory
4. Update the web.xml file in the new geoserver.war file using the current web.xml file from the current geoserver folder or geoserver.war file ( I was using win.rar application to update this file). In the web.xml, we configure the geoserver\_data_directory. 
5. We use CSS plugin, so you need to download the same version of this plugin from the geoserver's website. After that, you need to copy all the jar files to the new geoserver.war file's lib folder. I think that you should be notified by you are replacing them. 
6. Copy the new geoserver.war file to webapps folder of apache tomcat 
7. Test the new version

### Troubleshooting GeoServer
Check logs at: ```/home/geoserver/apache-tomcat-8.5.6/logs/catalina.out```

Might want to use: ```tail -1000 /home/geoserver/apache-tomcat-8.5.6/logs/catalina.out``` because the file is huge. 


####Some common error messages and what you should be checking
```
09 Apr 10:34:09 ERROR [storage.DefaultStorageFinder] - 
Found Java environment variable GEOSERVER_DATA_DIR set to /opt/GEOSERVER_DATA, 
but this path does not exist
```
```
Error: Could not find or load main class org.apache.catalina.startup.Bootstrap
```
```
09-Apr-2018 10:33:50.335 SEVERE [main] org.apache.catalina.core.AprLifecycleListener.init An incompatible version 1.1.33 of the APR based Apache Tomcat Native library is installed, while Tomcat requires version 1.2.6
```

Are you running ```./startup.sh``` as sudo?

Is nginx taking up port 80 that Tomcat wants to use? (```sudo lsof -i:80; kill -9 $PID```)

Check the output from ```sudo configtest.sh```.


## Deploy Script Example
```bash
function beta {
    cd /Users/kentwalters/Developer/skangular2

    npm run build

    cd /Users/kentwalters/Developer/skangular2/dist/

    scp ./* kew810@sksoilweb.usask.ca:/var/www/html/sksis-beta

    open https://sksoilweb.usask.ca/sksis-beta

    cd ..
}
```


## VMs

```
sksoildb.usask.ca       database
sksoilweb.usask.ca      web server
sksoils.usask.ca        dreamfactory
sksoilgis1.usask.ca     tile/map server
```

## Contributing Via Git

We use a [git workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow) model

Develop all new features on their own branches. When they are finished, merge them into the 'develop' branch.

Periodically, we merge development with master for a new release.

## New User Signup/API Flow
```RegisterService.register(...)``` posts new user info to DreamFactory.

It'll return something like this: 

``` 
{
_body: 
	"{"session_token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI",
	"host":"sksoils",
	"role":"Admin",
	"role_id":2}", 
	status: 200, 
	ok: true, 
	statusText: "OK", 
	headers: Headers,
}
```
```
u: API_ROLE_TEST
e: api@test.com	
f: API
l: ROLE
p: llllllll
```

### Misc.
[markdown cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

### Tomcat/APR/SSL Info
There are two ways to set Tomcat integrate with APR. One is you can add the following parameter when start up the Tomcat in 
`bin/catalina.sh`

```CATALINA_OPTS="-Djava.library.path=/usr/local/apr/lib"```

The other is to add a new environment variable `LD_LIBRARY_PATH` in `/etc/profile`:

```export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/apr/lib```


### How does the filtering work?
AND is evaluated first, then OR

# Dockerizing SKSIS
## Rationale
Currently, SKSIS runs on four different VMs:
 
```
sksoildb.usask.ca       database
sksoilweb.usask.ca      web server
sksoils.usask.ca        dreamfactory
sksoilgis1.usask.ca     tile/map server
```
To reduce risk of failure when updating the software on one of these VMs safely, we would have to duplicate the whole system so that we can make changes to non-production services.

Starting up, and setting up new VMs is a bit labour intense, prone to failure, and slow. Containers, rather than VMs, seem like a good solution to this problem. Containers can be built entirely from scripts, are much more lightweight, and much faster to start up and tear down for testing purposes. 

Therefore, we're going to move the system from these 4 VMs into containers. We're going to use Docker.

##Process
Rather than try to dockerize this whole thing in one go, which is likely prone to failure, I'm going to do one at a time,
starting from the web server which is probably the easiest. 


