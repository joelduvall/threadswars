# Thread Wars - A Meta Threads Clone
A [Meta Threads](https://threads.net) clone to showcase implmentations on multiple platforms. **This is very early in imlemention**.

The first implementations is using NextJS, NestJS, and MongoDB. It uses [Shadcn](https://ui.shadcn.com) and [Clerk](https://www.clerk.com) libriaries to speed up the first iteration. The Authentication/Authorization implementation will move away for Clerk eventually.

## Project Setup and Debugging Guide

This document provides a comprehensive guide on how to build and debug the project, which consists of a frontend built with Next.js, a backend powered by NestJS, and MongoDB and Azure Storage for data storage.

### Prerequisites

Before you start, ensure you have the following installed:

- Docker, I recommend [Docker Desktop](https://www.docker.com/products/docker-desktop/) (for running development containers)
- Node.js and npm (for running the projects locally without containers)
- MongoDB (if you choose to run it locally instead of using a container)

### Setting Up the Development Environment

#### Configure local environment variables

1. **Update frontend .env.local in the 'frontend' directory**
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
     - Clerk Public key. Get this from your application configuration on the Clerk website
   - CLERK_SECRET_KEY
     - Clerk secret key. Get this from your application configuration on the Clerk website
   - THREAD_WARS_BACKEND_URL
     - The URL for the REST API for thread wars. The default is `http://localhost:3080`

2. **Update backend_nest \*.env in the 'backend_nest' directory**
   - NODE_ENV
      - Used to define the current environment in which the Node. js application is running
   - PORT
      - The port to that the rest api will be hosted on.
   - MONGODB_HOST
      - For the MongoDB Connection. The MongoDB connection host name.
   - MONGODB_USERNAME
      - For the MongoDB Connection. The username to use when authenticating with the MongoDB cluster.
   - MONGODB_PASSWORD
      - For the MongoDB Connection. The password to use when authenticating with the MongoDB cluster.
   - MONGODB_DATABASE_NAME
      - For the MongoDB Connection. The name of the database where the related documents to ThreadWards are contained 
   - AZURE_STORAGE_ACCOUNT_NAME
      - The Azure account name. Azure storage is used by default for storing thread media.
   - AZURE_STORAGE_ACCOUNT_KEY
      - The Azure storage account key. Azure storage is used by default for storing thread media.
   - AZURE_STORAGE_AVATAR_CONTAINER_NAME
      - The Azure storage container name for storing users avatars. Azure storage is used by default for storing thread media.
   - AZURE_STORAGE_THREAD_CONTAINER_NAME
      - The Azure storage container name for storing thread media. Azure storage is used by default for storing thread media.
   - CLERK_ISSUER_URL
      - The Clerk issuer URL used to authenticate API requests.
   - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      - The Clerk publishable key used to authenticate API requests.
   - CLERK_SECRET_KEY
      - The Clerk secret key used to authenticate API requests.

#### Running in Visual Studio Code and Dev Containers

1. **Open the Backend Container in Visual Studio Code Dev Container**
   - Open the root project folder in Visual Studio Code
   - Use CMD (CNTL) - SHIFT - P and run `Dev Containers: Rebuild and Reopen in Container`
   - Select `backend_nest`

2. **Open the Frontend Container in a Visual Studio Code Dev Container**
   - Open the root project folder in Visual Studio Code
   - Use CMD (CNTL) - SHIFT - P and run `Dev Containers: Rebuild and Reopen in Container`
   - Select `frontend`

3. **Start Debugging Backend_Nest**
    - Inside the project there is a VS Code debug profile called `Debug Nest Framework` you can use to start the project.

4. **Start Debugging Frontend**
    - Inside the project there is a VS Code debug profile called `Debug Next Framework` you can use to start the project.

#### Running with Dev Containers

1. **Start the Dev Containers:**
   - Open your terminal.
   - Navigate to the project root directory.
   - Run `docker-compose up -d` to start the frontend, backend, and MongoDB containers in detached mode.

2. **Accessing the Containers:**
   - To access the frontend container, use `docker exec -it <frontend_container_name> /bin/bash`.
   - For the backend container, use `docker exec -it <backend_nestjs_container_name> /bin/bash`.

3. **Installing Dependencies:**
   - Inside each container, run `npm install` to install the necessary dependencies for the project.

### Running Locally Without Containers

1. **Frontend (Next.js Project):**
   - Navigate to the frontend directory: `cd frontend`.
   - Install dependencies: `npm install`.
   - Start the development server: `npm run dev`.
   - The frontend will be available at `http://localhost:3000`.

2. **Backend (NestJS Project):**
   - Navigate to the backend directory: `cd backend_nestjs`.
   - Install dependencies: `npm install`.
   - Start the development server: `npm run start:dev`.
   - The backend API will be available at `http://localhost:3001`.

3. **MongoDB:**
   - Ensure MongoDB is running on your local machine.
   - Configure the connection string in the backend project to point to your local MongoDB instance.