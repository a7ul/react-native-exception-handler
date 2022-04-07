
export const sendLog = async (url, error) => {
  try {
    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({message: error}),
    });
    const content = await rawResponse.json();
    console.log('====================================');
    console.log('error sent', content);
    console.log('====================================');
    return content;
  } catch (error) {
    alert(error);
    throw new Error(error);
  }
};
