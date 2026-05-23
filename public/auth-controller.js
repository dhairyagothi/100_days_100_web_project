document.addEventListener("DOMContentLoaded", () => {
  const authCard = document.querySelector(".auth-card");
  const tabButtons = document.querySelectorAll("[data-auth-tab]");
  const forms = document.querySelectorAll("[data-auth-form]");
  const switchButtons = document.querySelectorAll("[data-switch-auth]");
  const loginForm = document.querySelector('[data-auth-form="login"]');
  const signupForm = document.querySelector('[data-auth-form="signup"]');

  const config = window.ENV_CONFIG || {};
  const hasSupabaseConfig = Boolean(config.SUPABASE_URL && config.SUPABASE_ANON_KEY);
  const hasSupabaseClient = Boolean(window.supabase && window.supabase.createClient);
  const supabaseClient = hasSupabaseConfig && hasSupabaseClient
    ? window.supabase.createClient(config.SUPABASE_URL, config.SUPABASE_ANON_KEY)
    : null;

  function setAuthMode(mode) {
    authCard.dataset.mode = mode;

    tabButtons.forEach((button) => {
      const isActive = button.dataset.authTab === mode;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    forms.forEach((form) => {
      form.classList.toggle("is-active", form.dataset.authForm === mode);
    });
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => setAuthMode(button.dataset.authTab));
  });

  switchButtons.forEach((button) => {
    button.addEventListener("click", () => setAuthMode(button.dataset.switchAuth));
  });

  loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!supabaseClient) {
      alert("Add your Supabase URL and anon key in public/config.js, then reload the page.");
      return;
    }

    const email = loginForm.elements["login-email"].value.trim();
    const password = loginForm.elements["login-password"].value;

    if (!email || !password) {
      alert("Enter both email and password.");
      return;
    }

    const { error } = await supabaseClient.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "../index.html";
  });

  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!supabaseClient) {
      alert("Add your Supabase URL and anon key in public/config.js, then reload the page.");
      return;
    }

    const name = signupForm.elements["signup-name"].value.trim();
    const username = signupForm.elements["signup-username"].value.trim();
    const email = signupForm.elements["signup-email"].value.trim();
    const password = signupForm.elements["signup-password"].value;

    if (!name || !username || !email || !password) {
      alert("Please fill in every signup field.");
      return;
    }

    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          username
        }
      }
    });

    if (error) {
      alert(error.message);
      return;
    }

    const userId = data.user && data.user.id;

    if (userId) {
      const { error: profileError } = await supabaseClient
        .from("user_profiles")
        .insert([
          {
            id: userId,
            name,
            username,
            email
          }
        ]);

      if (profileError) {
        alert(`Signup worked, but profile insert failed: ${profileError.message}`);
        return;
      }
    }

    alert("Signup successful. Check your email if confirmation is enabled.");
    signupForm.reset();
    setAuthMode("login");
  });

  setAuthMode("login");
});