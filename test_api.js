// Native fetch is available in Node 24

async function testRegister() {
    try {
        console.log('Testing connection to http://localhost:3000/api/register...');
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullName: 'Test User',
                whatsapp: '1234567890',
                city: 'Latacunga',
                goal: 'Prueba',
                area: 'Sistemas',
                course: 'Programación',
                consent: 'SI'
            })
        });

        console.log('Status:', response.status);
        const text = await response.text();
        console.log('Response:', text);

    } catch (err) {
        console.error('Connection failed:', err.message);
    }
}

testRegister();
