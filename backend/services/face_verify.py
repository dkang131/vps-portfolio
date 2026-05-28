from signal import siginterrupt
from warnings import simplefilter
import cv2
import numpy as np
from insightface.app import FaceAnalysis
from sklearn.metrics.pairwise import cosine_similarity

app = FaceAnalysis(name="antelope")
app.prepare(ctx_id=-1, det_size=(640, 640))


def get_embedding(image_bytes):
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    faces = app.get(img)

    if len(faces) == 0:
        return None
    return faces[0].embedding


def verify_faces(img1_bytes, img2_bytes, threshold=0.5):
    emb1 = get_embedding(img1_bytes)
    emb2 = get_embedding(img2_bytes)

    if emb1 is None or emb2 is None:
        return {
            "verified": False,
            "message": "One or both of the images do not contain a face.",
        }

    similarity = cosine_similarity([emb1], [emb2])[0][0]
    match = similarity > threshold
    return {"success": True, "similarity": similarity, "matched": bool(match)}
