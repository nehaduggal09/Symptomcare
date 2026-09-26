// Day 4: Real Gemini API integration for symptom analysis
// Nearby clinics section still uses placeholder logic (built on Day 5)

const submitBtn = document.getElementById("submitBtn");
const symptomInput = document.getElementById("symptomInput");
const loadingText = document.getElementById("loadingText");
const emergencyBanner = document.getElementById("emergencyBanner");
const emergencyMessage = document.getElementById("emergencyMessage");
const resultsBlock = document.getElementById("resultsBlock");
const specialistText = document.getElementById("specialistText");
const conditionText = document.getElementById("conditionText");
const disclaimerText = document.getElementById("disclaimerText");
const citySection = document.getElementById("citySection");
const findClinicsBtn = document.getElementById("findClinicsBtn");
const clinicsLoading = document.getElementById("clinicsLoading");
const clinicsSection = document.getElementById("clinicsSection");
const resetBtn = document.getElementById("resetBtn");

function hideAllResultSections() {
  emergencyBanner.classList.add("hidden");
  resultsBlock.classList.add("hidden");
  citySection.classList.add("hidden");
  clinicsSection.classList.add("hidden");
  resetBtn.classList.add("hidden");
}

submitBtn.addEventListener("click", async () => {
  const text = symptomInput.value.trim();

  if (!text) {
    alert("Please describe your symptoms first.");
    return;
  }

  hideAllResultSections();
  loadingText.classList.remove("hidden");
  submitBtn.disabled = true;

  try {
    const response = await fetch("/api/analyze-symptoms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptomText: text }),
    });

    const data = await response.json();

    loadingText.classList.add("hidden");
    submitBtn.disabled = false;

    if (!response.ok) {
      alert(data.error || "Something went wrong. Please try again.");
      return;
    }

    if (data.isEmergency) {
      emergencyMessage.textContent = data.emergencyMessage;
      emergencyBanner.classList.remove("hidden");
    } else {
      specialistText.textContent = data.specialist;
      conditionText.textContent = data.possibleCondition;
      disclaimerText.textContent = data.disclaimer;
      resultsBlock.classList.remove("hidden");
    }

    citySection.classList.remove("hidden");
    resetBtn.classList.remove("hidden");
  } catch (err) {
    console.error("Request failed:", err);
    loadingText.classList.add("hidden");
    submitBtn.disabled = false;
    alert("Couldn't reach the server. Please check your connection and try again.");
  }
});

// Day 5 will replace this with a real Google Places API call
findClinicsBtn.addEventListener("click", () => {
  clinicsLoading.classList.remove("hidden");

  setTimeout(() => {
    clinicsLoading.classList.add("hidden");
    clinicsSection.classList.remove("hidden");
  }, 600);
});

resetBtn.addEventListener("click", () => {
  symptomInput.value = "";
  hideAllResultSections();
});
