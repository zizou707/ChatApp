import axios from "axios";

export const baseUrl = "https://chatapp-zz.onrender.com";

export const postRequest = async (url, body) => {
  try {
    const response = await axios.post(url, body);

    return response.data;
  } catch (error) {
    if (error?.response?.data) {
      let message = error.response.data;
      return { error: true, message };
    } else if (error?.message) {
      let message = error.message;
      return { error: true, message };
    } else if (error) {
      let message = error;
      return { error: true, message };
    }
  }
};

export const getRequest = async (url) => {
  try {
    const response = await axios.get(url);

    const data = response.data;

    return data;
  } catch (error) {
    if (error?.response?.data) {
      let message = error.response.data;
      return { error: true, message };
    } else if (error?.message) {
      let message = error.message.message;
      return { error: true, message };
    } else if (error) {
      let message = error.message;
      return { error: true, message };
    }
  }
};
export const updateRequest = async (url, body) => {
  try {
    const response = await axios.put(url, body);

    const data = response.config.data;
    return data;
  } catch (error) {
    if (error?.response?.data) {
      let message = error.response.data;
      return { error: true, message };
    } else if (error?.message) {
      let message = error.message.message;
      return { error: true, message };
    } else if (error) {
      let message = error.message;
      return { error: true, message };
    }
  }
};

export const unreadNotifiactionsFunc = (notifiactions) => {
  return notifiactions?.filter((n) => n.isRead === false);
};
