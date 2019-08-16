const initVideoForm = () => {
  const progressBar20 = document.querySelector(".new-form-progress-20");
  const progressBar40 = document.querySelector(".new-form-progress-40");
  const progressBar60 = document.querySelector(".new-form-progress-60");
  const progressBar80 = document.querySelector(".new-form-progress-80");
  const progressBar100 = document.querySelector(".new-form-progress-100");

  document.addEventListener('fileuploadprogress', (event, data) => {
    const progressPct = (Math.round((data.loaded * 100.0) / data.total));
    if (progressPct >= 20) {
      progressBar20.style.display = 'flex';
      console.log("20%");
    }
    if (progressPct >= 40) {
      progressBar40.style.display = 'flex';
      console.log("40%");
    }
    if (progressPct >= 60) {
      progressBar60.style.display = 'flex';
      console.log("60%");
    }
    if (progressPct >= 80) {
      progressBar80.style.display = 'flex';
      console.log("80%");
    }
    if (progressPct >= 100) {
      progressBar100.style.display = 'flex';
      console.log("100%");
    }
  });
}

export { initVideoForm };
