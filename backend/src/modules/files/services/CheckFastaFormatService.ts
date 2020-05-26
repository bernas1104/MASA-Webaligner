import { injectable } from 'tsyringe';

interface IRequest {
  sequence: string;
}

@injectable()
export default class CheckFastaFormatService {
  execute({ sequence }: IRequest): boolean {
    let oneLinSequence: string | string[] = sequence.split('\n');
    oneLinSequence[0] += ';';
    oneLinSequence = oneLinSequence.filter(line => line !== '').join('');

    const verifier = /^>(.*);[ATCGN]+$/gi;
    return verifier.test(oneLinSequence);
  }
}
