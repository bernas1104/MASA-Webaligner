import IRequestAlignmentDTO from '../dtos/IRequestAlignmentDTO';

export default interface IAlignerProvider {
  processAlignment(data: IRequestAlignmentDTO): void;
}
