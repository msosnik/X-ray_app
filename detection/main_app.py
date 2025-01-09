from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
import torchvision
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
import cv2
import numpy as np
import copy


app = Flask(__name__)
CORS(app)


def get_model(num_classes):
    model = torchvision.models.detection.fasterrcnn_resnet50_fpn(
        weights='DEFAULT')
    in_features = model.roi_heads.box_predictor.cls_score.in_features
    model.roi_heads.box_predictor = FastRCNNPredictor(in_features, num_classes)
    return model


def modify_model_roi_thresholds(model, nms_thresh=0.7, score_thresh=0.5):
    model_copy = copy.deepcopy(model)
    model_copy.roi_heads.nms_thresh = nms_thresh
    model_copy.roi_heads.score_thresh = score_thresh
    return model_copy


def load_model(checkpoint_path, num_classes, nms_thresh, score_thresh):
    model = get_model(num_classes)
    model = torch.load(checkpoint_path, map_location=torch.device('cpu'))
    model = modify_model_roi_thresholds(
        model, nms_thresh=nms_thresh, score_thresh=score_thresh)
    model.eval()
    return model


def process_image(file):
    file_bytes = np.asarray(bytearray(file), dtype=np.uint8)
    image = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

    if image is None or image.size == 0:
        raise ValueError(
            "Failed to decode image. Please check the file format and content.")

    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image_tensor = torch.tensor(
        image / 255.0, dtype=torch.float32
    ).permute(2, 0, 1).unsqueeze(0)

    return image, image_tensor


def detect_objects(model, image_tensor):
    with torch.no_grad():
        predictions = model(image_tensor)
    return predictions


def model_report(predictions, score_threshold=0.5):
    scores = predictions[0]['scores'].cpu().numpy()

    if len(scores) == 0 or max(scores) < score_threshold:
        return ["No wrist fractures detected"]

    max_score = max(scores)
    return [f"Detected wrist fracture with {max_score*100:.2f}% confidence"]


@app.route('/predict', methods=['POST'])
def predict():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        file = request.files['file'].read()

        image, image_tensor = process_image(file)

        predictions = detect_objects(model, image_tensor)
        pred_boxes = predictions[0]['boxes'].cpu().numpy().tolist()
        pred_scores = predictions[0]['scores'].cpu().numpy().tolist()

        report = model_report(predictions)

        return jsonify({
            'boxes': pred_boxes,
            'scores': pred_scores,
            'report': report
        })
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': 'Unexpected error occurred: ' + str(e)}), 500


if __name__ == "__main__":
    checkpoint_path = 'model.pth'
    num_classes = 2
    nms_thresh = 0.5
    score_thresh = 0.3

    model = load_model(checkpoint_path, num_classes, nms_thresh, score_thresh)

    app.run(host='0.0.0.0', port=8000)
