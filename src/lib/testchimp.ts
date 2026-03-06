
import testchimp from 'testchimp-rum-js';

export const TESTCHIMP_PROJECT_ID = '4ea545b8-bac6-4c68-a4c7-9e4ca07910a8';
export const TESTCHIMP_API_KEY = 'e6e82c24-eca9-4e33-b408-9454ecd6e036';

export const initTestChimp = () => {
  testchimp.init({
    projectId: TESTCHIMP_PROJECT_ID,
    apiKey: TESTCHIMP_API_KEY,
  });
};

export const emitEvent = (title: string, metadata?: Record<string, any>) => {
  testchimp.emit({ title, metadata });
};

export const resetSession = () => {
  testchimp.resetSession();
};

export default testchimp;
