// Day 3: static show/hide logic only — no real API calls yet (that's Day 4 & 5)

const submitBtn = document.getElementById("submitBtn");
const symptomInput = document.getElementById("symptomInput");
const loadingText = document.getElementById("loadingText");
const emergencyBanner = document.getElementById("emergencyBanner");
const resultsBlock = document.getElementById("resultsBlock");
const citySection = document.getElementById("citySection");
const findClinicsBtn = document.getElementById("findClinicsBtn");
const clinicsSection = document.getElementById("clinicsSection");
const resetBtn = document.getElementById("resetBtn");

submitBtn.addEventListener("click", () => {
  if (!symptomInput.value.trim()) {
    alert("Please describe your symptoms first.");
    return;
  }

  loadingText.classList.remove("hidden");

  // Placeholder: simulate a short delay, then show dummy results
  setTimeout(() => {
    loadingText.classList.add("hidden");
    resultsBlock.classList.remove("hidden");
    citySection.classList.remove("hidden");
    resetBtn.classList.remove("hidden");
    // emergencyBanner.classList.remove("hidden"); // toggle this manually to preview emergency style
  }, 600);
});

findClinicsBtn.addEventListener("click", () => {
  const clinicsLoading = document.getElementById("clinicsLoading");
  clinicsLoading.classList.remove("hidden");

  setTimeout(() => {
    clinicsLoading.classList.add("hidden");
    clinicsSection.classList.remove("hidden");
  }, 600);
});

resetBtn.addEventListener("click", () => {
  symptomInput.value = "";
  resultsBlock.classList.add("hidden");
  emergencyBanner.classList.add("hidden");
  citySection.classList.add("hidden");
  clinicsSection.classList.add("hidden");
  resetBtn.classList.add("hidden");
});
