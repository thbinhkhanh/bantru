// customViLocale.js
import { vi } from 'date-fns/locale';

const customVi = {
  ...vi,
  localize: {
    ...vi.localize,
    day: (n, options = {}) => {
      const abbreviatedDays = ['CN', 'T.2', 'T.3', 'T.4', 'T.5', 'T.6', 'T.7'];
      if (options.width === 'abbreviated') return abbreviatedDays[n];
      return vi.localize.day(n, options);
    }
  }
};

export default customVi;
