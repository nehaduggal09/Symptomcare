const symptomInput = document.getElementById("symptomInput");
const checkBtn = document.getElementById("checkBtn");
const loadingText = document.getElementById("loadingText");

const emergencyBanner = document.getElementById("emergencyBanner");
const emergencyText = document.getElementById("emergencyText");

const resultsBlock = document.getElementById("resultsBlock");
const specialistText = document.getElementById("specialistText");
const conditionText = document.getElementById("conditionText");
const disclaimerText = document.getElementById("disclaimerText");

const citySection = document.getElementById("citySection");
const citySelect = document.getElementById("citySelect");
const findClinicsBtn = document.getElementById("findClinicsBtn");

const clinicsSection = document.getElementById("clinicsSection");
const clinicsList = document.getElementById("clinicsList");

const resetBtn = document.getElementById("resetBtn");

function hideAll() {
  emergencyBanner.classList.add("hidden");
  resultsBlock.classList.add("hidden");
  citySection.classList.add("hidden");
  clinicsSection.classList.add("hidden");
}

checkBtn.addEventListener("click", async () => {
  const symptomText = symptomInput.value.trim();

  if (!symptomText) {
    alert("Please describe your symptoms first.");
    return;
  }

  hideAll();
  loadingText.classList.remove("hidden");
  checkBtn.disabled = true;

  try {
    const response = await fetch("/api/analyze-symptoms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ symptomText }),
    });

    const data = await response.json();

    if (data.isEmergency) {
      emergencyText.textContent =
        data.emergencyMessage ||
        "This may be a medical emergency. Please seek immediate medical help.";
      emergencyBanner.classList.remove("hidden");
    } else {
      specialistText.textContent = data.specialist || "General Physician";
      conditionText.textContent =
        data.possibleCondition || "Unable to determine. Please consult a doctor.";
      disclaimerText.textContent =
        data.disclaimer ||
        "This is not a medical diagnosis. Please consult a qualified doctor.";
      resultsBlock.classList.remove("hidden");
      citySection.classList.remove("hidden");
    }
  } catch (err) {
    console.error(err);
    alert("Something went wrong analyzing your symptoms. Please try again.");
  } finally {
    loadingText.classList.add("hidden");
    checkBtn.disabled = false;
  }
});

findClinicsBtn.addEventListener("click", async () => {
  const city = citySelect.value;

  if (!city) {
    alert("Please select a city.");
    return;
  }

  clinicsList.innerHTML = "<p>Searching nearby clinics...</p>";
  clinicsSection.classList.remove("hidden");
  findClinicsBtn.disabled = true;

  try {
    const response = await fetch(
      `/api/nearby-clinics?city=${encodeURIComponent(city)}`
    );
    const data = await response.json();

    if (!data.clinics || data.clinics.length === 0) {
      clinicsList.innerHTML =
        "<p>No clinics found nearby. Please try a different city or search online.</p>";
      return;
    }

    clinicsList.innerHTML = "";
    data.clinics.forEach((clinic) => {
      const card = document.createElement("div");
      card.className = "clinic-card";
      card.innerHTML = `
        <h3>${clinic.name}</h3>
        <p>${clinic.address}</p>
        <a href="${clinic.mapLink}" target="_blank" rel="noopener">View on Map</a>
      `;
      clinicsList.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    clinicsList.innerHTML =
      "<p>Something went wrong finding clinics. Please try again.</p>";
  } finally {
    findClinicsBtn.disabled = false;
  }
});

resetBtn.addEventListener("click", () => {
  symptomInput.value = "";
  hideAll();
});
