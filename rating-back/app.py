import uvicorn
from main import *
from src.utils.constmap import CONFIG

if __name__ == "__main__":
    uvicorn.run(app,
                port=CONFIG["PORT"],
                host=CONFIG["HOST"],
                log_level="debug",
                use_colors=True)

    print(f"Run app at: {CONFIG['HOST']}:{CONFIG['PORT']}")