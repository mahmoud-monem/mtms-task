import { FindManyOptions, Repository } from 'typeorm';

export class ApiParams {
  search: string;
  paginate = true;
  limit = 10;
  page = 0;
  sort: any;
}

export class BaseRepository<Entity> extends Repository<Entity> {
  async getAll(
    conditions?: FindManyOptions<Entity>,
    params?: ApiParams,
  ): Promise<
    | {
        result: Entity[];
        pages: number;
        length: number;
        page: number;
      }
    | Entity[]
  > {
    if (params && params.sort) {
      conditions['order'] = params.sort;
    }
    if (params && params.paginate) {
      const count = await super.count(conditions);
      conditions['take'] = params.limit;
      conditions['skip'] = params.limit * params.page;
      const entities = await super.find(conditions);
      const pagesCount = Math.ceil(count / params.limit) || 1;
      const result = {
        result: entities,
        page: params.page,
        length: count,
        pages: pagesCount,
      };
      return result;
    }
    return super.find(conditions);
  }
}
