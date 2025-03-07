# GamersWorld

A symfony web-app made for playing simple games (Tic-Tac-Toe, Rock Paper Scissors etc), either alone in solo mode,
against the machine or even against another player in an online game. It uses Symfony and PHP to manage server
requests, Messenger for handling asynchronous tasks like Mail Dispatching, Mercure for a real time one-way communication
with the server. The files are served through Caddy Server, running FrankenPHP in worker mode.
Since the project uses Static Rendering of We-Pages, vanilla JavaScript is used to add interactivity in some
parts of the website through a very simple Framework, Stimulus. React is also used for more complex systems
and mounted on the DOM through stimulus. All of it run in a Docker Container.

---

## Table of Contents

- [Features](#features)
- [Demo](#demo)
- [Getting Started](#getting-started)
- [Installation](#installation)

---

## Features

- **Symfony Web Application** - Uses Symfony for dynamic rendering of the html content.
- **Responsive Design** - Adapts to different screen sizes (desktop, tablet, mobile).
- **Real-Time Updates** - Real-Time Updates from the server, essential for the PVP game system.
- **Authentication** - Creation and deletion of accounts, Login and modification of personal information
- **Static Rendering** - Ideal for SEO

## Demo

Check out the live demo here: [Live Demo URL](https://games.levynkeneng.dev).

---

## Getting Started

The following instructions will guide you on how to set up and run the project locally.

### Prerequisites

- **Docker Compose** 
- **NodeJS** (version 18 or later)

### Installation

1. Clone the repository:
    ```bash
       git clone https://github.com/LinkNexus/GamersWorld.git
        cd GamersWorld
    ```

2. Run the container:
  ```bash
    docker compose build --no-cache
    docker compose up --pull always -d --wait
  ```

3. Inside the container, run the Fixtures
  ```bash
    docker exec -it << container_id >> /bin/bash
    bin/console doctrine:fixtures:load
  ```

4. Activate Webpack Dev-Server in order to server the JS and CSS files of the front-end
  ```bash
    npm run dev-server
  ```

5. Open your browser and visit [https://localhost](https://localhost) to see the website.

---

# Tech Stack of this Project

- PHP
  - Symfony
  - Frankenphp
- Webpack Encore
- CSS
  - Sass
  - Tailwind
- JavaScript
  - React
  - TypeScript
  - Zustand
  - Flowbite
- Mercure
- Stimulus
- Symfony Ux
  - Live Components
  - Turbo
  - Stimulus
  - Dropzone
  - Symfony Icons
  - Turbo
- Docker