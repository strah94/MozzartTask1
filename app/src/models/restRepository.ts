export interface IResult<T> {
  success: boolean;
  matches: T[];
}

export interface IRestRepository<TBase> {
  getAll(): Promise<IResult<TBase>>;
}
