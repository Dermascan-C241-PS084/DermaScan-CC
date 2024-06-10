const predictClassification = require('../service/inferenceService');
const loadModel = require('../service/loadModel');
const tf = require('@tensorflow/tfjs-node');
const { v4: uuidv4 } = require('uuid');
const { firestore } = require('../service/firestore');

const diseaseLabels = ["cellulitis", "impetigo", "athlete's foot", "nail fungus", "ringworm", "cutaneous larva migrans", "chickenpox", "shingles"];

async function postPredictHandler(request, h) {
  try {
    const model = await loadModel();
    const { image } = request.payload;
    const prediction = await predictClassification(model, image);
    const predData = prediction.dataSync();
    const softmax = tf.softmax(predData);
    const probabilities = softmax.arraySync();

    const maxIndex = probabilities.indexOf(Math.max(...probabilities));
    const maxProbability = probabilities[maxIndex];
    const isAboveThreshold = maxProbability >= 0.2;
    const result = isAboveThreshold ? diseaseLabels[maxIndex] : "No disease detected";

    const predictionData = {
      result: result,
      confidenceScore: maxProbability,
      isAboveThreshold: isAboveThreshold,
      createdAt: new Date().toISOString()
    };

    const predictionRef = firestore.collection('predictions').doc();
    await predictionRef.set({
      id: predictionRef.id,
      ...predictionData
    });

    const response = {
      "message": "Model is predicted successfully.",
      "data": {
        "id": predictionRef.id,
        ...predictionData
      }
    };

    return response;

  } catch (error) {
    console.error("Error processing prediction:", error);
    return h.response({ message: "Error processing image" }).code(500);
  }
}

module.exports = postPredictHandler;