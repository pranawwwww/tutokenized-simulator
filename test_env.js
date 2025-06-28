import { DEFAULT_EXECUTOR_CONFIG } from './src/utils/executorManager.js';

console.log('Environment variables test:');
console.log('VITE_EXECUTOR_TYPE:', process.env.VITE_EXECUTOR_TYPE);
console.log('VITE_TASK_QUEUE_URL:', process.env.VITE_TASK_QUEUE_URL);
console.log('VITE_API_KEY:', process.env.VITE_API_KEY ? 'SET' : 'NOT_SET');

console.log('Default config:', DEFAULT_EXECUTOR_CONFIG);
