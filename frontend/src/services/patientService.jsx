export const getPatients = async (apiInstance) => {
  const response = await apiInstance.get('/patients');
  return response.data;
};

export const createPatient = async (apiInstance, patientData) => {
  const response = await apiInstance.post('/patients', patientData);
  return response.data;
};

export const deletePatient = async (apiInstance, id) => {
  const response = await apiInstance.delete(`/patients/${id}`);
  return response.data;
};
