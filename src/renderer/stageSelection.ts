document.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;

  if(target.classList.contains('stage-option')) {
    window.location.href = "stage.html?stage="+target.dataset.stage;
  }
});