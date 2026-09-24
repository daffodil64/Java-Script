const form = document.querySelector("#applicationForm");
const successMessage = document.querySelector("#successMessage");
const currentYear = new Date().getFullYear();

const rules = {
  fullName: {
    message: "Please enter your full name.",
    validate: (value) => value.trim().length >= 2 && /^[\p{L}][\p{L} .'-]*$/u.test(value.trim())
  },
  dateOfBirth: {
    message: "Please enter a valid date of birth.",
    validate: (value) => {
      if (!value) return false;
      const birthDate = new Date(`${value}T00:00:00`);
      const today = new Date();
      const oldest = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate());
      return birthDate <= today && birthDate >= oldest;
    }
  },
  gender: { message: "Please select an option.", validate: (value) => Boolean(value) },
  email: { message: "Enter a valid email address.", validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim()) },
  mobile: { message: "Enter a valid 10-digit mobile number.", validate: (value) => value.replace(/\D/g, "").length === 10 },
  address: { message: "Please enter your complete address.", validate: (value) => value.trim().length >= 8 },
  city: { message: "Please enter your city.", validate: (value) => value.trim().length >= 2 },
  state: { message: "Please enter your state.", validate: (value) => value.trim().length >= 2 },
  pinCode: { message: "Enter a valid 6-digit PIN code.", validate: (value) => /^\d{6}$/.test(value.trim()) },
  qualification: { message: "Please select your highest qualification.", validate: (value) => Boolean(value) },
  institute: { message: "Please enter your university or institute.", validate: (value) => value.trim().length >= 2 },
  passingYear: { message: `Enter a year between 1950 and ${currentYear}.`, validate: (value) => Number.isInteger(Number(value)) && Number(value) >= 1950 && Number(value) <= 2030 },
  score: { message: "Please enter your percentage or CGPA.", validate: (value) => /\d/.test(value.trim()) },
  jobPosition: { message: "Please enter the position you are applying for.", validate: (value) => value.trim().length >= 2 },
  experience: { message: "Please select your work experience.", validate: (value) => Boolean(value) },
  organization: { message: "Please enter your current or previous organization.", validate: (value) => value.trim().length >= 2 },
  salary: { message: "Please enter your expected annual salary.", validate: (value) => Number(value) >= 0 && value !== "" },
  languages: { message: "Please list at least one programming language.", validate: (value) => value.trim().length >= 2 },
  technicalSkills: { message: "Please list your technical skills.", validate: (value) => value.trim().length >= 2 }
};

function getErrorElement(field) {
  return document.querySelector(`#${field.id}Error`);
}

function getValue(field) {
  return field.type === "checkbox" ? field.checked : field.value;
}

function validateField(field, showSuccessState = true) {
  const rule = rules[field.name];
  const errorElement = getErrorElement(field);
  if (!rule || !errorElement) return true;

  const isValid = rule.validate(getValue(field));
  field.classList.toggle("invalid", !isValid);
  field.classList.toggle("valid", isValid && showSuccessState);
  field.setAttribute("aria-invalid", String(!isValid));
  errorElement.textContent = isValid ? "" : rule.message;
  return isValid;
}

function validateConsent() {
  const consent = document.querySelector("#consent");
  const errorElement = document.querySelector("#consentError");
  const isValid = consent.checked;
  consent.setAttribute("aria-invalid", String(!isValid));
  errorElement.textContent = isValid ? "" : "Please confirm that the information is accurate.";
  return isValid;
}

function markFieldAsTouched(event) {
  validateField(event.target);
  successMessage.hidden = true;
}

Object.keys(rules).forEach((fieldName) => {
  const field = document.querySelector(`#${fieldName}`);
  field.addEventListener("input", markFieldAsTouched);
  field.addEventListener("change", markFieldAsTouched);
  field.addEventListener("blur", (event) => validateField(event.target));
});

document.querySelector("#consent").addEventListener("change", () => {
  validateConsent();
  successMessage.hidden = true;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const fieldsAreValid = Object.keys(rules).every((fieldName) => {
    const field = document.querySelector(`#${fieldName}`);
    return validateField(field);
  });
  const consentIsValid = validateConsent();

  if (!fieldsAreValid || !consentIsValid) {
    successMessage.hidden = true;
    const firstInvalidField = form.querySelector(".invalid, [aria-invalid='true']");
    firstInvalidField?.focus();
    return;
  }

  successMessage.hidden = false;
  successMessage.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

document.querySelector("#passingYear").setAttribute("max", currentYear);
document.querySelector("#dateOfBirth").setAttribute("max", new Date().toISOString().split("T")[0]);
