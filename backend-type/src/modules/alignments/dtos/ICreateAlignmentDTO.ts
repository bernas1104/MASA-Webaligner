export default interface ICreateAlignmentDTO {
  type: string;
  extension: number;
  only1?: boolean;
  clearn?: boolean;
  block_pruning?: boolean;
  complement?: number;
  reverse?: number;
  full_name?: string;
  email?: string;
}
