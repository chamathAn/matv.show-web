import { useState, useEffect } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export default function useAPI(url: string, options?: AxiosRequestConfig) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const request = axios.CancelToken.source();
  const fetchData = async () => {
    setIsLoading(true);

    try {
      const configuredOptions: AxiosRequestConfig = {
        ...options,
        cancelToken: request.token,
      };
      const response: AxiosResponse = await axios(url, configuredOptions);
      setData(response.data);
    } catch (error) {
      setError(error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
    return () => request.cancel();
  }, []);

  return { data, isLoading, error };
}

// references
// prevent unneccassary rerendering https://medium.com/suyeonme/react-how-to-prevent-unnecessary-api-calls-649b6a6ab84d
