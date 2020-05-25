# Fantastic-Telegram

**Speed Test ISP with db storage.**

I don't know about you about you but I really like monitoring my bandwidth. So, I've created this tool that allows for watching it over time.

As configured, it will connect to speedtest.net and run a test every 15 minutes, on the quarter hours.

## How To Run This Project

### Prerequisite Installs

-   NodeJS
-   MongoDB
-   Git

#### Startup Process - \*nix/MacOS terminal

1. Clone Repo

```SHELL
	git clone https://github.com/adamfarver/fantastic-telegram.git
```

2. cd into cloned directory

```SHELL
	cd ./fantastic-telegram
```

3. Install Depenencies via NPM

```SHELL
	npm install
```

4. Start MongoDB service

```SHELL
	mongod
```

5. Start Server-Side

```SHELL
	npm index.js
```

6. Start Front-End

```SHELL
	npm start
```

At this point, the front end will open in your default browser at http://localhost:8080. To access from other devices on your network, you will just need to replace localhost with the IP address of the server.
