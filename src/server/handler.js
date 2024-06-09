const predictClassification = require('../service/inferenceService');
const storeData = require('../service/storeData');

async function postPredictHandler(request, h) {
  try {
    const { image } = request.payload;
    const model = request.server.app.model;

    if (!model) {
      return h.response({ status: 'fail', message: 'Model not loaded' }).code(500);
    }

    const prediction = await predictClassification(model, image);
    const predData = prediction.dataSync();
    const softmax = tf.softmax(predData);
    const probabilities = softmax.arraySync();
    return { probabilities };
  } catch (error) {
    console.error('Error in postPredictHandler:', error);
    return h.response({ status: 'fail', message: error.message }).code(500);
  }
}

module.exports = postPredictHandler;