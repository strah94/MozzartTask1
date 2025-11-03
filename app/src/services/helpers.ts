export async function fetchWithRetry<T>(
  request: () => Promise<T>,
  retries = 3,
  delay = 1000
): Promise<T> {
  try {
    return await request();
  } catch (err) {
    if (retries === 0) throw err;
    await new Promise((res) => setTimeout(res, delay));

    return fetchWithRetry(request, retries - 1, delay);
  }
}
