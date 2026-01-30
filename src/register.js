// DOM Elements
const form = document.getElementById('register-form');
const viewForm = document.getElementById('view-form');
const viewSuccess = document.getElementById('view-success');
const backBtn = document.getElementById('back-btn');
const toast = document.getElementById('toast');
const submitBtn = document.getElementById('submit-btn');

function showToast(msg, isError = false) {
    toast.textContent = msg;
    toast.style.backgroundColor = isError ? 'rgba(255, 68, 68, 0.9)' : 'rgba(74, 222, 128, 0.9)';
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = document.getElementById('fullName').value;
    const whatsapp = document.getElementById('whatsapp').value;
    const city = document.getElementById('city').value;
    const goal = document.getElementById('goal').value;
    const area = document.getElementById('area').value;
    const course = document.getElementById('course').value;
    const consent = document.querySelector('input[name="consent"]:checked')?.value;

    if (!fullName || !whatsapp || !city || !goal || !area || !course || !consent) {
        showToast('Por favor completa todos los campos', true);
        return;
    }

    if (consent !== 'SI') {
        showToast('Debes aceptar participar para continuar', true);
        return;
    }

    // Loading state
    const originalBtnText = submitBtn.textContent;
    submitBtn.textContent = 'Guardando...';
    submitBtn.disabled = true;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName,
                whatsapp,
                city,
                goal,
                area,
                course,
                consent
            })
        });

        const data = await response.json();

        if (data.success) {
            // Show success view
            viewForm.classList.add('hidden');
            viewSuccess.classList.remove('hidden');
            form.reset();
        } else {
            showToast(data.error || 'Error al registrar', true);
        }
    } catch (err) {
        showToast('Error de conexión', true);
        console.error(err);
    } finally {
        submitBtn.textContent = originalBtnText;
        submitBtn.disabled = false;
    }
});

backBtn.addEventListener('click', () => {
    viewSuccess.classList.add('hidden');
    viewForm.classList.remove('hidden');
});
