# run.py
import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        "main:app",          # points to app instance inside main.py
        host="127.0.0.1",    # or "0.0.0.0" to allow external access
        port=8000,           # choose any free port
        reload=True          # auto-reload on code changes
    )