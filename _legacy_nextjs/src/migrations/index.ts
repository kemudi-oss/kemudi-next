import * as migration_20260507_221443_initial from './20260507_221443_initial';
import * as migration_20260707_135311 from './20260707_135311';
import * as migration_20260806_054953_fix_schema_drift from './20260806_054953_fix_schema_drift';

export const migrations = [
  {
    up: migration_20260507_221443_initial.up,
    down: migration_20260507_221443_initial.down,
    name: '20260507_221443_initial',
  },
  {
    up: migration_20260707_135311.up,
    down: migration_20260707_135311.down,
    name: '20260707_135311',
  },
  {
    up: migration_20260806_054953_fix_schema_drift.up,
    down: migration_20260806_054953_fix_schema_drift.down,
    name: '20260806_054953_fix_schema_drift'
  },
];
