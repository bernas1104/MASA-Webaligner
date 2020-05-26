import IAlignerProvider from '../models/IAlignerProvider';
import IRequestAlignmentDTO from '../dtos/IRequestAlignmentDTO';

export default class MASACUDAlignAlignerProvider implements IAlignerProvider {
  private alignments: IRequestAlignmentDTO[] = [];

  public processAlignment(data: IRequestAlignmentDTO): void {
    this.alignments.push(data);
  }
}
