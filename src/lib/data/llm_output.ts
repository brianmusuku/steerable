export const narration = {
    "content": [
        {
            "script_text": "Alright, let's get this project started. The first thing I need to do is set up a frontend directory and a placeholder readme. [show command line shell] Before I just start creating things, I want to make sure I'm not going to overwrite anything or duplicate a folder that already exists, so I'll start by listing out the current files to verify the environment.",
            "visual": "command line shell",
            "visual animation": "The agent types 'ls -la' into the terminal to inspect the current directory structure.",
            "title": "Inspecting Directory",
            "filename": "",
            "filetree": "[{\"name\": \"opencode.json\", \"type\": \"file\"}]",
            "agents_output": "ls -la"
        },
        {
            "script_text": "Now that I've confirmed the space is clear, [show command line shell] I'm going to create the frontend folder. Creating a dedicated directory for the frontend is standard practice to keep the project organized and maintain a clear separation of concerns.",
            "visual": "command line shell",
            "visual animation": "The command 'mkdir frontend' is executed in the shell, and the folder appears in the file tree.",
            "title": "Creating Frontend Directory",
            "filename": "",
            "filetree": "[{\"name\": \"opencode.json\", \"type\": \"file\"}, {\"name\": \"frontend\", \"type\": \"folder\", \"children\": []}]",
            "agents_output": "mkdir frontend"
        },
        {
            "script_text": "With the folder ready, [show file viewer] I'm initializing a README.md file inside it. Even though I wasn't given specific content requirements, starting with a readme is a great habit for documentation hygiene; it ensures that anyone who opens this folder later understands exactly what it's for.",
            "visual": "file viewer",
            "visual animation": "A new file named README.md is created inside the frontend folder, and content is written to it.",
            "title": "Initializing Readme",
            "filename": "frontend/README.md",
            "filetree": "[{\"name\": \"opencode.json\", \"type\": \"file\"}, {\"name\": \"frontend\", \"type\": \"folder\", \"children\": [{\"name\": \"README.md\", \"type\": \"file\"}]}]",
            "agents_output": "# Frontend Project\n\nThis folder contains the frontend source code and assets."
        },
        {
            "script_text": "And that's it. [show folder tree viewer] I've successfully set up the frontend folder and added the readme. The project structure is now primed for the next phase of development.",
            "visual": "folder tree viewer",
            "visual animation": "The final folder tree is highlighted, showing the successful creation of the directory and file.",
            "title": "Task Completed",
            "filename": "",
            "filetree": "[{\"name\": \"opencode.json\", \"type\": \"file\"}, {\"name\": \"frontend\", \"type\": \"folder\", \"children\": [{\"name\": \"README.md\", \"type\": \"file\"}]}]",
            "agents_output": "Created frontend/ directory with a README.md file."
        }
    ]
}