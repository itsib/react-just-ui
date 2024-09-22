export type Report = [number, number];

export interface ModuleReport {
  [ext: string]: Report;
}

export interface FullReport {
  total: ModuleReport;
  modules: { [module: string]: ModuleReport };
}