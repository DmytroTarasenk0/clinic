# Clinic app project

## Build instructions

### For development:

### Back-end

1. Open the project in Visual Studio 2022.
2. Create a `.env` file in the root. Add your MS SQL Server info and a session secret like this:

```
DB_USER=sql_user
DB_PASSWORD=sql_password
DB_SERVER=sql_server
DB_DATABASE=sql_db
SESSION_SECRET=secret_key
PORT=(optional)
```

3. Install all dependencies by running in terminal `npm install`.
4. Run `npm run dev` for starting back-end on the PORT(5000 default).

### Front-end

1. In a new terminal enter directory "client" by `cd client` command.
2. Install all dependencies by running `npm install`.
3. Run `npm run dev` for starting front-end on the Vite-port.

### How to build and use

1. In front-terminal `(clinic/client)` run `npm run build` this will create `dist` directory.
2. From `dist` copy-paste to `clinic/public` directory(create if not exsist).
3. Run in back-terminal `node app.js`.

## Project Overview:

This project is a full-stack web application for managing a medical clinic. It implements a two primary user-roles: Patients and Doctors and its functional.

- Patients can register, login, browse a filterable list of doctors, book/cancel appointments and view their appointment history.

- Doctors have a tabbed dashboard where they can manage their appointments, complete appointments (which generates a medical record), and manage the data dictionaries (specializations, symptoms,diagnoses, medications). They can then modify a medical record to add diagnoses and automatically link recommended treatments to display on the patient tab.

### Technology Stack:

- Backend: Node.js, Express.js
- Routing: react-router-dom
- Database: MS SQL Server
- ORM: Sequelize
- Frontend: React (Vite)
- Authentication: express-session
- State Management: React Context API (AuthContext.jsx)
