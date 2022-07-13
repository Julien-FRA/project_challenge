import { useCallback, useEffect, useState} from 'react';
import axios, { AxiosError } from 'axios';
import { API_URL } from '../utils/config';
import { GetDto, PostDto, PutDto } from '../type/query';

interface Api<DataType>{
  data: DataType | null;
  isLoading: boolean;
}

interface GetApiList<DataType> extends Api<DataType> {
  getData: (path?: string) => Promise<void>
}

export const useApiGetList = <DataType>(_url: string): GetApiList<GetDto<DataType>>  => {

  const [data, setData] = useState<GetDto<DataType> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async () => {
    try {
      const { data } = await axios.get<GetDto<DataType>>(`${API_URL}/${_url}`);
      setData(data);
    }
    catch (error) {
      console.error(error)
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);

  return {
    data,
    isLoading,
    getData,
  };
};

interface GetApi<DataType> extends Api<DataType> {
  getData: (path?: string) => Promise<DataType | undefined>
}
export const useApiGet = <DataType>(_url: string): GetApi<DataType>  => {

  const [data, setData] = useState<DataType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getData = async (path?: string) => {
    try {
      const { data } = await axios.get<DataType>(`${API_URL}/${_url}${path ? `/${path}` : ""}`);
      setData(data)
      return data
    }
    catch (error) {
      console.error(error)
    }
    setIsLoading(false);
  };

  return {
    data,
    isLoading,
    getData
  };
};

interface PostApi<DataInputType, DataOutputType> extends Omit<Api<DataInputType>, "data"> {
  postData: (_data: DataInputType, path?: string) => Promise<PostDto<DataOutputType> | undefined>
}

export const useApiPost = <DataInputType, DataOutputType = {}>(_url: string): PostApi<DataInputType, DataOutputType>  => {

  const [isLoading, setIsLoading] = useState(false);

  const postData = async(_data: DataInputType, path?: string) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post<PostDto<DataOutputType>>(`${API_URL}/${_url}${path ? `/${path}` : ""}`, _data);
      setIsLoading(false);
      return data
    }
    catch (error) {
      setIsLoading(false);
      console.error(error)
    }
  };

  return {
    postData,
    isLoading,
  };
};

// input and output
interface PutApi<DataInputType, DataOutputType> extends Omit<Api<DataInputType>, "data"> {
  putData: (_id: number | string, _data: DataInputType) => Promise<PutDto<DataOutputType> | undefined>
}

export const usePutApi = <DataInputType, DataOutputType = {}>(_url: string): PutApi<DataInputType, DataOutputType>  => {

  const [isLoading, setIsLoading] = useState(true);

  const putData = async(_id: number | string,  _data: DataInputType) => {
    try {
      const { data } = await axios.put<PutDto<DataOutputType>>(`${API_URL}/${_url}/${_id}`, _data);
      return data
    }
    catch (error) {
      console.error(error)
    }
    setIsLoading(false);
  };

  return {
    putData,
    isLoading,
  };
};
