<script>
(function () {
  var form = document.getElementById('signup-form');
  if (!form) return;
  var emailInput = document.getElementById('signup-email');
  var btn = document.getElementById('signup-submit');
  var status = document.getElementById('signup-status');

  function setStatus(msg, cls) {
    status.textContent = msg || '';
    status.className = 'signup-status' + (cls ? ' ' + cls : '');
  }

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    var email = (emailInput.value || '').trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setStatus('please enter a valid email', 'err');
      emailInput.focus();
      return;
    }
    btn.disabled = true;
    setStatus('subscribing…', '');
    try {
      var res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, website: form.website.value }),
      });
      if (res.ok) {
        setStatus('subscribed · check your inbox for the welcome', 'ok');
        form.reset();
      } else {
        var data = await res.json().catch(function () { return {}; });
        setStatus(data.error === 'invalid_email' ? 'that email looks off — try again' : 'something broke on our end — try again later', 'err');
      }
    } catch (err) {
      setStatus('network hiccup — try again', 'err');
    } finally {
      btn.disabled = false;
    }
  });
})();
</script>
