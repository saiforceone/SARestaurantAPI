import dev from './dev.mjs';
import production from './production.mjs';

const config = process.env.NODE_ENV === 'production' ? production : dev;

export default config;