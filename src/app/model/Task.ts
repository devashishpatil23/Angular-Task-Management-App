export class Task {
  constructor(
    public title: string,
    public description: string,
    public assignedTo: string,
    public createdAt: string,
    public priority: string,
    public status: string,
    public createdBy: string,
    public id?: string
  ) {}
}
