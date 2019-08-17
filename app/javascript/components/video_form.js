const initVideoForm = () => {
  const progressBar20 = document.querySelector(".new-form-progress-20");
  const progressBar40 = document.querySelector(".new-form-progress-40");
  const progressBar60 = document.querySelector(".new-form-progress-60");
  const progressBar80 = document.querySelector(".new-form-progress-80");
  const progressBar100 = document.querySelector(".new-form-progress-100");

  const progressMessaging = (item) => {
    item.style.display = 'flex';
  };

  document.querySelector("form").addEventListener('submit', (event) => {
    console.log("top2");
    const interval = 4000;
    setTimeout(progressMessaging, interval*1, progressBar20);
    setTimeout(progressMessaging, interval*2, progressBar40);
    setTimeout(progressMessaging, interval*3, progressBar60);
    setTimeout(progressMessaging, interval*4, progressBar80);
    setTimeout(progressMessaging, interval*5, progressBar100);
  });
};

export { initVideoForm };
