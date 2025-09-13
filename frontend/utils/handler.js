 export const handleRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    return { success: true, data: response };
  } catch (error) {
    console.error("ProfileService Error:", error);

    return {
      success: false,
      error:
        error.message || 
        "Something went wrong",
    };
  }
};