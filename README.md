# Inventory Management System - Background Task Server

This project is a dedicated server for handling background tasks for the inventory management system. It leverages Bull, a Node.js library for managing distributed jobs and message queues, and Redis for job storage.


## Features

- **Background Task Management**: Efficient handling of background tasks such as updating promotions and processing orders.
- **Job Queue with Bull**: Utilize Bull for robust job scheduling and processing.
- **Redis for Storage**: Use Redis to store and manage job data efficiently.

## Technologies Used

- **Node.js**: JavaScript runtime for building server-side applications.
- **Bull**: A Node.js library for handling distributed jobs and messages.
- **Redis**: In-memory data structure store used as a database, cache, and message broker.
- **Express**: Minimalist web framework for setting up a RESTful API.
- **Sequelize**: Promise-based Node.js ORM for Postgres, MySQL, MariaDB, SQLite, and Microsoft SQL Server.
- **TypeScript**: Adds static types to JavaScript for a better development experience.

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- Redis server

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd inventory-server
npm install
