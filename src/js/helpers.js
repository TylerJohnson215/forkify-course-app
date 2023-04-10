import { TIMEOUT_SEC } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// convert data from API url to JSON
export const getJSON = async function (url) {
  try {
    const fetchPromise = fetch(url);

    // Promise passed through Promise.race either rejects or fullfills.
    // If fetchPromise rejects after 10 sec -> throw err
    const resp = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await resp.json();

    if (!resp.ok) throw new Error(`${data.message} (${resp.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};

// Sending data to API
export const sendJSON = async function (url, uploadData) {
  try {
    // Prepare format to JSON so data can be sent to API
    const fetchPromise = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    // Promise passed through Promise.race either rejects or fullfills.
    // If fetchPromise rejects after 10 sec -> throw err
    const resp = await Promise.race([fetchPromise, timeout(TIMEOUT_SEC)]);
    const data = await resp.json();

    if (!resp.ok) throw new Error(`${data.message} (${resp.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};
