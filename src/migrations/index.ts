import * as migration_20260507_221443_initial from './20260507_221443_initial';
import * as migration_20260707_135311 from './20260707_135311';

export const migrations = [
  {
    up: migration_20260507_221443_initial.up,
    down: migration_20260507_221443_initial.down,
    name: '20260507_221443_initial',
  },
  {
    up: migration_20260707_135311.up,
    down: migration_20260707_135311.down,
    name: '20260707_135311'
  },
];
