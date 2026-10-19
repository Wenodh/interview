document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const alertBox = document.getElementById('alert-box');

  const fields = {
    fullName: document.getElementById('fullName'),
    email: document.getElementById('email'),
    password: document.getElementById('password'),
    confirmPassword: document.getElementById('confirmPassword'),
    terms: document.getElementById('terms'),
  };

  const errors = {
    fullName: document.getElementById('fullName-error'),
    email: document.getElementById('email-error'),
    password: document.getElementById('password-error'),
    confirmPassword: document.getElementById('confirmPassword-error'),
    terms: document.getElementById('terms-error'),
  };

  function validateField(name) {
    let error = '';
    const val = fields[name].type === 'checkbox' ? fields[name].checked : fields[name].value.trim();

    switch (name) {
      case 'fullName':
        if (!val) error = 'Full name is required.';
        else if (val.length < 3) error = 'Name must be at least 3 characters.';
        break;
      case 'email':
        if (!val) error = 'Email is required.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) error = 'Please enter a valid email address.';
        break;
      case 'password':
        if (!val) error = 'Password is required.';
        else if (val.length < 8) error = 'Password must be at least 8 characters.';
        else if (!/\d/.test(val)) error = 'Password must contain at least one number.';
        break;
      case 'confirmPassword':
        if (!val) error = 'Please confirm your password.';
        else if (val !== fields.password.value.trim()) error = 'Passwords do not match.';
        break;
      case 'terms':
        if (!val) error = 'You must accept the terms and conditions.';
        break;
    }

    errors[name].textContent = error;
    if (error && fields[name].classList) {
      fields[name].classList.add('invalid');
    } else if (fields[name].classList) {
      fields[name].classList.remove('invalid');
    }

    return !error;
  }

  // Real-time listener
  Object.keys(fields).forEach((name) => {
    fields[name].addEventListener('input', () => validateField(name));
    fields[name].addEventListener('blur', () => validateField(name));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alertBox.classList.add('hidden');

    const isValid = Object.keys(fields).reduce((acc, name) => {
      const valid = validateField(name);
      return acc && valid;
    }, true);

    if (isValid) {
      alertBox.textContent = '🎉 Form submitted successfully! (Controlled state & validation passed)';
      alertBox.className = 'alert success';
    }
  });

  document.getElementById('reset-btn').addEventListener('click', () => {
    form.reset();
    alertBox.classList.add('hidden');
    Object.keys(errors).forEach((name) => {
      errors[name].textContent = '';
      if (fields[name].classList) fields[name].classList.remove('invalid');
    });
  });
});
