export type GetDto<Data> = {
  limit: number
  page: number
  rows: Data[]
  total: number
}

export type PostDto<T = {}> = T & {
  id: number
};

export type PutDto<T = {}> = T & {
  rows: number
};