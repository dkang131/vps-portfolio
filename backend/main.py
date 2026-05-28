from fastapi import FastAPI, UploadFiles, File
from fastapi.middleware.cors import CORSMiddleware
from services.face_verify import verify_faces

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def healthcheck():
    return {"status": "healthy"}


@app.post("/api/verify")
async def verify_faces_endpoint(
    file1: UploadFile = File(...), file2: UploadFile = File(...)
):
    img1 = await file1.read()
    img2 = await file2.read()
    result = verify_faces(img1, img2)
    return result


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=3839)
