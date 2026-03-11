function editBio(){
    console.log("im accessed");
    const mainBioDiv = document.getElementById('main-bio-box');
    const currentBio = document.getElementById('profile-bio').innerText;
    const BioDiv = document.getElementById('bio-box');
    const editBtn = document.getElementById('bio-btn');

    if(BioDiv){
        const textField = document.createElement('textarea');
        const saveBtn = document.createElement('button');
        textField.value = currentBio;
        textField.id = 'bio-box';
        editBtn.innerText = 'Save Changes';
        mainBioDiv.replaceChild(textField, BioDiv);
        editBtn.onclick = function() {
            mainBioDiv.replaceChild(BioDiv, textField);
            BioDiv.id = 'bio-box';
            const newBio = textField.value;
            document.getElementById('profile-bio').innerText = newBio;
            editBtn.innerText = 'Edit Bio';
            editBtn.onclick = editBio;
        }
    } 
}
async function loadDashboardInformation(){
    try{
        const response = await fetch('/get-user');
        const userData = await response.json();

        if(userData.loggedIn){
            //updates top right profile name and type based on the current session's information
            document.getElementById("fullname").textContent = `${userData.lname}, ${userData.fname}`;
            document.getElementById("type").textContent = `${userData.status}`;
            //updates the sidebar popup
            document.getElementById("sidebar-fullname").textContent = `${userData.lname}, ${userData.fname}`;
            document.getElementById("sidebar-usertype").textContent = `${userData.status}`;

        }

    }catch(error){
        console.log("MongoDB Error:", error.message);
    }
}

window.onload = loadDashboardInformation;
        