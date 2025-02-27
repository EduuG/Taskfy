interface ITask {
    id: number;
    userId?: number;
    description: string;
    active?: number;
    order?: number;
    isCompleted?: boolean;
    creationDate?: Date;
}

export default ITask;

