import path from 'path';
import { execSync as exec } from 'child_process';

import uploadConfig from '@config/upload';

import IAlignerProvider from '../models/IAlignerProvider';
import IRequestAlignmentDTO from '../dtos/IRequestAlignmentDTO';

export default class MASACUDAlignAlignerProvider implements IAlignerProvider {
  public processAlignment({
    type,
    only1,
    clearn,
    block_pruning,
    complement,
    reverse,
    s0,
    s1,
  }: IRequestAlignmentDTO): void {
    let edges: string;
    if (type === 'local') edges = '';
    else edges = '++';

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
    if (block_pruning === false) exeBlockPruning = '--no-block-pruning';

    exec(
      `cudalign --ram-size=1000M --disk-size=500M ${
        edges ? `--alignment-edges=${edges}` : ''
      } ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${path.resolve(
        uploadConfig.uploadsFolder,
        s0,
      )} ${path.resolve(uploadConfig.uploadsFolder, s1)} -d ${path.resolve(
        uploadConfig.resultsFolder,
        `${path.parse(s0).name}-${path.parse(s1).name}`,
      )} -1 > /dev/null 2>&1`,
    );

    if (!only1) {
      exec(
        `cudalign --ram-size=1000M --disk-size=500M ${
          edges ? `--alignment-edges=${edges}` : ''
        } ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${path.resolve(
          uploadConfig.uploadsFolder,
          s0,
        )} ${path.resolve(uploadConfig.uploadsFolder, s1)} -d ${path.resolve(
          uploadConfig.resultsFolder,
          `${path.parse(s0).name}-${path.parse(s1).name}`,
        )} -2 > /dev/null 2>&1`,
      );

      exec(
        `cudalign --ram-size=1000M --disk-size=500M ${
          edges ? `--alignment-edges=${edges}` : ''
        } ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${path.resolve(
          uploadConfig.uploadsFolder,
          s0,
        )} ${path.resolve(uploadConfig.uploadsFolder, s1)} -d ${path.resolve(
          uploadConfig.resultsFolder,
          `${path.parse(s0).name}-${path.parse(s1).name}`,
        )} -3 > /dev/null 2>&1`,
      );

      exec(
        `cudalign --ram-size=1000M --disk-size=500M ${
          edges ? `--alignment-edges=${edges}` : ''
        } ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${path.resolve(
          uploadConfig.uploadsFolder,
          s0,
        )} ${path.resolve(uploadConfig.uploadsFolder, s1)} -d ${path.resolve(
          uploadConfig.resultsFolder,
          `${path.parse(s0).name}-${path.parse(s1).name}`,
        )} -4 > /dev/null 2>&1`,
      );

      exec(
        `cudalign --ram-size=1000M --disk-size=500M ${
          edges ? `--alignment-edges=${edges}` : ''
        } ${exeClearn}${exeComplement}${exeReverse}${exeBlockPruning} ${path.resolve(
          uploadConfig.uploadsFolder,
          s0,
        )} ${path.resolve(uploadConfig.uploadsFolder, s1)} -d ${path.resolve(
          uploadConfig.resultsFolder,
          `${path.parse(s0).name}-${path.parse(s1).name}`,
        )} -5 > /dev/null 2>&1`,
      );
    }
  }
}
