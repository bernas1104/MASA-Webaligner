import IRequestAlignmentDTO from '../dtos/IRequestAlignmentDTO';

export default interface IAlignerProvider {
  executeStage1(data: IRequestAlignmentDTO): void;
  executeStage2(data: IRequestAlignmentDTO): void;
  executeStage3(data: IRequestAlignmentDTO): void;
  executeStage4(data: IRequestAlignmentDTO): void;
  executeStage5(data: IRequestAlignmentDTO): void;
}
