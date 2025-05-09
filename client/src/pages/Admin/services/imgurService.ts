import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

export const uploadToImgur = async (file: File): Promise<{
  id: string;
  deletehash: string;
  link: string;
}> => {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await api.post("/imgur-upload", formData);
    return response.data;
  } catch (er: any) {
    return Promise.reject("Upload failed");
  }
};

export const deleteUploaded = async (deleteHash: string): Promise<any> => {
  try {
    const response = await api.delete(`/imgur-upload/${deleteHash}`);
    return response.data;
  } catch (er: any) {
    return Promise.reject("Delete failed");
  }
};
