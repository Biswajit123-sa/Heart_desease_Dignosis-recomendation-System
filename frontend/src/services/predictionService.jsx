export const createPrediction = async (apiInstance, predictionData) => {
  const response = await apiInstance.post('/predictions', predictionData);
  return response.data;
};

export const getPredictions = async (apiInstance) => {
  const response = await apiInstance.get('/predictions');
  return response.data;
};
