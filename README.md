# Readme file

Run 'npm install' to install required dependencies

How to dump the database:
	1. Open command prompt (Windows X -> command prompt)
	2. Type "mysqldump -u root -p map_data > db_backup.sql"
	3. Enter your password
	4. The backup file can be found in the student folder

How to restore a database:
	1. Open MYSQL Command Line
	2. Type: "create database map_data;"
	3. Locate the dump file and copy the path
	4. Type: "source *path backup file*"
	5. For example: "source C:\Users\Students\db_backup.sql"

General structure:
	- If you make a new ejs-file (html), put it in the views folder and make a link to it in app.js (using angular routes).
	- If you make a new controller, call it ...Controller.js and put it in the controllers folder. Create a <script> tag for it in index.ejs for it to work.
	- If you use a lot of app.get or app.post commands in maps-server.js that belong together, put them in a separate Javascript file and require it in maps-server.js (for example how I did with cookies.js).

For the Heroku deployment to work correctly, we need at least the following:
	- A start script in package.json. This is "node maps-server.js" and should not be changed. If you rename maps-server.js for whatever reason, don't forget to change it there as well.
	- ejs-files instead of html files. These are exactly the same as html-files (in terms of syntax) but the extension is .ejs instead of .html.
	- The http.listen(process.env.PORT || 5000) command in maps-server.js. The examples we worked with so far used a fixed port like 3000, but Heroku won't like that. This command tells Heroku to use whatever port they want to use, or use 5000 when we run it locally. This also means you have to navigate to localhost:5000 instead of localhost:3000.
If either of these requirements are not met, the Heroku deployment will fail and you will make me very angry >:(

Only the code in the master branch will be deployed to Heroku; any other branch will be ignored. The URL of our app is https://amazing-maps-app.herokuapp.com