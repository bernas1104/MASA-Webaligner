export default interface IRequestAlignmentDTO {
  id: string;
  masa: string;
  type?: string;
  only1?: boolean;
  clearn?: boolean;
  block_pruning?: boolean;
  complement?: number;
  reverse?: number;
  s0: string;
  s1: string;
  full_name: string;
  email: string;
}
