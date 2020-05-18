interface IRequest {
  sequence: string;
}

export default class CheckFastaFormatService {
  execute({ sequence }: IRequest): boolean {
    const verifier = /(>[A-Z]+_?[0-9]{5,6}\.[0-9]{1} (.*)\n)?([AGCTN]+[\n]?)/gy;
    return verifier.test(sequence);
  }
}

// ^>(.*?)\n([AGCTN]+[\n]?)+$
