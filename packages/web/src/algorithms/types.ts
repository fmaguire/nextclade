/* eslint-disable @typescript-eslint/no-empty-interface */
import type { AuspiceJsonV2 } from 'auspice'
import type { StrictOmit } from 'ts-essentials'

import type { Tagged } from 'src/helpers/types'
import type { AuspiceJsonV2Extended } from 'src/algorithms/tree/types'
import type { QCResult, QCRulesConfig } from 'src/algorithms/QC/types'

/** Type-safe representation of a nucleotide */
export type Nucleotide = Tagged<string, 'Nucleotide'>

/** Type-safe representation of an aminoacid */
export type Aminoacid = Tagged<string, 'Aminoacid'>

/** Represents a numeric interval bounded by begin and end. Similar to `Span`, but different representation. */
export interface Range {
  begin: number
  end: number
}

/** Represents a numeric interval bounded by start and length. Similar to `Range`, but different representation. */
export interface Span {
  start: number
  length: number
}

export interface NucleotideLocation {
  pos: number
  nuc: Nucleotide
}

export interface NucleotideSubstitution {
  pos: number
  refNuc: Nucleotide
  queryNuc: Nucleotide
}

export interface NucleotideDeletion extends Span {}

export interface NucleotideInsertion {
  pos: number
  ins: string
}

export interface NucleotideMissing extends Range {}

export interface NucleotideRange extends Range {
  nuc: Nucleotide
}

export type Clades = Record<string, NucleotideLocation[]>

export interface CladesGrouped {
  pos: number
  subs: Record<string, string[]>
}

export interface AminoacidSubstitution {
  refAA: Aminoacid
  queryAA: Aminoacid
  codon: number
  gene: string
}

export interface SubstitutionsWithAminoacids extends NucleotideSubstitution {
  aaSubstitutions: AminoacidSubstitution[]
}

export interface PcrPrimer {
  name: string
  target: string
  source: string
  rootOligonuc: string
  primerOligonuc: string
  range: Range
  nonACGTs: NucleotideLocation[]
}

export interface PcrPrimerChange {
  primer: PcrPrimer
  substitutions: NucleotideSubstitution[]
}

export interface SubstitutionsWithPrimers extends SubstitutionsWithAminoacids {
  pcrPrimersChanged: PcrPrimer[]
}

export interface Virus {
  name: string
  genomeSize: number
  minimalLength: number
  geneMap: Gene[]
  rootSeq: string
  auspiceData: AuspiceJsonV2
  pcrPrimers: PcrPrimer[]
  qcRulesConfig: QCRulesConfig
}

export type VirusRaw = StrictOmit<Virus, 'genomeSize'>

export interface AlgorithmParams {
  sequenceDatum: string
  virus: Virus
}

export interface ClusteredSNPs {
  start: number
  end: number
  numberOfSNPs: number
}

export interface AnalysisResultWithoutClade {
  seqName: string
  substitutions: SubstitutionsWithPrimers[]
  totalMutations: number
  aminoacidChanges: AminoacidSubstitution[]
  totalAminoacidChanges: number
  insertions: NucleotideInsertion[]
  totalInsertions: number
  deletions: NucleotideDeletion[]
  totalGaps: number
  missing: NucleotideMissing[]
  totalMissing: number
  nonACGTNs: NucleotideRange[]
  totalNonACGTNs: number
  alignmentStart: number
  alignmentEnd: number
  alignmentScore: number
  alignedQuery: string
  nucleotideComposition: Record<string, number>
  pcrPrimerChanges: PcrPrimerChange[]
  totalPcrPrimerChanges: number
}

export interface AnalysisResultWithClade extends AnalysisResultWithoutClade {
  clade: string
}

export interface AnalysisResult extends AnalysisResultWithClade {
  qc: QCResult
}

export interface AnalysisResultWithMatch extends AnalysisResult {
  nearestTreeNodeId: number
}

export interface ParseResult {
  input: string
  parsedSequences: Record<string, string>
}

export interface AnalysisParams {
  seqName: string
  seq: string
  minimalLength: number
  geneMap: Gene[]
  rootSeq: string
  auspiceData: AuspiceJsonV2Extended
  pcrPrimers: PcrPrimer[]
  qcRulesConfig: QCRulesConfig
}

/** Represents a named interval in the genome */
export interface Gene {
  name: string
  color: string
  range: Range
}

export interface MutationElement extends SubstitutionsWithAminoacids {
  seqName: string
}

export interface MutationElementWithId extends MutationElement {
  id: string
}

export interface MissingElement {
  seqName: string
  character: Nucleotide
  begin: number
  end: number
}

export interface MissingElementWithId extends MissingElement {
  id: string
}
