const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, image) {
  try {
    const tensor = tf.node
      .decodeJpeg(image)
      .resizeNearestNeighbor([224, 224])
      .expandDims()
      .toFloat()
      .div(tf.scalar(255.0));

    const prediction = model.predict(tensor);
    const predData = prediction.dataSync();
    console.log('Prediction Data:', predData); // Tambahkan log ini

    const softmax = tf.softmax(predData);
    const probabilities = softmax.arraySync();
    return { probabilities };
  } catch (error) {
    console.error('Error in predictClassification:', error);
    throw error;
  }
}

module.exports = { predictClassification };