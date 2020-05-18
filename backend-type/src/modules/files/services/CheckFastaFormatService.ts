import { injectable } from 'tsyringe';

interface IRequest {
  sequence: string;
}

@injectable()
export default class CheckFastaFormatService {
  execute({ sequence }: IRequest): boolean {
    const verifier = /(>[A-Z]+_?[0-9]{5,6}\.[0-9]{1} (.*)\n)?([AGCTN]+[\n]?)/gy;
    return verifier.test(sequence);
  }
}

// ^>(.*?)\n([AGCTN]+[\n]?)+$
