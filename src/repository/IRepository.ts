export interface IRepository<T> {
    getList(params: object): Promise<T[]>;

    getOneById(id: number): Promise<T>;

    getOne(params: Partial<T>): Promise<T>;

    update(id: number, data: T): Promise<void>;

    updateByField?(params: Partial<T>, data: T): Promise<void>;

    add(data: T): Promise<void>;

    delete(id: number): Promise<void>;

    deleteByField?(params: Partial<T>): Promise<void>;

    count(params: Partial<T>): Promise<number>;
}
