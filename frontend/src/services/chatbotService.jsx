export const sendChatMessage = async (apiInstance, payload) => {
  // payload: { message: string, context?: string }
  const response = await apiInstance.post('/chat', payload);
  return response.data;
};
