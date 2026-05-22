TaskFlow Kanban Board

TaskFlow is a simple website to help you organize your tasks. You can add tasks, move them around, and delete them. The website saves your tasks automatically so you do not lose them.

Features

- Move tasks between columns by dragging them.
- Add tasks with titles, descriptions, priorities, deadlines, and tags.
- Click on any task to view it or change its details.
- Delete tasks you do not need anymore.
- All your tasks are saved in your web browser.
- Set priority levels like low, medium, and high.
- Set due dates for when tasks are done.

Technologies Used

- React for building the webpage structure.
- Vite to build and run the code.
- Tailwind CSS and plain CSS for colors and layout.
- dnd-kit for drag and drop functions.
- UUID for task numbering.

Folder Layout

kanban-app/
  public/: Static files like icons
  src/
    components/: Individual pieces of the webpage
      AddTaskModal.jsx: Form to create new tasks
      Board.jsx: The main board grid
      Column.jsx: Column container for tasks
      TaskCard.jsx: Individual task item
      TaskModal.jsx: Detailed task editor and viewer
    context/
      TaskContext.jsx: Code that manages the saved tasks
    App.jsx: Main page template
    index.css: Colors and styling
    main.jsx: Launches the React application
  package.json: Project configuration and packages
  tailwind.config.js: Tailwind CSS options
  vite.config.js: Vite options

How to Run This Project

Prerequisites

You need to have Node.js and npm installed on your computer.

Steps to Run

1. Open your terminal and go into the folder:
cd kanban-app

2. Install all the necessary packages:
npm install

3. Run the development server:
npm run dev

4. Open the website using the address shown in your terminal (usually http://localhost:5173).

Building and Previewing

To build the code for publishing:
npm run build

To preview the built website:
npm run preview

Future Plans

- Add a search box and filters for tags and priority.
- Allow adding and deleting columns.
- Add subtasks to track smaller steps.
- Add user accounts to share lists with others.
