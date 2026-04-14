export const narration = {
    "content": [
        {
            "script_text": "I started by assessing the current project structure. The goal was to establish a clear separation of concerns, so I decided the best course of action was to create a dedicated 'frontend' directory to house all the upcoming UI work.",
            "visual": "folder tree viewer",
            "visual animation": "Show the current directory structure, then highlight the root where the new 'frontend' folder will be placed.",
            "title": "Project Structure Assessment",
            "filename": "root"
        },
        {
            "script_text": "To make this happen, I jumped into the terminal. I used the 'mkdir -p' command because it is the most reliable way to create directories; it ensures the folder is created and doesn't throw an error if it already exists or if parent paths are missing.",
            "visual": "command line shell",
            "visual animation": "Type out 'mkdir -p frontend' and show it executing successfully.",
            "title": "Creating Frontend Directory",
            "filename": "terminal"
        },
        {
            "script_text": "Once the folder was in place, I didn't want it to be empty. I added a README.md file. My reasoning here is simple: every new module should have an entry point for documentation to help other developers understand the purpose of the folder right away.",
            "visual": "file viewer",
            "visual animation": "Show the 'frontend/README.md' file being created with a simple 'Frontend Documentation' header.",
            "title": "Initializing Documentation",
            "filename": "frontend/README.md"
        },
        {
            "script_text": "And there we go. By looking at the file tree now, you can see the 'frontend' folder is active and documented. This provides a clean, professional starting point for the rest of the application development.",
            "visual": "folder tree viewer",
            "visual animation": "Expand the newly created 'frontend' directory in the tree to reveal the 'README.md' file inside.",
            "title": "Verifying Structure",
            "filename": "root"
        }
    ]
}
