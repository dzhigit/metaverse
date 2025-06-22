async function getBalanceFP() {
  const url = 'https://faucetpay.io/api/v1/getbalance'; // Обратите внимание на endpoint
  const formData = new FormData();
  formData.append('api_key', APIKEYFP);
  formData.append('currency', 'pepe'); // в нижнем регистре, как в Postman

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData
      // Не нужно Content-Type для FormData - браузер сам установит
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error('Ошибка:', error);
    throw error;
  }
}

async function checkAdressFP(name) {
  const url = 'https://faucetpay.io/api/v1/checkaddress';
  const formData = new URLSearchParams();

  formData.append('api_key', APIKEYFP),
  formData.append('address', name);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {

      },
      body: formData
    });

    const data = await response.json();
    
    console.log(data); // Здесь можешь вставить логику отображения данных
  } catch (error) {
    console.error('Ошибка:', error);
  }
}

<!--
document.getElementById('checkAddress').addEventListener('click', function () {
  checkAdressFP(name);
});
-->



