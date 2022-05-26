# Meta-Chat-App MERN

# Abstract:
 When working remotely as part of a globally disbursed crew, we should have a collaborative surroundings. Chat packages play a vital position in supporting us stay related. In assessment to e-mail, chat applications offer fast, real-time communications with colleagues around the globe. Furthermore, through chat applications we can create communities to interact with for many purpose such as Gaming, Educational Purposes, and for Competitions etc. We have created a web based chatting application where users can create communities with their friends, can talk, and send links to join the room. The access link will be shared via email using Simple Mail Transfer Protocol where users can join room, users will communicate via Socket programming(Web Sockets),  Additional feature can be file Transfer using File Transfer Protocol.

# SYSTEM REQUIREMENTS:
 The system requirements are divided into mainly two parts

# Functional Requirements:
 The functional requirements of Web based chatting application are:

• Sign Up: The user will sign up the account by entering details.
• Login: The user will be logged in by using Email and Password, the authorization will be done from the backend.
• Get User Info:  The User can get his Information from the User Avatar button.
• Search Users: The User can search other users through the search bar.
• Create Single Chats (One-on-One):  The user can create a single chat (Private Room) by searching the user and can chat with them.
• Create Group Chats:  The user can create a group chat (Public Room) by searching the user, entering chat group name with users greater or equal than 3.
• Update Group Chats: The user can add, remove, rename, and leave the group chat.
• Send Messages: The user can send the real time messages to other users.
• Send Email : Email is sent to users who are added in group chat
• Send Files: File links will be shared and they are uploaded on cloudinary and user can access them from there.

# Non-Functional Requirements:
 The non-functional requirements of Web based chatting application are:

• Usability: The user interface is designed by considering the ease of user. It is a friendly and interactive interface.
• Performance: Socket.io is used to increase the performance of Chat app.
• Security: JWB and Bcrypt is used to store the passwords of users in encrypted format in Database.

# ARCHITECTURE DESIGN:
 MVC is used as the architecture pattern.
 
# Tech:
 The technology used to build the site are

• MySql DataBase
• React JS
• Chakra UI
• Node JS
• Express JS

# Link:
 https://mern-meta-chat.herokuapp.com/