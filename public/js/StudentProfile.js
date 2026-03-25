async function editBio() {
    console.log("im accessed");

    const mainBioDiv = document.getElementById('main-bio-box');
    const currentBio = document.getElementById('profile-bio').innerText;
    const BioDiv = document.getElementById('bio-box');
    const editBtn = document.getElementById('bio-btn');

    if (BioDiv) {
        const textField = document.createElement('textarea');
        textField.value = currentBio;
        textField.id = 'bio-box';

        editBtn.innerText = 'Save Changes';
        mainBioDiv.replaceChild(textField, BioDiv);

        editBtn.onclick = async function () {
            const newBio = textField.value;

            try {
                const response = await fetch('/update-bio', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ bio: newBio })
                });

                if (!response.ok) {
                    throw new Error('Failed to save bio');
                }

                mainBioDiv.replaceChild(BioDiv, textField);
                BioDiv.id = 'bio-box';
                document.getElementById('profile-bio').innerText = newBio || 'This user has no Bio yet.';
                editBtn.innerText = 'Edit Bio';
                editBtn.onclick = editBio;
            } catch (err) {
                console.error('BIO SAVE ERROR:', err);
                alert('Failed to save bio.');
            }
        };
    }
}

window.onload = loadDashboardInformation;