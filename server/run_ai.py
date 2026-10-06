"""Launch the supplied Python service through the Madaar compatibility bridge."""
import os
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
PACKAGE = HERE.parent / "integration" / "ai" / "Madar_Final_Ministry_Ready" / "backend"
sys.path.insert(0, str(PACKAGE))
sys.path.insert(0, str(HERE))
os.environ.setdefault("FRONTEND_ORIGIN", "http://127.0.0.1:5500")
os.environ.setdefault("OFFICIAL_IFTA_URL", "https://alifta.gov.sa/ar/home")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("package_bridge:app", host="127.0.0.1", port=int(os.environ.get("MADAAR_AI_PORT", "8001")))
