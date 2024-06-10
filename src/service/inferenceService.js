const tf = require('@tensorflow/tfjs-node');

async function predictClassification(model, imageBuffer) {
  const tensor = tf.node.decodeJpeg(imageBuffer)
    .resizeNearestNeighbor([224, 224])
    .expandDims()
    .toFloat()
    .div(tf.scalar(255.0));

  return model.predict(tensor);
}

module.exports = predictClassification;