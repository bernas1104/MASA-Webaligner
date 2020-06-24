import { injectable } from 'tsyringe';

interface IRequest {
  sequence: string;
}

@injectable()
export default class CheckFastaFormatService {
  execute({ sequence }: IRequest): boolean {
    let oneLineSequence: string | string[] = sequence.split('\n');
    oneLineSequence[0] += ';';
    oneLineSequence = oneLineSequence.filter(line => line !== '').join('');

    const verifier = /^>(.*);[ACGTUNXVHDBMRWSYK]+$/gi;

    const check = verifier.test(oneLineSequence);

    return check;
  }
}
