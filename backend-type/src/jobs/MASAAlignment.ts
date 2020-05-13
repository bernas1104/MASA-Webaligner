import { execSync as exec } from 'child_process';

export interface MASAAlignmentJob {
  masa: string;
  only1?: boolean;
  clearn?: boolean;
  complement?: number;
  reverse?: number;
  blockPruning?: boolean;
  s0: string;
  s1: string;
  s0edge: string;
  s1edge: string;
  s0folder: string;
  s1folder: string;
  filesPath: string;
  resultsPath: string;
  fullName?: string;
  email?: string;
}

export default {
  key: 'MASAAlignment',
  async handle(data: MASAAlignmentJob): Promise<void> {
    const {
      masa,
      only1,
      clearn,
      complement,
      reverse,
      blockPruning,
      s0,
      s1,
      s0edge,
      s1edge,
      s0folder,
      s1folder,
      filesPath,
      resultsPath,
    } = data;

    let exeClearn = '';
    if (clearn) exeClearn = '--clear-n ';

    let exeComplement = '';
    if (complement)
      exeComplement = `--complement=${
        complement < 3 ? String(complement) : 'both'
      } `;

    let exeReverse = '';
    if (reverse)
      exeReverse = `--reverse=${reverse < 3 ? String(reverse) : 'both'} `;

    let exeBlockPruning = '';
    if (blockPruning === false) exeBlockPruning = '--no-block-pruning';

    if (!only1) {
      await exec(`
        ${masa} --ram-size=1000M --disk-size=500M --alignment-edges=${s0edge}${s1edge} ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${filesPath}/${s0} ${filesPath}/${s1} -d ${resultsPath}/${s0folder}-${s1folder} -1 > /dev/null 2>&1 &&
        ${masa} --ram-size=1000M --disk-size=500M --alignment-edges=${s0edge}${s1edge} ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${filesPath}/${s0} ${filesPath}/${s1} -d ${resultsPath}/${s0folder}-${s1folder} -2 > /dev/null 2>&1 &&
        ${masa} --ram-size=1000M --disk-size=500M --alignment-edges=${s0edge}${s1edge} ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${filesPath}/${s0} ${filesPath}/${s1} -d ${resultsPath}/${s0folder}-${s1folder} -3 > /dev/null 2>&1 &&
        ${masa} --ram-size=1000M --disk-size=500M --alignment-edges=${s0edge}${s1edge} ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${filesPath}/${s0} ${filesPath}/${s1} -d ${resultsPath}/${s0folder}-${s1folder} -4 > /dev/null 2>&1 &&
        ${masa} --ram-size=1000M --disk-size=500M --alignment-edges=${s0edge}${s1edge} ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${filesPath}/${s0} ${filesPath}/${s1} -d ${resultsPath}/${s0folder}-${s1folder} -5 > /dev/null 2>&1
      `);
    } else {
      await exec(`
        ${masa} --alignment-edges=${s0edge}${s1edge} ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${filesPath}/${s0} ${filesPath}/${s1} -d ${resultsPath}/${s0folder}-${s1folder} -1 > /dev/null 2>&1
      `);
    }
  },
};
