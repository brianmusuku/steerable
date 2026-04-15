export const narration = {
    "content": [
        {
            "script_text": "Alright, let's get this project organized. The user wants a new frontend directory and a readme to go with it. [ls -la] I'll start by listing the current files just to get my bearings and ensure I'm not stepping on any existing directories.",
            "visual": "command line shell",
            "visual animation": "typing: ls -la",
            "title": "Checking Workspace Context",
            "filename": "opencode.json",
            "filetree": "[\n  {\n    \"name\": \"opencode.json\",\n    \"type\": \"file\"\n  }\n]"
        },
        {
            "script_text": "The path is clear. [mkdir frontend] I'm executing a simple mkdir command to create the 'frontend' folder. This sets the stage for the rest of the project structure.",
            "visual": "command line shell",
            "visual animation": "typing: mkdir frontend",
            "title": "Creating the Frontend Directory",
            "filename": "opencode.json",
            "filetree": "[\n  {\n    \"name\": \"opencode.json\",\n    \"type\": \"file\"\n  },\n  {\n    \"name\": \"frontend\",\n    \"type\": \"folder\",\n    \"children\": []\n  }\n]"
        },
        {
            "script_text": "Now, a folder without content doesn't help much, especially if we're using version control. [frontend/README.md] I'm initializing a basic README.md file inside the new folder. Even without specific instructions on content, providing this documentation is a best practice that makes the project's purpose clear from the start.",
            "visual": "file viewer",
            "visual animation": "creating file: frontend/README.md",
            "title": "Adding Documentation",
            "filename": "frontend/README.md",
            "filetree": "[\n  {\n    \"name\": \"opencode.json\",\n    \"type\": \"file\"\n  },\n  {\n    \"name\": \"frontend\",\n    \"type\": \"folder\",\n    \"children\": [\n      {\n        \"name\": \"README.md\",\n        \"type\": \"file\"\n      }\n    ]\n  }\n]"
        },
        {
            "script_text": "Everything is set. [folder tree viewer] As you can see in the file tree, we now have our frontend directory populated with its readme. The foundation for the frontend development is ready to go.",
            "visual": "folder tree viewer",
            "visual animation": "highlight: frontend folder",
            "title": "Task Complete",
            "filename": "opencode.json",
            "filetree": "[\n  {\n    \"name\": \"opencode.json\",\n    \"type\": \"file\"\n  },\n  {\n    \"name\": \"frontend\",\n    \"type\": \"folder\",\n    \"children\": [\n      {\n        \"name\": \"README.md\",\n        \"type\": \"file\"\n      }\n    ]\n  }\n]"
        }
    ]
}