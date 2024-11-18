# Online Market Place app

This is a Next.js application that includes user authentication, registration, and state management using Redux. It also features database connectivity with MySQL and uses Prettier for code formatting.

## Getting Started

### Prerequisites

You need to have the following installed on your machine:

- Node.js
- npm (Node Package Manager)
- MySQL

### Installation

1. Clone the repository:

   git clone 
   cd your-project-name
   npm install
   
2. Setup the database:

   - Create a new database in MySQL
   - Create a `.env` file in the root directory of the project
   - Add the following environment variables to the `.env` file:

     DB_HOST=localhost
     DB_USER=root
     DB_NAME=your-database-name
     DB_PASSWORD=your-database-password

   - Run the following command to create the tables in the database:


    CREATE TABLE users (
        user_id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL
    );
     
3. Start the development server:

   npm run dev