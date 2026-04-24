import { EventEmitter } from 'events';

class AppEmitter extends EventEmitter {}

export const emitter = new AppEmitter();

// Increase limit to avoid memory leak warnings with many listeners
emitter.setMaxListeners(20);
