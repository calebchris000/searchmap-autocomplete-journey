import { Coordinate } from "@/utils/locationUtils";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const GetSearch = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/search?q=${query}`);

    return {
      success: response.status === 200,
      message: response.data?.message || "Success",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "An unexpected error occurred",
      data: null,
    };
  }
};

export const GetDirections = async (
  origin: Coordinate,
  destination: Coordinate,
) => {
  try {
    const response = await axios.post(`${BASE_URL}/directions`, {
      origin,
      destination,
    });

    return {
      success: response.status === 201,
      message: response.data?.message || "Success",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: axios.isAxiosError(error)
        ? error.response?.data?.message || error.message
        : "An unexpected error occurred",
      data: null,
    };
  }
};
